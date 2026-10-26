# Audit RH 360° — Le Club des RH

Questionnaire de pré-diagnostic RH intégré au site Webflow du Club des RH. Le visiteur décrit son
contexte, répond à une trentaine de questions réparties sur 8 piliers, obtient un score, ses sujets
à sécuriser et un aperçu de roadmap, puis laisse ses coordonnées pour recevoir le rapport détaillé.

Pas de serveur, pas de framework : une feuille de style et un fichier JavaScript, servis par
jsDelivr depuis ce dépôt, montés sur un `<div>` de la page Webflow.

```
dist/audit-rh.css       →  Head de la page Webflow
dist/audit-rh.min.js    →  Footer de la page Webflow
<div id="arh-audit">    →  Embed Webflow, à l'emplacement voulu
```

Les blocs prêts à coller sont dans **[docs/WEBFLOW.md](docs/WEBFLOW.md)**.
Le branchement Zapier / Pipedrive / Brevo / GA4 est dans **[docs/INTEGRATIONS.md](docs/INTEGRATIONS.md)**.

---

## Principe

Une règle, un endroit. Rien de métier n'est écrit dans l'interface.

| Fichier | Contient | Modifier pour |
|---|---|---|
| `src/config/questions.js` | piliers, contextualisation, échelles, 36 questions | changer un intitulé, un poids, une recommandation |
| `src/config/scoring.js` | seuils, hiérarchie de restitution, textes, qualification commerciale | changer un seuil, un texte de résultat, une règle de lead |
| `src/config/legal-rules.js` | référentiel réglementaire sourcé et daté | mettre à jour une obligation, acter une relecture juridique |
| `src/config/ccn-modules.js` | modules conventionnels (Syntec, Métallurgie) | ajouter une convention à contrôles spécifiques |
| `src/data/ccn-list.js` | liste des conventions du sélecteur | ajouter une convention au sélecteur |
| `src/engine.js` | moteur de calcul, fonctions pures | corriger un calcul (rare) |
| `src/app.js` | interface, écrans, événements | corriger un comportement d'écran (rare) |

Ajouter une convention collective au sélecteur n'oblige pas à écrire une règle. Ajouter un module
conventionnel ne touche ni au moteur, ni à l'interface, ni au scoring.

### Arborescence

```
src/
  audit.css                      styles, entièrement préfixés .arh
  config/questions.js            source de vérité métier
  config/scoring.js              règles de restitution et de qualification
  config/legal-rules.js          référentiel réglementaire (sources officielles)
  config/ccn-modules.js          modules conventionnels par IDCC
  config/integrations.example.js modèle de configuration d'environnement (non chargé)
  data/ccn-list.js               conventions proposées dans le sélecteur
  engine.js                      moteur : applicabilité, scoring, roadmap, payload
  report-email.js                gabarit HTML de l'email de rapport
  integrations.js                envoi du rapport, URL de rendez-vous
  dev/profiles.js                profils de recette
  app.js                         interface
dist/                            fichiers servis par le CDN (générés, versionnés)
scripts/                         build, contrôles, recette
docs/                            intégration Webflow, branchements, import IDCC
index.html                       page de recette locale
```

---

## Travailler sur le projet

```bash
npm install          # terser, seule dépendance (développement)
npm run check        # validation de la configuration + tests du moteur + build
npm run serve        # http://localhost:4173 — page de recette locale
```

| Commande | Rôle |
|---|---|
| `npm run validate` | cohérence de la configuration : identifiants, règles, recommandations manquantes, vocabulaire interdit, effet du garde-fou juridique |
| `npm test` | 1 555 assertions sur le moteur, dont un balayage de 2 000 contextes × 4 jeux de réponses |
| `npm run build` | régénère `dist/` |
| `node scripts/browser-check.js` | 76 contrôles dans un vrai navigateur (nécessite `npm i -D playwright`) |

