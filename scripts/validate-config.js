/*
 * Audit RH 360° — contrôle d'intégrité de la source de vérité métier.
 * Sans dépendance. Exécution (macOS, JavaScriptCore) depuis la racine du dépôt :
 *   scripts/validate.sh
 * Sort en erreur (exception) au premier lot d'anomalies ; affiche sinon un récapitulatif.
 */
(function () {
  'use strict';
  var Q = globalThis.ARH_QUESTIONS, R = globalThis.ARH_RULES, L = globalThis.ARH_LEGAL;
  var out = typeof print === 'function' ? print : console.log;
  var errors = [], warnings = [];
  function err(m) { errors.push(m); }
  function warn(m) { warnings.push(m); }

  var REQUIRED_QUESTION_FIELDS = ['id', 'pillar', 'type', 'question', 'help_text', 'weight', 'risk_level',
    'red_flag_conditions', 'legal_flag', 'legal_rule', 'applicability', 'source', 'verified_at',
    'recommendation_by_answer', 'commercial_tags', 'short_label', 'area_text'];
  var LEAD_TAGS = R.lead_interest.rules.map(function (r) { return r.tag; });
  var PILLAR_IDS = Q.PILLARS.map(function (p) { return p.id; });
  var MOD = (globalThis.ARH_CCN_MODULES || { modules: {} }).modules, CCN = globalThis.ARH_CCN_LIST || { entries: [], special: [] };
  var CTX = {}; Q.CONTEXT.forEach(function (c) { CTX[c.id] = c; });
  /* Champs issus de la sélection de convention et des questions de contexte des modules. */
  CTX.collective_agreement_idcc = { options: CCN.entries.map(function (e) { return { id: e.idcc }; }) };
  CTX.collective_agreement_known = { options: [{ id: 'known' }].concat(CCN.special.map(function (x) { return { id: x.id }; })) };
  Object.keys(MOD).forEach(function (idcc) { (MOD[idcc].context_questions || []).forEach(function (c) { CTX[c.id] = c; }); });
  /* Questions des modules conventionnels : validées comme les autres (le moteur les fusionne). */
  var ALLQ = Q.QUESTIONS.slice();
  Object.keys(MOD).forEach(function (idcc) {
    if (!CCN.entries.some(function (e) { return e.idcc === idcc; })) errors.push('Module ' + idcc + ' : IDCC absent de la liste des conventions');
    (MOD[idcc].questions || []).forEach(function (q) {
      ALLQ.push(q);
      var hasIdcc = JSON.stringify(q.applicability || {}).indexOf('"field":"collective_agreement_idcc","in":["' + idcc + '"]') >= 0;
      if (!hasIdcc) errors.push('Question ' + q.id + ' : l\'applicabilité doit porter la condition d\'IDCC ' + idcc);
    });
    if ((MOD[idcc].context_questions || []).length + (MOD[idcc].questions || []).length > 2)
      errors.push('Module ' + idcc + ' : plus de 2 questions (philosophie V1 : 1 à 2 contrôles discriminants)');
  });
  var seenEntries = {};
  CCN.entries.forEach(function (e) {
    if (!/^\d{1,4}$/.test(e.idcc)) errors.push('Convention : IDCC invalide ' + e.idcc);
    if (seenEntries[e.idcc]) errors.push('Convention : IDCC en double ' + e.idcc); seenEntries[e.idcc] = true;
    if (!e.label) errors.push('Convention ' + e.idcc + ' : libellé manquant');
  });

  /* ---------- conditions ---------- */
  function checkCond(c, where) {
    if (c === null || c === undefined) return;
    if (c.all) return c.all.forEach(function (x) { checkCond(x, where); });
    if (c.any) return c.any.forEach(function (x) { checkCond(x, where); });
    if (c.not) return checkCond(c.not, where);
    if (!c.field) return err(where + ' : condition sans champ');
    var f = CTX[c.field];
    if (!f) return err(where + ' : champ de condition inconnu ' + c.field);
    var ids = (f.options || []).map(function (o) { return o.id; });
    (c.in || c.not_in || []).forEach(function (v) { if (ids.indexOf(v) < 0) err(where + ' : valeur inconnue ' + c.field + '=' + v); });
  }
  function evalCond(c, ctx) {
    if (c === null || c === undefined) return true;
    if (c.all) return c.all.every(function (x) { return evalCond(x, ctx); });
    if (c.any) return c.any.some(function (x) { return evalCond(x, ctx); });
    if (c.not) return !evalCond(c.not, ctx);
    if (c.in) return c.in.indexOf(ctx[c.field]) >= 0;
    if (c.not_in) return c.not_in.indexOf(ctx[c.field]) < 0;
    return false;
  }

  /* ---------- règles réglementaires ---------- */
  var RULE_IDS = Object.keys(L.RULES);
  RULE_IDS.forEach(function (id) {
    var r = L.RULES[id];
    ['id', 'title', 'status', 'legal_rule', 'applicability', 'source', 'verified_at'].forEach(function (k) {
      if (!(k in r)) err('Règle ' + id + ' : champ manquant ' + k);
    });
    if (r.id !== id) err('Règle ' + id + ' : id incohérent');
    if (['verified', 'legal_validation_required'].indexOf(r.status) < 0) err('Règle ' + id + ' : statut invalide ' + r.status);
    if (r.status === 'verified') {
      if (!r.source || !r.source.length) err('Règle ' + id + ' vérifiée sans source');
      if (!r.verified_at) err('Règle ' + id + ' vérifiée sans date');
      (r.source || []).forEach(function (s) {
        if (!/^https:\/\/(www\.)?(service-public\.(fr|gouv\.fr)|entreprendre\.service-public\.(fr|gouv\.fr)|legifrance\.gouv\.fr|travail-emploi\.gouv\.fr|urssaf\.fr|eur-lex\.europa\.eu|code\.travail\.gouv\.fr)\//.test(s.url || ''))
          err('Règle ' + id + ' : source non officielle ' + (s.url || '(vide)'));
      });
    }
    if (r.status === 'legal_validation_required' && L.LEGAL_VALIDATION_REQUIRED.every(function (x) { return x.rule !== id; }))
      err('Règle ' + id + ' à valider mais absente de LEGAL_VALIDATION_REQUIRED');
  });

  function isActive(q) {
    if (q.enabled === false) return false;
    return (q.legal_rule || []).every(function (id) { return L.RULES[id] && L.RULES[id].status === 'verified'; });
  }

  /* ---------- questions ---------- */
  var seen = {};
  ALLQ.forEach(function (q, i) {
    var w = 'Question ' + (q.id || '#' + i);
    REQUIRED_QUESTION_FIELDS.forEach(function (k) { if (!(k in q)) err(w + ' : champ manquant ' + k); });
    if (seen[q.id]) err(w + ' : identifiant en double'); seen[q.id] = true;
    if (PILLAR_IDS.indexOf(q.pillar) < 0) err(w + ' : pilier inconnu ' + q.pillar);
    if ([1, 2, 3].indexOf(q.weight) < 0) err(w + ' : poids invalide');
    if (['eleve', 'modere', 'faible'].indexOf(q.risk_level) < 0) err(w + ' : risk_level invalide');
    (q.commercial_tags || []).forEach(function (t) { if (LEAD_TAGS.indexOf(t) < 0) err(w + ' : tag commercial inconnu ' + t); });
    (q.legal_rule || []).forEach(function (id) { if (!L.RULES[id]) err(w + ' : règle inconnue ' + id); });
    if (q.legal_flag && !(q.legal_rule && q.legal_rule.length)) err(w + ' : legal_flag sans legal_rule');
    if (!q.legal_flag && q.red_flag_conditions.length) err(w + ' : red flag sans legal_flag');
    checkCond(q.applicability, w);
    /* Un red flag = réponse déclenchante + obligation applicable : l'obligation est obligatoire. */
    q.red_flag_conditions.forEach(function (rf) {
      if (!rf.obligation || (q.legal_rule || []).indexOf(rf.obligation) < 0) err(w + ' : red flag sans obligation rattachée à la question');
    });
    (q.variants || []).forEach(function (v) {
      var vw = w + ' (variante ' + v.id + ')';
      if (!v.id || !v.when) err(vw + ' : id et when obligatoires');
      checkCond(v.when, vw);
      Object.keys(v).forEach(function (k) {
        if (['id', 'when', 'question', 'help_text', 'short_label', 'area_text', 'answers', 'recommendation_by_answer', 'allow_na', 'na_label'].indexOf(k) < 0) err(vw + ' : champ non adaptable ' + k);
      });
      if (v.answers && q.type === 'M') ['A', 'B', 'C', 'D'].forEach(function (k) { if (!v.answers[k]) err(vw + ' : situation ' + k + ' manquante'); });
      if (v.allow_na && !v.na_label) err(vw + ' : na_label requis');
    });
    if (q.type === 'M' && q.allow_na && !q.na_label) err(w + ' : na_label requis');
    var rec = q.recommendation_by_answer || {};
    if (q.type === 'M') {
      ['A', 'B', 'C', 'D'].forEach(function (k) { if (!q.answers || !q.answers[k]) err(w + ' : situation ' + k + ' manquante'); });
      ['A', 'B', 'C'].forEach(function (k) { if (!rec[k]) err(w + ' : recommandation manquante pour ' + k); });
    } else if (q.type === 'C') {
      ['partial', 'no', 'unknown'].forEach(function (k) { if (!rec[k]) err(w + ' : recommandation manquante pour ' + k); });
      if (typeof q.allow_na !== 'boolean') err(w + ' : allow_na doit être défini');
      q.red_flag_conditions.forEach(function (rf) {
        rf.answers.forEach(function (a) { if (['yes', 'partial', 'no', 'unknown'].indexOf(a) < 0) err(w + ' : réponse de red flag inconnue ' + a); });
      });
    } else err(w + ' : type inconnu ' + q.type);
  });

  /* Aucune périodicité en dur dans le libellé des entretiens (brief §17). */
  ALLQ.filter(function (q) { return q.legal_rule && q.legal_rule.indexOf('LR_ENTRETIEN_PARCOURS') >= 0; }).forEach(function (q) {
    var txt = [q.question, q.help_text, q.area_text].concat(Object.keys(q.recommendation_by_answer).map(function (k) { return q.recommendation_by_answer[k]; })).join(' ');
    if (/\b(\d+|deux|trois|quatre|six|huit)\s+ans\b|tous les/i.test(txt)) err(q.id + ' : périodicité écrite en dur dans un texte affiché');
  });

  /* ---------- vocabulaire interdit dans tous les textes affichés ---------- */
  function visibleTexts() {
    var t = [];
    Q.PILLARS.forEach(function (p) { t.push(p.label, p.strength_text, p.weak_text); });
    ALLQ.forEach(function (q) {
      t.push(q.question, q.help_text, q.short_label, q.area_text, q.na_label || '', q.action_title || '');
      Object.keys(q.answers || {}).forEach(function (k) { t.push(q.answers[k]); });
      Object.keys(q.recommendation_by_answer).forEach(function (k) { t.push(q.recommendation_by_answer[k]); });
      (q.variants || []).forEach(function (v) {
        ['question', 'help_text', 'short_label', 'area_text', 'na_label'].forEach(function (k) { if (v[k]) t.push(v[k]); });
        Object.keys(v.answers || {}).forEach(function (k) { t.push(v.answers[k]); });
        Object.keys(v.recommendation_by_answer || {}).forEach(function (k) { t.push(v.recommendation_by_answer[k]); });
      });
    });
    (function walk(o) {
      if (typeof o === 'string') t.push(o);
      else if (o && typeof o === 'object') Object.keys(o).forEach(function (k) { walk(o[k]); });
    })([R.result_texts, R.disclaimer, R.lead_form, R.commercial_cta, R.reason_templates, R.hero]);
    return t;
  }
  visibleTexts().forEach(function (s) {
    R.forbidden_wording.forEach(function (f) {
      if (s.toLowerCase().indexOf(f) >= 0) err('Formulation interdite « ' + f + ' » : ' + s.slice(0, 80));
    });
  });

  /* ---------- volume par profil (brief §6 : ~36 questions max) ---------- */
  var sizes = CTX.company_size.options.map(function (o) { return o.id; });
  var cses = CTX.has_cse.options.map(function (o) { return o.id; });
  var matrix = [], maxAsked = 0;
  sizes.forEach(function (s) {
    var row = { size: s };
    cses.forEach(function (c) {
      var ctx = { company_size: s, has_cse: c };
      var asked = ALLQ.filter(function (q) { return isActive(q) && evalCond(q.applicability, ctx); }).length;
      var potential = ALLQ.filter(function (q) { return evalCond(q.applicability, ctx); }).length;
      row[c] = asked + (potential !== asked ? ' (' + potential + ')' : '');
      maxAsked = Math.max(maxAsked, potential);
    });
    matrix.push(row);
  });
  /* Modules conventionnels : pire cas (convention du module + toutes les questions de contexte à « oui »). */
  Object.keys(MOD).forEach(function (idcc) {
    sizes.forEach(function (sz) {
      var ctx = { company_size: sz, has_cse: 'yes', collective_agreement_idcc: idcc, forfait_jours: 'yes' };
      var asked = ALLQ.filter(function (q) { return isActive(q) && evalCond(q.applicability, ctx); }).length;
      var potential = ALLQ.filter(function (q) { return evalCond(q.applicability, ctx); }).length;
      if (sz === '50-249') out('Module ' + idcc + ' (50-249, CSE, forfait jours « oui ») : ' + asked + ' questions actives (' + potential + ' une fois toutes les règles validées) + ' + (MOD[idcc].context_questions || []).length + ' écran(s) de contexte');
      if (asked > 36) err('Module ' + idcc + ' : ' + asked + ' questions actives (> 36)');
      if (potential > 36 && sz === '50-249') warn('Module ' + idcc + ' : ' + potential + ' questions une fois Q24/C6 activées (> 36) — à surveiller');
    });
  });
  if (maxAsked > 36) err('Un profil peut recevoir ' + maxAsked + ' questions (> 36)');

  PILLAR_IDS.forEach(function (p) {
    if (!Q.QUESTIONS.some(function (q) { return q.pillar === p && q.applicability === null && isActive(q); }))
      warn('Pilier ' + p + ' : aucune question toujours posée (peut être « non évalué » selon le profil)');
  });

  /* ---------- sortie ---------- */
  var active = ALLQ.filter(isActive).length;
  out('Questions : ' + ALLQ.length + ' définies (dont ' + (ALLQ.length - Q.QUESTIONS.length) + ' conventionnelles), ' + active + ' actives, ' + (ALLQ.length - active) + ' en attente de validation juridique');
  out('Conventions dans le sélecteur : ' + CCN.entries.length + ' · modules conventionnels : ' + Object.keys(MOD).join(', '));
  out('Règles réglementaires : ' + RULE_IDS.length + ' (' + RULE_IDS.filter(function (id) { return L.RULES[id].status === 'verified'; }).length + ' vérifiées) · LEGAL_VALIDATION_REQUIRED : ' + L.LEGAL_VALIDATION_REQUIRED.length);
  out('Questions posées par profil — actives (potentiel une fois toutes les règles validées) :');
  out('  effectif   | ' + cses.join(' | '));
  matrix.forEach(function (r) { out('  ' + (r.size + '        ').slice(0, 10) + ' | ' + cses.map(function (c) { return r[c]; }).join(' | ')); });
  warnings.forEach(function (w) { out('ATTENTION : ' + w); });
  if (errors.length) { errors.forEach(function (e) { out('ERREUR : ' + e); }); throw new Error(errors.length + ' erreur(s) dans la configuration'); }
  out('OK — configuration cohérente.');

  globalThis.ARH_VALIDATE = { evalCond: evalCond, isActive: isActive };
})();
