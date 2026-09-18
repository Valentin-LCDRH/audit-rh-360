/*!
 * Audit RH 360° — BRANCHEMENTS (à renseigner par environnement, rien de secret ici).
 *
 * Tant que `report_webhook_url` est vide, l'envoi du rapport est SIMULÉ (mocks.js) et l'interface
 * l'indique (« aucun email n'est envoyé »). Tant que `meeting_path` est vide, le CTA de rendez-vous
 * est simulé. Détail des branchements (GTM, Zapier, Pipedrive, Brevo) : docs/INTEGRATIONS.md.
 */
(function (root) {
  'use strict';
  root.ARH_INTEGRATIONS_CONFIG = {
    /* Catch Hook Zapier recevant le payload complet après « Recevoir mon rapport ».
       Exemple : 'https://hooks.zapier.com/hooks/catch/XXXXXXX/YYYYYYY/'. */
    report_webhook_url: '',

    /* Chemin de la page de prise de rendez-vous. Comme pour le simulateur RPO, seul le chemin est
       utilisé et l'URL est reconstruite sur le domaine visité (staging Webflow ou production). */
    meeting_path: '',

    /* GA4 : les événements partent dans window.dataLayer (conteneur GTM déjà présent sur le site).
       Aucun identifiant n'est nécessaire côté audit. */
    analytics: 'dataLayer'
  };
})(typeof window !== 'undefined' ? window : globalThis);
