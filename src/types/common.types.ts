import { StatusMap } from "elysia";
import { ElysiaCookie } from "elysia/dist/cookies";

/**
 * @example
 * ```
 *  type ref = { foo: string, bar: number }
 *  type fooType = GetTypeFromObjByKey< ref, "foo" >
 *  const fooData: fooType -> fooData: string
 * ```
 */
export type GetTypeFromObjByKey<T, K extends keyof T> = T[K];

// START: ELYSIA PART
type SetCookie = {
  "Set-Cookie"?: string | string[];
};

export type elysiaSet = {
  headers: Record<string, string> & SetCookie;
  status?: number | keyof StatusMap;
  redirect?: string;
  /**
   * ! Internal Property
   *
   * Use `Context.cookie` instead
   */
  cookie?: Record<string, ElysiaCookie>;
};
// END: ELYSIA PART
