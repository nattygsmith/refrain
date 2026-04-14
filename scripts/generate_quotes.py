#!/usr/bin/env python3
"""
As It Fell — Quote Generator
=============================
Reads all per-collection quote JSON files and regenerates src/quotes.js.

Usage (run from repo root):
    python3 scripts/generate_quotes.py

Only quotes with status "approved" are included.
Quotes with status "hold", "pending-wordsmith", or "retired" are skipped.

To add a new collection, add its path to QUOTE_FILES below.
"""

import json
import sys
from pathlib import Path

# ── Config ──────────────────────────────────────────────────────────────────

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
    "scripts/refrain-quotes-broadwood.json",
    "scripts/refrain-quotes-mackenzie.json",
    # Add future collection files here:
    # "scripts/refrain-quotes-broadwood-county.json",
    # "scripts/refrain-quotes-greig-duncan.json",
]

TARGET_FILE = "src/quotes.js"

# ── Helpers ──────────────────────────────────────────────────────────────────

def js_string(s):
    """Escape a string for use in a JS double-quoted string."""
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")

def js_array(items):
    """Render a list of strings as a compact JS array."""
    if not items:
        return "[]"
    return "[" + ", ".join(f'"{i}"' for i in items) + "]"

def render_quote(q):
    """Render a single quote object as a JS object literal."""
    lines = []
    lines.append("  {")
    lines.append(f'    text: "{js_string(q["text"])}",')
    lines.append(f'    source: "{js_string(q["source"])}",')
    lines.append(f'    time: {js_array(q.get("time", []))},')
    lines.append(f'    season: {js_array(q.get("season", []))},')

    if "lyricsKey" in q:
        lines.append(f'    lyricsKey: "{q["lyricsKey"]}",')
    if "stanzaIndex" in q:
        lines.append(f'    stanzaIndex: {q["stanzaIndex"]},')

    if q.get("notes"):
        # Emit notes as a JS comment so they're visible in source but not at runtime
        lines.append(f'    // notes: "{js_string(q["notes"])}"')

    lines.append("  },")
    return "\n".join(lines)

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
        print(f"  {path}: {len(approved)} approved quotes (of {len(quotes)} total)")
        all_quotes.extend(approved)

    if not all_quotes:
        print("No approved quotes found. Aborting.", file=sys.stderr)
        sys.exit(1)

    # Group by collection for readability in the generated file
    by_collection = {}
    for q in all_quotes:
        coll = q.get("collection", "unknown")
        by_collection.setdefault(coll, []).append(q)

    blocks = []
    for coll, quotes in by_collection.items():
        blocks.append(f"  // ── {coll} ({'─' * (50 - len(coll))})")
        current_source = None
        for q in quotes:
            if q["source"] != current_source:
                blocks.append(f"  // --- {q['source']} ---")
                current_source = q["source"]
            blocks.append(render_quote(q))

    array_body = "\n".join(blocks)
    output = (
        "// AUTO-GENERATED — do not edit by hand.\n"
        "// To update, edit the per-collection JSON files in scripts/ and run:\n"
        "//   python3 scripts/generate_quotes.py\n"
        "\n"
        f"export const QUOTES = [\n{array_body}\n];\n"
    )

    target = Path(TARGET_FILE)
    target.write_text(output, encoding="utf-8")

    print(f"\nDone. {len(all_quotes)} approved quotes written to {TARGET_FILE}.")

if __name__ == "__main__":
    main()
