/**
 * @example
 * ```
 *  type ref = { foo: string, bar: number }
 *  type fooType = GetTypeFromObjByKey< ref, "foo" >
 *  const fooData: fooType -> fooData: string
 * ```
 */
export type GetTypeFromObjByKey<T, K extends keyof T> = T[K];
