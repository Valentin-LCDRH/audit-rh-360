/*!
 * Audit RH 360° — Le Club des RH
 * MOTEUR (fonctions pures, sans DOM ni réseau). Toutes les règles viennent de la configuration :
 * ARH_QUESTIONS (questions.js), ARH_LEGAL (legal-rules.js), ARH_RULES (scoring.js).
 *
 * Point d'entrée : evaluate(context, answers[, cfg]) -> résultat complet (scores, red flags,
 * roadmap, points forts, signaux commerciaux internes). Déterministe et testable.
 *
 * Seuils : les valeurs décimales sont conservées ; les comparaisons aux seuils (niveaux, pilier
 * faible, cas « très bon résultat ») se font sur le score AFFICHÉ (arrondi), pour que le libellé
 * soit toujours cohérent avec le chiffre vu par l'utilisateur.
 */
(function (root) {
  'use strict';

  /* ================================================================
   * Configuration
   * ================================================================ */
  function defaultConfig() {
    return { Q: root.ARH_QUESTIONS, R: root.ARH_RULES, L: root.ARH_LEGAL };
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* Copie de configuration avec surcharges (tests, mode démo) :
   *   { rules: { LR_X: 'verified' }, questions: { C5: { enabled: false } } }
   * Sert à démontrer qu'activer Q24 ou désactiver l'Index ne touche ni au moteur ni à l'interface. */
  function withOverrides(cfg, over) {
    var c = { Q: clone(cfg.Q), R: cfg.R, L: clone(cfg.L) };
    over = over || {};
    Object.keys(over.rules || {}).forEach(function (id) { if (c.L.RULES[id]) c.L.RULES[id].status = over.rules[id]; });
    Object.keys(over.questions || {}).forEach(function (id) {
      c.Q.QUESTIONS.forEach(function (q) { if (q.id === id) Object.keys(over.questions[id]).forEach(function (k) { q[k] = over.questions[id][k]; }); });
    });
    return c;
  }

  /* ================================================================
   * Conditions
   * ================================================================ */
  function evalCond(c, ctx) {
    if (c === null || c === undefined) return true;
    if (c.all) return c.all.every(function (x) { return evalCond(x, ctx); });
    if (c.any) return c.any.some(function (x) { return evalCond(x, ctx); });
    if (c.not) return !evalCond(c.not, ctx);
    if (c.in) return c.in.indexOf(ctx[c.field]) >= 0;
    if (c.not_in) return c.not_in.indexOf(ctx[c.field]) < 0;
    return false;
  }

  function ruleVerified(id, cfg) { var r = cfg.L.RULES[id]; return !!r && r.status === 'verified'; }
  /* Une obligation s'applique si elle est vérifiée ET que son champ d'application couvre le contexte. */
  function obligationApplies(id, ctx, cfg) {
    return ruleVerified(id, cfg) && evalCond(cfg.L.RULES[id].applicability_condition, ctx);
  }

  function isActive(q, cfg) {
    if (q.enabled === false) return false;
    return (q.legal_rule || []).every(function (id) { return ruleVerified(id, cfg); });
  }
  function isApplicable(q, ctx, cfg) { return isActive(q, cfg) && evalCond(q.applicability, ctx); }

  /* Wording adaptatif : même question (id, poids, scoring), textes adaptés au contexte. */
  var VARIANT_FIELDS = ['question', 'help_text', 'short_label', 'area_text', 'answers', 'recommendation_by_answer', 'allow_na', 'na_label'];
  function resolveQuestion(q, ctx) {
    var v = (q.variants || []).filter(function (x) { return evalCond(x.when, ctx); })[0];
    if (!v) return q;
    var r = {};
    Object.keys(q).forEach(function (k) { r[k] = q[k]; });
    VARIANT_FIELDS.forEach(function (k) { if (k in v) r[k] = v[k]; });
    r.variant_id = v.id;
    return r;
  }

  function pillarOrder(cfg) { var o = {}; cfg.Q.PILLARS.forEach(function (p) { o[p.id] = p.order; }); return o; }
  function pillarById(cfg) { var o = {}; cfg.Q.PILLARS.forEach(function (p) { o[p.id] = p; }); return o; }

  /* Questions posées, dans l'ordre du parcours (pilier, puis ordre de configuration). */
  function questionsFor(ctx, cfg) {
    cfg = cfg || defaultConfig();
    var po = pillarOrder(cfg);
    return cfg.Q.QUESTIONS
      .map(function (q, i) { return { q: q, i: i }; })
      .filter(function (x) { return isApplicable(x.q, ctx, cfg); })
      .sort(function (a, b) { return (po[a.q.pillar] - po[b.q.pillar]) || (a.i - b.i); })
      .map(function (x) { return resolveQuestion(x.q, ctx); });
  }

  /* Piliers réellement parcourus (au moins une question), avec leurs questions. */
  function pillarsFor(ctx, cfg) {
    cfg = cfg || defaultConfig();
    var qs = questionsFor(ctx, cfg);
    return cfg.Q.PILLARS.slice().sort(function (a, b) { return a.order - b.order; })
      .map(function (p) { return { pillar: p, questions: qs.filter(function (q) { return q.pillar === p.id; }) }; })
      .filter(function (x) { return x.questions.length > 0; });
  }

  /* ================================================================
   * Réponses et scores
   * ================================================================ */
  function answerOptions(q, cfg) {
    if (q.type === 'M') {
      var m = cfg.Q.ANSWER_SCALES.M.map(function (a) { return { id: a.id, label: q.answers[a.id], score: a.score }; });
      if (q.allow_na) m.push({ id: 'na', label: q.na_label, score: null });   // exclu du score
      return m;
    }
    return cfg.Q.ANSWER_SCALES.C
      .filter(function (a) { return a.id !== 'na' || q.allow_na; })
      .map(function (a) { return { id: a.id, label: a.id === 'na' && q.na_label ? q.na_label : a.label, score: a.score, vigilance: !!a.vigilance }; });
  }
  function findOption(q, answerId, cfg) {
    return answerOptions(q, cfg).filter(function (o) { return o.id === answerId; })[0] || null;
  }

  function round(v, d) { if (v === null || v === undefined) return null; var f = Math.pow(10, d || 0); return Math.round(v * f) / f; }
  function levelFor(displayScore, cfg) {
    if (displayScore === null) return null;
    var lv = cfg.R.maturity_levels.slice().sort(function (a, b) { return b.min - a.min; });
    for (var i = 0; i < lv.length; i++) if (displayScore >= lv[i].min) return lv[i];
    return lv[lv.length - 1];
  }
  function weighted(items) {
    var num = 0, den = 0;
    items.forEach(function (it) { num += it.score * it.weight; den += 100 * it.weight; });
    return den > 0 ? num / den * 100 : null;
  }

  function statusFor(it, cfg) {
    var S = cfg.R.answer_status;
    if (it.red_flag) return S.red_flag;
    if (it.answer_id === 'unknown') return S.unknown;
    if (it.critical_structure) return S.critical_structure;
    if (it.answer_id === 'partial') return S.partial;
    if (it.score >= 100) return S.top;
    if (it.score <= 0) return it.type === 'C' ? S.red_flag : S.weak_maturity;
    return S.mid_maturity;
  }

  function tpl(s, vars) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined ? vars[k] : m; }); }

  /* ================================================================
   * Évaluation complète
   * ================================================================ */
  function evaluate(ctx, answers, cfg) {
    cfg = cfg || defaultConfig();
    answers = answers || {};
    var R = cfg.R, T = R.thresholds, D = R.scoring.display_rounding;
    var PB = pillarById(cfg), PO = pillarOrder(cfg);
    var qs = questionsFor(ctx, cfg);
    var qOrder = {}; cfg.Q.QUESTIONS.forEach(function (q, i) { qOrder[q.id] = i; });

    /* ---- 1. Réponses ---- */
    var items = [], missing = [];
    qs.forEach(function (q) {
      var a = answers[q.id];
      var opt = a === undefined || a === null ? null : findOption(q, a, cfg);
      if (!opt) { missing.push(q.id); return; }
      var it = {
        question_id: q.id, pillar: q.pillar, type: q.type, weight: q.weight,
        answer_id: opt.id, answer_label: opt.label, score: opt.score,
        in_score: opt.score !== null, vigilance: !!opt.vigilance,
        short_label: q.short_label, variant_id: q.variant_id || null, q: q
      };
      it.red_flag = it.in_score && q.red_flag_conditions.some(function (rf) {
        return rf.answers.indexOf(opt.id) >= 0 && obligationApplies(rf.obligation, ctx, cfg);
      });
      it.critical_strong = !it.red_flag && it.in_score && q.weight === T.critical_weight && it.score <= T.weak_max_score;
      it.critical_structure = !it.red_flag && it.in_score && q.weight === T.critical_weight && q.type === 'M' &&
        T.critical_structure_answers.indexOf(opt.id) >= 0;
      it.status = it.in_score ? statusFor(it, cfg) : null;
      items.push(it);
    });
    var scored = items.filter(function (it) { return it.in_score; });

    /* ---- 2. Scores ---- */
    var pillars = cfg.Q.PILLARS.slice().sort(function (a, b) { return a.order - b.order; }).map(function (p) {
      var asked = qs.filter(function (q) { return q.pillar === p.id; });
      var its = scored.filter(function (it) { return it.pillar === p.id; });
      var evaluated = its.length >= R.scoring.min_questions_per_pillar;
      var sc = evaluated ? weighted(its) : null;
      var disp = round(sc, D);
      var lv = levelFor(disp, cfg);
      return {
        id: p.id, label: p.label, short_label: p.short_label, order: p.order, score_field: p.score_field,
        evaluated: evaluated, score: sc, display_score: disp,
        level: lv ? lv.id : null, level_label: lv ? lv.label : R.result_texts.pillar_not_evaluated,
        applicable_count: asked.length, scored_count: its.length,
        red_flags_count: its.filter(function (it) { return it.red_flag; }).length,
        strength_text: p.strength_text, weak_text: p.weak_text
      };
    });
    var ev = pillars.filter(function (p) { return p.evaluated; });
    ev.slice().sort(function (a, b) { return (a.score - b.score) || (a.order - b.order); })
      .forEach(function (p, i) { p.rank_from_bottom = i + 1; });

    var gScore = weighted(scored), gDisp = round(gScore, D), gLv = levelFor(gDisp, cfg);
    var global = {
      score: gScore, display_score: gDisp, level: gLv ? gLv.id : null, level_label: gLv ? gLv.label : null,
      text: gLv ? R.result_texts.global_by_level[gLv.id] : null,
      applicable_count: qs.length, scored_count: scored.length, weight_sum: scored.reduce(function (s, it) { return s + it.weight; }, 0)
    };

    /* ---- 3. Roadmap (hiérarchie stricte, sans doublon) ---- */
    var listed = {};
    function sortItems(arr) {
      return arr.slice().sort(function (a, b) {
        return (b.weight - a.weight) || (a.score - b.score) || (PO[a.pillar] - PO[b.pillar]) || (qOrder[a.question_id] - qOrder[b.question_id]);
      });
    }
    function action(it, priority, tone, reasonKey, description) {
      listed[it.question_id] = true;
      return {
        priority: priority, tone: tone, question_id: it.question_id, pillar: it.pillar,
        pillar_label: PB[it.pillar].label, title: it.short_label,
        description: description || it.q.area_text,
        reason: tpl(R.reason_templates[reasonKey], { answer: it.answer_label, pillar: PB[it.pillar].label }),
        recommendation: it.q.recommendation_by_answer[it.answer_id] || null,
        status: it.status, answer_label: it.answer_label, weight: it.weight
      };
    }
    var roadmap = [];
    sortItems(scored.filter(function (it) { return it.red_flag; })).forEach(function (it) {
      var body = R.result_texts.red_flag_body[it.answer_id] || R.result_texts.red_flag_body.no;
      roadmap.push(action(it, 1, 'secure', 'red_flag', body));
    });
    sortItems(scored.filter(function (it) { return !listed[it.question_id] && (it.critical_strong || it.critical_structure); }))
      .sort(function (a, b) { return (a.critical_strong === b.critical_strong ? 0 : a.critical_strong ? -1 : 1); })
      .forEach(function (it) {
        roadmap.push(action(it, 2, it.critical_strong ? 'critical' : 'critical_structure', it.critical_strong ? 'critical_weak' : 'critical_structure'));
      });
    ev.filter(function (p) { return p.display_score < T.low_pillar_below; })
      .sort(function (a, b) { return (a.score - b.score) || (a.order - b.order); })
      .forEach(function (p) {
        var weakest = scored.filter(function (it) { return it.pillar === p.id && !listed[it.question_id] && it.score < 100; })
          .sort(function (a, b) { return (a.score - b.score) || (b.weight - a.weight) || (qOrder[a.question_id] - qOrder[b.question_id]); })
          .slice(0, 2);
        if (!weakest.length) return;   // tout le pilier est déjà couvert par des priorités supérieures
        weakest.forEach(function (it) { listed[it.question_id] = true; });
        roadmap.push({
          priority: 3, tone: 'structure', question_id: null, related_questions: weakest.map(function (it) { return it.question_id; }),
          pillar: p.id, pillar_label: p.label, title: p.label, description: p.weak_text,
          reason: tpl(R.reason_templates.low_pillar, { pillar: p.label, score: p.display_score }),
          recommendation: weakest.map(function (it) { return it.q.recommendation_by_answer[it.answer_id]; }).filter(Boolean).join(' '),
          status: R.answer_status.weak_maturity, weight: null
        });
      });
    sortItems(scored.filter(function (it) { return !listed[it.question_id] && it.score <= T.partial_max_score; })).forEach(function (it) {
      roadmap.push(action(it, 4, 'consolidate', 'partial'));
    });
    sortItems(scored.filter(function (it) { return !listed[it.question_id] && T.optimisation_scores.indexOf(it.score) >= 0; })).forEach(function (it) {
      roadmap.push(action(it, 5, 'optimise', 'optimisation'));
    });

    var redFlags = roadmap.filter(function (a) { return a.priority === 1; });
    var RS = R.result_texts.red_flag_suffix;
    if (redFlags.length && RS && RS.levels.indexOf(global.level) >= 0)
      global.text += ' ' + (redFlags.length > 1 ? RS.many : RS.one).replace('{n}', redFlags.length);
    var critical = roadmap.filter(function (a) { return a.priority === 2; });

    /* ---- 4. Cas « très bon résultat » ---- */
    var VG = T.very_good;
    var veryGood = gDisp !== null && gDisp >= VG.min_global &&
      (!VG.no_red_flag || redFlags.length === 0) &&
      (!VG.no_critical || critical.length === 0) &&
      ev.every(function (p) { return p.display_score >= VG.no_pillar_below; });

    /* ---- 5. Points forts (piliers sans sujet à sécuriser) ---- */
    function strengthsFrom(min) {
      return ev.filter(function (p) { return p.display_score >= min && p.red_flags_count === 0; })
        .sort(function (a, b) { return (b.score - a.score) || (a.order - b.order); })
        .slice(0, T.max_strengths)
        .map(function (p) { return { pillar: p.id, label: p.label, score: p.score, display_score: p.display_score, text: p.strength_text }; });
    }
    var strengths = strengthsFrom(T.strength_min_score), strengthsFallback = false;
    if (!strengths.length) { strengths = strengthsFrom(T.strength_fallback_min); strengthsFallback = strengths.length > 0; }

    /* ---- 6. Axes à structurer / optimisations ---- */
    var areas = veryGood ? [] : roadmap.filter(function (a) {
      return a.priority === 2 || a.priority === 3 || (a.priority === 4 && a.question_id && itemById(a.question_id).score <= 33);
    });
    var optimisations = veryGood ? roadmap.filter(function (a) { return a.priority >= 4; }) : roadmap.filter(function (a) { return a.priority === 5; });
    function itemById(id) { return items.filter(function (it) { return it.question_id === id; })[0]; }

    /* ---- 7. Aperçu gratuit de la roadmap (jamais complété artificiellement) ---- */
    var DL = R.roadmap_display_limit, preview;
    if (veryGood) {
      preview = { mode: 'optimisations', actions: optimisations.slice(0, DL.free_results) };
      preview.remaining_count = optimisations.length - preview.actions.length;
    } else {
      var prio = roadmap.filter(function (a) { return a.priority <= DL.free_max_priority; });
      preview = { mode: prio.length ? 'priorities' : 'none', actions: prio.slice(0, DL.free_results) };
      preview.remaining_count = roadmap.length - preview.actions.length;
    }

    var result = {
      method_version: R.method_version,
      config_version: cfg.Q.version, legal_rules_version: cfg.L.version,
      context: ctx,
      complete: missing.length === 0, missing: missing,
      questions_count: qs.length,
      global: global,
      pillars: pillars,
      items: items.map(function (it) { var o = {}; Object.keys(it).forEach(function (k) { if (k !== 'q') o[k] = it[k]; }); return o; }),
      red_flags: redFlags,
      critical: critical,
      roadmap: roadmap,
      areas_to_structure: areas,
      strengths: strengths, strengths_fallback: strengthsFallback,
      optimisations: optimisations,
      free_preview: preview,
      very_good: veryGood,
      vigilance_count: items.filter(function (it) { return it.vigilance; }).length,
      lowest_pillar: ev.length ? ev.filter(function (p) { return p.rank_from_bottom === 1; })[0].id : null
    };
    var lead = leadInterest(result, ctx, cfg);
    result.lead_interest = lead.tags;
    result.lead_signals = lead.signals;
    return result;
  }

  /* ================================================================
   * Qualification commerciale interne (jamais affichée)
   * ================================================================ */
  function metrics(res, cfg) {
    var P = {}; res.pillars.forEach(function (p) { P[p.id] = p; });
    var byQ = {}; res.items.forEach(function (it) { byQ[it.question_id] = it; });
    var qTags = {}; cfg.Q.QUESTIONS.forEach(function (q) { qTags[q.id] = q.commercial_tags; });
    /* Signaux par domaine : red flags + toutes les priorités 2. Dispersion (audit_rh) : red flags +
       priorités 2 FORTES uniquement (une situation B n'est pas un sujet de sécurisation). */
    var signalPillars = {}, strongPillars = {};
    res.red_flags.concat(res.critical).forEach(function (a) { signalPillars[a.pillar] = (signalPillars[a.pillar] || 0) + 1; });
    res.red_flags.concat(res.critical.filter(function (a) { return a.tone === 'critical'; })).forEach(function (a) { strongPillars[a.pillar] = true; });
    var wb = cfg.R.lead_interest.weak_pillar_below;
    return {
      red_flags_count: function () { return res.red_flags.length; },
      critical_count: function () { return res.critical.length; },
      critical_strong_count: function () { return res.critical.filter(function (a) { return a.tone === 'critical'; }).length; },
      global_score: function () { return res.global.display_score; },
      pillar_score: function (l) { return P[l.pillar] && P[l.pillar].evaluated ? P[l.pillar].display_score : null; },
      weak_pillars_count: function () { return res.pillars.filter(function (p) { return p.evaluated && p.display_score < wb; }).length; },
      rank_from_bottom: function (l) { return P[l.pillar] && P[l.pillar].evaluated ? P[l.pillar].rank_from_bottom : null; },
      pillar_signal_count: function (l) { return signalPillars[l.pillar] || 0; },
      pillar_weak_answers: function (l) { return res.items.filter(function (it) { return it.pillar === l.pillar && it.in_score && it.score === 0; }).length; },
      pillars_with_critical: function () { return Object.keys(strongPillars).length; },
      tagged_weak_count: function (l) { return res.items.filter(function (it) { return it.in_score && it.score <= 33 && (qTags[it.question_id] || []).indexOf(l.tag) >= 0; }).length; },
      answer_score: function (l) { var it = byQ[l.question]; return it && it.in_score ? it.score : null; },
      red_flag_on: function (l) { return l.questions.some(function (id) { return byQ[id] && byQ[id].red_flag; }) ? 1 : 0; }
    };
  }
  function cmp(v, l) {
    if (v === null || v === undefined) return false;
    if ('gte' in l && !(v >= l.gte)) return false;
    if ('gt' in l && !(v > l.gt)) return false;
    if ('lte' in l && !(v <= l.lte)) return false;
    if ('lt' in l && !(v < l.lt)) return false;
    return true;
  }
  function leafText(l, v) {
    var op = 'gte' in l ? '≥ ' + l.gte : 'gt' in l ? '> ' + l.gt : 'lte' in l ? '≤ ' + l.lte : '< ' + l.lt;
    return l.metric + (l.pillar ? '[' + l.pillar + ']' : l.question ? '[' + l.question + ']' : l.tag ? '[' + l.tag + ']' : '') + ' = ' + (Math.round(v * 10) / 10) + ' (' + op + ')';
  }
  function evalLead(c, M, ctx, reasons) {
    if (c.all) { var r = []; var ok = c.all.every(function (x) { return evalLead(x, M, ctx, r); }); if (ok) Array.prototype.push.apply(reasons, r); return ok; }
    if (c.any) { var hit = false; c.any.forEach(function (x) { if (evalLead(x, M, ctx, reasons)) hit = true; }); return hit; }
    if (c.not) return !evalLead(c.not, M, ctx, []);
    if (c.field) { var ok2 = evalCond(c, ctx); if (ok2) reasons.push(c.field + ' = ' + ctx[c.field]); return ok2; }
    var v = M[c.metric](c);
    var ok3 = cmp(v, c);
    if (ok3) reasons.push(leafText(c, v));
    return ok3;
  }
  function leadInterest(res, ctx, cfg) {
    var M = metrics(res, cfg), tags = [], signals = [];
    cfg.R.lead_interest.rules.forEach(function (rule) {
      var reasons = [];
      if (evalLead(rule.when, M, ctx, reasons)) { tags.push(rule.tag); signals.push({ tag: rule.tag, reasons: reasons }); }
    });
    return { tags: tags, signals: signals };
  }

  /* ================================================================
   * Payload (préparé pour Pipedrive / Brevo, envoyé nulle part par le moteur)
   * ================================================================ */
  function buildPayload(o, cfg) {
    cfg = cfg || defaultConfig();
    var res = o.result, ctx = o.context || res.context, contact = o.contact || {}, utm = o.utm || {}, meta = o.meta || {};
    var p = {};
    cfg.R.payload.contact.forEach(function (k) { p[k] = contact[k] ? String(contact[k]).trim() : ''; });
    cfg.R.payload.context.forEach(function (k) { p[k] = ctx[k] || ''; });
    p.global_score = res.global.display_score;
    res.pillars.forEach(function (pl) { p[pl.score_field] = pl.evaluated ? pl.display_score : null; });
    p.red_flags_count = res.red_flags.length;
    p.red_flags = res.red_flags.map(function (a) { return a.title; });
    p.critical_issues_count = res.critical.length;
    p.top_priorities = res.very_good ? [] : res.roadmap.filter(function (a) { return a.priority <= 3; }).slice(0, 3).map(function (a) { return a.title; });
    p.areas_to_structure = res.areas_to_structure.map(function (a) { return a.title; });
    p.strengths = res.strengths.map(function (s) { return s.label; });
    p.lead_interest = res.lead_interest.slice();
    cfg.R.utm_keys.forEach(function (k) { p[k] = utm[k] || ''; });
    p.audit_id = meta.audit_id || '';
    p.config_version = res.config_version;
    p.legal_rules_version = res.legal_rules_version;
    p.completed_at = meta.completed_at || '';
    p.page_url = meta.page_url || '';
    p.consent_scope = cfg.R.lead_form.consent_scope || '';
    p.method_version = res.method_version;
    p.pillar_details = res.pillars.map(function (pl) {
      return { pillar: pl.id, score: pl.score, display_score: pl.display_score, evaluated: pl.evaluated, level: pl.level,
        applicable_count: pl.applicable_count, scored_count: pl.scored_count, red_flags_count: pl.red_flags_count };
    });
    p.lead_signals = res.lead_signals;
    p.audit_metrics = meta.metrics || null;
    p.answers_json = JSON.stringify(res.items.map(function (it) {
      return { question_id: it.question_id, variant_id: it.variant_id, pillar: it.pillar, answer_id: it.answer_id, score: it.score,
        weight: it.weight, applicable: true, in_score: it.in_score, red_flag: it.red_flag };
    }));
    return p;
  }

  /* ================================================================
   * Progression (abandon / reprise) et UTM — pur, le stockage est fait par l'interface
   * ================================================================ */
  function serializeProgress(state, now) {
    return JSON.stringify({ v: 1, saved_at: (now || new Date()).toISOString(), state: state });
  }
  function restoreProgress(raw, now, ttlDays) {
    if (!raw) return null;
    var o;
    try { o = JSON.parse(raw); } catch (e) { return null; }
    if (!o || o.v !== 1 || !o.state || !o.saved_at) return null;
    var age = ((now || new Date()).getTime() - new Date(o.saved_at).getTime()) / 86400000;
    if (!(age >= 0) || age > (ttlDays || 30)) return null;
    return o.state;
  }
  /* Les UTM de l'URL priment ; sinon on garde ceux déjà mémorisés pendant la visite. */
  function resolveUtm(search, storedJson, keys) {
    var fromUrl = {}, any = false;
    String(search || '').replace(/^\?/, '').split('&').forEach(function (pair) {
      if (!pair) return;
      var i = pair.indexOf('='), k = decodeURIComponent(i < 0 ? pair : pair.slice(0, i)), v = i < 0 ? '' : decodeURIComponent(pair.slice(i + 1).replace(/\+/g, ' '));
      if (keys.indexOf(k) >= 0 && v) { fromUrl[k] = v; any = true; }
    });
    var stored = {};
    try { stored = storedJson ? JSON.parse(storedJson) || {} : {}; } catch (e) { stored = {}; }
    var src = any ? fromUrl : stored, out = {};
    keys.forEach(function (k) { out[k] = src[k] || ''; });
    return { utm: out, from_url: any };
  }

  /* ================================================================
   * Mesure de durée et de friction (pur : l'horloge est passée en paramètre)
   * ================================================================ */
  function newMetrics(now) {
    return { started_at: now, results_at: null, resumed: false, questionnaire_ms: 0, pillar_ms: {},
      segment: null, back_count: 0, answer_changes: 0, last_question_id: null, last_pillar: null };
  }
  /* Ferme le segment d'écran en cours (plafonné) et l'ajoute au questionnaire et à son pilier. */
  function closeSegment(m, now, capSeconds) {
    if (!m || !m.segment) return m;
    var dt = Math.max(0, Math.min(now - m.segment.t0, (capSeconds || 300) * 1000));
    m.questionnaire_ms += dt;
    m.pillar_ms[m.segment.pillar] = (m.pillar_ms[m.segment.pillar] || 0) + dt;
    m.segment = null;
    return m;
  }
  /* Ouvre un segment sur une question (ferme le précédent). */
  function openSegment(m, question, now, capSeconds) {
    closeSegment(m, now, capSeconds);
    m.segment = { pillar: question.pillar, t0: now };
    m.last_question_id = question.id; m.last_pillar = question.pillar;
    return m;
  }
  function metricsSummary(m) {
    if (!m) return null;
    var pillars = {};
    Object.keys(m.pillar_ms).forEach(function (k) { pillars[k] = Math.round(m.pillar_ms[k] / 1000); });
    return {
      audit_duration_seconds: m.results_at ? Math.round((m.results_at - m.started_at) / 1000) : null,
      questionnaire_duration_seconds: Math.round(m.questionnaire_ms / 1000),
      pillar_duration_seconds: pillars,
      audit_resumed: !!m.resumed,
      back_count: m.back_count, answer_changes: m.answer_changes,
      last_question_id: m.last_question_id, last_pillar: m.last_pillar
    };
  }

  var API = {
    defaultConfig: defaultConfig, withOverrides: withOverrides,
    evalCond: evalCond, obligationApplies: obligationApplies,
    isActive: isActive, isApplicable: isApplicable,
    questionsFor: questionsFor, pillarsFor: pillarsFor, answerOptions: answerOptions, resolveQuestion: resolveQuestion,
    levelFor: levelFor, evaluate: evaluate, buildPayload: buildPayload,
    serializeProgress: serializeProgress, restoreProgress: restoreProgress, resolveUtm: resolveUtm,
    newMetrics: newMetrics, openSegment: openSegment, closeSegment: closeSegment, metricsSummary: metricsSummary
  };
  root.ARH_ENGINE = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
