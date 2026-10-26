#!/usr/bin/env node
/*!
 * Audit RH 360° — CONTRÔLE D'INTÉGRITÉ DE LA CONFIGURATION.
 *
 * À lancer après toute modification de src/config ou src/data, avant le build.
 * Ne teste pas le comportement (voir scripts/test.js) : vérifie que la configuration est cohérente
 * et qu'elle ne peut pas produire d'écran cassé ni de texte interdit.
 *
 *   npm run validate
 *
 * Sortie : liste des erreurs (bloquantes, code de sortie 1) et des avertissements (informatifs).
 */
'use strict';

const path = require('path');
const SRC = path.join(__dirname, '..', 'src');

require(path.join(SRC, 'config/questions.js'));
require(path.join(SRC, 'config/scoring.js'));
require(path.join(SRC, 'config/legal-rules.js'));
require(path.join(SRC, 'config/ccn-modules.js'));
require(path.join(SRC, 'data/ccn-list.js'));

const Q = globalThis.ARH_QUESTIONS;
const R = globalThis.ARH_RULES;
const L = globalThis.ARH_LEGAL;
const MOD = globalThis.ARH_CCN_MODULES;
const CCN = globalThis.ARH_CCN_LIST;

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

/* ------------------------------------------------------------------ */
/* Référentiels                                                        */
/* ------------------------------------------------------------------ */
const PILLAR_IDS = Q.PILLARS.map(p => p.id);
const CTX_FIELDS = new Set(R.conditions.fields);
const SCALE_C = Q.ANSWER_SCALES.C.map(a => a.id);
const SCALE_M = Q.ANSWER_SCALES.M.map(a => a.id);
const RULE_IDS = new Set(Object.keys(L.RULES));
const IDCC = new Set(CCN.entries.map(e => e.idcc));

/* Toutes les questions du parcours : générales + modules conventionnels. */
const MOD_QUESTIONS = [];
for (const idcc of Object.keys(MOD.modules)) {
  for (const q of (MOD.modules[idcc].questions || [])) MOD_QUESTIONS.push({ q, idcc });
}
const ALL = Q.QUESTIONS.map(q => ({ q, idcc: null })).concat(MOD_QUESTIONS);

/* ------------------------------------------------------------------ */
/* 1. Piliers                                                          */
/* ------------------------------------------------------------------ */
(function pillars() {
  const seen = new Set(), orders = new Set(), fields = new Set();
  for (const p of Q.PILLARS) {
    for (const k of ['id', 'order', 'score_field', 'label', 'short_label', 'strength_text', 'weak_text']) {
      if (p[k] === undefined || p[k] === null || p[k] === '') err(`pilier ${p.id} : champ « ${k} » manquant`);
    }
    if (seen.has(p.id)) err(`pilier ${p.id} : identifiant en doublon`);
    if (orders.has(p.order)) err(`pilier ${p.id} : ordre ${p.order} déjà utilisé`);
    if (fields.has(p.score_field)) err(`pilier ${p.id} : score_field ${p.score_field} déjà utilisé`);
    seen.add(p.id); orders.add(p.order); fields.add(p.score_field);
    if (!R.payload.scores.includes(p.score_field)) err(`pilier ${p.id} : score_field ${p.score_field} absent de RULES.payload.scores`);
  }
  for (const f of R.payload.scores) {
    if (f !== 'global_score' && !fields.has(f)) err(`RULES.payload.scores : ${f} ne correspond à aucun pilier`);
  }
})();

