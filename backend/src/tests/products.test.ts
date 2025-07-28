import { describe, it } from "vitest";

import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";
import * as tableService from "@services/tables";

import createTestCases from "./generateTests";

describe("Products", () => {
  const testCases = createTestCases(tableService);
  const table: Prisma.ModelName = "products";

  describe("Get cases", async () => {
    const { id } = await prisma[table].findFirstOrThrow();

    it("should get all", testCases.getAllTest(table));
    it("should get one", testCases.getOneTest(table, id));
  });

  describe("Create cases", async () => {
    const { id: category_id } = await prisma.categories.findFirstOrThrow();
    const { id: brand_id } = await prisma.brands.findFirstOrThrow();

    const createBody = { name: "Test", category_id, brand_id };

    it("should create", testCases.createOneTest(table, createBody));
  });

  describe("Update cases", async () => {
    const { id } = await prisma[table].findFirstOrThrow();
    const updateBody = { name: "Updated" };

    it("should update", testCases.updateOneTest(table, id, updateBody));
  });

  describe("Delete cases", async () => {
    const { id: category_id } = await prisma.categories.findFirstOrThrow();
    const { id: brand_id } = await prisma.brands.findFirstOrThrow();

    const { id } = await prisma[table].create({
      data: { name: "Temp", category_id, brand_id },
    });

    it("should delete", testCases.deleteOneTest(table, id));
  });
});
