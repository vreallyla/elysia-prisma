import { PrismaClient } from "@prisma/client";
import { existsSync, mkdirSync, readdirSync } from "fs";
import { resolve } from "path";
import { Log } from "../../src/app/libs/log.utils";
import { toHash } from "../../src/app/libs/string.utils";
import { prismaInit } from "../../src/database/prisma.db";
import { dateAddMinutes } from "../../src/app/libs/date.utils";

const seedLocation = resolve(__dirname, "./data");

const prisma = prismaInit();
const seeds = readdirSync(seedLocation).sort();
const [command] = process.argv.slice(2);
const isRevert = command && command.toLowerCase() == "revert";

await prisma.$connect();

const createPathWhenNotExists = () => {
  if (!existsSync(seedLocation)) mkdirSync(seedLocation);
};

const runSeeds = async () => {
  const alreadySeeds = (
    await prisma.dbSeeds.findMany({
      select: { name: true },
      orderBy: { generatedAt: "asc" },
    })
  ).map((e) => e.name);

  let escape = false;

  for await (let seed of isRevert ? seeds.reverse() : seeds) {
    const startTime = new Date().getTime();
    //   // eslint-disable-next-line @typescript-eslint/no-var-requires
    const getClass = require(seedLocation + "/" + seed)?.default;
    const hasOnDB = alreadySeeds.includes(getClass.name);

    // handle
    if (isRevert ? !hasOnDB || escape : hasOnDB) continue;

    // update: only once revert
    if (isRevert) escape = true;

    // check function exits
    if (typeof getClass != "function") {
      const msgError = seedLocation + "/" + seed + "is invalid format";
      throw new Error(msgError);
    }

    // init class
    const run = new getClass();

    await prisma.$transaction(async (q) => {
      if (isRevert) {
        await Promise.all([
          run.down(q),
          q.dbSeeds.deleteMany({ where: { name: getClass.name } }),
        ]);
      } else {
        await Promise.all([
          run.up(q),
          q.dbSeeds.create({
            data: {
              generatedAt: new Date(),
              name: getClass.name ?? startTime,
            },
          }),
        ]);
      }
    });
    Log.info(
      `successfully ${isRevert ? "revert" : "runned"} the seed in ${
        seedLocation + "/" + seed
      } [${new Date().getTime() - startTime}ms]`
    );
  }
};

if (command && command.toLowerCase() != "revert")
  throw new Error("command not found!");

createPathWhenNotExists();
await runSeeds();
await prisma.$disconnect();