/* ------------------------------------------------------------------ */
/* 2. Grammaire des conditions                                         */
/* ------------------------------------------------------------------ */
function checkCond(c, where) {
  if (c === null || c === undefined) return;
  if (typeof c !== 'object') return err(`${where} : condition invalide (${JSON.stringify(c)})`);
  if (c.all) return c.all.forEach((x, i) => checkCond(x, `${where}.all[${i}]`));
  if (c.any) return c.any.forEach((x, i) => checkCond(x, `${where}.any[${i}]`));
  if (c.not) return checkCond(c.not, `${where}.not`);
  if (!c.field) return err(`${where} : condition sans « field » ni opérateur logique`);
  if (!CTX_FIELDS.has(c.field)) err(`${where} : champ « ${c.field} » absent de RULES.conditions.fields`);
  if (!Array.isArray(c.in) && !Array.isArray(c.not_in)) err(`${where} : condition sur ${c.field} sans « in » ni « not_in »`);
}
/* Vrai si la condition impose cet IDCC quelque part dans sa branche « all ». */
function requiresIdcc(c, idcc) {
  if (!c || typeof c !== 'object') return false;
  if (c.field === 'collective_agreement_idcc' && Array.isArray(c.in)) return c.in.length === 1 && c.in[0] === idcc;
  if (c.all) return c.all.some(x => requiresIdcc(x, idcc));
  return false;
}
function condFields(c, out = new Set()) {
  if (!c || typeof c !== 'object') return out;
  if (c.field) out.add(c.field);
  for (const k of ['all', 'any']) if (c[k]) c[k].forEach(x => condFields(x, out));
  if (c.not) condFields(c.not, out);
  return out;
}

/* ------------------------------------------------------------------ */
/* 3. Contextualisation                                               */
/* ------------------------------------------------------------------ */
(function context() {
  const ids = new Set();
  for (const f of Q.CONTEXT) {
    if (ids.has(f.id)) err(`contexte ${f.id} : identifiant en doublon`);
    ids.add(f.id);
    if (!CTX_FIELDS.has(f.id)) {
      /* `collective_agreement` stocke des champs dérivés, déclarés individuellement. */
      if (f.type !== 'ccn_search') err(`contexte ${f.id} : champ absent de RULES.conditions.fields`);
    }
    if (!f.label) err(`contexte ${f.id} : libellé manquant`);
    checkCond(f.applicability, `contexte ${f.id}.applicability`);
    if (f.type === 'ccn_search') {
      if (!f.placeholder) err(`contexte ${f.id} : « placeholder » requis pour un champ de recherche`);
      continue;
    }
    if (!Array.isArray(f.options) || !f.options.length) { err(`contexte ${f.id} : aucune option`); continue; }
    const opts = new Set();
    for (const o of f.options) {
      if (opts.has(o.id)) err(`contexte ${f.id} : option ${o.id} en doublon`);
      opts.add(o.id);
      if (!o.label) err(`contexte ${f.id}/${o.id} : libellé manquant`);
      if (o.detail) {
        if (!o.detail.id || !o.detail.label) err(`contexte ${f.id}/${o.id} : « detail » incomplet`);
        /* Un champ libre est stocké et transmis, mais ne doit jamais déclencher de règle :
           il reste donc hors de RULES.conditions.fields, et doit figurer dans le payload. */
        if (CTX_FIELDS.has(o.detail.id)) err(`contexte ${f.id}/${o.id} : le champ libre ${o.detail.id} ne doit pas être déclaré dans RULES.conditions.fields (texte saisi, jamais une règle)`);
        if (!R.payload.context.includes(o.detail.id)) err(`contexte ${f.id}/${o.id} : champ libre ${o.detail.id} absent de RULES.payload.context (il ne serait pas transmis au CRM)`);
        if (!o.detail.maxlength) warn(`contexte ${f.id}/${o.id} : champ libre ${o.detail.id} sans maxlength`);
      }
    }
  }
  /* Le sélecteur de convention doit exister : les modules conventionnels s'y accrochent. */
  if (!Q.CONTEXT.some(f => f.type === 'ccn_search')) err('contexte : aucun champ de type ccn_search');
})();

/* ------------------------------------------------------------------ */
/* 4. Questions                                                       */
/* ------------------------------------------------------------------ */
const REQUIRED_QUESTION_FIELDS = ['id', 'pillar', 'type', 'weight', 'short_label', 'question', 'help_text',
  'red_flag_conditions', 'area_text', 'recommendation_by_answer', 'commercial_tags'];

