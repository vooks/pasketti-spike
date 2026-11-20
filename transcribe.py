"""Run pasketti-phonetic on every WAV in a folder and write IPA transcripts as JSON.

Usage: uv run python transcribe.py <clips_dir> <out_json>
"""

import json
import sys
from pathlib import Path

import librosa
import torch
from transformers import Wav2Vec2Processor, WavLMForCTC

REPO = "drivendata/pasketti-phonetic"


def main() -> None:
    clips_dir = Path(sys.argv[1])
    out_path = Path(sys.argv[2])
    paths = sorted(clips_dir.glob("*.wav"))
    if not paths:
        sys.exit(f"No .wav files in {clips_dir}")

    processor = Wav2Vec2Processor.from_pretrained(REPO)
    model = WavLMForCTC.from_pretrained(REPO).eval()

    results = {}
    for path in paths:
        wav, _ = librosa.load(path, sr=16000, mono=True)
        inputs = processor(wav, sampling_rate=16000, return_tensors="pt")
        with torch.no_grad():
            ids = model(**inputs).logits.argmax(-1)
        results[path.name] = processor.batch_decode(ids)[0]
        print(f"{path.name}: {results[path.name]}")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
