import { PrismaClient } from "@prisma/client";
import { toKebabCase, toTitleCase } from "../../../src/app/libs/string.utils";
import { getRandomInt } from "../../../src/app/libs/number.utils";
import { arrShuffle } from "../../../src/app/libs/array.utils";

export default class PArticles1715928818156 {
  readonly names = [
    "fairly soft noon sister",
    "steep mouth cut stairs tank team",
    "solid sport previous leader",
    "plan pick entirely signal atom changing over",
    "difference chicken battle corner window",
    "apartment board lead fat letter",
  ];

  async up(prisma: PrismaClient) {
    const categories = await prisma.mArticleCategories.findMany({
      select: { id: true },
    });
    const tags = await prisma.mArticleTags.findMany({ select: { id: true } });

    // insert
    await prisma.pArticles.createMany({
      data: this.names.map((e) => ({
        title: toTitleCase(e),
        slug: toKebabCase(e),
        categoryId: !categories.length
          ? null
          : categories[getRandomInt(categories.length - 1)].id,
        // tags: {
        //   create: {
        //     tagId: tags[getRandomInt(tags.length - 1)].id,
        //   },
        // },
        content: `pass box sleep poor such eventually closely owner cup dirt state equal wealth nice business stock screen perhaps its smile by saw running bank
        diameter pain attack production fort relationship tool managed quarter storm tube sick atomic shout orbit constantly greater joined seat brown tribe recent service shirt
        education pet sentence stairs series wonderful queen price character sign calm final primitive beginning all circus old stronger stood swim income information amount blank
        `,
      })),
    });

    // get refs
    const articles = await prisma.pArticles.findMany({ select: { id: true } });

    // push tag rels
    await prisma.pArticleMTagRels.createMany({
      data: articles.reduce((prev, dt) => {
        const newData = arrShuffle(tags)
          .slice(0, getRandomInt(tags.length))
          .map((e) => ({
            articleId: dt.id,
            tagId: e.id,
          }));
        return [...prev, ...newData];
      }, [] as any[]),
    });
  }

  async down(prisma: PrismaClient) {
    // delete articles
    await prisma.pArticles.deleteMany({
      where: { slug: { in: this.names.map((e) => toKebabCase(e)) } },
    });
  }
}
