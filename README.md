# Pasketti spike

Tests whether `drivendata/pasketti-phonetic` can catch planted reading errors in 8 sentences.

## Morning steps

1. Record 16 WAV files, one sentence per file, and put them in `clips/`.
2. Run `./run.sh`
3. Read the table in `out/clips/report.md`. It is also printed to the terminal.

The first run takes about a minute because the model loads. The model is already downloaded.

## File names (must match exactly)

| Sentence | Correct reading | Planted error |
|---|---|---|
| The cape is red. | `cape_correct.wav` | `cape_as_cap.wav` |
| I can ride a bike. | `ride_correct.wav` | `ride_as_rid.wav` |
| The note is on the desk. | `note_correct.wav` | `note_as_not.wav` |
| A ship is on the sea. | `ship_correct.wav` | `ship_as_sip.wav` |
| The chin is wet. | `chin_correct.wav` | `chin_as_tin.wav` |
| I see a frog. | `frog_correct.wav` | `frog_as_fog.wav` |
| The dog ran fast. | `fast_correct.wav` | `fast_as_fat.wav` |
| She has a big hat. | `big_correct.wav` | `big_as_bag.wav` |

Any sample rate works; clips are resampled to 16 kHz mono.

## How it scores

For each clip, the heard sounds are compared with the expected sounds for both the correct reading and the error reading (phone edit distance).

- **Error caught:** the error clip is closer to the error reading.
- **False alarm:** the correct clip is closer to the error reading.
- **Verdict:** go at 6+ caught, unclear at 4–5, pivot at 3 or fewer.

`samples/tts/` holds the synthetic clips (macOS `say`) used to prove the pipeline: `./run.sh samples/tts`.
