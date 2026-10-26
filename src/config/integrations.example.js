/*!
 * Audit RH 360° — MODÈLE de configuration d'environnement.
 *
 * Ce fichier n'est PAS chargé par le site et n'est PAS inclus dans le bundle : il documente
 * l'objet que la page Webflow doit définir AVANT de charger audit-rh.min.js.
 * Voir docs/INTEGRATIONS.md pour la procédure complète (Zapier, Pipedrive, Brevo, GA4).
 *
 * Pourquoi dans la page et non dans le dépôt : les valeurs diffèrent entre la page de recette et
 * la production, et les changer ne doit pas imposer un commit, une nouvelle version et une purge
 * de cache CDN.
 */
window.ARH_INTEGRATIONS_CONFIG = {

  /* Catch Hook Zapier qui reçoit le payload après « Recevoir mon rapport ».
     Vide = envoi simulé, aucun email expédié, l'interface le signale au visiteur.
     Exemple : 'https://hooks.zapier.com/hooks/catch/1234567/abcdefg/' */
  report_webhook_url: '',

  /* Lecture du statut HTTP de l'envoi.
     'auto'    (défaut) : lit le statut ; si la réponse est illisible, retente en aveugle.
     'cors'    : strict, signale tout échec au visiteur (à réserver à la recette).
     'no-cors' : jamais de lecture du statut, toujours optimiste (comportement historique). */
  report_webhook_mode: 'auto',

  /* CHEMIN de la page de prise de rendez-vous, sur le même domaine que la page visitée.
     Vide = CTA inactif. Un domaine tiers est refusé par sécurité.
     Exemple : '/prendre-rendez-vous' */
  meeting_path: '',

  /* GA4 : les événements partent dans window.dataLayer (conteneur GTM déjà présent sur le site).
     Aucun identifiant n'est nécessaire côté audit. Valeur informative. */
  analytics: 'dataLayer'
};
