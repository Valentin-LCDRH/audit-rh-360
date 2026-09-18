#!/bin/sh
# Assemble la pré-production (page + fichiers) dans le dossier cible (par défaut dist/preprod).
# Vérifie d'abord la configuration et les tests : rien n'est assemblé si un test échoue.
cd "$(dirname "$0")/.." || exit 1
OUT="${1:-dist/preprod}"
scripts/test.sh >/dev/null || { echo "Tests en échec : pré-production non assemblée."; exit 1; }
rm -rf "$OUT" && mkdir -p "$OUT/src/config" "$OUT/src/data"
cp preprod/page.html "$OUT/audit-rh-360.html"
cp src/audit.css src/engine.js src/mocks.js src/integrations.js src/profiles.js src/app.js "$OUT/src/"
cp src/config/legal-rules.js src/config/questions.js src/config/ccn-modules.js src/config/scoring.js src/config/integrations.js "$OUT/src/config/"
cp src/data/ccn-list.js "$OUT/src/data/"
echo "Pré-production assemblée dans $OUT ($(git rev-parse --short HEAD 2>/dev/null))"
