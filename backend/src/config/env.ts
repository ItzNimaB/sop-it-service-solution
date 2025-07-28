import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().url(),
  FRONTEND_URL: z.string().optional(),
  BACKEND_PORT: z.coerce.number().default(5000),
  JWT_SECRET: z.string(),

  LDAP_HOST: z.string(),
  LDAP_PORT: z.coerce.number().optional().default(389),
  LDAP_USERNAME: z.string(),
  LDAP_PASSWORD: z.string(),
  LDAP_BASE_DN: z.string(),
  LDAP_USERS: z.string().optional(),
  LDAP_ADMINS: z.string().optional(),
  LDAP_SUPERIORS: z.string().optional(),

  MAIL_MAILER: z.enum(["smtp"]).default("smtp"),
  MAIL_HOST: z.string().optional(),
  MAIL_PORT: z.coerce.number().default(587),
  MAIL_USERNAME: z.string().optional(),
  MAIL_PASSWORD: z.string().optional(),
  MAIL_ENCRYPTION: z.enum(["tls", "ssl"]).default("tls"),
  MAIL_FROM_ADDRESS: z.string().optional(),
  MAIL_FROM_NAME: z.string().optional(),
});

const { data, error } = EnvSchema.safeParse(process.env);

if (error) {
  console.error("Invalid environment variables:", error.format());
  process.exit(1);
}

export default data!;
export const isProd = data.NODE_ENV === "production";
