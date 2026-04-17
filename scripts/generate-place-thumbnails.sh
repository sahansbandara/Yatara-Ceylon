#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$ROOT_DIR/public/images/places"
OUT_DIR="$SRC_DIR/thumbs"

mkdir -p "$OUT_DIR"

find "$SRC_DIR" -maxdepth 1 -type f \( -iname '*.webp' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) | while IFS= read -r src; do
  filename="$(basename "$src")"
  stem="${filename%.*}"
  dest="$OUT_DIR/$stem.jpg"

  /usr/bin/sips -Z 320 "$src" \
    --setProperty format jpeg \
    --setProperty formatOptions 65 \
    --out "$dest" \
    >/dev/null

  echo "Generated $(basename "$dest")"
done
