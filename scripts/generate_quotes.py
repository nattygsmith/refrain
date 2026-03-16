#!/usr/bin/env python3
"""
As It Fell — Quote Generator
=============================
Reads as-it-fell-quotes-child.json (and future collection files) and
regenerates the QUOTES array in folk-quotes.jsx.

Usage:
    python3 generate_quotes.py

Expects to be run from the repo root, with:
    - scripts/as-it-fell-quotes-child.json  (quote library)
    - src/App.jsx                            (target file)

The script replaces the content between the markers:
    const QUOTES = [
    ];
leaving all other app code untouched.
"""

import json
import re
import sys
from pathlib import Path

# ── Config ──────────────────────────────────────────────────────────────────

QUOTE_FILES = [
    "scripts/as-it-fell-quotes-child.json",
    # Add future collection files here:
    "scripts/as-it-fell-quotes-sharp.json",
    # "scripts/as-it-fell-quotes-lloyd.json",
]

APP_FILE = "src/App.jsx"

# Markers in App.jsx that delimit the QUOTES array
START_MARKER = "const QUOTES = ["
END_MARKER = "];"

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
    # Load all quotes from all collection files
    all_quotes = []
    for path in QUOTE_FILES:
        p = Path(path)
        if not p.exists():
            print(f"Warning: {path} not found, skipping.", file=sys.stderr)
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

    # Group by collection for source comments
    by_collection = {}
    for q in all_quotes:
        coll = q.get("collection", "unknown")
        by_collection.setdefault(coll, []).append(q)

    # Build the new QUOTES array content
    blocks = []
    for coll, quotes in by_collection.items():
        blocks.append(f"  // ── {coll} ({'─' * (50 - len(coll))})")
        # Group further by source ballad
        current_source = None
        for q in quotes:
            if q["source"] != current_source:
                blocks.append(f"  // --- {q['source']} ---")
                current_source = q["source"]
            blocks.append(render_quote(q))

    new_array_body = "\n".join(blocks)
    new_quotes_block = f"const QUOTES = [\n{new_array_body}\n];"

    # Read App.jsx
    app_path = Path(APP_FILE)
    if not app_path.exists():
        print(f"Error: {APP_FILE} not found.", file=sys.stderr)
        sys.exit(1)

    app_content = app_path.read_text(encoding="utf-8")

    # Find and replace the QUOTES block
    # Match from START_MARKER to the first ]; after it
    pattern = re.compile(
        r"(const QUOTES = \[).*?(\];)",
        re.DOTALL
    )
    match = pattern.search(app_content)
    if not match:
        print(f"Error: Could not find QUOTES array in {APP_FILE}.", file=sys.stderr)
        sys.exit(1)

    new_content = app_content[:match.start()] + new_quotes_block + app_content[match.end():]
    app_path.write_text(new_content, encoding="utf-8")

    print(f"\nDone. {len(all_quotes)} approved quotes written to {APP_FILE}.")

if __name__ == "__main__":
    main()
