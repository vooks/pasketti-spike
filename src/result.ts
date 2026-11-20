// Plain-English wording for a clip's outcome, shared by the markdown table and the page.
// Every outcome reads as "the model got it right" or "the model got it wrong", never as jargon.

import { words } from './lexicon.ts';
import type { Row } from './score.ts';

export const resultLabel = (r: Row): string => {
  if (r.kind === 'correct') return r.pass ? 'Right: no mistake, none flagged' : 'Wrong: flagged a mistake that wasn’t there';
  return r.pass ? 'Right: spotted the mistake' : 'Wrong: missed the mistake';
};

const quote = (ws: string[]): string => `“${ws.join(' ')}”`;

// What she got wrong, as words: "said “cap” instead of “cape”" or "added “book”".
export const mistakeText = (r: Row): string => {
  const book = words(r.s.text);
  const said = r.said.split(' ');
  const swapped = said.filter((w) => !book.includes(w));
  const skipped = book.filter((w) => !said.includes(w));
  if (swapped.length > 0 && skipped.length > 0) return `said ${quote(swapped)} instead of ${quote(skipped)}`;
  if (swapped.length > 0) return `added ${quote(swapped)}`;
  return `skipped ${quote(skipped)}`;
};

export const explain = (r: Row): string => {
  if (r.kind === 'correct' && r.pass) return 'She read it correctly, and the model agreed.';
  if (r.kind === 'correct') return 'She read it correctly, but the model thought she made a mistake.';
  if (r.pass) return `She ${mistakeText(r)}, and the model heard it.`;
  return `She ${mistakeText(r)}, but the model heard the book’s words instead.`;
};
