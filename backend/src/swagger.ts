import swaggerJSDoc from "swagger-jsdoc";

import pkg from "../package.json";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: pkg.name,
      version: pkg.version,
      description: pkg.description,
      contact: {
        name: "Nima Badiei",
        email: "nima0100@edu.sde.dk",
        url: "https://github.com/ItzNimaB/sop-it-service-solution/issues",
      },
    },
    servers: [
      { url: "http://localhost/api", description: "Local development server" },
      // {
      //   url: "https://test.udlaan.itskp-odense.dk/api",
      //   description: "Production server",
      // },
    ],
    externalDocs: {
      description: "GitHub repository",
      url: "https://github.com/ItzNimaB/sop-it-service-solution",
    },
  },
  apis: ["./src/api/routes/**/*.ts", "./src/docs/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
