import { z } from "zod";

import { registry } from "@/zod";

export const createSchema = z
  .object({ name: z.string().openapi({ example: "Example brand" }) })
  .openapi("Create Brand");

const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

registry.registerPath({
  operationId: "createBrand",
  method: "post",
  path: "/brands",
  summary: "Create a brand",
  security: [{ [bearerAuth.name]: [] }],
  tags: ["Brands"],
  request: {
    body: {
      content: { "application/json": { schema: createSchema } },
      required: true,
      description: "Brand data",
    },
  },
  responses: {
    200: {
      description: "Object with brand data.",
      content: { "application/json": { schema: createSchema } },
    },
    204: { description: "No content - successful operation" },
  },
});
