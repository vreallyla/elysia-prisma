import { AppType } from "../..";
import { ArticleController } from "../../app/controllers/article.controller";
import { SwaggerConfig } from "../../app/setups/swagger.configs";

export const ArticleRoutes = (app: AppType) => {
  const c = new ArticleController(app.decorator.prisma);

  return app.guard(
    {
      detail: {
        tags: [SwaggerConfig.gArticle],
      },
    },
    (app) =>
      app.group("article", (app) => {
        return app
          .get("/", () => c.index())
          .post("/", () => c.store())
          .patch("/", () => c.update())
          .get(":slug", () => c.details())
          .get("category/:slug", () => c.getByCategory())
          .get("tag/:slug", () => c.getByTag());
      })
  );
};
