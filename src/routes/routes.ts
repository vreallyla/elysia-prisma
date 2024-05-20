import Elysia from "elysia";
import { AppType } from "..";
import { AuthRoutes } from "./data/auth.routes";
import { errorModels } from "../app/models/responses/error.models";
import { ArticleRoutes } from "./data/article.routes";

//user.route.ts
export class Routes {
  private readonly app: AppType;

  constructor(app: AppType) {
    this.app = app;
    this.initRoutes();
  }

  private initRoutes() {
    // api
    this.app.use(AuthRoutes).use(ArticleRoutes);
  }
}
