import { PrismaClient } from "@prisma/client";
import { toKebabCase, toTitleCase } from "../../../src/app/libs/string.utils";

export default class MArticleCategories1715928404502 {
  readonly names = [
    "butter nine",
    "opposite else",
    "wide worse",
    "weather bread",
    "see farmer",
    "forest carried",
    "journey bee",
  ];

  async up(prisma: PrismaClient) {
    await prisma.mArticleCategories.createMany({
      data: this.names.map((e) => ({
        name: toTitleCase(e),
        slug: toKebabCase(e),
        isActive: true,
      })),
    });
  }

  async down(prisma: PrismaClient) {
    await prisma.mArticleCategories.deleteMany({
      where: {
        slug: {
          in: this.names.map((e) => toKebabCase(e)),
        },
      },
    });
  }
}
