#!/usr/bin/env python3
"""
Refrain — iOS Lyrics JSON Generator
======================================
Merges all per-collection lyrics JSON files into a single lyrics.json
suitable for bundling in the iOS app.

Usage (run from repo root):
    python3 scripts/generate_lyrics_json.py

The output is a JSON object keyed by lyricsKey, matching the shape
expected by the iOS LyricsEntry model:
  {
    "child1": {
      "title": "...",
      "collectionLabel": "...",   // optional: childNumber, sharpNumber, collectionNumber, collectionLabel
      "version": "...",
      "stanzas": ["...", ...]
    },
    ...
  }

To add a new collection, add its path to LYRICS_FILES below.
"""

import json
import os
import sys
from pathlib import Path

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))

LYRICS_FILES = [
    os.path.join(SCRIPTS_DIR, "refrain-lyrics-child.json"),
    os.path.join(SCRIPTS_DIR, "refrain-lyrics-sharp.json"),
    os.path.join(SCRIPTS_DIR, "refrain-lyrics-sharp-somerset.json"),
    os.path.join(SCRIPTS_DIR, "refrain-lyrics-campbell-sharp.json"),
    os.path.join(SCRIPTS_DIR, "refrain-lyrics-karpeles-newfoundland.json"),
    os.path.join(SCRIPTS_DIR, "refrain-lyrics-gardiner-hampshire.json"),
    os.path.join(SCRIPTS_DIR, "refrain-lyrics-lomax.json"),
    os.path.join(SCRIPTS_DIR, "refrain-lyrics-lomax1934.json"),
    os.path.join(SCRIPTS_DIR, "refrain-lyrics-karpeles-appalachian.json"),
    os.path.join(SCRIPTS_DIR, "refrain-lyrics-baring-gould.json"),
    os.path.join(SCRIPTS_DIR, "refrain-lyrics-broadwood.json"),
]

TARGET_FILE = os.path.join(SCRIPTS_DIR, "..", "ios", "Refrain", "Refrain", "Resources", "lyrics.json")

# Fields to carry through to the iOS output (everything except internal metadata)
SKIP_FIELDS = {"description", "collection", "last_updated"}

# ── Helpers ───────────────────────────────────────────────────────────────────

def load_file(path):
    """Load a lyrics file, handling both flat-dict and meta/lyrics-list formats."""
    with open(path, encoding="utf-8") as f:
        data = json.load(f)

    # Format A: flat dict { "key": { title, stanzas, ... }, ... }
    if isinstance(data, dict) and "lyrics" not in data:
        return {k: v for k, v in data.items() if isinstance(v, dict)}

    # Format B: { "meta": {...}, "lyrics": [ { "key": "...", ... }, ... ] }
    if isinstance(data, dict) and "lyrics" in data and isinstance(data["lyrics"], list):
        result = {}
        for entry in data["lyrics"]:
            key = entry.get("key")
            if not key:
                continue
            cleaned = {k: v for k, v in entry.items() if k not in {"key"} | SKIP_FIELDS}
            result[key] = cleaned
        return result

    print(f"  WARNING: unrecognised format in {os.path.basename(path)}, skipping.")
    return {}

def normalise_entry(entry):
    """Return a clean entry with only runtime-relevant fields.

    Also normalises field naming inconsistencies across collections:
    - Some Karpeles Newfoundland entries use 'source' instead of 'version'.
      We map 'source' → 'version' so all entries have a consistent schema.
    """
    result = {k: v for k, v in entry.items() if k not in SKIP_FIELDS}
    # Normalise: if no 'version' but there is a 'source', promote it
    if "version" not in result and "source" in result:
        result["version"] = result.pop("source")
    return result

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    merged = {}

    for path in LYRICS_FILES:
        if not os.path.exists(path):
            print(f"  WARNING: {path} not found — skipping.")
            continue

        entries = load_file(path)
        overlap = set(merged.keys()) & set(entries.keys())
        if overlap:
            print(f"  WARNING: duplicate keys in {os.path.basename(path)}: {overlap}")

        cleaned = {k: normalise_entry(v) for k, v in entries.items()}
        merged.update(cleaned)
        print(f"  Loaded {len(cleaned)} entries from {os.path.basename(path)}")

    if not merged:
        print("No lyrics entries found. Aborting.", file=sys.stderr)
        sys.exit(1)

    print(f"  Total lyrics entries: {len(merged)}")

    target = Path(TARGET_FILE)
    target.parent.mkdir(parents=True, exist_ok=True)
    with open(target, "w", encoding="utf-8") as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)

    print(f"\nDone. {len(merged)} lyrics entries written to {TARGET_FILE}.")

if __name__ == "__main__":
    main()
