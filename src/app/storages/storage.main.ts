import { FileSystemConfigs } from "./setups/filesystem.configs";

export class StorageMain {
  init() {
    return new FileSystemConfigs();
  }
}
