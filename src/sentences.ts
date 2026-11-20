// The 8 test sentences, each with a correct reading and one planted error.
// IPA uses only symbols in the pasketti-phonetic vocab (ɹ for r, ʧ for ch, ɡ written as ASCII g).

export type Sentence = {
  key: string;
  text: string;
  errorWord: string;
  skill: string;
  correctIpa: string;
  errorIpa: string;
};

export const sentences: Sentence[] = [
  { key: 'cape', text: 'The cape is red.', errorWord: 'cap', skill: 'silent e, long a', correctIpa: 'ðə keɪp ɪz ɹɛd', errorIpa: 'ðə kæp ɪz ɹɛd' },
  { key: 'ride', text: 'I can ride a bike.', errorWord: 'rid', skill: 'silent e, long i', correctIpa: 'ɑɪ kæn ɹɑɪd ə bɑɪk', errorIpa: 'ɑɪ kæn ɹɪd ə bɑɪk' },
  { key: 'note', text: 'The note is on the desk.', errorWord: 'not', skill: 'silent e, long o', correctIpa: 'ðə noʊt ɪz ɑn ðə dɛsk', errorIpa: 'ðə nɑt ɪz ɑn ðə dɛsk' },
  { key: 'ship', text: 'A ship is on the sea.', errorWord: 'sip', skill: 'digraph sh', correctIpa: 'ə ʃɪp ɪz ɑn ðə si', errorIpa: 'ə sɪp ɪz ɑn ðə si' },
  { key: 'chin', text: 'The chin is wet.', errorWord: 'tin', skill: 'digraph ch', correctIpa: 'ðə ʧɪn ɪz wɛt', errorIpa: 'ðə tɪn ɪz wɛt' },
  { key: 'frog', text: 'I see a frog.', errorWord: 'fog', skill: 'blend fr', correctIpa: 'ɑɪ si ə fɹɑg', errorIpa: 'ɑɪ si ə fɑg' },
  { key: 'fast', text: 'The dog ran fast.', errorWord: 'fat', skill: 'final blend st', correctIpa: 'ðə dɑg ɹæn fæst', errorIpa: 'ðə dɑg ɹæn fæt' },
  { key: 'big', text: 'She has a big hat.', errorWord: 'bag', skill: 'short vowel i', correctIpa: 'ʃi hæz ə bɪg hæt', errorIpa: 'ʃi hæz ə bæg hæt' },
];

export const correctFile = (s: Sentence): string => `${s.key}_correct.wav`;
export const errorFile = (s: Sentence): string => `${s.key}_as_${s.errorWord}.wav`;
