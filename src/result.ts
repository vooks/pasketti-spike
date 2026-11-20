// One wording for a clip's outcome, shared by the markdown table and the page.

import type { Row } from './score.ts';

export const resultLabel = (r: Row): string => {
  if (r.kind === 'correct') return r.pass ? 'Clean' : 'False alarm';
  return r.pass ? 'Caught' : 'Missed';
};
