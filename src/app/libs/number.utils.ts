export function getRandomInt(max: number) {
  const gen = Math.floor(Math.random() * (max + 1));

  return gen > max ? max : gen;
}
