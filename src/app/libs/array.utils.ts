export function arrShuffle(ref: any[]) {
  let arr = ref;
  for (let i = 0; i < arr.length; i++) {
    let x = Math.floor(Math.random() * arr.length);
    let y = Math.floor(Math.random() * arr.length);
    if (x === y) {
      //for dont change arr[index] with self !!!
      continue;
    }
    let temp0 = arr[x];
    arr[x] = arr[y];
    arr[y] = temp0;
  }
  return arr;
}
