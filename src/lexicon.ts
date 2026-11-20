// Word → IPA in the pasketti-phonetic vocab (ɹ for r, ʧ for ch, ASCII g). The single source of expected sounds:
// sentence IPA and the IPA of whatever a clip's file name says was read are both built from here.
// Add a word here when a clip name uses one that is missing (the report lists unknown words).

const WORDS: Record<string, string> = {
  a: 'ə', bag: 'bæg', big: 'bɪg', bike: 'bɑɪk', book: 'bʊk', can: 'kæn', cap: 'kæp', cape: 'keɪp',
  chin: 'ʧɪn', desk: 'dɛsk', dog: 'dɑg', fast: 'fæst', fat: 'fæt', fog: 'fɑg', frog: 'fɹɑg',
  has: 'hæz', hat: 'hæt', i: 'ɑɪ', is: 'ɪz', not: 'nɑt', note: 'noʊt', on: 'ɑn', ran: 'ɹæn',
  read: 'ɹid', red: 'ɹɛd', rid: 'ɹɪd', ride: 'ɹɑɪd', sea: 'si', see: 'si', she: 'ʃi', ship: 'ʃɪp',
  sip: 'sɪp', the: 'ðə', tin: 'tɪn', wet: 'wɛt',
};

export const words = (text: string): string[] =>
  text.toLowerCase().replace(/[^a-z'\s]/g, ' ').split(/\s+/).filter(Boolean);

export type Ipa = { ipa: string; unknown: string[] };

// Unknown words fall back to their spelling so scoring still runs; the caller reports them.
export const toIpa = (ws: string[]): Ipa => ({
  ipa: ws.map((w) => WORDS[w] ?? w).join(' '),
  unknown: ws.filter((w) => !(w in WORDS)),
});
