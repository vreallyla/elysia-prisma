import { PrismaClient } from "@prisma/client";
import { toKebabCase, toTitleCase } from "../../../src/app/libs/string.utils";

export default class MArticleTags1715927773396 {
  readonly names = [
    "giving day",
    "black market",
    "success story",
    "strange people",
    "away from me",
    "note love",
    "product indeed",
    "spell magic",
  ];
  async up(prisma: PrismaClient) {
    await prisma.mArticleTags.createMany({
      data: this.names.map((e) => ({
        name: toTitleCase(e),
        slug: toKebabCase(e),
        isActive: true,
      })),
    });
  }

  async down(prisma: PrismaClient) {
    await prisma.mArticleTags.deleteMany({
      where: {
        slug: {
          in: this.names.map((e) => toKebabCase(e)),
        },
      },
    });
  }
}
