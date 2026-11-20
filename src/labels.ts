// Turn a clip's file name into the words that were actually read, and find the sentence it was a reading of.
// Names can be the words said ("the cap is red.mp3") or the short form ("cape_correct.wav", "cape_as_cap.wav").

import { toIpa, words } from './lexicon.ts';
import { phoneDistance } from './distance.ts';
import { sentences, type Sentence } from './sentences.ts';

const stem = (file: string): string => file.replace(/\.[^.]+$/, '');

const shortForm = (name: string): string | null => {
  const correct = /^(\w+)_correct$/.exec(name);
  const s = correct && sentences.find((x) => x.key === correct[1]);
  if (s) return s.text;
  const swapped = /^(\w+)_as_(\w+)$/.exec(name);
  const t = swapped && sentences.find((x) => x.key === swapped[1]);
  if (!t || !swapped) return null;
  return words(t.text).map((w) => (w === t.key ? swapped[2] : w)).join(' ');
};

export const saidWords = (file: string): string[] => words(shortForm(stem(file)) ?? stem(file));

// The target is the sentence sharing the most words with what was said (either reading of it);
// sound distance only breaks ties, so a short clip like "i can read" still lands on "I can ride a bike."
export const targetFor = (said: string[]): Sentence => {
  const ipa = toIpa(said).ipa;
  const shared = (s: Sentence): number => {
    const pool = new Set([...words(s.text), ...words(s.errorText)]);
    return said.filter((w) => pool.has(w)).length;
  };
  const gap = (s: Sentence): number =>
    Math.min(phoneDistance(ipa, s.correctIpa), phoneDistance(ipa, s.errorIpa));
  const better = (a: Sentence, b: Sentence): boolean =>
    shared(a) > shared(b) || (shared(a) === shared(b) && gap(a) < gap(b));
  return sentences.reduce((best, s) => (better(s, best) ? s : best));
};
