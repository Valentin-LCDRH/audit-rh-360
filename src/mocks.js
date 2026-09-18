/*!
 * Audit RH 360° — INTÉGRATIONS SIMULÉES (Phase 2).
 * Aucun appel réseau : les envois Zapier / Pipedrive / Brevo sont remplacés par des promesses
 * locales qui conservent le payload pour inspection. À remplacer en Phase 5 uniquement.
 */
(function (root) {
  'use strict';

  var log = [];

  function esc(t) { return String(t === null || t === undefined ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function label(cfg, field, id) {
    var c = cfg.Q.CONTEXT.filter(function (x) { return x.id === field; })[0];
    var o = c && c.options ? c.options.filter(function (x) { return x.id === id; })[0] : null;
    return o ? o.label : (id || '—');
  }

  /* Envoi simulé : conserve le payload, répond comme le ferait un webhook. */
  function submitReport(payload, email) {
    var entry = { at: new Date().toISOString(), target: 'mock:zapier→pipedrive+brevo', payload: payload, email_subject: email && email.subject };
    log.push(entry);
    return new Promise(function (resolve) { setTimeout(function () { resolve({ ok: true, mock: true }); }, 700); });
  }

  /* ------------------------------------------------------------------
   * Email « Votre diagnostic RH 360° » (gabarit Brevo, HTML compatible messagerie :
   * tableaux + styles en ligne). Utile en lui-même et transférable (DG, DAF…).
   * ------------------------------------------------------------------ */
  function buildReportEmail(res, payload, cfg) {
    var R = cfg.R, V = '#5E17EB', INK = '#131214', INK2 = '#5E5963', LINE = '#E9E4F0', OR = '#C0661A';
    var ctx = res.context;
    var h = [];
    function p(t, st) { h.push('<p style="margin:0 0 12px;font-size:15px;line-height:1.55;color:' + INK2 + ';' + (st || '') + '">' + t + '</p>'); }
    function h2(t) { h.push('<h2 style="margin:32px 0 12px;font-size:18px;line-height:1.3;color:' + INK + '">' + esc(t) + '</h2>'); }
    function item(title, body, rec, color) {
      h.push('<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 10px;border:1px solid ' + LINE + ';border-left:3px solid ' + (color || V) + ';border-radius:8px"><tr><td style="padding:12px 14px">' +
        '<div style="font-size:15px;font-weight:600;color:' + INK + '">' + esc(title) + '</div>' +
        (body ? '<div style="font-size:14px;color:' + INK2 + ';margin-top:4px">' + esc(body) + '</div>' : '') +
        (rec ? '<div style="font-size:14px;color:' + INK + ';margin-top:6px"><strong>Action :</strong> ' + esc(rec) + '</div>' : '') +
        '</td></tr></table>');
    }

    h.push('<div style="background:#F7F3FE;padding:24px 12px;font-family:Arial,Helvetica,sans-serif">');
    h.push('<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px"><tr><td style="padding:32px 28px">');
    h.push('<div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:' + V + ';font-weight:700">Le Club des RH · Audit RH 360°</div>');
    h.push('<h1 style="margin:8px 0 16px;font-size:24px;line-height:1.25;color:' + INK + '">Votre diagnostic RH 360°</h1>');
    p('Bonjour ' + esc(payload.firstname) + ',');
    p('Voici le détail de votre pré-diagnostic RH' + (payload.company ? ' pour <strong>' + esc(payload.company) + '</strong>' : '') + ' : vos scores, les sujets à sécuriser et une roadmap priorisée de vos prochaines actions.');

    h2('1. Contexte');
    p(esc(label(cfg, 'company_size', ctx.company_size)) + ' · CSE : ' + esc(label(cfg, 'has_cse', ctx.has_cse)) +
      ' · Organisation RH : ' + esc(label(cfg, 'hr_organization', ctx.hr_organization)) +
      (ctx.collective_agreement_label ? ' · Convention collective : ' + esc(ctx.collective_agreement_label) + (ctx.collective_agreement_idcc ? ' (IDCC ' + esc(ctx.collective_agreement_idcc) + ')' : '') : '') +
      ' · ' + res.questions_count + ' questions.');

    h2('2. Score global');
    h.push('<div style="font-size:40px;font-weight:700;color:' + INK + '">' + res.global.display_score + '<span style="font-size:18px;color:' + INK2 + '"> / 100</span></div>');
    p(esc(res.very_good ? R.result_texts.very_good.body : res.global.text), 'margin-top:6px');

    h2('3. Scores par pilier');
    h.push('<table role="presentation" width="100%" cellpadding="0" cellspacing="0">');
    res.pillars.forEach(function (pl) {
      var w = pl.evaluated ? Math.max(2, Math.round(pl.display_score)) : 0;
      h.push('<tr><td style="padding:6px 0;font-size:14px;color:' + INK + '">' + esc(pl.label) + '</td>' +
        '<td style="padding:6px 0;font-size:14px;text-align:right;color:' + INK2 + ';white-space:nowrap">' + (pl.evaluated ? pl.display_score + ' / 100' : 'Non évalué') + '</td></tr>' +
        '<tr><td colspan="2" style="padding:0 0 8px"><div style="background:#EFEAF6;border-radius:4px;height:6px"><div style="background:' + (pl.evaluated ? (pl.display_score >= 60 ? V : OR) : '#EFEAF6') + ';width:' + w + '%;height:6px;border-radius:4px"></div></div></td></tr>');
    });
    h.push('</table>');

    h2('4. Sujets à sécuriser');
    if (res.red_flags.length) res.red_flags.forEach(function (a) { item(a.subject || a.title, a.description, a.recommendation, OR); });
    else p('Vos réponses ne font ressortir aucun sujet réglementaire à sécuriser en priorité.');

    h2('5. Priorités');
    var prio = res.critical;
    if (prio.length) prio.forEach(function (a) { item((a.subject || a.title) + ' — ' + a.status, a.description, a.recommendation); });
    else p('Aucun point critique supplémentaire.');

    h2('6. Axes à structurer');
    var areas = res.areas_to_structure.filter(function (a) { return a.priority !== 2; });
    if (areas.length) areas.forEach(function (a) { item(a.subject || a.title, a.description, a.recommendation, '#9B78F4'); });
    else p(res.very_good ? 'Aucun axe à structurer : votre organisation apparaît bien structurée.' : 'Aucun axe supplémentaire.');

    h2('7. Points forts');
    if (res.strengths.length) res.strengths.forEach(function (s) { item(s.label + ' — ' + s.display_score + ' / 100', s.text, null, '#1E8E5A'); });
    else p('Vos points forts apparaîtront à mesure que vos pratiques se structurent.');

    h2('8. Roadmap détaillée');
    R.roadmap_priorities.forEach(function (pr) {
      var acts = res.roadmap.filter(function (a) { return a.priority === pr.priority; });
      if (!acts.length) return;
      h.push('<div style="font-size:13px;font-weight:700;color:' + V + ';margin:16px 0 8px;text-transform:uppercase;letter-spacing:.05em">' + esc(res.very_good && pr.priority >= 4 ? R.result_texts.very_good.optimisations_title : pr.label) + '</div>');
      acts.forEach(function (a) { item(a.title + (a.priority === 2 && pr.label_by_tone && pr.label_by_tone[a.tone] ? ' — ' + pr.label_by_tone[a.tone] : ''), a.reason, a.recommendation); });
    });

    h2('9. Hypothèses');
    p(esc(R.disclaimer), 'font-size:13px');

    h.push('<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;background:#F7F3FE;border-radius:10px"><tr><td style="padding:20px">' +
      '<div style="font-size:16px;font-weight:700;color:' + INK + '">' + esc(R.commercial_cta.title) + '</div>' +
      '<div style="font-size:14px;color:' + INK2 + ';margin:6px 0 14px">' + esc(R.commercial_cta.text) + '</div>' +
      '<a href="' + esc(R.commercial_cta.url) + '" style="display:inline-block;background:' + V + ';color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 18px;border-radius:8px">' + esc(R.commercial_cta.cta) + '</a>' +
      '</td></tr></table>');
    h.push('</td></tr></table></div>');
    return { subject: 'Votre diagnostic RH 360°', html: h.join('') };
  }

  /* active : intégrations simulées -> l'interface le signale (aucun email réellement envoyé). */
  var API = { active: true, submitReport: submitReport, buildReportEmail: buildReportEmail, log: log };
  root.ARH_MOCKS = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
