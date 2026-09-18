# Audit RH 360° — Le Club des RH

Pré-diagnostic RH gratuit : contexte → questionnaire conditionnel (8 piliers) → résultat, sujets à
sécuriser, axes à structurer, points forts, roadmap → rapport par email → échange avec un consultant.
JavaScript sans framework ni build, 100 % navigateur (même architecture que `calculateur-rpo`).

```
src/config/questions.js    piliers, contexte, échelles, questions, recommandations     (ARH_QUESTIONS)
src/config/legal-rules.js  règles réglementaires sourcées + LEGAL_VALIDATION_REQUIRED (ARH_LEGAL)
src/config/scoring.js      seuils, roadmap, red flags, tags internes, textes, payload  (ARH_RULES)
src/engine.js              moteur pur, sans DOM : evaluate(), buildPayload()           (ARH_ENGINE)
src/mocks.js               intégrations simulées + gabarit de l'email Brevo            (ARH_MOCKS)
src/profiles.js            profils de test (maquette + tests)                          (ARH_PROFILES)
src/app.js · audit.css     interface, montée dans <div id="arh-audit">, classes arh-
docs/GRILLE.md             grille métier générée depuis la config
docs/QA-PHASE2.md          recette de la maquette
```

## Tester la maquette
```bash
python3 -m http.server 8766
```
Puis <http://127.0.0.1:8766/> (version propre pour les tests utilisateurs) ou <http://127.0.0.1:8766/?test=1>.
Le bouton **Outils de test** (maquette uniquement, `?test=1` ou `data-arh-dev="true"`) charge les profils préconfigurés, simule la validation juridique des règles en attente,
désactive l'Index égalité et affiche le payload CRM, les signaux commerciaux internes et les événements.

## Contrôles
```bash
scripts/test.sh
```
Contrôle d'intégrité de la config + 27 tests du moteur (JavaScriptCore, fourni avec macOS).
`scripts/build-grille.sh` régénère `docs/GRILLE.md` ; `scripts/build-condensation.sh` régénère
`docs/PROPOSITION-CONDENSATION.md` (proposition non appliquée).

## Modifier sans toucher à l'interface
- Activer Q24 : passer `LR_TRANSPARENCE_SALARIALE` à `status: 'verified'` avec source, applicabilité et red flags.
- Désactiver l'Index égalité : `enabled: false` sur `C5` (questions.js).
- Seuils, libellés de restitution, règles de tags : `scoring.js`.
