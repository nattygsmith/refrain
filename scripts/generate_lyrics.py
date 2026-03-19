#!/usr/bin/env python3
"""
As It Fell — Lyrics Generator
================================
Merges all per-collection lyrics JSON files into src/lyrics.js.

Usage (run from repo root):
    python3 scripts/generate_lyrics.py

To add a new collection, add its path to LYRICS_FILES below.
"""

import json
import os
import sys
from pathlib import Path

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))

LYRICS_FILES = [
    os.path.join(SCRIPTS_DIR, "as-it-fell-lyrics-child.json"),
    os.path.join(SCRIPTS_DIR, "as-it-fell-lyrics-sharp.json"),
    os.path.join(SCRIPTS_DIR, "as-it-fell-lyrics-sharp-somerset.json"),
    os.path.join(SCRIPTS_DIR, "as-it-fell-lyrics-campbell-sharp.json"),
    os.path.join(SCRIPTS_DIR, "as-it-fell-lyrics-karpeles-newfoundland.json"),
    # Add future collections here:
    # os.path.join(SCRIPTS_DIR, "as-it-fell-lyrics-karpeles.json"),
    # os.path.join(SCRIPTS_DIR, "as-it-fell-lyrics-lloyd.json"),
]

TARGET_FILE = os.path.join(SCRIPTS_DIR, "..", "src", "lyrics.js")

# ── Helpers ──────────────────────────────────────────────────────────────────

def escape_js_string(s):
    """Escape a string for use inside a JS double-quoted string."""
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")

def entry_to_js(key, entry):
    lines = []
    lines.append(f'  "{key}": {{')
    lines.append(f'    title: "{escape_js_string(entry["title"])}",')
    if "childNumber" in entry:
        lines.append(f'    childNumber: "{escape_js_string(entry["childNumber"])}",')
    elif "collectionLabel" in entry:
        lines.append(f'    collectionLabel: "{escape_js_string(entry["collectionLabel"])}",')
    lines.append(f'    version: "{escape_js_string(entry["version"])}",')
    lines.append(f'    stanzas: [')
    for stanza in entry["stanzas"]:
        lines.append(f'      "{escape_js_string(stanza)}",')
    lines.append(f'    ],')
    lines.append(f'  }},')
    return "\n".join(lines)

# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    merged = {}
    for path in LYRICS_FILES:
        if not os.path.exists(path):
            print(f"  WARNING: {path} not found — skipping.")
            continue
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        overlap = set(merged.keys()) & set(data.keys())
        if overlap:
            print(f"  WARNING: duplicate keys in {os.path.basename(path)}: {overlap}")
        merged.update(data)
        print(f"  Loaded {len(data)} entries from {os.path.basename(path)}")

    if not merged:
        print("No lyrics entries found. Aborting.", file=sys.stderr)
        sys.exit(1)

    print(f"  Total LYRICS entries: {len(merged)}")

    entry_strings = [entry_to_js(k, v) for k, v in merged.items()]
    output = (
        "// AUTO-GENERATED — do not edit by hand.\n"
        "// To update, edit the per-collection JSON files in scripts/ and run:\n"
        "//   python3 scripts/generate_lyrics.py\n"
        "\n"
        "export const LYRICS = {\n"
        + "\n\n".join(entry_strings)
        + "\n};\n"
    )

    target = Path(TARGET_FILE)
    target.write_text(output, encoding="utf-8")
    print(f"  Updated LYRICS in {target.name}")

if __name__ == "__main__":
    main()
