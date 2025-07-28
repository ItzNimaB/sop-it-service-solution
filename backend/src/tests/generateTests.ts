import { TestFunction, expect } from "vitest";

import { Prisma } from "@prisma/client";

type ServiceFunction<T> = (...args: any[]) => Promise<IResponse<T>>;

type IService<T = any> = Partial<{
  getAll: ServiceFunction<T[]>;
  getOne: ServiceFunction<T>;
  createOne: ServiceFunction<T>;
  createMultiple: ServiceFunction<T[]>;
  updateOne: ServiceFunction<T>;
  deleteOne: ServiceFunction<T>;
  returnLoan: ServiceFunction<T>;
}>;

type FunctionWithArgs<T> = T extends (...args: infer P) => any
  ? (...args: P) => TestFunction
  : never;

type ITestCases<T extends IService> = {
  [K in keyof T as `${string & K}Test`]: FunctionWithArgs<T[K]>;
} & {
  cleanUp: () => void;
};

function createTableTestCases(table: Prisma.ModelName) {}

export default function createTestCases<T extends IService>(
  service: T,
  cleanupFunction: (id: string) => void = () => {}
): ITestCases<T> {
  const cleanupList: string[] = [];

  const testCases = {
    cleanUp() {
      cleanupList.map(cleanupFunction);
    },
  } as ITestCases<T>;

  if (service.getAll && typeof service.getAll === "function") {
    testCases.getAllTest = ((...args): TestFunction => {
      return async () => {
        const response = await service.getAll!(...args);

        expect(response.status).toBe(200);
        if (Array.isArray(response.data)) {
          expect(response.data).toBeInstanceOf(Array);
        } else {
          expect(response.data).toBeInstanceOf(Object);
        }
      };
    }) as FunctionWithArgs<T["getAll"]>;
  }

  if (service.getOne && typeof service.getOne === "function") {
    testCases.getOneTest = ((...args): TestFunction => {
      return async () => {
        const response = await service.getOne!(...args);

        expect(response.status).toBe(200);
        expect(response.data).toBeInstanceOf(Object);
      };
    }) as FunctionWithArgs<T["getOne"]>;
  }

  if (service.createOne && typeof service.createOne === "function") {
    testCases.createOneTest = ((...args: any[]): TestFunction => {
      return async () => {
        const response = await service.createOne!(...args);

        expect(response.status).toBe(201);
        expect(response.data).toBeInstanceOf(Object);

        if (response.data) cleanupList.push(response.data.id);
      };
    }) as FunctionWithArgs<T["createOne"]>;
  }

  if (service.createMultiple && typeof service.createMultiple === "function") {
    testCases.createMultipleTest = ((...args): TestFunction => {
      return async () => {
        const response = await service.createMultiple!(...args);

        expect(response.status).toBe(201);
        expect(response.data).toBeInstanceOf(Array);

        if (response.data) {
          cleanupList.push(...response.data.map((d) => d.id));
        }
      };
    }) as FunctionWithArgs<T["createMultiple"]>;
  }

  if (service.updateOne && typeof service.updateOne === "function") {
    testCases.updateOneTest = ((...args): TestFunction => {
      return async () => {
        const response = await service.updateOne!(...args);

        expect(response.status).toBe(200);
        expect(response.data).toBeInstanceOf(Object);
      };
    }) as FunctionWithArgs<T["updateOne"]>;
  }

  if (service.deleteOne && typeof service.deleteOne === "function") {
    testCases.deleteOneTest = ((...args): TestFunction => {
      return async () => {
        const response = await service.deleteOne!(...args);

        expect(response.status).toBe(200);
      };
    }) as FunctionWithArgs<T["deleteOne"]>;
  }

  return testCases;
}
