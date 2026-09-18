/*!
 * Audit RH 360° — ENVOIS (rapport, rendez-vous). Réels si configurés dans integrations.js,
 * sinon délégués aux mocks. L'interface ne connaît que cette couche.
 */
(function (root) {
  'use strict';
  var C = root.ARH_INTEGRATIONS_CONFIG || {}, M = root.ARH_MOCKS;

  function isMock() { return !C.report_webhook_url; }

  /* Envoi au Catch Hook Zapier : champs à plat (mappage direct dans Zapier) + payload_json complet +
   * le rapport HTML prêt pour Brevo. Même mécanisme que le simulateur RPO (no-cors, keepalive). */
  function submitReport(payload, email) {
    if (isMock()) return M.submitReport(payload, email);
    var body = new URLSearchParams();
    Object.keys(payload).forEach(function (k) {
      var v = payload[k];
      body.set(k, v === null || v === undefined ? '' : (typeof v === 'object' ? JSON.stringify(v) : String(v)));
    });
    body.set('payload_json', JSON.stringify(payload));
    body.set('report_subject', email.subject);
    body.set('report_html', email.html);
    return root.fetch(C.report_webhook_url, { method: 'POST', mode: 'no-cors', keepalive: false, body: body })
      .then(function () { return { ok: true, mock: false }; })
      .catch(function () { return { ok: false, mock: false }; });
  }

  /* URL du rendez-vous sur le domaine visité, ou null si non configurée (CTA simulé). */
  function meetingUrl() {
    if (!C.meeting_path) return null;
    try { var u = new root.URL(C.meeting_path, root.location.origin); return root.location.origin + u.pathname + u.search + u.hash; }
    catch (e) { return null; }
  }

  root.ARH_INTEGRATIONS = { isMock: isMock, submitReport: submitReport, meetingUrl: meetingUrl };
})(typeof window !== 'undefined' ? window : globalThis);
