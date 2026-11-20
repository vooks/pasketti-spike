// Score transcripts against the 8 sentences. Shared by the markdown table and the HTML page.

import { sentences, correctFile, errorFile, type Sentence } from './sentences.ts';
import { phoneDistance } from './distance.ts';

export type Row = {
  s: Sentence;
  correctHeard: string;
  errorHeard: string;
  caught: boolean | null;
  falseAlarm: boolean | null;
};

export type Summary = {
  rows: Row[];
  caught: number;
  falseAlarms: number;
  missing: number;
  verdict: 'GO' | 'UNCLEAR' | 'PIVOT';
};

// A clip "reads as the error" when it is strictly closer to the error IPA than to the correct IPA.
const readsAsError = (heard: string, s: Sentence): boolean =>
  phoneDistance(heard, s.errorIpa) < phoneDistance(heard, s.correctIpa);

const scoreRow = (s: Sentence, t: Record<string, string>): Row => {
  const correctHeard = t[correctFile(s)];
  const errorHeard = t[errorFile(s)];
  const caught = errorHeard === undefined ? null : readsAsError(errorHeard, s);
  const falseAlarm = correctHeard === undefined ? null : readsAsError(correctHeard, s);
  return { s, correctHeard: correctHeard ?? '', errorHeard: errorHeard ?? '', caught, falseAlarm };
};

const verdictFor = (caught: number): Summary['verdict'] => {
  if (caught >= 6) return 'GO';
  if (caught >= 4) return 'UNCLEAR';
  return 'PIVOT';
};

export const score = (transcripts: Record<string, string>): Summary => {
  const rows = sentences.map((s) => scoreRow(s, transcripts));
  const caught = rows.filter((r) => r.caught === true).length;
  return {
    rows,
    caught,
    falseAlarms: rows.filter((r) => r.falseAlarm === true).length,
    missing: rows.filter((r) => r.caught === null || r.falseAlarm === null).length,
    verdict: verdictFor(caught),
  };
};
