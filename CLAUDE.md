# Audit RH 360° — Le Club des RH

Pré-diagnostic RH gratuit (lead magnet). Brief complet : conversation de cadrage du 2026-09-18.
Phase courante : **Phase 2 FIGÉE** (2026-09-18) jusqu'aux retours des tests utilisateurs
(`docs/GUIDE-TESTS-UTILISATEURS.md`). Ne rien optimiser avant mesure réelle ; ordre d'arbitrage :
conserver → condenser → rendre conditionnel → supprimer en dernier recours. Ensuite : Phase 3 (designer). Ne pas brancher Webflow / Zapier / Pipedrive / Brevo avant validation.
Arbitrages Phase 1 (2026-09-18) : red flag = réponse + obligation applicable ; poids 3 + B = priorité 2
« À structurer en priorité » ; pilier sans question = « Non évalué », exclu du global ; score global
pondéré sur toutes les questions ; tags commerciaux = signaux internes multiples, justifiés.

## Architecture (même pattern que `calculateur-rpo`)
- `src/config/questions.js` : piliers, contexte, échelles, questions (`ARH_QUESTIONS`).
- `src/config/legal-rules.js` : règles réglementaires sourcées + `LEGAL_VALIDATION_REQUIRED` (`ARH_LEGAL`).
- `src/config/scoring.js` : seuils, roadmap, red flags, tags commerciaux, textes, payload (`ARH_RULES`).
- Aucune question, aucun seuil ni aucune règle dans l'UI. JavaScript sans build.
- `src/engine.js` : moteur pur (aucune règle en dur). `src/app.js` : interface, aucun texte métier.
- `src/mocks.js` : intégrations simulées (Phase 2). `src/profiles.js` : profils de test.
- `scripts/test.sh` : intégrité + tests du moteur (doivent rester au vert, ajouter un test par règle).
- `scripts/validate.sh` : contrôle d'intégrité (doit afficher « OK »).
- `scripts/build-grille.sh` : régénère `docs/GRILLE.md` (ne jamais l'éditer à la main).

## Règles non négociables
- **Production** : aucune question ni logique réglementaire incertaine activée. Avant mise en production,
  passe de validation par un juriste sur TOUTES les règles `legal_flag` (pas seulement Q24/C6) ;
  `validated_by` renseigné pour chacune.
- Partie gratuite = vraie valeur (score, 8 piliers dont « Non évalué », sujets à sécuriser, points forts,
  jusqu'à 3 vraies actions). L'email débloque l'approfondissement ; aucun résultat masqué ni priorité inventée.
- Jamais « non conforme », « illégal », « sanction » : vocabulaire À vérifier / À sécuriser / À structurer / Maîtrisé.
- Aucune règle réglementaire sans `legal_rule`, `applicability`, `source` officielle, `verified_at`.
  Règle incertaine → statut `legal_validation_required` → questions inactives.
- Aucune périodicité en dur dans les libellés (entretiens de parcours professionnel).
- Formulaire de rapport = envoi du rapport + échange éventuel sur CET audit (`consent_scope`). Aucune
  inscription automatique à une liste newsletter / prospection ; l'opt-in marketing sera traité à part avant Brevo.
- Durée : objectif 6-7 min réelles ; qualité du diagnostic > promesse de durée. Promesse provisoire
  « Moins de 10 minutes » tant qu'aucun chronométrage réel n'existe. Proposition de condensation dans
  `proposals/` (non appliquée, décision après tests utilisateurs).
- Wording adaptatif (`variants`) plutôt que nouvelles questions quand le concept mesuré est le même.
- Tags commerciaux jamais visibles. Parcours de conversion figé (brief §31).
- Commits cohérents par étape. Décisions produit : Valentin.
