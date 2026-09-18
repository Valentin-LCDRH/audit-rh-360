#!/bin/sh
# Régénère docs/PROPOSITION-CONDENSATION.md (proposition non appliquée).
cd "$(dirname "$0")/.." || exit 1
JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc
"$JSC" src/config/legal-rules.js src/config/questions.js src/config/ccn-modules.js src/config/scoring.js src/data/ccn-list.js src/engine.js proposals/condensation-m.js scripts/build-condensation.js > docs/PROPOSITION-CONDENSATION.md || exit 1
echo "docs/PROPOSITION-CONDENSATION.md régénéré"
