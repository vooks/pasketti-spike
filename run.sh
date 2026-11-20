#!/bin/sh
# One command: transcribe every WAV in a folder, then fill in the scoring table.
# Usage: ./run.sh            (uses clips/)
#        ./run.sh some-dir   (uses another folder)
set -e
cd "$(dirname "$0")"
CLIPS="${1:-clips}"
NAME="$(basename "$CLIPS")"
uv run python transcribe.py "$CLIPS" "out/$NAME/transcripts.json"
node src/report.ts "out/$NAME/transcripts.json" "out/$NAME/report.md"
echo "Table saved to out/$NAME/report.md"
