#!/usr/bin/env python

"""
Build utility to extract and merge the source translation messages.
"""
import json
from collections import defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent.resolve()

INPUT_DIRS = (
  REPO_ROOT / "src" / "i18n" / "messages",
  REPO_ROOT / "node_modules" / "@open-formulieren" / "formio-renderer" / "i18n" / "messages",
)

OUTPUT_DIR = REPO_ROOT / "dist" / "i18n" / "messages"


def main():
  print("Extracting all source internationalization messages...")
  print(f"  Repository root: {REPO_ROOT}")

  messages_by_language_code = defaultdict(dict)

  for input_dir in INPUT_DIRS:
    print(f"  Scanning ./{input_dir.relative_to(REPO_ROOT)}")
    for messages_file in input_dir.iterdir():
      assert messages_file.suffix == ".json", "Expected only JSON input files."
      language_code = messages_file.stem
      print(f"    Processing {messages_file}, language: {language_code}")
      with messages_file.open("rb") as infile:
        messages = json.load(infile)
      print(f"      Found {len(messages)} messages.")
      # merge the messages together
      messages_by_language_code[language_code].update(messages)

  print("Writing merged messages...")
  if OUTPUT_DIR.exists():
    print(f"WARNING: output directory {OUTPUT_DIR} exists, overwriting contents!")

  OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
  for language_code, messages in messages_by_language_code.items():
    with (OUTPUT_DIR / f"{language_code}.json").open("w") as outfile:
      json.dump(messages, outfile, indent=2)
    print(f"  {len(messages)} message written for language: {language_code}")


if __name__ == "__main__":
  main()
