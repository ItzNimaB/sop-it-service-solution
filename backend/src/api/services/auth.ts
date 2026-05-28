import { createHash, randomInt, timingSafeEqual } from "crypto";
import { sign, verify } from "jsonwebtoken";

import prisma from "@/configs/prisma.config";
import {
  createLdapPasswordHash,
  createLdapUser,
  getLdapUsers,
  ldapAuthenticate,
  sendMail,
} from "@/functions";

const { JWT_SECRET } = process.env;
const schoolMailDomain = "@edu.sde.dk";
const signupOtpTtlMs = 20 * 60 * 1000; // 20 minutes
const defaultSignupFrontendUrl =
  process.env.NODE_ENV === "development"
    ? "http://signup.localhost"
    : process.env.FRONTEND_URL?.split(",")[0] || "http://signup.localhost";

export async function login(
  username: string,
  password: string
): Promise<IResponse> {
  try {
    let user = await ldapAuthenticate(username, password);

    if (!user) return { status: 400, data: "Invalid credentials" };

    if (!JWT_SECRET) throw new Error("JWT_SECRET not set");

    const dbUser = await prisma.users.findFirst({
      where: { username: user.username },
      select: { UUID: true },
    });

    let newUser = { UUID: 0 };

    if (!dbUser) {
      newUser = await prisma.users.create({
        data: { username: user.username },
      });
    }

    user.UUID = dbUser?.UUID || newUser.UUID;

    const token = sign(user, JWT_SECRET, { expiresIn: "1d" });

    return { status: 200, data: { user, token } };
  } catch (err) {
    console.log(err);

    return { status: 400, data: "Something went wrong" };
  }
}

export async function validate(token: string): Promise<IResponse> {
  if (!JWT_SECRET) throw new Error("JWT_SECRET not set");

  try {
    const verified = verify(token, JWT_SECRET);

    return { status: 200, data: verified };
  } catch (err) {
    return { status: 400, data: "Invalid token" };
  }
}

function isSchoolMail(email: string) {
  return (
    email.toLowerCase().endsWith(schoolMailDomain) &&
    email.length > schoolMailDomain.length
  );
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getUsernameFromSchoolMail(email: string) {
  return normalizeEmail(email).replace(schoolMailDomain, "");
}

function createOtp() {
  return randomInt(100000, 1000000).toString();
}

function createSignupConfirmUrl(email: string) {
  const signupFrontendUrl =
    process.env.SIGNUP_FRONTEND_URL || defaultSignupFrontendUrl;
  const url = new URL("/confirm.html", signupFrontendUrl);

  url.searchParams.set("email", email);

  return url.toString();
}

function hashOtp(otp: string) {
  return createHash("sha256").update(otp).digest("hex");
}

function otpMatches(otp: string, otpHash: string) {
  const inputHash = Buffer.from(hashOtp(otp));
  const expectedHash = Buffer.from(otpHash);

  return (
    inputHash.length === expectedHash.length &&
    timingSafeEqual(inputHash, expectedHash)
  );
}

async function userExists(username: string) {
  const existingDBUser = await prisma.users.findFirst({
    where: { username },
  });

  if (existingDBUser) return true;

  const existingLdapUser = await getLdapUsers();

  return existingLdapUser.data.some((user: user) => user.username === username);
}

export async function createUser(
  email: string,
  password: string
): Promise<IResponse> {
  try {
    const normalizedEmail = normalizeEmail(email);

    if (!isSchoolMail(normalizedEmail)) {
      return { status: 400, data: "Email must end with @edu.sde.dk" };
    }

    const username = getUsernameFromSchoolMail(normalizedEmail);

    if (await userExists(username))
      return { status: 400, data: "User with that username already exists" };

    const otp = createOtp();
    const expiresAt = new Date(Date.now() + signupOtpTtlMs);

    await prisma.signup_verifications.upsert({
      where: { email: normalizedEmail },
      update: {
        username,
        password_hash: createLdapPasswordHash(password),
        otp_hash: hashOtp(otp),
        expires_at: expiresAt,
        date_updated: new Date(),
      },
      create: {
        email: normalizedEmail,
        username,
        password_hash: createLdapPasswordHash(password),
        otp_hash: hashOtp(otp),
        expires_at: expiresAt,
      },
    });

    const confirmUrl = createSignupConfirmUrl(normalizedEmail);

    await sendMail({
      to: normalizedEmail,
      subject: "Bekraeft din konto",
      text: `Din engangskode er ${otp}. Koden udloeber om 20 minutter.

Tilgå dette link for at bekræfte din konto: ${confirmUrl}`,
      html: `
        <p>Din engangskode er <strong>${otp}</strong>.</p>
        <p>Koden udløber om 20 minutter.</p>
        <p>
          <a href="${confirmUrl}">Bekræft din konto</a>
        </p>
      `,
    });

    return { status: 200, data: "Verification code sent" };
  } catch (err) {
    console.log(err);

    return { status: 400, data: "Something went wrong" };
  }
}

export async function confirmCreateUser(
  email: string,
  otp: string
): Promise<IResponse> {
  try {
    const normalizedEmail = normalizeEmail(email);

    if (!isSchoolMail(normalizedEmail)) {
      return { status: 400, data: "Email must end with @edu.sde.dk" };
    }

    const verification = await prisma.signup_verifications.findUnique({
      where: { email: normalizedEmail },
    });

    if (!verification)
      return { status: 400, data: "No pending verification found" };

    if (verification.expires_at < new Date()) {
      await prisma.signup_verifications.delete({
        where: { email: normalizedEmail },
      });

      return { status: 400, data: "Verification code expired" };
    }

    if (!otpMatches(otp, verification.otp_hash)) {
      return { status: 400, data: "Invalid verification code" };
    }

    if (await userExists(verification.username))
      return { status: 400, data: "User with that username already exists" };

    const ldapUser = await createLdapUser(
      verification.username,
      undefined,
      verification.email,
      verification.password_hash
    );
    if (ldapUser.status !== 200) return ldapUser;

    const newUser = await prisma.users.create({
      data: { username: verification.username },
    });

    await prisma.signup_verifications.delete({
      where: { email: normalizedEmail },
    });

    return { status: 200, data: { ldapUser: ldapUser.data, user: newUser } };
  } catch (err) {
    console.log(err);

    return { status: 400, data: "Something went wrong" };
  }
}