(function questions() {
  const ids = new Set();
  for (const { q, idcc } of ALL) {
    const w = `question ${q.id}`;
    for (const k of REQUIRED_QUESTION_FIELDS) {
      if (q[k] === undefined) err(`${w} : champ « ${k} » manquant`);
    }
    if (!('applicability' in q)) err(`${w} : champ « applicability » manquant (null = toujours posée)`);
    if (ids.has(q.id)) err(`${w} : identifiant en doublon`);
    ids.add(q.id);
    if (!PILLAR_IDS.includes(q.pillar)) err(`${w} : pilier « ${q.pillar} » inconnu`);
    if (q.type !== 'C' && q.type !== 'M') err(`${w} : type « ${q.type} » invalide`);
    if (![1, 2, 3].includes(q.weight)) err(`${w} : poids ${q.weight} invalide (1, 2 ou 3)`);
    checkCond(q.applicability, `${w}.applicability`);

    const scale = q.type === 'M' ? SCALE_M : SCALE_C;
    if (q.type === 'M') {
      if (!q.answers) err(`${w} : type M sans « answers »`);
      else for (const a of SCALE_M) if (!q.answers[a]) err(`${w} : situation ${a} sans libellé`);
      if (q.allow_na && !q.na_label) err(`${w} : allow_na sans « na_label »`);
    } else if (q.answers) {
      err(`${w} : type C avec « answers » (les libellés viennent de ANSWER_SCALES.C)`);
    }

    /* Recommandations : une par réponse non maximale et dans le score. */
    const needRec = Q.ANSWER_SCALES[q.type]
      .filter(a => a.score !== null && a.score < 100 && (a.id !== 'na'))
      .map(a => a.id);
    for (const a of needRec) {
      if (!q.recommendation_by_answer || !q.recommendation_by_answer[a]) {
        err(`${w} : recommandation manquante pour la réponse « ${a} »`);
      }
    }
    for (const a of Object.keys(q.recommendation_by_answer || {})) {
      if (!scale.includes(a)) err(`${w} : recommandation pour une réponse inconnue « ${a} »`);
    }

    /* Règles réglementaires. */
    for (const id of (q.legal_rule || [])) {
      if (!RULE_IDS.has(id)) err(`${w} : règle « ${id} » absente de legal-rules.js`);
    }
    for (const rf of (q.red_flag_conditions || [])) {
      if (!Array.isArray(rf.answers) || !rf.answers.length) err(`${w} : red_flag_conditions sans réponses`);
      for (const a of (rf.answers || [])) if (!scale.includes(a)) err(`${w} : red flag sur une réponse inconnue « ${a} »`);
      if (!rf.obligation) err(`${w} : red flag sans obligation`);
      else if (!RULE_IDS.has(rf.obligation)) err(`${w} : red flag sur une règle inconnue « ${rf.obligation} »`);
      else if (!(q.legal_rule || []).includes(rf.obligation)) {
        warn(`${w} : le red flag s'appuie sur ${rf.obligation}, absent de « legal_rule » (la question resterait active si la règle était désactivée)`);
      }
    }

    /* Variantes de formulation : mêmes concepts, textes adaptés. */
    for (const v of (q.variants || [])) {
      if (!v.id) err(`${w} : variante sans identifiant`);
      checkCond(v.when, `${w}.variants[${v.id}].when`);
      for (const k of Object.keys(v)) {
        if (!['id', 'when', 'question', 'help_text', 'short_label', 'area_text', 'answers',
          'recommendation_by_answer', 'allow_na', 'na_label'].includes(k)) {
          err(`${w} : variante ${v.id} modifie « ${k} », champ non pris en charge par le moteur`);
        }
      }
    }

    /* Question de module conventionnel : son applicabilité doit porter l'IDCC. */
    if (idcc && !requiresIdcc(q.applicability, idcc)) {
      err(`${w} : question du module IDCC ${idcc} dont l'applicabilité n'impose pas cet IDCC`);
    }
    if (!idcc) {
      for (const f of condFields(q.applicability)) {
        if (f === 'forfait_jours') warn(`${w} : question générale conditionnée par « forfait_jours », champ posé seulement par le module Syntec`);
      }
    }
  }
})();

