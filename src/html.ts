// Render the scored run as a standalone, Vooks-branded results page.

import { phoneDistance } from './distance.ts';
import { pageCss } from './page-css.ts';
import type { Row, Summary } from './score.ts';

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const heard = (got: string, expected: string): string => {
  if (got === '') return '<span class="chip none">missing clip</span>';
  const off = phoneDistance(got, expected);
  return `<div class="ipa">${esc(got)}</div><div class="exp">expected <span class="ipa">${esc(expected)}</span> · off by ${off}</div>`;
};

// goodWhen: the value that counts as a pass (caught=true is good, falseAlarm=false is good).
const chip = (v: boolean | null, goodWhen: boolean, yes: string, no: string): string => {
  if (v === null) return '<span class="chip none">—</span>';
  const cls = v === goodWhen ? 'good' : 'bad';
  return `<span class="chip ${cls}">${v ? yes : no}</span>`;
};

const row = (r: Row, i: number): string => `<tr>
  <td>${i + 1}</td>
  <td><div class="sent">${esc(r.s.text)}</div><div class="skill">${esc(r.s.key)} → ${esc(r.s.errorWord)} · ${esc(r.s.skill)}</div></td>
  <td>${heard(r.correctHeard, r.s.correctIpa)}</td>
  <td>${heard(r.errorHeard, r.s.errorIpa)}</td>
  <td>${chip(r.caught, true, 'Caught', 'Missed')}</td>
  <td>${chip(r.falseAlarm, false, 'False alarm', 'Clean')}</td>
</tr>`;

const sourceNote = (source: string): string => {
  if (source === 'tts') {
    return '<b>These clips are synthetic.</b> They were made with the built-in Mac voice to prove the pipeline works end to end. The real test is a child or adult reading into <code>clips/</code>, then <code>./run.sh</code>.';
  }
  return `<b>Source:</b> clips from <code>${esc(source)}/</code>.`;
};

export const renderPage = (sum: Summary, source: string): string => `<title>Pasketti spike results</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Noto+Sans&display=swap" rel="stylesheet">
<style>${pageCss}</style>
<main>
  <h1>Pasketti spike results</h1>
  <p class="sub">Can pasketti-phonetic hear the exact sound a reader got wrong? 8 sentences, each read once correctly and once with a planted error.</p>
  <section class="verdict">
    <div class="badge ${sum.verdict}">${sum.verdict}</div>
    <div class="stats">
      <div class="stat"><b>${sum.caught} / 8</b><span>errors caught</span></div>
      <div class="stat"><b>${sum.falseAlarms} / 8</b><span>false alarms</span></div>
      ${sum.missing > 0 ? `<div class="stat"><b>${sum.missing}</b><span>sentences missing a clip</span></div>` : ''}
    </div>
    <p class="rule">Go at 6+ caught, unclear at 4–5, pivot at 3 or fewer. A clip counts as the error when its sounds are closer to the error reading than to the correct one.</p>
  </section>
  <h2>Sentence by sentence</h2>
  <div class="scroll"><table>
    <thead><tr><th>#</th><th>Sentence</th><th>Read correctly: heard</th><th>Read with error: heard</th><th>Error</th><th>Correct reading</th></tr></thead>
    <tbody>${sum.rows.map(row).join('')}</tbody>
  </table></div>
  <div class="note">${sourceNote(source)}</div>
</main>
`;
