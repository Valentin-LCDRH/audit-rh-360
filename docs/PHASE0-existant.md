# Phase 0 — Audit de l'existant

Référence : simulateur de capacité recrutement, dépôt `Valentin-LCDRH/calculateur-rpo` (tag `v1.3.2`).
Architecture : JavaScript sans framework ni build, 100 % navigateur, servi par jsDelivr (tag épinglé)
et monté dans Webflow via du code personnalisé (`<div id="crs-simulator">`).

## Réutilisable tel quel (pattern)
- **Configuration centrale** (`config.js` → global `CRS_CONFIG`) : aucune valeur métier ailleurs.
- **Logique pure séparée** (`calc.js`, sans DOM) → ici `engine.js` en Phase 2.
- **Tracking** `track()` : `dataLayer.push` si GTM présent, sinon `gtag` ; événements « une fois ».
- **UTM** : lus dans l'URL, persistés en `sessionStorage`, injectés dans le payload.
- **Livraison** : GitHub public + jsDelivr épinglé par tag ; CSS encapsulé sous un préfixe (`crs-` → `arh-`).
- **CTA dynamique** `meetingUrl()` : chemin en config, domaine réel (staging / prod).

## À adapter
- **Tests** : page HTML à ouvrir via `python3 -m http.server`. Conservé pour la Phase 2, complété ici
  par des contrôles exécutables en ligne de commande (JavaScriptCore, fourni par macOS — pas de Node sur ce poste).
- **Reprise du contexte** : le simulateur passe le contexte à `/client-contact` via `sessionStorage`.
  L'audit a besoin d'une vraie **reprise de progression** (abandon / reprise) → `localStorage`
  avec expiration, clé `arh_progress`.
- **Webhook anonyme** (Zapier → Airtable) : le mécanisme existe, mais l'audit envoie un payload
  **nominatif** après conversion → à brancher en Phase 5 uniquement.
- **Template Brevo** : référencé dans le README (`brevo-email.html`) mais absent du dépôt → à recréer.

## À ne pas réutiliser
- L'interface en 4 étapes et ses composants (champs numériques, curseurs, allocation) : sans rapport
  avec un questionnaire à choix.
- La conversion par redirection vers `/client-contact` : l'audit a sa propre lead gate figée (brief §31).
- Les hypothèses sur `/ressources/...` (README obsolète : la page est à la racine).

## Benchmark Finaxim (structure seulement, rien de copié)
6 blocs, ~42 questions majoritairement oui/non, quelques conditionnelles, contact demandé **avant**
tout résultat. Nous faisons l'inverse : résultat gratuit, 26 à 35 questions selon le profil,
échelles de maturité, red flags indépendants du score, roadmap déterministe.
