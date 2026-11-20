// Score transcripts against the 8 sentences and write the doc's scoring table.
// Usage: node src/report.ts <transcripts.json> <report.md>

import { readFileSync, writeFileSync } from 'node:fs';
import { sentences, correctFile, errorFile, type Sentence } from './sentences.ts';
import { phoneDistance } from './distance.ts';

type Row = {
  s: Sentence;
  correctHeard: string;
  errorHeard: string;
  caught: boolean | null;
  falseAlarm: boolean | null;
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

const mark = (v: boolean | null): string => (v === null ? 'missing clip' : v ? 'yes' : 'no');

const heardCell = (heard: string, expected: string): string =>
  heard === '' ? '—' : `\`${heard}\` (exp \`${expected}\`, off by ${phoneDistance(heard, expected)})`;

const verdict = (caught: number): string => {
  if (caught >= 6) return 'GO';
  if (caught >= 4) return 'UNCLEAR';
  return 'PIVOT';
};

const main = (): void => {
  const [inPath, outPath] = process.argv.slice(2);
  const transcripts = JSON.parse(readFileSync(inPath, 'utf8')) as Record<string, string>;
  const rows = sentences.map((s) => scoreRow(s, transcripts));
  const caught = rows.filter((r) => r.caught === true).length;
  const falseAlarms = rows.filter((r) => r.falseAlarm === true).length;
  const missing = rows.filter((r) => r.caught === null || r.falseAlarm === null).length;

  const lines = [
    '# Pasketti scoring table',
    '',
    '| # | Sentence (error) | Correct reading: heard | Error reading: heard | Error caught? | False alarm? |',
    '|---|---|---|---|---|---|',
    ...rows.map((r, i) =>
      `| ${i + 1} | ${r.s.text} (${r.s.key}→${r.s.errorWord}) | ${heardCell(r.correctHeard, r.s.correctIpa)} | ${heardCell(r.errorHeard, r.s.errorIpa)} | ${mark(r.caught)} | ${mark(r.falseAlarm)} |`,
    ),
    '',
    `**Errors caught: ${caught} of 8. False alarms: ${falseAlarms} of 8.**`,
    '',
    `**Verdict: ${verdict(caught)}** (go at 6+, unclear at 4–5, pivot at 3 or fewer)`,
  ];
  if (missing > 0) lines.push('', `Note: ${missing} sentence(s) are missing a clip. Check file names against the README.`);

  const md = lines.join('\n') + '\n';
  writeFileSync(outPath, md);
  console.log(md);
};

main();
