// Score every transcribed clip against the sentence it was a reading of. Shared by the markdown table and the page.
//   Correct reading: a false alarm if the model heard it as closer to the planted error than to the sentence.
//   Misreading: caught if the model heard it as closer to what was actually said than to the sentence.

import { phoneDistance } from './distance.ts';
import { toIpa, words } from './lexicon.ts';
import { saidWords, targetFor } from './labels.ts';
import { sentences, type Sentence } from './sentences.ts';

export type Row = {
  file: string;
  said: string;
  s: Sentence;
  kind: 'correct' | 'misread';
  heard: string;
  saidIpa: string;
  offSaid: number;
  offTarget: number;
  pass: boolean;
  unknown: string[];
};

export type Verdict = 'GO' | 'UNCLEAR' | 'PIVOT' | 'NO MISREADS YET';

export type Summary = {
  rows: Row[];
  misreads: number;
  caught: number;
  corrects: number;
  falseAlarms: number;
  untested: Sentence[];
  verdict: Verdict;
};

const scoreClip = (file: string, heard: string): Row => {
  const said = saidWords(file);
  const s = targetFor(said);
  const { ipa: saidIpa, unknown } = toIpa(said);
  const kind = said.join(' ') === words(s.text).join(' ') ? 'correct' : 'misread';
  const offSaid = phoneDistance(heard, saidIpa);
  const offTarget = phoneDistance(heard, s.correctIpa);
  const falseAlarm = phoneDistance(heard, s.errorIpa) < offTarget;
  const pass = kind === 'correct' ? !falseAlarm : offSaid < offTarget;
  return { file, said: said.join(' '), s, kind, heard, saidIpa, offSaid, offTarget, pass, unknown };
};

// Same bar as the doc (go at 6 of 8, pivot at 3 of 8 or fewer), as a share of misreadings.
const verdictFor = (caught: number, misreads: number): Verdict => {
  if (misreads === 0) return 'NO MISREADS YET';
  if (caught / misreads >= 0.75) return 'GO';
  if (caught / misreads >= 0.5) return 'UNCLEAR';
  return 'PIVOT';
};

export const score = (transcripts: Record<string, string>): Summary => {
  const rows = Object.entries(transcripts)
    .map(([file, heard]) => scoreClip(file, heard))
    .sort((a, b) => sentences.indexOf(a.s) - sentences.indexOf(b.s) || a.kind.localeCompare(b.kind));
  const misreads = rows.filter((r) => r.kind === 'misread');
  const corrects = rows.filter((r) => r.kind === 'correct');
  const caught = misreads.filter((r) => r.pass).length;
  return {
    rows,
    misreads: misreads.length,
    caught,
    corrects: corrects.length,
    falseAlarms: corrects.filter((r) => !r.pass).length,
    untested: sentences.filter((s) => !rows.some((r) => r.s === s)),
    verdict: verdictFor(caught, misreads.length),
  };
};
