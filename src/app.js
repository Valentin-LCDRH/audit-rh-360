/*!
 * Audit RH 360° — Le Club des RH
 * INTERFACE (maquette Phase 2). Aucun texte métier ici : questions, libellés, seuils et règles
 * viennent de la configuration ; les calculs viennent de engine.js.
 * Ordre de chargement : config/legal-rules.js, config/questions.js, config/scoring.js, engine.js,
 * mocks.js, [profiles.js en mode test], app.js. Point de montage : <div id="arh-audit"></div>.
 */
(function (root, doc) {
  'use strict';

  var E = root.ARH_ENGINE, M = root.ARH_MOCKS;
  var mount = doc.getElementById('arh-audit');
  if (!mount || !E || !root.ARH_QUESTIONS || !root.ARH_RULES || !root.ARH_LEGAL) {
    if (root.console) console.error('[ARH] Point de montage ou configuration manquant.');
    return;
  }

  var BASE = E.defaultConfig(), R = BASE.R;
  var DEV = mount.getAttribute('data-arh-dev') === 'true' || /[?&]test=1\b/.test(root.location.search);
  var HERO = {
    eyebrow: 'Audit RH 360°',
    title: 'Faites le point sur votre organisation RH en quelques minutes',
    lead: 'Évaluez vos pratiques RH, identifiez vos principales zones de risque et obtenez une roadmap personnalisée de vos priorités.',
    cta: 'Démarrer mon audit RH',
    meta: ['≈ 5 minutes', 'Résultat personnalisé', 'Aucune coordonnée demandée pour voir votre résultat']
  };

  /* ================================================================
   * État
   * ================================================================ */
  var S = freshState(), saved = null, sending = false, formErrors = {}, contactDraft = {}, devOpen = false, devLog = [], fired = {};
  var overrides = { rules: {}, questions: {} };
  function freshState() {
    return { step: 'intro', ctxIndex: 0, qIndex: 0, context: {}, answers: {}, converted: false,
      audit_id: 'arh_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7), started_at: null, completed_at: null };
  }
  function cfg() {
    var hasOver = Object.keys(overrides.rules).length || Object.keys(overrides.questions).length;
    return hasOver ? E.withOverrides(BASE, overrides) : BASE;
  }

  /* ---------- Stockage (toujours protégé : navigation privée, stockage bloqué…) ---------- */
  function store(kind, key, val) { try { root[kind].setItem(key, val); } catch (e) { /* sans stockage, le parcours reste utilisable */ } }
  function load(kind, key) { try { return root[kind].getItem(key); } catch (e) { return null; } }
  function drop(kind, key) { try { root[kind].removeItem(key); } catch (e) { /* idem */ } }
  function save() { if (S.step !== 'intro') store('localStorage', R.storage.progress_key, E.serializeProgress(S)); }

  var U = E.resolveUtm(root.location.search, load('sessionStorage', R.storage.utm_key), R.utm_keys);
  if (U.from_url) store('sessionStorage', R.storage.utm_key, JSON.stringify(U.utm));
  var UTM = U.utm;

  /* ---------- Analytics (même mécanisme que le simulateur RPO) ---------- */
  function track(event, props, once) {
    if (once) { if (fired[event]) return; fired[event] = true; }
    var data = { audit: 'audit_rh_360', source: UTM.utm_source || '', campaign: UTM.utm_campaign || '' };
    if (S.context.company_size) data.company_size = S.context.company_size;
    Object.keys(props || {}).forEach(function (k) { data[k] = props[k]; });
    root.dataLayer = root.dataLayer || [];
    var hasGtm = !!(root.google_tag_manager && Object.keys(root.google_tag_manager).some(function (k) { return k.indexOf('GTM-') === 0; }));
    if (hasGtm || typeof root.gtag !== 'function') root.dataLayer.push(Object.assign({ event: event }, data));
    else root.gtag('event', event, data);
    devLog.unshift(event + ' ' + JSON.stringify(data));
    if (DEV) renderDev();
  }

  /* ================================================================
   * Utilitaires d'affichage
   * ================================================================ */
  function esc(t) { return String(t === null || t === undefined ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function plural(n, forms) { return (n > 1 ? forms.many : forms.one).replace('{n}', n); }
  function ctxLabel(field, id) {
    var c = BASE.Q.CONTEXT.filter(function (x) { return x.id === field; })[0];
    var o = c && c.options ? c.options.filter(function (x) { return x.id === id; })[0] : null;
    return o ? o.label : '';
  }
  function questions() { return E.questionsFor(S.context, cfg()); }
  function pillarsFor() { return E.pillarsFor(S.context, cfg()); }

  var view = doc.createElement('div');
  mount.classList.add('arh');
  mount.innerHTML = '';
  mount.appendChild(view);

  function go(step, patch) {
    S.step = step;
    Object.keys(patch || {}).forEach(function (k) { S[k] = patch[k]; });
    save();
    render();
    var top = mount.getBoundingClientRect().top;
    if (top < 0 || top > root.innerHeight * 0.4) mount.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var h = view.querySelector('.arh-h2, .arh-h1');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  /* ================================================================
   * Écrans
   * ================================================================ */
  function renderIntro() {
    var s = saved && saved.answers ? saved : null;
    var answered = s ? Object.keys(s.answers).length : 0;
    return '<section class="arh-screen arh-hero">' +
      '<span class="arh-eyebrow">' + esc(HERO.eyebrow) + '</span>' +
      '<h1 class="arh-h1">' + esc(HERO.title) + '</h1>' +
      '<p class="arh-lead">' + esc(HERO.lead) + '</p>' +
      '<ul class="arh-meta">' + HERO.meta.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' +
      '<button class="arh-btn" data-act="start">' + esc(HERO.cta) + ' <span aria-hidden="true">→</span></button>' +
      (s && (answered || s.step !== 'intro') ? '<div class="arh-resume"><span>Vous avez un audit en cours' + (answered ? ' (' + answered + ' réponses)' : '') + '.</span>' +
        '<button class="arh-link" data-act="resume">Reprendre mon audit</button></div>' : '') +
      '<ul class="arh-pillars-preview" aria-label="Les 8 piliers évalués">' + BASE.Q.PILLARS.map(function (p) { return '<li>' + esc(p.label) + '</li>'; }).join('') + '</ul>' +
      '</section>';
  }

  function optionsHtml(opts, selected, muted) {
    return '<ul class="arh-options" role="list">' + opts.map(function (o, i) {
      return '<li><button type="button" class="arh-option' + (muted && muted(o) ? ' arh-option-muted' : '') + '" data-opt="' + esc(o.id) + '" aria-pressed="' + (selected === o.id) + '">' +
        '<span class="arh-radio" aria-hidden="true"></span><span>' + esc(o.label) + '</span><span class="arh-sr"> (touche ' + (i + 1) + ')</span></button></li>';
    }).join('') + '</ul>';
  }

  function renderContext() {
    var fields = BASE.Q.CONTEXT, f = fields[S.ctxIndex], val = S.context[f.id];
    var body = f.free_text
      ? '<div style="margin-top:26px"><label class="arh-sr" for="arh-free">' + esc(f.label) + '</label>' +
        '<input id="arh-free" class="arh-input" type="text" autocomplete="off" maxlength="120" placeholder="' + esc(f.placeholder || '') + '" value="' + esc(val || '') + '"></div>'
      : optionsHtml(f.options, val);
    return '<section class="arh-screen arh-card">' +
      '<div class="arh-top"><span class="arh-step-label">Votre contexte</span><span class="arh-count">' + (S.ctxIndex + 1) + ' / ' + fields.length + '</span></div>' +
      '<div class="arh-progress" aria-hidden="true"><span style="width:' + Math.round(S.ctxIndex / fields.length * 100) + '%"></span></div>' +
      '<div class="arh-qhead"><h2 class="arh-h2">' + esc(f.label) + '</h2>' + (f.help_text ? tipBtn() : '') + '</div>' +
      (f.help_text ? '<p class="arh-tip" id="arh-tip" hidden>' + esc(f.help_text) + '</p>' : '') +
      body +
      '<div class="arh-nav"><button class="arh-btn arh-btn-ghost" data-act="back">← Précédent</button>' +
      (f.free_text ? '<button class="arh-btn" data-act="ctx-next">' + (val ? 'Continuer' : 'Passer') + ' →</button>'
        : '<button class="arh-btn arh-btn-secondary" data-act="ctx-next"' + (val ? '' : ' disabled') + '>Suivant →</button>') + '</div>' +
      '</section>';
  }
  function tipBtn() { return '<button type="button" class="arh-tip-btn" data-act="tip" aria-expanded="false" aria-controls="arh-tip" aria-label="Plus d\'informations">?</button>'; }

  function renderQuestion() {
    var qs = questions(), q = qs[S.qIndex], C = cfg();
    if (!q) return renderQuestionMissing();
    var ps = pillarsFor(), pIdx = 0;
    ps.forEach(function (x, i) { if (x.pillar.id === q.pillar) pIdx = i; });
    var val = S.answers[q.id];
    var opts = E.answerOptions(q, C);
    return '<section class="arh-screen arh-card">' +
      '<div class="arh-top"><span class="arh-step-label">Pilier ' + (pIdx + 1) + '/' + ps.length + ' — ' + esc(ps[pIdx].pillar.label) + '</span>' +
      '<span class="arh-count">' + (S.qIndex + 1) + ' / ' + qs.length + '</span></div>' +
      '<div class="arh-progress" aria-hidden="true"><span style="width:' + Math.round(S.qIndex / qs.length * 100) + '%"></span></div>' +
      '<div class="arh-qhead"><h2 class="arh-h2">' + esc(q.question) + '</h2>' + tipBtn() + '</div>' +
      '<p class="arh-tip" id="arh-tip" hidden>' + esc(q.help_text) + '</p>' +
      optionsHtml(opts, val, function (o) { return o.id === 'unknown' || o.id === 'na'; }) +
      '<div class="arh-nav"><button class="arh-btn arh-btn-ghost" data-act="back">← Précédent</button>' +
      '<button class="arh-btn arh-btn-secondary" data-act="q-next"' + (val ? '' : ' disabled') + '>' + (S.qIndex === qs.length - 1 ? 'Voir mon résultat' : 'Suivant') + ' →</button></div>' +
      '<p class="arh-small arh-kbd-hint">Astuce : touches 1 à ' + opts.length + ' pour répondre.</p>' +
      '</section>';
  }
  function renderQuestionMissing() { S.qIndex = 0; return renderQuestion(); }

  /* ---------- Résultat ---------- */
  function itemHtml(a, kind) {
    var cls = kind === 'secure' ? ' arh-item-secure' : kind === 'strength' ? ' arh-item-strength' : kind === 'optim' ? ' arh-item-optim' : '';
    var tagCls = kind === 'secure' ? ' arh-tag-secure' : kind === 'strength' ? ' arh-tag-strength' : '';
    return '<li class="arh-item' + cls + '"><div class="arh-item-head"><h4>' + esc(a.title) + '</h4>' +
      (a.tag ? '<span class="arh-tag' + tagCls + '">' + esc(a.tag) + '</span>' : '') + '</div>' +
      (a.body ? '<p>' + esc(a.body) + '</p>' : '') + (a.rec ? '<p class="arh-rec">' + esc(a.rec) + '</p>' : '') + '</li>';
  }

  function renderResults() {
    var C = cfg(), res = E.evaluate(S.context, S.answers, C), T = R.result_texts;
    if (!res.complete) {   // effectif modifié, nouvelles questions : on reprend à la première manquante
      var idx = questions().map(function (q) { return q.id; }).indexOf(res.missing[0]);
      S.step = 'question'; S.qIndex = Math.max(0, idx); save();
      return renderQuestion();
    }
    var g = res.global, lv = g.level, nAreas = Math.min(R.thresholds.max_areas_to_structure, res.areas_to_structure.length);
    var h = '<div class="arh-screen arh-results">';

    /* Bloc 1 — score global */
    h += '<section class="arh-card arh-score-card' + (res.very_good ? ' arh-good' : '') + '" aria-labelledby="arh-res-title">';
    if (res.very_good) h += '<div class="arh-good-mark" aria-hidden="true">✓</div>';
    h += '<span class="arh-eyebrow">Votre diagnostic RH</span>';
    h += '<h2 class="arh-h2" id="arh-res-title" style="margin-top:14px">' + esc(res.very_good ? T.very_good.title : 'Votre diagnostic RH 360°') + '</h2>';
    h += '<div class="arh-score-row"><div class="arh-score" aria-label="Score global ' + g.display_score + ' sur 100">' + g.display_score + '<small>/ 100</small></div>' +
      '<span class="arh-level arh-lv-' + lv + '">' + esc(g.level_label) + '</span></div>';
    h += '<div class="arh-gauge" aria-hidden="true"><i style="left:' + g.display_score + '%"></i></div>';
    h += '<p class="arh-lead" style="margin-top:14px">' + esc(res.very_good ? T.very_good.body : g.text) + '</p>';
    h += '<div class="arh-summary">' +
      (res.red_flags.length ? '<span class="arh-chip arh-chip-warn"><b>' + res.red_flags.length + '</b> ' + (res.red_flags.length > 1 ? 'sujets à sécuriser' : 'sujet à sécuriser') + '</span>' : '<span class="arh-chip"><b>0</b> sujet réglementaire à sécuriser</span>') +
      (res.very_good || !nAreas ? '' : '<span class="arh-chip"><b>' + nAreas + '</b> ' + (nAreas > 1 ? 'axes à structurer' : 'axe à structurer') + '</span>') +
      (res.strengths.length ? '<span class="arh-chip"><b>' + res.strengths.length + '</b> ' + (res.strengths_fallback ? (res.strengths.length > 1 ? 'points d\'appui' : 'point d\'appui') : (res.strengths.length > 1 ? 'points forts' : 'point fort')) + '</span>' : '') +
      (res.vigilance_count ? '<span class="arh-chip"><b>' + res.vigilance_count + '</b> « Je ne sais pas »</span>' : '') + '</div>';
    h += '<p class="arh-context-line">' + esc([ctxLabel('company_size', S.context.company_size), ctxLabel('hr_organization', S.context.hr_organization), res.questions_count + ' questions'].filter(Boolean).join(' · ')) + '</p>';
    h += '</section>';

    /* Bloc 2 — sujets à sécuriser */
    if (res.red_flags.length) {
      h += '<section class="arh-card"><div class="arh-section-head"><h3 class="arh-h3">' + esc(plural(res.red_flags.length, T.red_flags_title)) + '</h3></div><ul class="arh-items">' +
        res.red_flags.map(function (a) { return itemHtml({ title: a.title, tag: a.status, body: a.description }, 'secure'); }).join('') + '</ul></section>';
    }

    /* Bloc 3 — points forts (en tête si très bon résultat) */
    var strengthsHtml = res.strengths.length ? '<section class="arh-card"><div class="arh-section-head"><h3 class="arh-h3">' +
      esc(res.very_good ? T.very_good.strengths_title : res.strengths_fallback ? T.strengths_fallback_title : T.strengths_title) + '</h3></div><ul class="arh-items">' +
      res.strengths.map(function (s) { return itemHtml({ title: s.label, tag: s.display_score + ' / 100', body: s.text }, 'strength'); }).join('') + '</ul></section>' : '';
    if (res.very_good) h += strengthsHtml;

    /* Bloc 4 — axes à structurer (jamais inventés : vide si très bon résultat) */
    var maxA = R.thresholds.max_areas_to_structure;
    if (res.areas_to_structure.length) {
      h += '<section class="arh-card"><div class="arh-section-head"><h3 class="arh-h3">' + esc(plural(Math.min(maxA, res.areas_to_structure.length), T.areas_title)) + '</h3></div><ul class="arh-items">' +
        res.areas_to_structure.slice(0, maxA).map(function (a) { return itemHtml({ title: a.title, tag: a.status, body: a.description }); }).join('') + '</ul>' +
        (res.areas_to_structure.length > maxA ? '<p class="arh-small" style="margin:12px 0 0">+ ' + (res.areas_to_structure.length - maxA) + ' autres dans votre rapport détaillé.</p>' : '') + '</section>';
    }

    /* Bloc 5 — scores par pilier */
    h += '<section class="arh-card"><div class="arh-section-head"><h3 class="arh-h3">Vos scores par pilier</h3></div><ul class="arh-bars">' +
      res.pillars.map(function (p) {
        if (!p.evaluated) return '<li class="arh-bar-ne"><div class="arh-bar-top"><b>' + esc(p.label) + '</b><span class="arh-bar-val">Non évalué</span></div><div class="arh-bar-track"></div><div class="arh-bar-sub">' + esc(T.pillar_not_evaluated) + '</div></li>';
        return '<li><div class="arh-bar-top"><b>' + esc(p.label) + '</b><span class="arh-bar-val">' + p.display_score + '</span></div>' +
          '<div class="arh-bar-track" role="img" aria-label="' + esc(p.label + ' : ' + p.display_score + ' sur 100, ' + p.level_label) + '"><div class="arh-bar-fill arh-fill-' + p.level + '" style="width:' + Math.max(2, p.display_score) + '%"></div></div>' +
          '<div class="arh-bar-sub">' + esc(p.level_label) + (p.red_flags_count ? ' · ' + p.red_flags_count + ' à sécuriser' : '') + '</div></li>';
      }).join('') + '</ul></section>';

    if (!res.very_good) h += strengthsHtml;

    /* Bloc 6 — pistes d'optimisation (très bon résultat) ou aperçu de roadmap */
    var lim = R.roadmap_display_limit.free_results;
    if (res.very_good) {
      if (res.optimisations.length) h += '<section class="arh-card"><div class="arh-section-head"><h3 class="arh-h3">' + esc(T.very_good.optimisations_title) + '</h3></div><ul class="arh-items">' +
        res.optimisations.slice(0, lim).map(function (a) { return itemHtml({ title: a.title, body: a.recommendation }, 'optim'); }).join('') + '</ul></section>';
    } else if (res.roadmap.length) {
      h += '<section class="arh-card"><div class="arh-section-head"><h3 class="arh-h3">Vos premières actions</h3><span class="arh-small">Aperçu de votre roadmap</span></div><ol class="arh-roadmap">' +
        res.roadmap.slice(0, lim).map(function (a) {
          return '<li><div><span class="arh-tag' + (a.priority === 1 ? ' arh-tag-secure' : '') + '">' + esc(priorityLabel(a)) + '</span>' +
            '<h4>' + esc(a.title) + '</h4><p>' + esc(a.recommendation || a.description) + '</p></div></li>';
        }).join('') + '</ol>' +
        (res.roadmap.length > lim ? '<div class="arh-locked">+ ' + (res.roadmap.length - lim) + ' actions priorisées dans votre roadmap détaillée, envoyée avec votre rapport.</div>' : '') + '</section>';
    }

    /* Bloc 7 — lead gate / post-conversion */
    h += S.converted ? renderConverted() : renderGate();

    h += '<p class="arh-disclaimer">' + esc(R.disclaimer) + '</p>';
    h += '<div class="arh-actions-row"><button class="arh-btn arh-btn-ghost" data-act="edit">Modifier mes réponses</button>' +
      '<button class="arh-btn arh-btn-ghost" data-act="restart">Recommencer l\'audit</button></div>';
    h += '</div>';
    return h;
  }

  function renderGate() {
    var F = R.lead_form;
    return '<section class="arh-card arh-gate" id="arh-gate"><h3 class="arh-h3" style="font-size:22px">' + esc(F.title) + '</h3>' +
      '<p class="arh-muted" style="margin:8px 0 0">' + esc(F.text) + '</p>' +
      '<form class="arh-form" novalidate data-form="lead">' + F.fields.map(function (f) {
        var err = formErrors[f.id];
        return '<div class="arh-field' + (f.id === 'email' || f.id === 'company' ? '' : '') + '"><label for="arh-f-' + f.id + '">' + esc(f.label) + '</label>' +
          '<input class="arh-input" id="arh-f-' + f.id + '" name="' + f.id + '" type="' + (f.type || 'text') + '" autocomplete="' + ({ firstname: 'given-name', lastname: 'family-name', email: 'email', company: 'organization' }[f.id] || 'off') + '"' +
          ' value="' + esc(contactDraft[f.id] || '') + '"' + (err ? ' aria-invalid="true" aria-describedby="arh-e-' + f.id + '"' : '') + ' required>' +
          (err ? '<div class="arh-error" id="arh-e-' + f.id + '">' + esc(err) + '</div>' : '') + '</div>';
      }).join('') +
      '<div class="arh-full"><button class="arh-btn" type="submit"' + (sending ? ' disabled' : '') + '>' + (sending ? 'Envoi en cours…' : esc(F.cta)) + '</button>' +
      '<p class="arh-small" style="margin:10px 0 0">' + esc(F.privacy_note) + ' <a class="arh-link" style="font-weight:500" href="' + esc(F.privacy_url) + '" target="_blank" rel="noopener">Politique de confidentialité</a></p></div>' +
      '</form></section>';
  }

  function renderConverted() {
    var C = R.commercial_cta;
    return '<section class="arh-card" id="arh-done"><div class="arh-done-mark"><span aria-hidden="true">✓</span> Votre rapport est en route</div>' +
      '<p class="arh-muted" style="margin:10px 0 0">Il contient le détail de vos réponses, les sujets à sécuriser et votre roadmap RH complète. Vous pouvez le transférer à votre direction.</p>' +
      (DEV ? '<p class="arh-small" style="margin:10px 0 0">Maquette : aucun email n\'est envoyé. <button class="arh-link" data-act="preview-email">Voir l\'aperçu du rapport</button></p>' : '') +
      '</section>' +
      '<section class="arh-card arh-cta-block"><h3 class="arh-h3" style="font-size:22px">' + esc(C.title) + '</h3>' +
      '<p class="arh-muted" style="margin:8px 0 0">' + esc(C.text) + '</p>' +
      '<a class="arh-btn" data-act="meeting" href="' + esc(C.url) + '">' + esc(C.cta) + ' <span aria-hidden="true">→</span></a>' +
      '<p class="arh-small" data-meeting-note hidden style="color:#CFCAD6;margin:12px 0 0">Maquette : destination du rendez-vous à définir avant la Phase 4/5.</p></section>';
  }

  /* ================================================================
   * Rendu et événements
   * ================================================================ */
  function render() {
    var html;
    if (S.step === 'intro') html = renderIntro();
    else if (S.step === 'context') html = renderContext();
    else if (S.step === 'question') html = renderQuestion();
    else html = renderResults();
    view.innerHTML = html;
    if (S.step === 'results' && !S.converted) {
      var res = E.evaluate(S.context, S.answers, cfg());
      if (res.complete && !S.completion_tracked) {   // une seule fois par audit, même après rechargement
        S.completion_tracked = true; save();
        track('audit_completed', resultProps(res));
      }
      if (res.complete && !fired['results_viewed_' + S.audit_id]) {   // une fois par visite
        fired['results_viewed_' + S.audit_id] = true;
        track('results_viewed', resultProps(res));
      }
    }
    if (DEV) renderDev();
  }
  function priorityLabel(a) {
    var p = R.roadmap_priorities[a.priority - 1];
    return (p.label_by_tone && p.label_by_tone[a.tone]) || p.label;
  }
  function resultProps(res) {
    return { global_score: res.global.display_score, lowest_pillar: res.lowest_pillar || '', red_flags_count: res.red_flags.length };
  }

  /* Sélection marquée sur place (pas de re-rendu), puis passage automatique à l'écran suivant. */
  var advancing = false;
  function markPressed(val) {
    Array.prototype.forEach.call(view.querySelectorAll('[data-opt]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-opt') === val)); });
    var n = view.querySelector('[data-act="ctx-next"], [data-act="q-next"]'); if (n) n.disabled = false;
  }
  function answerContext(val) {
    var f = BASE.Q.CONTEXT[S.ctxIndex];
    S.context[f.id] = val;
    save(); markPressed(val);
    setTimeout(ctxNext, 180);
  }
  function ctxNext() {
    var f = BASE.Q.CONTEXT[S.ctxIndex];
    if (f.free_text) { var inp = view.querySelector('#arh-free'); if (inp) S.context[f.id] = inp.value.trim(); }
    if (f.required && !S.context[f.id]) return;
    if (S.ctxIndex < BASE.Q.CONTEXT.length - 1) return go('context', { ctxIndex: S.ctxIndex + 1 });
    track('context_completed', { hr_organization: S.context.hr_organization, respondent_role: S.context.respondent_role }, true);
    go('question', { qIndex: 0 });
  }

  function answerQuestion(val) {
    var q = questions()[S.qIndex];
    S.answers[q.id] = val;
    save(); markPressed(val);
    setTimeout(qNext, 220);
  }
  function qNext() {
    var qs = questions(), q = qs[S.qIndex];
    if (!q || !S.answers[q.id]) return;
    var next = qs[S.qIndex + 1];
    if ((!next || next.pillar !== q.pillar) && !fired['pc_' + q.pillar]) { fired['pc_' + q.pillar] = true; track('pillar_completed', { pillar: q.pillar }); }
    if (!next) { S.completed_at = new Date().toISOString(); return go('results'); }
    go('question', { qIndex: S.qIndex + 1 });
  }

  function back() {
    if (S.step === 'question') return S.qIndex > 0 ? go('question', { qIndex: S.qIndex - 1 }) : go('context', { ctxIndex: BASE.Q.CONTEXT.length - 1 });
    if (S.step === 'context') return S.ctxIndex > 0 ? go('context', { ctxIndex: S.ctxIndex - 1 }) : go('intro');
  }

  function submitLead(form) {
    var F = R.lead_form, errors = {};
    F.fields.forEach(function (f) {
      var v = (form.elements[f.id].value || '').trim();
      contactDraft[f.id] = v;
      if (f.required && !v) errors[f.id] = 'Ce champ est nécessaire pour vous envoyer le rapport.';
      else if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) errors[f.id] = 'Adresse email invalide.';
    });
    formErrors = errors;
    if (Object.keys(errors).length) { render(); var first = view.querySelector('[aria-invalid="true"]'); if (first) first.focus(); return; }
    var C = cfg(), res = E.evaluate(S.context, S.answers, C);
    var payload = E.buildPayload({ result: res, context: S.context, contact: contactDraft, utm: UTM,
      meta: { audit_id: S.audit_id, completed_at: S.completed_at || new Date().toISOString(), page_url: root.location.href.split('#')[0] } }, C);
    var email = M.buildReportEmail(res, payload, C);
    lastEmail = email; lastPayload = payload;
    sending = true; render();
    M.submitReport(payload, email).then(function () {
      sending = false; S.converted = true; save();
      track('report_requested', resultProps(res));
      render();
      var done = view.querySelector('#arh-done'); if (done) done.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
  var lastEmail = null, lastPayload = null;

  function previewEmail() {
    if (!lastEmail) return;
    var m = doc.createElement('div');
    m.className = 'arh-modal';
    m.innerHTML = '<div class="arh-modal-box" role="dialog" aria-modal="true" aria-label="Aperçu de l\'email"><div class="arh-modal-head"><span>Aperçu : « ' + esc(lastEmail.subject) + ' » (gabarit Brevo, maquette)</span>' +
      '<button class="arh-btn arh-btn-ghost" data-close>Fermer</button></div><iframe title="Aperçu de l\'email"></iframe></div>';
    mount.appendChild(m);
    m.querySelector('iframe').srcdoc = '<!doctype html><meta charset="utf-8">' + lastEmail.html;
    function close() { m.remove(); doc.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    m.addEventListener('click', function (e) { if (e.target === m || e.target.hasAttribute('data-close')) close(); });
    doc.addEventListener('keydown', onKey);
    m.querySelector('[data-close]').focus();
  }

  mount.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act], [data-opt]');
    if (!t || !mount.contains(t)) return;
    if (t.hasAttribute('data-opt')) {
      if (advancing) return;
      advancing = true; setTimeout(function () { advancing = false; }, 260);
      var v = t.getAttribute('data-opt');
      return S.step === 'context' ? answerContext(v) : answerQuestion(v);
    }
    var act = t.getAttribute('data-act');
    if (act === 'start') {
      S = freshState(); S.started_at = new Date().toISOString(); contactDraft = {}; formErrors = {};
      track('audit_started', null, true);
      go('context', { ctxIndex: 0 });
    } else if (act === 'resume') {
      S = saved; saved = null; go(S.step === 'intro' ? 'context' : S.step);
    } else if (act === 'back') back();
    else if (act === 'ctx-next') ctxNext();
    else if (act === 'q-next') qNext();
    else if (act === 'tip') {
      var tip = view.querySelector('#arh-tip'), open = t.getAttribute('aria-expanded') === 'true';
      t.setAttribute('aria-expanded', String(!open)); tip.hidden = open;
    } else if (act === 'edit') go('question', { qIndex: 0 });
    else if (act === 'restart') { drop('localStorage', R.storage.progress_key); S = freshState(); saved = null; go('intro'); }
    else if (act === 'preview-email') previewEmail();
    else if (act === 'meeting') {
      track('meeting_cta_clicked', { lead_interest: E.evaluate(S.context, S.answers, cfg()).lead_interest.join(',') });
      if (R.commercial_cta.mock) { e.preventDefault(); var n = view.querySelector('[data-meeting-note]'); if (n) n.hidden = false; }
    }
  });
  mount.addEventListener('submit', function (e) {
    if (e.target.getAttribute('data-form') === 'lead') { e.preventDefault(); submitLead(e.target); }
  });
  mount.addEventListener('input', function (e) {
    if (e.target.id === 'arh-free') { var b = view.querySelector('[data-act="ctx-next"]'); if (b) b.textContent = (e.target.value.trim() ? 'Continuer' : 'Passer') + ' →'; }
  });
  mount.addEventListener('keydown', function (e) {
    if (e.target.id === 'arh-free' && e.key === 'Enter') { e.preventDefault(); ctxNext(); }
  });
  doc.addEventListener('keydown', function (e) {
    if ((S.step !== 'question' && S.step !== 'context') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || ''))) return;
    var n = parseInt(e.key, 10);
    if (n >= 1 && n <= 9) { var b = view.querySelectorAll('[data-opt]')[n - 1]; if (b) { e.preventDefault(); b.click(); } }
  });

  /* ================================================================
   * Outils de test (maquette uniquement : data-arh-dev="true" ou ?test=1)
   * ================================================================ */
  var devEl = null, devBtn = null;
  function renderDev() {
    if (!devBtn) {
      devBtn = doc.createElement('button');
      devBtn.className = 'arh-dev-toggle'; devBtn.type = 'button';
      devBtn.addEventListener('click', function () { devOpen = !devOpen; renderDev(); });
      devEl = doc.createElement('aside');
      devEl.className = 'arh-dev'; devEl.setAttribute('aria-label', 'Outils de test de la maquette');
      devEl.addEventListener('click', onDevClick); devEl.addEventListener('change', onDevChange);
      mount.appendChild(devBtn); mount.appendChild(devEl);
    }
    devBtn.textContent = devOpen ? 'Fermer les outils' : 'Outils de test';
    devEl.hidden = !devOpen;
    if (!devOpen) return;
    var C = cfg(), res = S.context.company_size ? E.evaluate(S.context, S.answers, C) : null;
    var P = root.ARH_PROFILES;
    var payload = lastPayload || (res && res.complete ? E.buildPayload({ result: res, context: S.context, utm: UTM, meta: { audit_id: S.audit_id } }, C) : null);
    devEl.innerHTML = '<div class="arh-dev-head"><strong>Outils de test — maquette</strong><button class="arh-btn arh-btn-ghost" data-dev="close">Fermer</button></div>' +
      '<p class="arh-small" style="margin:4px 0 0">Invisible pour l\'utilisateur final. Aucun envoi réel (Zapier, Pipedrive, Brevo mockés).</p>' +
      '<h3>Profils préconfigurés</h3><div class="arh-dev-profiles">' + (P ? P.PROFILES.map(function (p, i) {
        return '<button data-dev="profile" data-id="' + p.id + '">' + (i + 1) + '. ' + esc(p.label) + '</button>';
      }).join('') : '<span class="arh-small">profiles.js non chargé</span>') + '</div>' +
      '<p class="arh-small">Ouvre directement le résultat. « Modifier mes réponses » permet ensuite de parcourir le questionnaire pré-rempli.</p>' +
      '<h3>Règles (sans toucher à l\'interface)</h3>' +
      '<label><input type="checkbox" data-dev="rules"' + (overrides.rules.LR_TRANSPARENCE_SALARIALE ? ' checked' : '') + '> Simuler la validation juridique en attente (active Q24 et C6)</label>' +
      '<label><input type="checkbox" data-dev="index"' + (overrides.questions.C5 ? ' checked' : '') + '> Désactiver l\'Index égalité (C5)</label>' +
      '<h3>Moteur</h3><pre>' + esc(res ? JSON.stringify({
        global: res.global.score === null ? null : Math.round(res.global.score * 100) / 100, niveau: res.global.level, complet: res.complete,
        questions: res.questions_count, tres_bon_resultat: res.very_good,
        red_flags: res.red_flags.map(function (a) { return a.question_id; }), priorites_2: res.critical.map(function (a) { return a.question_id + ' (' + a.tone + ')'; }),
        piliers: res.pillars.map(function (p) { return p.id + ' ' + (p.evaluated ? Math.round(p.score * 10) / 10 : 'non évalué') + ' · ' + p.applicable_count + ' q.'; })
      }, null, 2) : 'Contexte non renseigné') + '</pre>' +
      '<h3>Signaux commerciaux (internes)</h3><pre>' + esc(res ? JSON.stringify(res.lead_signals, null, 2) : '—') + '</pre>' +
      '<h3>Payload CRM ' + (lastPayload ? '(envoyé au mock)' : '(aperçu, sans contact)') + '</h3><pre>' + esc(payload ? JSON.stringify(payload, null, 2) : '—') + '</pre>' +
      '<h3>Événements dataLayer</h3><pre>' + esc(devLog.slice(0, 20).join('\n') || '—') + '</pre>' +
      '<h3>UTM retenues</h3><pre>' + esc(JSON.stringify(UTM)) + '</pre>' +
      '<p style="margin-top:16px"><button class="arh-btn arh-btn-secondary" data-dev="reset">Tout réinitialiser</button></p>';
  }
  function onDevClick(e) {
    var t = e.target.closest('[data-dev]'); if (!t) return;
    var a = t.getAttribute('data-dev');
    if (a === 'close') { devOpen = false; renderDev(); }
    else if (a === 'profile') {
      var p = root.ARH_PROFILES.PROFILES.filter(function (x) { return x.id === t.getAttribute('data-id'); })[0];
      S = freshState(); S.context = JSON.parse(JSON.stringify(p.context)); S.answers = root.ARH_PROFILES.answersFor(p, cfg());
      S.started_at = S.completed_at = new Date().toISOString(); lastPayload = null; lastEmail = null; contactDraft = {}; formErrors = {};
      if (root.innerWidth < 900) devOpen = false;
      go('results');
    } else if (a === 'reset') {
      drop('localStorage', R.storage.progress_key); drop('sessionStorage', R.storage.utm_key);
      overrides = { rules: {}, questions: {} }; S = freshState(); saved = null; lastPayload = null; lastEmail = null; devLog = []; fired = {};
      go('intro');
    }
  }
  function onDevChange(e) {
    var a = e.target.getAttribute('data-dev');
    if (a === 'rules') overrides.rules = e.target.checked ? { LR_TRANSPARENCE_SALARIALE: 'verified', LR_ETAT_DES_LIEUX_PARCOURS: 'verified' } : {};
    if (a === 'index') overrides.questions = e.target.checked ? { C5: { enabled: false } } : {};
    lastPayload = null;
    render();
  }

  /* ================================================================
   * Démarrage
   * ================================================================ */
  saved = E.restoreProgress(load('localStorage', R.storage.progress_key), new Date(), R.storage.progress_ttl_days);
  if (saved && saved.step === 'results' && saved.converted) saved = null;   // audit terminé et rapport demandé : on repart de zéro
  render();
  if ('IntersectionObserver' in root) {
    var io = new root.IntersectionObserver(function (en) { if (en[0].isIntersecting) { track('audit_view', null, true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(mount);
  } else track('audit_view', null, true);
})(window, document);
