import { afterEach, describe, it } from "vitest";

import prisma from "@/config/prisma";
import * as itemsService from "@services/items";
import * as tableService from "@services/tables";

import createTestCases from "./generateTests";

describe("Items", () => {
  const deleteFunction = async (id: string) => {
    await prisma.items.delete({ where: { id: Number(id) } });
  };

  const specificTestCases = createTestCases(itemsService, deleteFunction);
  const tableTestCases = createTestCases(tableService, deleteFunction);

  afterEach(async () => {
    specificTestCases.cleanUp();
  });

  describe("Get cases", async () => {
    const { id } = await prisma.items.findFirstOrThrow();

    it("should get all items", tableTestCases.getAllTest("items"));
    it("should get one item", specificTestCases.getOneTest(id));
  });

  describe("Create cases", async () => {
    const { id } = await prisma.products.findFirstOrThrow();

    it("should create an item", specificTestCases.createMultipleTest(id));
  });
});