/* ------------------------------------------------------------------ */
/* 5. Modules conventionnels                                          */
/* ------------------------------------------------------------------ */
(function modules() {
  const qIds = new Set(ALL.map(x => x.q.id));
  for (const idcc of Object.keys(MOD.modules)) {
    const m = MOD.modules[idcc];
    if (!IDCC.has(idcc)) err(`module ${idcc} : IDCC absent de ccn-list.js (le module ne pourrait jamais se déclencher)`);
    if (!m.id) err(`module ${idcc} : identifiant manquant`);
    for (const c of (m.context_questions || [])) {
      if (!CTX_FIELDS.has(c.id)) err(`module ${idcc} : question de contexte ${c.id} absente de RULES.conditions.fields`);
      if (!Array.isArray(c.options) || !c.options.length) err(`module ${idcc} : question de contexte ${c.id} sans options`);
      if (!c.label) err(`module ${idcc} : question de contexte ${c.id} sans libellé`);
    }
    for (const g of (m.roadmap_groups || [])) {
      if (!g.id || !g.title || !g.recommendation || !g.reason) err(`module ${idcc} : regroupement ${g.id || '?'} incomplet`);
      if (typeof g.max_score !== 'number') err(`module ${idcc} : regroupement ${g.id} sans max_score`);
      for (const id of (g.questions || [])) {
        if (!qIds.has(id)) err(`module ${idcc} : regroupement ${g.id} référence la question inconnue ${id}`);
      }
      if ((g.questions || []).length < 2) err(`module ${idcc} : regroupement ${g.id} doit porter au moins deux questions`);
    }
  }
})();

/* ------------------------------------------------------------------ */
/* 6. Conventions collectives                                         */
/* ------------------------------------------------------------------ */
(function ccnList() {
  const seen = new Set();
  for (const e of CCN.entries) {
    if (!/^[1-9]\d*$/.test(e.idcc)) err(`CCN ${e.idcc} : IDCC invalide (chaîne, sans zéro initial)`);
    if (seen.has(e.idcc)) err(`CCN ${e.idcc} : IDCC en doublon`);
    seen.add(e.idcc);
    if (!e.label) err(`CCN ${e.idcc} : intitulé officiel (« label ») manquant`);
  }
  const special = (CCN.special || []).map(s => s.id);
  for (const s of CCN.special || []) if (!s.label) err(`CCN alternative ${s.id} : libellé manquant`);
  if (special.includes('known')) err('CCN : « known » est réservé au marqueur de sélection');
  if (!special.length) warn('CCN : aucune alternative explicite (« je ne connais pas », « pas de convention »)');
})();

/* ------------------------------------------------------------------ */
/* 7. Référentiel réglementaire                                       */
/* ------------------------------------------------------------------ */
(function legal() {
  const STATUSES = ['verified', 'legal_validation_required'];
  for (const id of Object.keys(L.RULES)) {
    const r = L.RULES[id];
    if (r.id !== id) err(`règle ${id} : champ « id » incohérent (${r.id})`);
    if (!STATUSES.includes(r.status)) err(`règle ${id} : statut « ${r.status} » inconnu`);
    if (!r.title) err(`règle ${id} : titre manquant`);
    checkCond(r.applicability_condition, `règle ${id}.applicability_condition`);
    if (r.status === 'verified') {
      if (!r.verified_at) err(`règle ${id} : statut « verified » sans date de vérification`);
      if (!Array.isArray(r.source) || !r.source.length) err(`règle ${id} : statut « verified » sans source`);
      for (const s of (r.source || [])) {
        if (!/^https:\/\/(entreprendre\.service-public|www\.service-public|www\.legifrance|travail-emploi|www\.urssaf|eur-lex\.europa)\.gouv\.fr|^https:\/\/eur-lex\.europa\.eu/.test(s.url || '')) {
          warn(`règle ${id} : source hors liste autorisée (${s.url})`);
        }
      }
    }
  }
  const qIds = new Set(ALL.map(x => x.q.id));
  for (const v of L.LEGAL_VALIDATION_REQUIRED || []) {
    if (!RULE_IDS.has(v.rule)) err(`LEGAL_VALIDATION_REQUIRED : règle inconnue ${v.rule}`);
    for (const id of v.questions || []) if (!qIds.has(id)) err(`LEGAL_VALIDATION_REQUIRED (${v.rule}) : question inconnue ${id}`);
    if (!v.point) err(`LEGAL_VALIDATION_REQUIRED (${v.rule}) : point à valider non décrit`);
  }
  for (const w of L.LEGAL_WATCH || []) {
    if (!RULE_IDS.has(w.rule)) err(`LEGAL_WATCH : règle inconnue ${w.rule}`);
  }
  /* Une règle à valider doit être au statut qui désactive ses questions. */
  for (const v of (L.LEGAL_VALIDATION_REQUIRED || []).filter(x => x.blocking)) {
    const r = L.RULES[v.rule];
    if (r && r.status === 'verified') {
      err(`règle ${v.rule} : marquée bloquante dans LEGAL_VALIDATION_REQUIRED mais au statut « verified » (ses questions seraient actives)`);
    }
  }
})();

