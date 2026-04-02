#!/usr/bin/env python3
"""
Refrain — iOS Quote JSON Generator
=====================================
Reads all per-collection quote JSON files and writes a single merged
quotes.json suitable for bundling in the iOS app.

Usage (run from repo root):
    python3 scripts/generate_quotes_json.py

Only quotes with status "approved" are included.

To add a new collection, add its path to QUOTE_FILES below.
"""

import json
import sys
from pathlib import Path

# ── Config ───────────────────────────────────────────────────────────────────

QUOTE_FILES = [
    "scripts/refrain-quotes-child.json",
    "scripts/refrain-quotes-sharp.json",
    "scripts/refrain-quotes-sharp-somerset.json",
    "scripts/refrain-quotes-campbell-sharp.json",
    "scripts/refrain-quotes-karpeles-newfoundland.json",
    "scripts/refrain-quotes-gardiner-hampshire.json",
    "scripts/refrain-quotes-lomax.json",
    "scripts/refrain-quotes-lomax1934.json",
    "scripts/refrain-quotes-karpeles-appalachian.json",
    "scripts/refrain-quotes-baring-gould.json",
    "scripts/refrain-quotes-broadwood.json",
]

TARGET_FILE = "ios/Refrain/Refrain/Resources/quotes.json"

# ── Fields to include in the output ──────────────────────────────────────────
# 'id', 'collection', 'status', and 'notes' are omitted — they are curation
# metadata not needed at runtime. The iOS app only needs:
#   text, source, time, season, lyricsKey (optional), stanzaIndex (optional)

RUNTIME_FIELDS = {"text", "source", "time", "season", "lyricsKey", "stanzaIndex"}

# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    all_quotes = []

    for path in QUOTE_FILES:
        p = Path(path)
        if not p.exists():
            print(f"  Warning: {path} not found, skipping.", file=sys.stderr)
            continue
        with open(p, encoding="utf-8") as f:
            data = json.load(f)
        quotes = data.get("quotes", [])
        approved = [q for q in quotes if q.get("status") == "approved"]
        print(f"  {p.name}: {len(approved)} approved quotes (of {len(quotes)} total)")

        for q in approved:
            entry = {k: v for k, v in q.items() if k in RUNTIME_FIELDS}
            # Ensure required fields are present with safe defaults
            entry.setdefault("time", [])
            entry.setdefault("season", [])
            all_quotes.append(entry)

    if not all_quotes:
        print("No approved quotes found. Aborting.", file=sys.stderr)
        sys.exit(1)

    target = Path(TARGET_FILE)
    target.parent.mkdir(parents=True, exist_ok=True)
    with open(target, "w", encoding="utf-8") as f:
        json.dump(all_quotes, f, ensure_ascii=False, indent=2)

    print(f"\nDone. {len(all_quotes)} approved quotes written to {TARGET_FILE}.")

if __name__ == "__main__":
    main()
