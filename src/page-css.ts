// Vooks-branded styles for the results page (tokens from vooks-ui ThemeProvider/colors.ts).

const dark = `
  --bg: #1c2428; --surface: #263238; --ink: #eef3f6; --muted: #9fb0b9; --line: #37474f;
  --accent: #4fc3f7; --title: #8ab4f8; --ok: #8bc34a; --bad: #ef5350; --warn: #ffa726;
  --ok-bg: rgba(139,195,74,.14); --bad-bg: rgba(239,83,80,.14); --warn-bg: rgba(255,167,38,.14);`;

export const pageCss = `
:root {
  --bg: #f4f8fb; --surface: #ffffff; --ink: #1c2428; --muted: #5f6f78; --line: #dde5ea;
  --accent: #03a9f4; --title: #286abe; --ok: #6a9e3f; --bad: #c22e2d; --warn: #fb8c00;
  --ok-bg: rgba(106,158,63,.12); --bad-bg: rgba(194,46,45,.1); --warn-bg: rgba(251,140,0,.12);
  color-scheme: light dark;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ${dark} } }
:root[data-theme="dark"] { ${dark} }
* { box-sizing: border-box; }
body {
  margin: 0; background: var(--bg); color: var(--ink);
  font-family: "Nunito", "Proxima Soft", ui-rounded, system-ui, sans-serif; line-height: 1.5;
}
main {
  max-width: 1040px; margin: 0 auto;
  padding: 32px max(16px, env(safe-area-inset-right, 0px)) 48px max(16px, env(safe-area-inset-left, 0px));
}
h1 { color: var(--title); font-size: 1.9rem; margin: 0 0 4px; font-weight: 800; }
h2 { font-size: 1.15rem; margin: 32px 0 12px; font-weight: 800; }
.sub { color: var(--muted); margin: 0 0 24px; }
.verdict {
  display: grid; grid-template-columns: auto 1fr; gap: 20px; align-items: center;
  background: var(--surface); border: 1px solid var(--line); border-radius: 18px; padding: 20px 24px;
}
.badge { font-size: 2rem; font-weight: 900; padding: 10px 22px; border-radius: 14px; letter-spacing: .02em; }
.badge.GO { color: var(--ok); background: var(--ok-bg); }
.badge.UNCLEAR { color: var(--warn); background: var(--warn-bg); }
.badge.PIVOT { color: var(--bad); background: var(--bad-bg); }
.stats { display: flex; flex-wrap: wrap; gap: 8px 28px; }
.stat b { display: block; font-size: 1.6rem; font-variant-numeric: tabular-nums; }
.stat span { color: var(--muted); font-size: .9rem; }
.rule { color: var(--muted); font-size: .85rem; grid-column: 1 / -1; margin: 0; }
.scroll { overflow-x: auto; background: var(--surface); border: 1px solid var(--line); border-radius: 18px; }
table { border-collapse: collapse; width: 100%; min-width: 760px; font-size: .92rem; }
th, td { text-align: left; padding: 12px 14px; border-bottom: 1px solid var(--line); vertical-align: top; }
th { color: var(--muted); font-weight: 700; font-size: .78rem; text-transform: uppercase; letter-spacing: .05em; }
tr:last-child td { border-bottom: 0; }
.sent { font-weight: 700; }
.skill { color: var(--muted); font-size: .82rem; }
.ipa { font-family: "Noto Sans", "Charis SIL", "Doulos SIL", system-ui, sans-serif; }
.exp { color: var(--muted); font-size: .82rem; }
.chip { display: inline-block; padding: 2px 10px; border-radius: 999px; font-weight: 800; font-size: .8rem; }
.chip.good { color: var(--ok); background: var(--ok-bg); }
.chip.bad { color: var(--bad); background: var(--bad-bg); }
.chip.none { color: var(--warn); background: var(--warn-bg); }
.note {
  margin-top: 24px; padding: 14px 18px; border-left: 4px solid var(--accent);
  background: var(--surface); border-radius: 0 12px 12px 0; color: var(--muted);
}
.note b { color: var(--ink); }
@media (max-width: 560px) { .verdict { grid-template-columns: 1fr; } }
`;
