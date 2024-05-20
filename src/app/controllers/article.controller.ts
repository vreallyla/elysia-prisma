import { PrismaType } from "../../types/setup.types";

export class ArticleController {
  private readonly prisma;

  constructor(prisma: PrismaType) {
    this.prisma = prisma;
  }

  index() {
    return "ok";
  }

  store() {
    return "ok";
  }
  update() {
    return "ok";
  }
  details() {
    return "ok";
  }
  getByCategory() {
    return "ok";
  }
  getByTag() {
    return "ok";
  }
}
