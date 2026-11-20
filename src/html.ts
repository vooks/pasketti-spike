// Render the scored run as a standalone, Vooks-branded results page: one row per clip, in plain English.

import { pageCss } from './page-css.ts';
import { explain } from './result.ts';
import type { Row, Summary, Verdict } from './score.ts';

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const mark = (r: Row): string =>
  r.pass ? '<span class="mark good" aria-label="Model was right">✓</span>' : '<span class="mark bad" aria-label="Model was wrong">✗</span>';

const row = (r: Row): string => `<tr class="${r.pass ? 'ok' : 'miss'}">
  <td>${mark(r)}</td>
  <td><div class="sent">${esc(r.s.text)}</div></td>
  <td><div class="sent">“${esc(r.said)}”</div><div class="skill">${r.kind === 'correct' ? 'read correctly' : 'made a mistake'}</div></td>
  <td><div>${esc(explain(r))}</div><details><summary>Sounds</summary><div class="exp">Model heard <span class="ipa">${esc(r.heard)}</span> · she said <span class="ipa">${esc(r.saidIpa)}</span></div></details></td>
</tr>`;

const headline: Record<Verdict, string> = {
  GO: 'Yes. The model can tell when a child misreads a word.',
  UNCLEAR: 'Maybe. The model catches some mistakes but misses too many.',
  PIVOT: 'No. The model misses most mistakes.',
  'NO MISREADS YET': 'Not known yet. Record some clips where a word is read wrong.',
};

const untested = (sum: Summary): string =>
  sum.untested.length === 0 ? '' : `<p class="rule">Sentences with no recording yet: ${sum.untested.map((s) => esc(s.text)).join(' · ')}</p>`;

const sourceNote = (source: string): string =>
  source === 'tts'
    ? 'These clips are synthetic, made with the built-in Mac voice to prove the pipeline works.'
    : `Sophie read each sentence into <code>${esc(source)}/</code>. Each file is named with the words she actually said, which is the answer key. A ✓ means the model’s answer matched what she really said.`;

export const renderPage = (sum: Summary, source: string): string => `<title>Pasketti spike results</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Noto+Sans&display=swap" rel="stylesheet">
<style>${pageCss}</style>
<main>
  <h1>Can the model hear reading mistakes?</h1>
  <p class="sub">A child reads a sentence. Does the model notice when she says a word wrong, and stay quiet when she gets it right?</p>
  <section class="verdict">
    <div class="badge ${sum.verdict.replace(/\s/g, '-')}">${sum.verdict}</div>
    <p class="answer">${headline[sum.verdict]}</p>
    <div class="stats">
      <div class="stat"><b>${sum.caught} of ${sum.misreads}</b><span>mistakes spotted<br>(higher is better)</span></div>
      <div class="stat"><b>${sum.falseAlarms} of ${sum.corrects}</b><span>correct readings wrongly flagged<br>(lower is better)</span></div>
    </div>
    <p class="rule">GO means the model spots at least 3 in 4 mistakes. Under half means pick a different approach.</p>
    ${untested(sum)}
  </section>
  <h2>Each recording</h2>
  <p class="legend"><span class="mark good">✓</span> model got it right <span class="mark bad">✗</span> model got it wrong</p>
  <div class="scroll"><table>
    <thead><tr><th></th><th>Book says</th><th>Sophie said</th><th>What happened</th></tr></thead>
    <tbody>${sum.rows.map(row).join('')}</tbody>
  </table></div>
  <div class="note">${sourceNote(source)}</div>
</main>
`;
