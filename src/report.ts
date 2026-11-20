// Score transcripts and write the scoring table as markdown plus a viewable HTML page.
// Usage: node src/report.ts <transcripts.json> <report.md> [report.html] [source label]

import { readFileSync, writeFileSync } from 'node:fs';
import { score } from './score.ts';
import { renderPage } from './html.ts';
import { resultLabel } from './result.ts';

const main = (): void => {
  const [inPath, mdPath, htmlPath, source] = process.argv.slice(2);
  const transcripts = JSON.parse(readFileSync(inPath, 'utf8')) as Record<string, string>;
  const sum = score(transcripts);

  const lines = [
    '# Pasketti scoring table',
    '',
    '| # | Clip | Sentence | Said | Heard | Off from said | Off from sentence | Result |',
    '|---|---|---|---|---|---|---|---|',
    ...sum.rows.map((r, i) =>
      `| ${i + 1} | ${r.file} | ${r.s.text} | ${r.said} (\`${r.saidIpa}\`) | \`${r.heard}\` | ${r.offSaid} | ${r.offTarget} | ${resultLabel(r)} |`,
    ),
    '',
    `**Misreadings caught: ${sum.caught} of ${sum.misreads}. False alarms: ${sum.falseAlarms} of ${sum.corrects}.**`,
    '',
    `**Verdict: ${sum.verdict}**`,
  ];
  const unknown = [...new Set(sum.rows.flatMap((r) => r.unknown))];
  if (unknown.length > 0) lines.push('', `Words missing from src/lexicon.ts: ${unknown.join(', ')}`);

  const md = lines.join('\n') + '\n';
  writeFileSync(mdPath, md);
  console.log(md);
  if (htmlPath) writeFileSync(htmlPath, renderPage(sum, source ?? 'clips'));
};

main();