/* ------------------------------------------------------------------ */
/* 8. Vocabulaire interdit dans les textes affichés                   */
/* ------------------------------------------------------------------ */
(function wording() {
  const strings = [];
  const push = (v, where) => {
    if (typeof v === 'string') strings.push([v, where]);
    else if (Array.isArray(v)) v.forEach((x, i) => push(x, `${where}[${i}]`));
    else if (v && typeof v === 'object') Object.keys(v).forEach(k => push(v[k], `${where}.${k}`));
  };
  for (const { q } of ALL) {
    for (const k of ['question', 'help_text', 'short_label', 'action_title', 'area_text', 'na_label']) push(q[k], `${q.id}.${k}`);
    push(q.answers, `${q.id}.answers`);
    push(q.recommendation_by_answer, `${q.id}.recommendation_by_answer`);
    for (const v of q.variants || []) {
      for (const k of ['question', 'help_text', 'short_label', 'area_text', 'na_label']) push(v[k], `${q.id}/${v.id}.${k}`);
      push(v.answers, `${q.id}/${v.id}.answers`);
      push(v.recommendation_by_answer, `${q.id}/${v.id}.recommendation_by_answer`);
    }
  }
  for (const p of Q.PILLARS) for (const k of ['label', 'short_label', 'strength_text', 'weak_text']) push(p[k], `pilier ${p.id}.${k}`);
  for (const f of Q.CONTEXT) {
    push(f.label, `contexte ${f.id}.label`); push(f.help_text, `contexte ${f.id}.help_text`);
    for (const o of f.options || []) push(o.label, `contexte ${f.id}/${o.id}`);
  }
  push(Q.ANSWER_SCALES.C.map(a => a.label), 'ANSWER_SCALES.C');
  for (const k of ['result_texts', 'disclaimer', 'hero', 'lead_form', 'commercial_cta', 'reason_templates',
    'answer_status', 'maturity_levels', 'roadmap_priorities']) push(R[k], `RULES.${k}`);
  for (const m of Object.values(MOD.modules)) for (const c of m.context_questions || []) {
    push(c.label, `module ${m.id}.${c.id}`); push(c.help_text, `module ${m.id}.${c.id}.help_text`);
    for (const o of c.options || []) push(o.label, `module ${m.id}.${c.id}/${o.id}`);
  }
  for (const m of Object.values(MOD.modules)) for (const g of m.roadmap_groups || []) {
    for (const k of ['title', 'recommendation', 'reason']) push(g[k], `module ${m.id}.${g.id}.${k}`);
  }

  for (const [s, where] of strings) {
    const low = s.toLowerCase();
    for (const bad of R.forbidden_wording) {
      if (low.includes(bad)) err(`vocabulaire interdit « ${bad} » dans ${where}`);
    }
  }
  console.log(`  ${strings.length} textes affichés contrôlés contre ${R.forbidden_wording.length} termes interdits`);
})();

