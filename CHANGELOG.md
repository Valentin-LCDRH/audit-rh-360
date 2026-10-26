# Journal des versions

Les versions sont épinglées dans les URL jsDelivr du code Webflow : **publier une version ne change
rien en production** tant que ces URL ne sont pas mises à jour.

## v1.0.0 — 2026-10-26

Première version destinée au site. Reprise de la maquette avec mise en production.

### Comportement en production

- **Garde-fou juridique.** `release.require_legal_review` passe à `false` : le statut `verified`
  (règle lue sur une source officielle, sourcée et datée) suffit à activer une règle. Avec le
  réglage précédent et un référentiel sans aucune date de relecture, 14 des 39 questions
  disparaissaient du parcours en production et aucun sujet à sécuriser ne pouvait se déclencher.
  Le réglage est désormais lu dans `scoring.js`, source unique, au lieu d'être forcé par l'interface.
  `LR_TRANSPARENCE_SALARIALE` (Q24) et `LR_ETAT_DES_LIEUX_PARCOURS` (C6) restent désactivées.
- **Sans webhook configuré, la page de production ne demande plus de coordonnées** et ne promet
  plus de rapport : l'envoi n'aboutirait pas. Un message neutre remplace le formulaire. La page de
  recette conserve le parcours complet avec envoi simulé.
- **Outils de recette réservés à la préproduction.** `?test=1` et `#test` n'ont plus aucun effet
  sans `data-arh-env="preprod"` : ils exposaient le payload CRM et les signaux commerciaux internes
  sur une page publique.
- **Vocabulaire interne retiré de l'affichage en production** (« maquette », « Phase 4/5 »).
- **Le bouton de rendez-vous n'est plus affiché** en production quand `meeting_path` est vide,
  au lieu de pointer vers une ancre inexistante.

### Fiabilité

- **Échec d'envoi détecté.** L'envoi lit le statut HTTP du webhook : une erreur serveur est signalée
  au visiteur au lieu d'un faux « Votre rapport est en route ». Repli en aveugle si la réponse n'est
  pas lisible, pour ne jamais perdre un lead pour une raison technique côté visiteur
  (`report_webhook_mode`).
- **Double chargement du script neutralisé.** Un second chargement écrasait le parcours en cours et
  doublait les écouteurs d'événements.
- **Récursion infinie supprimée** lorsqu'aucune question n'est applicable : un écran explicite la
  remplace (le cas devenait atteignable avec un garde-fou juridique strict).
- **Reprise de progression durcie** : une progression tronquée, périmée ou modifiée dans le
  navigateur repart proprement de l'accueil au lieu de faire échouer le rendu.
- **Modules manquants signalés** : message de diagnostic nommant le module absent, au lieu d'un
  bloc vide.
- **Raccourcis clavier limités** au bloc visible et ayant le focus : taper « 1 » ailleurs dans la
  page Webflow répondait à une question.

### Intégration Webflow

- **Un seul fichier JavaScript** au lieu de 11 scripts dont l'ordre devait être respecté.
- **`--arh-sticky-offset`** : la sous-navigation collante du résultat et les ancres de section ne
  passent plus sous la navbar fixe du site.
- **Police explicite** (`--arh-font`, Encode Sans par défaut) : le bloc ne dépend plus de la police
  du `<body>` Webflow.
- **`--arh-z`** : plan de la modale ajustable si la navbar du site passe au-dessus.
- **Configuration d'environnement sortie du dépôt** : webhook et page de rendez-vous se renseignent
  dans le code de la page Webflow, sans commit ni nouvelle version.

### Structure

- `mocks.js` scindé : `report-email.js` (gabarit de l'email, **dépendance de production** malgré
  son ancien nom) et le chemin simulé, intégré à `integrations.js`. Omettre l'ancien fichier
  « mocks » cassait l'envoi du rapport en production.
- `profiles.js` déplacé dans `src/dev/`.
- **Build** : fichiers servis générés depuis les sources, avec retrait des champs qui ne sont pas
  lus à l'exécution — texte des règles, articles de loi, sources, notes de validation juridique,
  descriptions des règles de qualification commerciale. Ces éléments restent dans le dépôt mais ne
  partent plus dans le navigateur des visiteurs. 235 Ko de sources → 130 Ko servis (37 Ko compressés).
- **Contrôles** : `npm run validate` (cohérence de la configuration, vocabulaire interdit, effet du
  garde-fou juridique), `npm test` (1 555 assertions, 8 000 évaluations sur 2 000 contextes),
  `scripts/browser-check.js` (76 contrôles dans Chromium), CI GitHub Actions.

### Accessibilité

- Contraste du texte secondaire porté à 4,7:1 (il était à 3,1:1, sous le seuil AA).
- Réponses regroupées et nommées par l'intitulé de la question pour les lecteurs d'écran.
- État d'envoi du formulaire annoncé.
- Classe de contenu réservé aux lecteurs d'écran modernisée (`clip-path`).

### Documentation

`README.md`, `docs/WEBFLOW.md` (blocs à coller, recette, dépannage), `docs/INTEGRATIONS.md`
(Zapier, Pipedrive, Brevo, GA4, champs reçus), `docs/CCN-IMPORT.md`.

### Inchangé

Questions, piliers, poids, scoring, seuils, hiérarchie de restitution, roadmap, règles de
qualification commerciale, textes affichés, structure du payload, événements analytics.
Un même jeu de réponses donne exactement le même résultat qu'avant.
