#!/bin/sh
# Valide la configuration puis régénère docs/GRILLE.md.
cd "$(dirname "$0")/.." || exit 1
JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc
"$JSC" src/config/legal-rules.js src/config/questions.js src/config/scoring.js scripts/validate-config.js >/dev/null || { echo "Configuration invalide : lancer scripts/validate.sh"; exit 1; }
"$JSC" src/config/legal-rules.js src/config/questions.js src/config/scoring.js scripts/validate-config.js scripts/build-grille.js | sed '1,/^OK — configuration cohérente\.$/d' > docs/GRILLE.md
echo "docs/GRILLE.md régénéré ($(wc -l < docs/GRILLE.md | tr -d ' ') lignes)"
