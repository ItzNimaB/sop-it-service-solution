import { afterEach, describe, it } from "vitest";

import prisma from "@/config/prisma";
import * as loansService from "@services/loans";

import createTestCases from "./generateTests";

describe("Loans", () => {
  const deleteFunction = async (id: string) => {
    if (!id) return;
    await prisma.loans.delete({ where: { id: Number(id) } });
  };

  const specificTestCases = createTestCases(loansService, deleteFunction);

  afterEach(async () => {
    specificTestCases.cleanUp();
  });

  describe("Create cases", async () => {
    const { id: Userid, username } = await prisma.users.findFirstOrThrow();
    const { id: Itemid } = await prisma.items.findFirstOrThrow();

    const createLoanBody: ILoanCreateInput = {
      loan: {
        user_id: Userid,
        helpdesk_personel_id: Userid,
        loan_length: 30,
      },
      products: [{ id: Itemid, withBag: true, withLock: true }],
      personel_username: username,
      personel_password: "",
    };

    it("should create a loan", specificTestCases.createOneTest(createLoanBody));
  });
});
