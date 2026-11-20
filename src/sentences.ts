// The 8 test sentences, each with one planted error word. Expected IPA comes from the lexicon.

import { toIpa, words } from './lexicon.ts';

export type Sentence = {
  key: string;
  text: string;
  errorWord: string;
  skill: string;
  errorText: string;
  correctIpa: string;
  errorIpa: string;
};

const make = (key: string, text: string, errorWord: string, skill: string): Sentence => {
  const errorText = words(text).map((w) => (w === key ? errorWord : w)).join(' ');
  return {
    key, text, errorWord, skill, errorText,
    correctIpa: toIpa(words(text)).ipa,
    errorIpa: toIpa(words(errorText)).ipa,
  };
};

export const sentences: Sentence[] = [
  make('cape', 'The cape is red.', 'cap', 'silent e, long a'),
  make('ride', 'I can ride a bike.', 'rid', 'silent e, long i'),
  make('note', 'The note is on the desk.', 'not', 'silent e, long o'),
  make('ship', 'A ship is on the sea.', 'sip', 'digraph sh'),
  make('chin', 'The chin is wet.', 'tin', 'digraph ch'),
  make('frog', 'I see a frog.', 'fog', 'blend fr'),
  make('fast', 'The dog ran fast.', 'fat', 'final blend st'),
  make('big', 'She has a big hat.', 'bag', 'short vowel i'),
];
