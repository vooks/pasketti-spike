// Score transcripts and write the doc's scoring table as markdown plus a viewable HTML page.
// Usage: node src/report.ts <transcripts.json> <report.md> [report.html] [source label]

import { readFileSync, writeFileSync } from 'node:fs';
import { phoneDistance } from './distance.ts';
import { score } from './score.ts';
import { renderPage } from './html.ts';

const mark = (v: boolean | null): string => (v === null ? 'missing clip' : v ? 'yes' : 'no');

const heardCell = (heard: string, expected: string): string =>
  heard === '' ? '—' : `\`${heard}\` (exp \`${expected}\`, off by ${phoneDistance(heard, expected)})`;

const main = (): void => {
  const [inPath, mdPath, htmlPath, source] = process.argv.slice(2);
  const transcripts = JSON.parse(readFileSync(inPath, 'utf8')) as Record<string, string>;
  const summary = score(transcripts);

  const lines = [
    '# Pasketti scoring table',
    '',
    '| # | Sentence (error) | Correct reading: heard | Error reading: heard | Error caught? | False alarm? |',
    '|---|---|---|---|---|---|',
    ...summary.rows.map((r, i) =>
      `| ${i + 1} | ${r.s.text} (${r.s.key}→${r.s.errorWord}) | ${heardCell(r.correctHeard, r.s.correctIpa)} | ${heardCell(r.errorHeard, r.s.errorIpa)} | ${mark(r.caught)} | ${mark(r.falseAlarm)} |`,
    ),
    '',
    `**Errors caught: ${summary.caught} of 8. False alarms: ${summary.falseAlarms} of 8.**`,
    '',
    `**Verdict: ${summary.verdict}** (go at 6+, unclear at 4–5, pivot at 3 or fewer)`,
  ];
  if (summary.missing > 0) lines.push('', `Note: ${summary.missing} sentence(s) are missing a clip. Check file names against the README.`);

  const md = lines.join('\n') + '\n';
  writeFileSync(mdPath, md);
  console.log(md);
  if (htmlPath) writeFileSync(htmlPath, renderPage(summary, source ?? 'clips'));
};

main();
