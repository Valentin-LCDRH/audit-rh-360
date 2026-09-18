#!/bin/sh
# Contrôle de la configuration + tests du moteur (JavaScriptCore, fourni avec macOS).
cd "$(dirname "$0")/.." || exit 1
JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc
CONFIG="src/config/legal-rules.js src/config/questions.js src/config/ccn-modules.js src/config/scoring.js src/data/ccn-list.js"
"$JSC" $CONFIG scripts/validate-config.js | tail -1 || exit 1
"$JSC" $CONFIG src/engine.js src/profiles.js test/engine.test.js