/* ------------------------------------------------------------------ */
/* 9. Textes attendus par l'interface                                 */
/* ------------------------------------------------------------------ */
(function uiContract() {
  const need = {
    'hero': ['eyebrow', 'title', 'lead', 'cta', 'meta'],
    'lead_form': ['title', 'intro', 'benefits', 'fields', 'cta', 'consent_scope', 'privacy_note', 'privacy_url'],
    'commercial_cta': ['title', 'text', 'cta'],
    'result_texts': ['global_by_level', 'very_good', 'red_flags_title', 'red_flag_body', 'areas_title',
      'vigilance_title', 'strengths_title', 'strengths_fallback_title', 'pillar_not_evaluated', 'preview', 'vigilance_note'],
    'thresholds': ['weak_max_score', 'critical_structure_answers', 'critical_weight', 'partial_max_score',
      'optimisation_scores', 'low_pillar_below', 'strength_min_score', 'strength_fallback_min',
      'max_strengths', 'max_areas_to_structure', 'very_good'],
    'storage': ['progress_key', 'utm_key', 'progress_ttl_days', 'last_metrics_key'],
    'roadmap_display_limit': ['free_results', 'free_max_priority'],
    'ui': ['auto_advance_ms']
  };
  for (const section of Object.keys(need)) {
    if (!R[section]) { err(`RULES.${section} manquant`); continue; }
    for (const k of need[section]) if (R[section][k] === undefined) err(`RULES.${section}.${k} manquant`);
  }
  for (const lv of R.maturity_levels) {
    if (!R.result_texts.global_by_level[lv.id]) err(`result_texts.global_by_level.${lv.id} manquant`);
  }
  if (!/^https:\/\//.test(R.lead_form.privacy_url)) err('lead_form.privacy_url doit être une URL https complète');
  for (const b of R.lead_form.benefits) {
    if (!['always', 'has_red_flags', 'has_areas', 'not_very_good', 'very_good'].includes(b.when)) {
      err(`lead_form.benefits : condition d'affichage « ${b.when} » inconnue`);
    }
  }
  if (R.roadmap_priorities.length < 5) err('roadmap_priorities : les 5 niveaux de priorité sont attendus');
  R.roadmap_priorities.forEach((p, i) => { if (p.priority !== i + 1) err(`roadmap_priorities[${i}] : priorité ${p.priority} hors séquence`); });
})();

/* ------------------------------------------------------------------ */
/* 10. Effet du garde-fou juridique                                   */
/* ------------------------------------------------------------------ */
(function release() {
  const rel = R.release || {};
  const active = id => {
    const r = L.RULES[id];
    if (!r || r.status !== 'verified') return false;
    return !(rel.mode === 'production' && rel.require_legal_review && !r.legal_reviewed_at);
  };
  const off = ALL.filter(({ q }) => (q.legal_rule || []).some(id => !active(id)));
  const redFlagCapable = ALL.filter(({ q }) => (q.red_flag_conditions || []).some(rf => active(rf.obligation)));
  console.log(`  release : mode=${rel.mode} require_legal_review=${rel.require_legal_review}`);
  console.log(`  ${ALL.length - off.length}/${ALL.length} questions actives · ${redFlagCapable.length} capables de déclencher un red flag`);
  if (off.length) {
    console.log('  questions désactivées : ' + off.map(x => x.q.id).join(', '));
  }
  if (!redFlagCapable.length) {
    err('aucune question ne peut déclencher de red flag avec la configuration de sortie actuelle : le bloc « sujets à sécuriser » serait toujours vide');
  }
  const unreviewed = Object.values(L.RULES).filter(r => r.status === 'verified' && !r.legal_reviewed_at);
  if (rel.require_legal_review === false && unreviewed.length) {
    warn(`${unreviewed.length} règles « verified » sans legal_reviewed_at sont actives en production (require_legal_review: false, choix assumé) : ${unreviewed.map(r => r.id).join(', ')}`);
  }
})();

/* ------------------------------------------------------------------ */
console.log('');
for (const w of warnings) console.log('  avertissement — ' + w);
if (warnings.length) console.log('');
if (errors.length) {
  for (const e of errors) console.error('  ERREUR — ' + e);
  console.error(`\n${errors.length} erreur(s) de configuration.\n`);
  process.exit(1);
}
console.log(`Configuration valide (${ALL.length} questions, ${Q.PILLARS.length} piliers, ${Object.keys(L.RULES).length} règles, ${CCN.entries.length} conventions, ${warnings.length} avertissement(s)).\n`);
