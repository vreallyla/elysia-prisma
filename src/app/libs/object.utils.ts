export const omitObject: (
  obj: Record<string, any>,
  strs?: string[]
) => Record<string, any> = (obj, strs = []) => {
  if (!strs.length || !Object.keys(obj).length) {
    return obj;
  }

  const [first, ...rest] = strs;
  const keys = first.split(".");
  const lastKey = keys.pop();
  let curObj: Record<string, any> = obj;

  if (!first.includes("."))
    return Object.keys(obj).reduce((prev, key) => {
      if (strs.includes(key)) return prev;

      return { ...prev, [key]: obj[key] };
    }, {});

  // loop keys for collect values
  for (const key of keys) {
    // escape when value is array
    if (Array.isArray(curObj[key]) && key == lastKey) break;

    // set current value
    curObj = typeof curObj == "object" ? curObj[key] : undefined;
  }

  // remove data based keys
  if (lastKey) {
    if (Array.isArray(curObj[lastKey]))
      curObj[lastKey] = curObj[lastKey].filter(
        (_: any, i: number) => i !== Number(lastKey)
      );
    else delete curObj[lastKey];
  }

  if (rest.length) omitObject(obj, rest);

  return obj;
};
