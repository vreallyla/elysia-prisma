import { nanoid } from "nanoid";
import { monthNYear } from "../../libs/date.utils";
import { StorageDefaultAbstract } from "../abstracts/storage_default.abstract";

import { unlink } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";

export class FileSystemConfigs extends StorageDefaultAbstract {
  prefixLocPath = "public/";
  prefixUrlPath = "assets/";

  async storeFile(
    data: File | File[],
    loc: string,
    deletePathFiles?: string[]
  ) {
    // define loc
    const locPath =
      this.prefixLocPath +
      (loc[0] == "/" ? loc.slice(1) : loc) +
      `/${monthNYear()}/`;

    // make dir -> not exists
    if (!existsSync(locPath)) {
      mkdirSync(locPath, { recursive: true });
    }

    // temp
    let promises: Promise<number>[] = [];
    let response: string[] = [];

    for (const dt of Array.isArray(data) ? data : [data]) {
      const naming = locPath + nanoid(3) + "_" + dt.name.split(" ").join("_");
      promises.push(Bun.write(Bun.file(naming), data));
      response.push(this.prefixUrlPath + naming.split("/").slice(1).join("/"));
    }

    await Promise.all([
      ...promises,
      ...(!deletePathFiles?.length ? [] : [this.deleteFile(deletePathFiles)]),
    ]);

    return response;
  }
  async deleteFile(paths: string[]) {
    let promises: Promise<void>[] = [];

    for await (const e of paths) {
      const parseString = e.startsWith(this.prefixUrlPath)
        ? e.replace(this.prefixUrlPath, this.prefixLocPath)
        : e;

      if (await Bun.file(parseString).exists())
        promises.push(unlink(parseString));
    }

    await Promise.all(promises);
  }
  async readFile() {}
}
