// Phone-level edit distance, normalized the way the model card scores PER:
// drop word gaps, tie bars, nasal tildes and length marks, then compare symbol by symbol.

const STRIP = /[\s|̃͡ː]/gu;

export const normalize = (ipa: string): string[] => [...ipa.normalize('NFD').replace(STRIP, '')];

export const editDistance = (a: string[], b: string[]): number => {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = row;
  }
  return prev[b.length];
};

export const phoneDistance = (heard: string, expected: string): number =>
  editDistance(normalize(heard), normalize(expected));
