export abstract class StorageDefaultAbstract {
  abstract storeFile(
    data: File | File[],
    loc: string,
    deletePathFiles?: string[]
  ): Promise<string[]>;
  abstract readFile(): Promise<void>;
  abstract deleteFile(pathFiles: string[]): Promise<void>;
}
