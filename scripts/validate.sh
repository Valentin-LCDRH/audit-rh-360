#!/bin/sh
# Contrôle d'intégrité de la configuration (JavaScriptCore, fourni avec macOS).
cd "$(dirname "$0")/.." || exit 1
JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc
exec "$JSC" src/config/legal-rules.js src/config/questions.js src/config/ccn-modules.js src/config/scoring.js src/data/ccn-list.js scripts/validate-config.js
