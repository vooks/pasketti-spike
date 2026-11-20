# Pasketti spike

Can an open phonetic speech model hear a young child misread a word?

This repo tests [drivendata/pasketti-phonetic](https://huggingface.co/drivendata/pasketti-phonetic) on the kind of errors early-reading feedback depends on: "cap" for "cape", "sip" for "ship", "fog" for "frog". The model writes down the sounds it hears (IPA), not words. That lets it catch a wrong sound even when what the child said isn't a real word.

## Result

**Early signal is good. It is not proven yet.**

| | Mistakes caught | Correct readings wrongly flagged |
|---|---|---|
| Real child (5-year-old girl) | **3 of 3** | **0 of 2** |
| Synthetic voice (pipeline check) | **7 of 8** | **0 of 8** |

The sample is small: 5 recordings from one child. It doesn't yet reach the spike's Go bar of at least 6 of 8 planted errors caught on real children.

## Real child

A 5-year-old girl read sentences from the test set aloud. Her mistakes were her own, not scripted. Each recording is named for the words she actually said, which serves as the answer key.

| Book says | She said | Model heard | Result |
|---|---|---|---|
| The cape is red. | the cape is red | `də ke͡ɪp ɪz ɹɛd` | ✓ correct reading, not flagged |
| The cape is red. | the **cap** is red | `ðə kæp ɪz ɹɛd` | ✓ mistake caught |
| I can ride a bike. | i can **read book** | `ɑ͡ɪ kæn ɹid bʊk` | ✓ mistake caught |
| I can ride a bike. | i can **read** | `ɑ͡ɪ kæn ɹid` | ✓ mistake caught |
| A ship is on the sea. | a ship is on the sea | `e͡ɪ ʃɪp ɪz ɑn ðə si` | ✓ correct reading, not flagged |

The model's sounds match what she said almost exactly, including "cap" for "cape". Small accent differences on correct readings ("the" heard as `də`) did not cause false alarms.

Audio: [`clips/`](clips). Full table: [`results/clips/report.md`](results/clips/report.md).

## Synthetic voice

The built-in Mac voice read each of the 8 test sentences twice: once correctly, and once with a single planted error. This only checks that the pipeline works. It says nothing about children.

| Sentence | Planted error | Skill | Caught? |
|---|---|---|---|
| The cape is red. | cap | silent e, long a | ✓ |
| I can ride a bike. | rid | silent e, long i | ✗ |
| The note is on the desk. | not | silent e, long o | ✓ |
| A ship is on the sea. | sip | digraph sh | ✓ |
| The chin is wet. | tin | digraph ch | ✓ |
| I see a frog. | fog | blend fr | ✓ |
| The dog ran fast. | fat | final blend st | ✓ |
| She has a big hat. | bag | short vowel i | ✓ |

The one miss: the model heard "ride" for both readings of sentence 2. The synthetic voice likely pronounced "rid" as "ride". None of the 8 correct readings were flagged.

Audio: [`samples/tts/`](samples/tts). Full table: [`results/tts/report.md`](results/tts/report.md).

## How scoring works

1. The model transcribes each clip to IPA (16 kHz audio, greedy CTC decoding).
2. The words actually said, taken from the file name, and the book sentence are each converted to expected IPA.
3. Sound-level edit distance compares what the model heard against both.
4. The model is right when what it heard is closer to what was said than to the book.

The verdict follows the spike checklist. Go if at least 6 of 8 errors are caught, unclear at 4–5, pivot at 3 or fewer.

## What this doesn't show yet

- **Enough errors:** only 3 real errors so far, against the 8 the Go bar needs.
- **Different children:** one child tested. No coverage across ages, dialects or speech differences.
- **Connected reading:** single sentences only. No hesitations, self-corrections or words-per-minute.
- **Real-world noise:** classroom and home audio, other microphones, tablets.
- **Speed:** latency for real-time feedback was not measured.
- **Model license:** Pasketti is released under OpenRAIL-M, which is not one of MIT, Apache 2.0 or CC-BY-4.0. That is open with the funder.

## Run it

Requirements: macOS or Linux, [uv](https://docs.astral.sh/uv/), and Node 24 or later. Everything runs locally, and the model downloads from Hugging Face on the first run.

```sh
./run.sh                # scores clips/
./run.sh samples/tts    # scores the synthetic set
```

Each run writes `transcripts.json`, `report.md` and a standalone `report.html` page to `results/<folder>/`.

To score new recordings, put wav, mp3 or m4a files in a folder and name each one after the words actually read, e.g. `the cap is red.mp3`. The short form `cape_correct.wav` or `cape_as_cap.wav` also works.

## Layout

| Path | What it is |
|---|---|
| `transcribe.py` | Runs the model over a folder of clips and writes IPA to JSON |
| `src/sentences.ts` | The 8 test sentences and their planted errors |
| `src/lexicon.ts` | Word-to-IPA lookup for expected pronunciations |
| `src/distance.ts` | Sound-level edit distance |
| `src/labels.ts` | Reads what was said from a clip's file name |
| `src/score.ts` | Scores each clip and decides the verdict |
| `src/report.ts` | Writes the Markdown table and HTML page |
| `clips/` | Real child recordings |
| `samples/tts/` | Synthetic recordings |
| `results/` | Output from the runs above |

## Links

- Model: https://huggingface.co/drivendata/pasketti-phonetic
- Pasketti collection: https://huggingface.co/collections/drivendata/pasketti
- RFP: https://k12-ai-infrastructure.org/
- DrivenData fine-tuning recipes: https://drivendata.co/blog/child-asr-phonetic-reference-implementation
- Competition winners' code: https://github.com/drivendataorg/on-top-of-pasketti

## Privacy

The child recordings are shared with a parent's consent for this evaluation. Please don't reuse them for training or anything outside evaluating this model.

## License

The code and recordings in this repo are under the [MIT License](LICENSE). The Pasketti model is not part of this repo. It has its own license, set by DrivenData on [Hugging Face](https://huggingface.co/drivendata/pasketti-phonetic).
