import { describe, it } from "vitest";

import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import * as tableService from "@services/tables";

import createTestCases from "./generateTests";

describe("Recipient type", () => {
  const testCases = createTestCases(tableService);
  const table: Prisma.ModelName = "recipient_type";

  describe("Get cases", async () => {
    const { id } = await prisma[table].findFirstOrThrow();

    it("should get all", testCases.getAllTest(table));
    it("should get one", testCases.getOneTest(table, id));
  });

  describe("Create cases", async () => {
    const createBody = { name: "Test" };

    it("should create", testCases.createOneTest(table, createBody));
  });

  describe("Update cases", async () => {
    const { id } = await prisma[table].findFirstOrThrow();
    const updateBody = { name: "Updated" };

    it("should update", testCases.updateOneTest(table, id, updateBody));
  });

  describe("Delete cases", async () => {
    const { id } = await prisma[table].create({ data: { name: "Temp" } });

    it("should delete", testCases.deleteOneTest(table, id));
  });
});
