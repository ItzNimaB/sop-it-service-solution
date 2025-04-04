import { z } from "zod";

import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi/dist";

const registry = new OpenAPIRegistry();

export const createSchema = z
  .object({ name: z.string().openapi({ example: "Example brand" }) })
  .openapi("Brands");

const brandIdSchema = registry.registerParameter(
  "BrandId",
  z.string().openapi({
    param: { name: "id", in: "path" },
    example: "1212121",
  })
);

const generator = new OpenApiGeneratorV3([createSchema]);

console.log(generator.generateComponents());

const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

registry.registerPath({
  method: "get",
  path: "/users/{id}",
  description: "Get user data by its id",
  summary: "Get a single user",
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: brandIdSchema }) },
  responses: {
    200: {
      description: "Object with user data.",
      content: { "application/json": { schema: createSchema } },
    },
    204: { description: "No content - successful operation" },
  },
});
