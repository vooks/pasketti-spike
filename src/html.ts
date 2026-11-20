// Render the scored run as a standalone, Vooks-branded results page: one row per clip.

import { pageCss } from './page-css.ts';
import { resultLabel } from './result.ts';
import type { Row, Summary } from './score.ts';

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const readingTag = (r: Row): string =>
  r.kind === 'correct' ? '<span class="skill">read as written</span>' : '<span class="skill">misread</span>';

const row = (r: Row, i: number): string => `<tr>
  <td>${i + 1}</td>
  <td><div class="sent">${esc(r.s.text)}</div><div class="skill">${esc(r.s.key)} · ${esc(r.s.skill)}</div></td>
  <td><div class="sent">“${esc(r.said)}”</div>${readingTag(r)}<div class="exp ipa">${esc(r.saidIpa)}</div></td>
  <td><div class="ipa">${esc(r.heard)}</div><div class="exp">off by ${r.offSaid} from what was said · ${r.offTarget} from the sentence</div></td>
  <td><span class="chip ${r.pass ? 'good' : 'bad'}">${resultLabel(r)}</span></td>
</tr>`;

const sourceNote = (source: string): string => {
  if (source === 'tts') {
    return '<b>These clips are synthetic.</b> They were made with the built-in Mac voice to prove the pipeline works end to end.';
  }
  return `<b>Real child reader.</b> Sophie read into <code>${esc(source)}/</code>; each file is named with the words she actually said, and that is the answer key. A misreading counts as caught when the model’s sounds are closer to what she said than to the sentence. A correct reading is a false alarm when its sounds are closer to the planted error.`;
};

const untested = (sum: Summary): string =>
  sum.untested.length === 0 ? '' : `<p class="rule">Not read yet: ${sum.untested.map((s) => esc(s.text)).join(' · ')}</p>`;

export const renderPage = (sum: Summary, source: string): string => `<title>Pasketti spike results</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Noto+Sans&display=swap" rel="stylesheet">
<style>${pageCss}</style>
<main>
  <h1>Pasketti spike results</h1>
  <p class="sub">Can pasketti-phonetic hear the exact sound a reader got wrong? Each clip is scored against what was really said.</p>
  <section class="verdict">
    <div class="badge ${sum.verdict.replace(/\s/g, '-')}">${sum.verdict}</div>
    <div class="stats">
      <div class="stat"><b>${sum.caught} / ${sum.misreads}</b><span>misreadings caught</span></div>
      <div class="stat"><b>${sum.falseAlarms} / ${sum.corrects}</b><span>false alarms</span></div>
      <div class="stat"><b>${sum.rows.length}</b><span>clips</span></div>
    </div>
    <p class="rule">Go at 75%+ of misreadings caught, unclear at 50–74%, pivot below 50% (the doc’s 6, 4–5 and 3 of 8).</p>
    ${untested(sum)}
  </section>
  <h2>Clip by clip</h2>
  <div class="scroll"><table>
    <thead><tr><th>#</th><th>Sentence</th><th>What was said</th><th>Model heard</th><th>Result</th></tr></thead>
    <tbody>${sum.rows.map(row).join('')}</tbody>
  </table></div>
  <div class="note">${sourceNote(source)}</div>
</main>
`;
