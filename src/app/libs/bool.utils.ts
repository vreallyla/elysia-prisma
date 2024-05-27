export const isDev = (): boolean =>
  ["development", "test"].includes(Bun.env?.BUN_ENV ?? "");

export const isDebug = (): boolean =>
  (Bun.env?.DEBUG_MODE ?? "").toLowerCase() == "true";
