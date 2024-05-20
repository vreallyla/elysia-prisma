export const isDev = (): boolean =>
  ["development", "test"].includes(process.env?.BUN_ENV??'');
