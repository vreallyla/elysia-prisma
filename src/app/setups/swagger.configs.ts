import swagger from "@elysiajs/swagger";
import type { OpenAPIV3 } from "openapi-types";

export class SwaggerConfig {
  static readonly gAuth = "auth";
  static readonly gArticle = "article";

  private readonly documentation: Omit<
    Partial<OpenAPIV3.Document>,
    | "x-express-openapi-additional-middleware"
    | "x-express-openapi-validation-strict"
  > = {
    info: {
      title: "Elysia Documentation",
      version: "1.0.0",
    },
    tags: [
      { name: SwaggerConfig.gAuth, description: "ok" },
      { name: SwaggerConfig.gArticle, description: "ok" },
    ],
  };

  init() {
    return swagger({
      documentation: this.documentation,
    });
  }
}
