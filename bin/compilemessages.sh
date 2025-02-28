#!/bin/bash
#
# Usage, from the root of the repository:
#
#   ./bin/compilemessages.sh
#

SUPPORTED_LOCALES=(
  en
  nl
)

for locale in "${SUPPORTED_LOCALES[@]}"; do
  echo "Compiling messages for locale '$locale'"
  npm run compilemessages -- \
    --ast \
    --out-file "src/i18n/compiled/$locale.json" \
    "src/i18n/messages/$locale.json" \
    "node_modules/@open-formulieren/*/i18n/messages/$locale.json"
done
