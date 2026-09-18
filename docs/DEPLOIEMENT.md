# Déploiement

## Pré-production privée (tests réels)
- URL privée claude.ai (non indexée, accès par partage) — environnement `preprod` : règles vérifiées actives,
  intégrations simulées, bannière « Pré-production ».
- Mise à jour : `scripts/build-preprod.sh <dossier>` (refuse d'assembler si un test échoue), puis republication.
- Outils de test : ajouter `#test` à l'URL de la page (mesures du dernier audit terminé, profils).

## Production (Webflow, après les 3 gates)
- Environnement **production par défaut** : sans `data-arh-env`, toute règle `legal_flag` sans `legal_reviewed_at`
  est désactivée (questions et red flags). Renseigner `legal_reviewed_at` règle par règle après relecture juridique.
- Fichiers servis par jsDelivr depuis un dépôt GitHub, tag épinglé (même procédure que `calculateur-rpo`) ;
  ordre des scripts : voir `index.html` (sans `profiles.js` en production).
- Page Webflow : `<div id="arh-audit"></div>` ; page en brouillon, puis publication sur le sous-domaine de staging
  uniquement ; **noindex** et exclusion du sitemap tant que l'ouverture publique n'est pas décidée.
- Ne jamais publier le site Webflow complet sans accord (les autres modifications en attente partiraient aussi).
