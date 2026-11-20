#!/bin/sh
# One command: transcribe every clip (wav, mp3, m4a) in a folder, then fill in the scoring table and results page.
# Usage: ./run.sh            (uses clips/)
#        ./run.sh some-dir   (uses another folder)
set -e
cd "$(dirname "$0")"
CLIPS="${1:-clips}"
NAME="$(basename "$CLIPS")"
uv run python transcribe.py "$CLIPS" "results/$NAME/transcripts.json"
node src/report.ts "results/$NAME/transcripts.json" "results/$NAME/report.md" "results/$NAME/report.html" "$NAME"
echo "Table saved to results/$NAME/report.md"
echo "Page saved to results/$NAME/report.html"
