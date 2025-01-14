/**
 * Given an array with weights values, it returns a random index if the array with probablitie weighted by the weights.
 *
 * @param weights
 * @returns
 */
export function randomWeightedIndex(weights: number[]) {
  const totalWeight = weights.reduce((acc, val) => acc + val, 0);
  const levels = Array.from({ length: weights.length }, () => 0);
  weights.forEach((value, index) => {
    levels[index] = value;
    if (index - 1 < 0) return;
    levels[index] += levels[index - 1];
  });

  const randomValue = Math.random() * totalWeight;
  return levels.findIndex((weight) => randomValue < weight);
}

export function randomListItem(values: []) {
  return values[Math.floor(Math.random() * values.length)];
}
