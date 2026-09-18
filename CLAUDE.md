# Audit RH 360° — Le Club des RH

Pré-diagnostic RH gratuit (lead magnet). Brief complet : conversation de cadrage du 2026-09-18.
Phase courante : **Phase 1 — source de vérité métier** (en attente de validation). Ne pas coder
l'interface, ne pas brancher Webflow / Zapier / Pipedrive / Brevo avant validation.

## Architecture (même pattern que `calculateur-rpo`)
- `src/config/questions.js` : piliers, contexte, échelles, questions (`ARH_QUESTIONS`).
- `src/config/legal-rules.js` : règles réglementaires sourcées + `LEGAL_VALIDATION_REQUIRED` (`ARH_LEGAL`).
- `src/config/scoring.js` : seuils, roadmap, red flags, tags commerciaux, textes, payload (`ARH_RULES`).
- Aucune question, aucun seuil ni aucune règle dans l'UI. JavaScript sans build.
- `scripts/validate.sh` : contrôle d'intégrité (doit afficher « OK »).
- `scripts/build-grille.sh` : régénère `docs/GRILLE.md` (ne jamais l'éditer à la main).

## Règles non négociables
- Jamais « non conforme », « illégal », « sanction » : vocabulaire À vérifier / À sécuriser / À structurer / Maîtrisé.
- Aucune règle réglementaire sans `legal_rule`, `applicability`, `source` officielle, `verified_at`.
  Règle incertaine → statut `legal_validation_required` → questions inactives.
- Aucune périodicité en dur dans les libellés (entretiens de parcours professionnel).
- Tags commerciaux jamais visibles. Parcours de conversion figé (brief §31).
- Commits cohérents par étape. Décisions produit : Valentin.