`npm run check` doit passer avant tout commit. La CI (`.github/workflows/ci.yml`) le rejoue et
vérifie en plus que `dist/` correspond bien aux sources.

### Publier une nouvelle version

`dist/` est versionné dans le dépôt : c'est ce que sert le CDN.

```bash
npm run check
git add -A && git commit -m "Audit RH 360° v1.1.0 — <ce qui change>"
git tag v1.1.0 && git push && git push --tags
```

Puis remplacer `@v1.0.0` par `@v1.1.0` dans les deux URL du code Webflow. **Rien ne change en
production tant que ces URL ne sont pas modifiées** : c'est tout l'intérêt des versions épinglées.
Un `git push` seul ne met jamais le site en production à jour.

---

## Deux points à connaître avant de toucher à la configuration

### 1. Le garde-fou juridique

`src/config/scoring.js › release.require_legal_review` décide si une règle réglementaire doit avoir
été relue par un juriste (`legal_reviewed_at` dans `legal-rules.js`) pour être active.

En V1 il est à **`false`** : le statut `verified` suffit, c'est-à-dire une règle lue sur une source
officielle, sourcée et datée. À `true` avec le référentiel actuel (aucune date de relecture
renseignée), **14 des 39 questions disparaîtraient du parcours et aucun sujet à sécuriser ne
pourrait plus se déclencher**. `npm run validate` affiche l'effet du réglage à chaque exécution et
refuse une configuration où plus aucun red flag n'est possible.

Pour revenir à un contrôle règle par règle : remettre `true` et renseigner `legal_reviewed_at` sur
les règles effectivement relues.

Indépendamment de ce réglage, deux règles restent au statut `legal_validation_required` et leurs
questions sont inactives : `LR_TRANSPARENCE_SALARIALE` (Q24, directive 2023/970 non transposée) et
`LR_ETAT_DES_LIEUX_PARCOURS` (C6, applicabilité transitoire à documenter). La liste complète des
points à valider est dans `legal-rules.js › LEGAL_VALIDATION_REQUIRED`.

### 2. Préproduction et production

Le comportement dépend de l'attribut `data-arh-env` du point de montage.

| | page de production (`<div id="arh-audit">`) | page de recette (`data-arh-env="preprod"`) |
|---|---|---|
| Outils de recette (`?test=1`) | **jamais**, même avec le paramètre | disponibles |
| Profils préconfigurés, payload CRM, signaux commerciaux | jamais affichés | consultables |
| Aperçu de l'email | non | oui |
| Sans webhook configuré | aucune coordonnée demandée, aucun rapport promis | parcours complet, envoi simulé |

Le deuxième point est délibéré : sans webhook, l'envoi n'aboutirait pas. Demander nom, prénom, email
et entreprise pour une finalité qu'on ne peut pas honorer n'est ni honnête ni défendable au regard
du RGPD. Tant que `report_webhook_url` est vide, la page de production affiche un message neutre à
la place du formulaire.

---

## Ce que le projet ne fait pas

- **Aucune donnée n'est stockée côté serveur par l'audit.** Les réponses vivent dans le navigateur
  du visiteur (`localStorage`, 30 jours) et ne partent qu'au moment où il demande son rapport.
- **Aucun secret dans le dépôt.** Un Catch Hook Zapier est une URL publique en écriture seule ;
  elle est renseignée dans le code de la page Webflow, pas ici.
- **Ce n'est pas un audit juridique.** Le texte de clause de non-responsabilité
  (`scoring.js › disclaimer`) est affiché sur l'écran de résultat et dans l'email. Ne pas le retirer.
- **Le vocabulaire est contraint.** « non conforme », « illégal », « sanction », « infraction » et
  quelques autres termes sont interdits dans tout texte affiché ; `npm run validate` le vérifie sur
  l'ensemble des textes de la configuration.

---

© Le Club des RH. Dépôt public pour la distribution via jsDelivr ; code non ouvert à la réutilisation.
