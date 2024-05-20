import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { Log } from "../../src/app/libs/log.utils";

export const seedLocation = resolve(__dirname, "./data");
const stubLocation = "./prisma/seeds/stubs/seed.stub";
const seedNames = process.argv.slice(2);

const generateSeeder = () => {
  const stub = readFileSync(stubLocation, "utf-8");

  seedNames.forEach((seedName) => {
    const unique = new Date().getTime();
    const nameSet = seedName
      .toLowerCase()
      .replaceAll("_", " ")
      .replaceAll("-", " ")
      .replaceAll(" ", "_");

    const nameFile = `${unique}_${nameSet}.ts`;
    const nameClass = `${nameSet
      .split("_")
      .map((e) => e[0].toUpperCase() + e.slice(1))
      .join("")}${unique}`;

    writeFileSync(
      seedLocation + "/" + nameFile,
      stub.replaceAll("{{NAME}}", nameClass)
    );

    Log.info({
      name: nameSet,
      message: `successfully created the seed in ${
        seedLocation + "/" + nameFile
      } (${new Date().getTime() - unique}ms)`,
    });
  });
};

// exc: stub not found!
if (!existsSync(stubLocation)) throw new Error("stub not found");

export const createPathWhenNotExists = () => {
  if (!existsSync(seedLocation)) mkdirSync(seedLocation);
};

createPathWhenNotExists();
generateSeeder();
