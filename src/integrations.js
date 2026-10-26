/*!
 * Audit RH 360° — Le Club des RH
 * ENVOIS (rapport, rendez-vous). Seule couche de l'application qui parle au réseau.
 *
 * Configuration : window.ARH_INTEGRATIONS_CONFIG, défini par la page AVANT le chargement du bundle
 * (voir docs/INTEGRATIONS.md et src/config/integrations.example.js). Rien de secret n'y figure :
 * un Catch Hook Zapier est une URL publique en écriture seule.
 *
 * Tant que `report_webhook_url` est vide, l'envoi est SIMULÉ ici même (aucun appel réseau) et
 * l'interface l'indique (« aucun email n'est envoyé »). Tant que `meeting_path` est vide, le CTA
 * de rendez-vous est inactif et l'interface le signale.
 */
(function (root) {
  'use strict';

  var C = root.ARH_INTEGRATIONS_CONFIG || {};

  /* Mode simulé : aucun webhook configuré. Lu par l'interface pour afficher l'avertissement. */
  function isMock() { return !C.report_webhook_url; }

  /* Envoi simulé : même forme de promesse et même latence perçue que l'envoi réel. */
  function simulate() {
    return new Promise(function (resolve) {
      root.setTimeout(function () { resolve({ ok: true, mock: true }); }, 700);
    });
  }

  /* Corps du POST : champs à plat (mappage direct dans Zapier) + payload_json complet
   * + le rapport HTML prêt pour Brevo. Encodage formulaire = requête simple, aucun préflight. */
  function body(payload, email) {
    var b = new root.URLSearchParams();
    Object.keys(payload).forEach(function (k) {
      var v = payload[k];
      b.set(k, v === null || v === undefined ? '' : (typeof v === 'object' ? JSON.stringify(v) : String(v)));
    });
    b.set('payload_json', JSON.stringify(payload));
    b.set('report_subject', email.subject);
    b.set('report_html', email.html);
    return b;
  }

  /* Un Catch Hook Zapier renvoie les en-têtes CORS : on lit donc le statut HTTP et on peut
   * signaler un échec réel au visiteur (sinon un Zap en erreur passait pour un succès).
   * Si la réponse n'est pas lisible (proxy d'entreprise, extension, CORS retiré), on retente
   * une fois en `no-cors` : la donnée part, et on reste optimiste plutôt que de perdre le lead.
   * `report_webhook_mode` : 'auto' (défaut) · 'cors' (strict) · 'no-cors' (toujours optimiste). */
  function submitReport(payload, email) {
    if (isMock()) return simulate();
    var mode = C.report_webhook_mode || 'auto';
    var url = C.report_webhook_url, data = body(payload, email);
    if (mode === 'no-cors') return opaque(url, data);
    return root.fetch(url, { method: 'POST', mode: 'cors', body: data })
      .then(function (res) { return { ok: !!res && res.ok, mock: false, status: res ? res.status : null }; })
      .catch(function () { return mode === 'cors' ? { ok: false, mock: false, status: null } : opaque(url, data); });
  }
  function opaque(url, data) {
    return root.fetch(url, { method: 'POST', mode: 'no-cors', body: data })
      .then(function () { return { ok: true, mock: false, opaque: true }; })
      .catch(function () { return { ok: false, mock: false, opaque: true }; });
  }

  /* URL du rendez-vous reconstruite sur le domaine visité (staging Webflow ou production) :
   * seul le CHEMIN est configuré, jamais un domaine en dur. null si non configuré. */
  function meetingUrl() {
    if (!C.meeting_path) return null;
    try {
      var u = new root.URL(C.meeting_path, root.location.origin);
      if (u.origin !== root.location.origin) return null;   // chemin seulement, jamais un domaine tiers
      return u.origin + u.pathname + u.search + u.hash;
    } catch (e) { return null; }
  }

  var API = { isMock: isMock, submitReport: submitReport, meetingUrl: meetingUrl, config: C };
  root.ARH_INTEGRATIONS = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
