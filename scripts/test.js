#!/usr/bin/env node
/*!
 * Audit RH 360° — TESTS DU MOTEUR.
 *
 *   npm test
 *
 * Le moteur (src/engine.js) est constitué de fonctions pures : il se teste sans navigateur.
 * Trois niveaux :
 *
 *   1. unitaires        recherche de convention, UTM, reprise de progression, chronométrage,
 *                       normalisation du contexte, parcours de contextualisation
 *   2. profils          les 8 profils de recette, invariants de restitution, payload, email
 *   3. balayage         tous les contextes possibles × réponses uniformes et aléatoires :
 *                       aucune exception, aucun doublon, bornes respectées
 *
 * L'interface (src/app.js) n'est pas couverte ici : elle est vérifiée dans un navigateur
 * (voir docs/WEBFLOW.md › recette).
 */
'use strict';

const path = require('path');
const SRC = path.join(__dirname, '..', 'src');

for (const f of ['config/questions.js', 'config/scoring.js', 'config/legal-rules.js',
  'config/ccn-modules.js', 'data/ccn-list.js', 'engine.js', 'report-email.js', 'dev/profiles.js']) {
  require(path.join(SRC, f));
}
const E = globalThis.ARH_ENGINE;
const RE = globalThis.ARH_REPORT_EMAIL;
const P = globalThis.ARH_PROFILES;
const Q = globalThis.ARH_QUESTIONS;
const R = globalThis.ARH_RULES;

let pass = 0;
const failures = [];
function ok(cond, label) {
  if (cond) pass++;
  else failures.push(label);
}
function eq(a, b, label) { ok(a === b, `${label} (attendu ${JSON.stringify(b)}, obtenu ${JSON.stringify(a)})`); }
function group(name) { console.log('\n  ' + name); }

/* Configuration de sortie réelle (celle du bundle) et configuration stricte (garde-fou actif). */
const CFG = E.withOverrides(E.defaultConfig(), {
  release: { mode: R.release.mode, require_legal_review: R.release.require_legal_review === true }
});
const CFG_STRICT = E.withOverrides(E.defaultConfig(), { release: { mode: 'production', require_legal_review: true } });

/* ==================================================================
 * 1. Tests unitaires
 * ================================================================== */
group('Recherche de convention collective');
{
  const find = (q, cfg = CFG) => E.searchAgreements(q, cfg, 8).map(e => e.idcc);
  ok(find('syntec')[0] === '1486', 'nom d\'usage « syntec » → 1486 en tête');
  ok(find('SYNTEC')[0] === '1486', 'recherche insensible à la casse');
  ok(find('1486')[0] === '1486', 'numéro IDCC exact');
  ok(find('idcc 1486')[0] === '1486', 'préfixe « idcc » ignoré');
  ok(find('IDCC 0001486')[0] === '1486', 'zéros initiaux ignorés');
  ok(find('convention collective nationale syntec')[0] === '1486', 'mots vides ignorés');
  ok(find('métallurgie')[0] === '3248', 'accents ignorés');
  ok(find('metallurgie')[0] === '3248', 'recherche sans accent');
  ok(find('cinov').includes('1486'), 'alias de recherche');
  eq(find('').length, 0, 'requête vide → aucun résultat');
  eq(find('zzzzzz').length, 0, 'requête sans correspondance');
  eq(find('ccn').length, 0, 'requête composée uniquement de mots vides');
  ok(find('148').includes('1486'), 'IDCC partiel en préfixe');
  ok(E.searchAgreements('e', CFG, 3).length <= 3, 'limite de résultats respectée');

  const syntec = E.agreementContext('1486', CFG);
  eq(syntec.collective_agreement_idcc, '1486', 'contexte convention : IDCC');
  eq(syntec.collective_agreement_short_name, 'Syntec', 'contexte convention : nom d\'usage');
  eq(syntec.collective_agreement_known, 'known', 'contexte convention : marqueur de sélection');
  ok(/^Convention collective nationale des bureaux/.test(syntec.collective_agreement_label), 'contexte convention : intitulé officiel stocké');
  const none = E.agreementContext('none', CFG);
  eq(none.collective_agreement_idcc, null, 'alternative « pas de convention » : aucun IDCC');
  eq(none.collective_agreement_known, 'none', 'alternative explicite conservée comme valeur distincte');
  eq(E.agreementContext('unknown', CFG).collective_agreement_known, 'unknown', 'alternative « je ne connais pas »');
  eq(E.agreementContext('9999999', CFG), null, 'IDCC inexistant → null');
}

group('Contexte et parcours de contextualisation');
{
  const steps = ctx => E.contextSteps(ctx, CFG).map(s => s.id);
  ok(!steps({ company_size: '1-10' }).includes('has_cse'), 'CSE non demandé sous 11 salariés');
  ok(steps({ company_size: '50-249' }).includes('has_cse'), 'CSE demandé à partir de 11 salariés');
  ok(!steps({ company_size: '50-249' }).includes('forfait_jours'), 'forfait jours non demandé hors Syntec');
  const syntecCtx = Object.assign({ company_size: '50-249' }, E.agreementContext('1486', CFG));
  const s2 = steps(syntecCtx);
  ok(s2.includes('forfait_jours'), 'forfait jours demandé pour l\'IDCC 1486');
  eq(s2.indexOf('forfait_jours'), s2.indexOf('collective_agreement') + 1, 'question de module insérée juste après la convention');
  ok(!steps(Object.assign({ company_size: '50-249' }, E.agreementContext('3248', CFG))).includes('forfait_jours'),
    'module Métallurgie : aucune question de contextualisation');

  const norm = E.normalizeContext({ company_size: '1-10', has_cse: 'yes' }, CFG);
  eq(norm.has_cse, undefined, 'valeur d\'un champ devenu non applicable ignorée (effectif réduit après coup)');
  const norm2 = E.normalizeContext({ hr_organization: 'hr_team', hr_organization_other: 'DAF partagé' }, CFG);
  eq(norm2.hr_organization_other, undefined, 'précision « Autre » ignorée si l\'option n\'est plus choisie');
  const norm3 = E.normalizeContext({ hr_organization: 'other', hr_organization_other: 'DAF partagé' }, CFG);
  eq(norm3.hr_organization_other, 'DAF partagé', 'précision « Autre » conservée si l\'option est choisie');
}

group('UTM et reprise de progression');
{
  const keys = R.utm_keys;
  const u1 = E.resolveUtm('?utm_source=linkedin&utm_campaign=audit', null, keys);
  eq(u1.utm.utm_source, 'linkedin', 'UTM lues dans l\'URL');
  eq(u1.from_url, true, 'origine URL signalée');
  const u2 = E.resolveUtm('', JSON.stringify({ utm_source: 'memorise' }), keys);
  eq(u2.utm.utm_source, 'memorise', 'UTM mémorisées à défaut');
  eq(E.resolveUtm('?utm_source=url', JSON.stringify({ utm_source: 'memorise' }), keys).utm.utm_source, 'url',
    'les UTM de l\'URL priment sur celles mémorisées');
  eq(E.resolveUtm('', 'ceci n\'est pas du json', keys).utm.utm_source, '', 'stockage corrompu toléré');
  eq(E.resolveUtm('?utm_source=a%20b', null, keys).utm.utm_source, 'a b', 'valeur décodée');
  eq(E.resolveUtm('?inconnu=x', null, keys).from_url, false, 'paramètre hors liste ignoré');

  const now = new Date('2026-10-26T10:00:00Z');
  const state = { step: 'question', ctxIndex: 2, qIndex: 5, context: { company_size: '50-249' }, answers: { Q1: 'yes' } };
  const raw = E.serializeProgress(state, now);
  ok(E.restoreProgress(raw, now, 30), 'progression relue');
  eq(E.restoreProgress(raw, now, 30).qIndex, 5, 'index de question conservé');
  eq(E.restoreProgress(raw, new Date('2026-12-26T10:00:00Z'), 30), null, 'progression expirée écartée');
  eq(E.restoreProgress(raw, new Date('2026-10-20T10:00:00Z'), 30), null, 'date future écartée (horloge modifiée)');
  eq(E.restoreProgress('{}', now, 30), null, 'objet sans version écarté');
  eq(E.restoreProgress('pas du json', now, 30), null, 'JSON invalide écarté');
  eq(E.restoreProgress(null, now, 30), null, 'absence de progression');
  eq(E.restoreProgress(JSON.stringify({ v: 1, saved_at: now.toISOString(), state: { step: 'inconnu', context: {}, answers: {} } }), now, 30),
    null, 'étape inconnue écartée');
  eq(E.restoreProgress(JSON.stringify({ v: 1, saved_at: now.toISOString(), state: { step: 'question', context: 'x', answers: {} } }), now, 30),
    null, 'contexte non structuré écarté');
  const fixed = E.restoreProgress(JSON.stringify({ v: 1, saved_at: now.toISOString(),
    state: { step: 'question', context: {}, answers: {}, qIndex: -3, metrics: 'x' } }), now, 30);
  eq(fixed.qIndex, 0, 'index négatif corrigé');
  eq(fixed.metrics, null, 'mesures corrompues neutralisées');
}

group('Chronométrage');
{
  const m = E.newMetrics(0);
  E.openSegment(m, { id: 'Q1', pillar: 'compliance' }, 1000, 300);
  E.closeSegment(m, 6000, 300);
  eq(m.questionnaire_ms, 5000, 'durée d\'un écran cumulée');
  eq(m.pillar_ms.compliance, 5000, 'durée imputée au pilier');
  E.openSegment(m, { id: 'Q2', pillar: 'compliance' }, 6000, 300);
  E.closeSegment(m, 6000 + 900 * 1000, 300);
  eq(m.pillar_ms.compliance, 5000 + 300 * 1000, 'segment plafonné (onglet abandonné)');
  eq(E.closeSegment(m, 9e9, 300).segment, null, 'fermer deux fois est sans effet');
  eq(E.metricsSummary(null), null, 'résumé sans mesures');
  const sum = E.metricsSummary(m);
  eq(sum.audit_duration_seconds, null, 'durée totale inconnue avant affichage du résultat');
  eq(sum.last_question_id, 'Q2', 'dernier point atteint mémorisé');
}

/* ==================================================================
 * 2. Profils de recette
 * ================================================================== */
function invariants(res, label) {
  ok(res.complete, `${label} : toutes les questions applicables sont répondues`);
  ok(res.global.display_score >= 0 && res.global.display_score <= 100, `${label} : score global dans [0;100]`);
  ok(res.global.level !== null, `${label} : niveau de maturité déterminé`);
  ok(typeof res.global.text === 'string' && res.global.text.length > 0, `${label} : texte de restitution présent`);

  for (const p of res.pillars) {
    if (p.evaluated) ok(p.display_score >= 0 && p.display_score <= 100, `${label} : pilier ${p.id} dans [0;100]`);
    else ok(p.score === null && p.display_score === null, `${label} : pilier ${p.id} non évalué sans score`);
    ok(p.scored_count <= p.applicable_count, `${label} : pilier ${p.id}, réponses notées ≤ questions posées`);
  }

  /* Hiérarchie stricte : une question n'est listée qu'une fois dans la roadmap. */
  const seen = new Map();
  for (const a of res.roadmap) {
    for (const id of [a.question_id, ...(a.related_questions || [])].filter(Boolean)) {
      ok(!seen.has(id), `${label} : ${id} listé une seule fois dans la roadmap (déjà en priorité ${seen.get(id)})`);
      seen.set(id, a.priority);
    }
  }
  for (const a of res.roadmap) {
    ok(a.priority >= 1 && a.priority <= 5, `${label} : priorité valide`);
    ok(!!a.title, `${label} : action sans titre`);
    ok(a.priority === 3 || !!a.recommendation || a.priority === 1, `${label} : action ${a.question_id} sans recommandation`);
  }
  const prios = res.roadmap.map(a => a.priority);
  ok(prios.every((p, i) => i === 0 || p >= prios[i - 1]), `${label} : roadmap triée par priorité croissante`);

  /* Un red flag exige une réponse déclenchante ET une obligation applicable. */
  const byId = new Map(res.items.map(it => [it.question_id, it]));
  for (const a of res.red_flags) {
    eq(a.priority, 1, `${label} : red flag en priorité 1`);
    ok(byId.get(a.question_id).red_flag, `${label} : red flag ${a.question_id} porté par la réponse`);
  }
  eq(res.red_flags.length, res.items.filter(it => it.red_flag).length, `${label} : tous les red flags remontent`);

  /* Sous-ensembles. Un constat peut avoir été absorbé par un regroupement de roadmap
     (modules conventionnels) : il reste alors couvert par l'action regroupée. */
  const inRoadmap = new Set(res.roadmap);
  const grouped = new Set();
  for (const a of res.roadmap) if (a.group_id) (a.related_questions || []).forEach(id => grouped.add(id));
  const covered = a => inRoadmap.has(a) || grouped.has(a.question_id);
  for (const a of res.areas_to_structure) ok(covered(a), `${label} : axe ${a.question_id || a.pillar} couvert par la roadmap`);
  for (const a of res.optimisations) ok(covered(a), `${label} : optimisation ${a.question_id || a.pillar} couverte par la roadmap`);
  for (const a of res.red_flags) ok(covered(a), `${label} : sujet à sécuriser ${a.question_id} couvert par la roadmap`);
  for (const a of res.critical) eq(a.priority, 2, `${label} : point critique en priorité 2`);

  /* Cas « très bon résultat » : jamais de priorité inventée, jamais de red flag masqué. */
  const VG = R.thresholds.very_good;
  if (res.very_good) {
    ok(res.global.display_score >= VG.min_global, `${label} : très bon résultat au-dessus du seuil`);
    eq(res.red_flags.length, 0, `${label} : très bon résultat sans red flag`);
    eq(res.critical.length, 0, `${label} : très bon résultat sans point critique`);
    eq(res.areas_to_structure.length, 0, `${label} : très bon résultat sans axe à structurer`);
    eq(res.free_preview.mode, res.optimisations.length ? 'optimisations' : 'optimisations', `${label} : aperçu en mode optimisations`);
  }

  /* Aperçu gratuit : jamais complété artificiellement. */
  const DL = R.roadmap_display_limit;
  ok(res.free_preview.actions.length <= DL.free_results, `${label} : aperçu limité à ${DL.free_results} actions`);
  if (!res.very_good) {
    for (const a of res.free_preview.actions) ok(a.priority <= DL.free_max_priority, `${label} : aperçu limité aux priorités réellement hautes`);
  }
  ok(res.free_preview.remaining_count >= 0, `${label} : reste à découvrir jamais négatif`);

  /* « Je ne sais pas » : compté, et listé seulement s'il n'apparaît pas déjà ailleurs. */
  const shown = new Set();
  for (const a of res.red_flags) { if (a.question_id) shown.add(a.question_id); (a.related_questions || []).forEach(x => shown.add(x)); }
  for (const a of res.areas_to_structure.slice(0, R.thresholds.max_areas_to_structure)) {
    if (a.question_id) shown.add(a.question_id); (a.related_questions || []).forEach(x => shown.add(x));
  }
  for (const v of res.vigilance_items) ok(!shown.has(v.question_id), `${label} : « à vérifier » ${v.question_id} non déjà affiché ailleurs`);
  eq(res.vigilance_count, res.items.filter(it => it.vigilance).length, `${label} : décompte des « je ne sais pas »`);

  /* Points forts : uniquement des piliers sans sujet à sécuriser. */
  for (const s of res.strengths) {
    const p = res.pillars.find(x => x.id === s.pillar);
    eq(p.red_flags_count, 0, `${label} : point fort ${s.pillar} sans red flag`);
    ok(p.display_score >= R.thresholds.strength_fallback_min, `${label} : point fort au-dessus du seuil de repli`);
  }
  ok(res.strengths.length <= R.thresholds.max_strengths, `${label} : nombre de points forts plafonné`);
}

function payloadChecks(p, res, label) {
  for (const k of R.payload.contact.concat(R.payload.context)) {
    ok(k in p, `${label} : payload, champ ${k} présent`);
    ok(p[k] !== undefined, `${label} : payload, champ ${k} défini`);
  }
  for (const pl of res.pillars) ok(pl.score_field in p, `${label} : payload, score du pilier ${pl.id}`);
  for (const k of R.utm_keys) ok(k in p, `${label} : payload, ${k} présent`);
  for (const k of ['global_score', 'red_flags_count', 'red_flags', 'critical_issues_count', 'top_priorities',
    'areas_to_structure', 'strengths', 'lead_interest', 'audit_id', 'config_version', 'legal_rules_version',
    'completed_at', 'page_url', 'consent_scope', 'method_version', 'pillar_details', 'lead_signals', 'answers_json']) {
    ok(k in p, `${label} : payload, ${k} présent`);
  }
  ok(JSON.stringify(p).indexOf('undefined') < 0, `${label} : payload sans « undefined »`);
  const answers = JSON.parse(p.answers_json);
  eq(answers.length, res.items.length, `${label} : payload, toutes les réponses transmises`);
  eq(p.red_flags_count, res.red_flags.length, `${label} : payload, décompte des red flags`);
  /* forfait_jours n'a de sens que si le module de la convention le pose. */
  if (res.context.collective_agreement_idcc !== '1486') eq(p.forfait_jours, '', `${label} : forfait_jours vide hors module Syntec`);
}

group('Profils de recette');
let biggestEmail = { bytes: 0, profile: null };
for (const profile of P.PROFILES) {
  const ctx = P.contextFor(profile, CFG);
  const answers = P.answersFor(profile, CFG);
  const res = E.evaluate(ctx, answers, CFG);
  invariants(res, profile.id);

  /* Déterminisme : deux évaluations identiques produisent le même résultat. */
  eq(JSON.stringify(E.evaluate(ctx, answers, CFG)), JSON.stringify(res), `${profile.id} : évaluation déterministe`);

  const payload = E.buildPayload({
    result: res, context: ctx, contact: { firstname: 'Test', lastname: 'Recette', email: 'test@example.org', company: 'ACME' },
    utm: { utm_source: 'test' }, meta: { audit_id: 'arh_test', completed_at: '2026-10-26T09:00:00Z', page_url: 'https://example.org/audit' }
  }, CFG);
  payloadChecks(payload, res, profile.id);

  const email = RE.build(res, payload, CFG, { meeting_url: 'https://example.org/rendez-vous' });
  ok(email.subject && email.html.length > 2000, `${profile.id} : email de rapport produit`);
  ok(email.html.indexOf('<h1') >= 0 && email.html.indexOf('Test') >= 0, `${profile.id} : email personnalisé`);
  ok(email.html.indexOf('undefined') < 0 && email.html.indexOf('[object Object]') < 0, `${profile.id} : email sans valeur technique visible`);
  const bytes = Buffer.byteLength(email.html) + Buffer.byteLength(JSON.stringify(payload));
  if (bytes > biggestEmail.bytes) biggestEmail = { bytes, profile: profile.id };
}

group('Attendus métier par profil');
{
  const run = id => {
    const pr = P.PROFILES.find(x => x.id === id);
    return E.evaluate(P.contextFor(pr, CFG), P.answersFor(pr, CFG), CFG);
  };
  const fragile = run('pme_fragile');
  ok(fragile.red_flags.length >= 1, 'PME peu structurée : au moins un sujet à sécuriser');
  ok(!fragile.very_good, 'PME peu structurée : pas de « très bon résultat »');
  const mature = run('tres_mature');
  ok(mature.very_good, 'organisation très mature : « très bon résultat »');
  eq(mature.areas_to_structure.length, 0, 'organisation très mature : aucun axe à structurer');
  const mixed = run('score_eleve_red_flag');
  ok(mixed.red_flags.length >= 1, 'score élevé avec red flag : le sujet remonte');
  eq(mixed.very_good, false, 'score élevé avec red flag : jamais présenté comme très bon résultat');
  ok(/sécuriser/.test(mixed.global.text), 'score élevé avec red flag : la moyenne ne masque pas le sujet');
  const tpe = run('tpe_sans_cse');
  const er = tpe.pillars.find(p => p.id === 'employee_relations');
  eq(er.evaluated, false, 'TPE sans CSE : pilier Relations sociales non évalué');
  ok(tpe.global.display_score !== null, 'TPE sans CSE : score global calculé malgré un pilier non évalué');
  const syntec = run('syntec_forfait_jours');
  ok(syntec.items.some(it => it.question_id === 'CCN1486_FJ'), 'Syntec + forfait jours : la question conventionnelle est posée');
  const metal = run('pme_metallurgie');
  ok(metal.items.some(it => it.question_id === 'CCN3248_CLASSIF'), 'Métallurgie : contrôle classification posé');
  ok(metal.items.some(it => it.question_id === 'CCN3248_MINIMA'), 'Métallurgie : contrôle minima posé');
  const grouped = metal.roadmap.find(a => a.group_id === 'metallurgie_classif_minima');
  ok(grouped, 'Métallurgie : classification et minima regroupés en une action de roadmap');
  if (grouped) eq(grouped.related_questions.length, 2, 'Métallurgie : l\'action regroupée porte les deux questions');
  /* Le regroupement ne concerne que la roadmap : le constat réglementaire reste listé seul. */
  ok(metal.red_flags.some(a => a.question_id === 'CCN3248_MINIMA'), 'Métallurgie : le constat « minima » reste un sujet à sécuriser distinct');
  eq(metal.roadmap.filter(a => a.question_id === 'CCN3248_MINIMA' || a.question_id === 'CCN3248_CLASSIF').length, 0,
    'Métallurgie : les deux questions ne sont plus listées séparément dans la roadmap');
  ok(metal.lead_interest.includes('metallurgie_minima'), 'Métallurgie : signal commercial minima');
  ok(metal.lead_interest.includes('metallurgie_classification'), 'Métallurgie : signal commercial classification');
}

group('Applicabilité conventionnelle');
{
  const base = { respondent_role: 'drh', company_size: '50-249', has_cse: 'yes', hr_organization: 'hr_team' };
  const ids = ctx => E.questionsFor(ctx, CFG).map(q => q.id);
  ok(!ids(base).includes('CCN1486_FJ'), 'aucune convention : pas de question Syntec');
  const syntecNo = Object.assign({}, base, E.agreementContext('1486', CFG), { forfait_jours: 'no' });
  ok(!ids(syntecNo).includes('CCN1486_FJ'), 'Syntec sans forfait jours : question non posée');
  const syntecYes = Object.assign({}, base, E.agreementContext('1486', CFG), { forfait_jours: 'yes' });
  ok(ids(syntecYes).includes('CCN1486_FJ'), 'Syntec avec forfait jours : question posée');
  const metal = Object.assign({}, base, E.agreementContext('3248', CFG));
  ok(ids(metal).includes('CCN3248_CLASSIF') && ids(metal).includes('CCN3248_MINIMA'), 'Métallurgie : deux contrôles posés');
  ok(!ids(metal).includes('CCN1486_FJ'), 'Métallurgie : aucune question Syntec');
  const noCcn = Object.assign({}, base, E.agreementContext('none', CFG));
  ok(!ids(noCcn).some(id => id.startsWith('CCN')), 'pas de convention : aucune question conventionnelle');
  /* Utiliser le forfait jours n'est jamais un problème en soi : seule la réponse peut l'être. */
  const yes = E.evaluate(syntecYes, Object.assign(answersAll(syntecYes, 'yes', 'D'), { CCN1486_FJ: 'yes' }), CFG);
  eq(yes.red_flags.filter(a => a.question_id === 'CCN1486_FJ').length, 0, 'forfait jours vérifié : aucun sujet à sécuriser');
  const no = E.evaluate(syntecYes, Object.assign(answersAll(syntecYes, 'yes', 'D'), { CCN1486_FJ: 'no' }), CFG);
  eq(no.red_flags.filter(a => a.question_id === 'CCN1486_FJ').length, 1, 'forfait jours non vérifié : sujet à sécuriser');
}

group('Garde-fou juridique (release)');
{
  const ctx = { respondent_role: 'drh', company_size: '250-999', has_cse: 'yes', hr_organization: 'hr_team',
    collective_agreement_idcc: null, collective_agreement_known: 'unknown' };
  const live = E.questionsFor(ctx, CFG).length;
  const strict = E.questionsFor(ctx, CFG_STRICT).length;
  ok(live > strict, `configuration de sortie : ${live} questions posées contre ${strict} avec le garde-fou strict`);
  const resStrict = E.evaluate(ctx, answersAll(ctx, 'no', 'A', CFG_STRICT), CFG_STRICT);
  eq(resStrict.red_flags.length, 0, 'garde-fou strict : aucun red flag possible (aucune règle relue)');
  const resLive = E.evaluate(ctx, answersAll(ctx, 'no', 'A'), CFG);
  ok(resLive.red_flags.length > 0, 'configuration de sortie : les red flags fonctionnent');
  /* Les deux règles encore à valider restent désactivées dans les deux configurations. */
  for (const cfg of [CFG, CFG_STRICT]) {
    const ids = E.questionsFor(Object.assign({}, ctx, { company_size: '1000+' }), cfg).map(q => q.id);
    ok(!ids.includes('Q24'), 'Q24 (transparence salariale) désactivée : directive non transposée');
    ok(!ids.includes('C6'), 'C6 (état des lieux) désactivée : applicabilité à documenter');
  }
}

group('Échappement des données saisies');
{
  const pr = P.PROFILES[0];
  const ctx = P.contextFor(pr, CFG);
  const res = E.evaluate(ctx, P.answersFor(pr, CFG), CFG);
  const hostile = '<script>alert(1)</script>"\'&';
  const payload = E.buildPayload({ result: res, context: ctx,
    contact: { firstname: hostile, lastname: hostile, email: 'a@b.co', company: hostile }, utm: {}, meta: {} }, CFG);
  const email = RE.build(res, payload, CFG, { meeting_url: 'https://example.org/rdv' });
  ok(email.html.indexOf('<script') < 0, 'email : balise script neutralisée');
  ok(email.html.indexOf('&lt;script&gt;') >= 0, 'email : saisie échappée et conservée');
  const url = RE.build(res, payload, CFG, { meeting_url: '" onload="alert(1)' });
  ok(url.html.indexOf('" onload="') < 0, 'email : URL de rendez-vous échappée dans l\'attribut');
}

/* ==================================================================
 * 3. Balayage de tous les contextes
 * ================================================================== */
function answersAll(ctx, cAnswer, mAnswer, cfg = CFG) {
  const out = {};
  for (const q of E.questionsFor(ctx, cfg)) out[q.id] = q.type === 'M' ? mAnswer : cAnswer;
  return out;
}

group('Balayage exhaustif des contextes');
{
  const roles = Q.CONTEXT.find(f => f.id === 'respondent_role').options.map(o => o.id);
  const sizes = Q.CONTEXT.find(f => f.id === 'company_size').options.map(o => o.id);
  const cses = Q.CONTEXT.find(f => f.id === 'has_cse').options.map(o => o.id).concat([undefined]);
  const orgs = Q.CONTEXT.find(f => f.id === 'hr_organization').options.map(o => o.id);
  const ccns = ['1486', '3248', '2120', 'unknown', 'none'];
  const cPairs = [['yes', 'D'], ['partial', 'C'], ['no', 'B'], ['unknown', 'A']];

  let contexts = 0, evaluations = 0, crashed = 0;
  const problems = [];
  for (const size of sizes) {
    for (const role of roles) {
      for (const cse of cses) {
        for (const org of orgs) {
          for (const ccn of ccns) {
            const ctx = { respondent_role: role, company_size: size, hr_organization: org };
            if (cse !== undefined) ctx.has_cse = cse;
            Object.assign(ctx, E.agreementContext(ccn, CFG) || {});
            if (ccn === '1486') ctx.forfait_jours = 'yes';
            if (org === 'other') ctx.hr_organization_other = 'DAF à temps partagé';
            contexts++;
            const qs = E.questionsFor(ctx, CFG);
            if (!qs.length) problems.push(`contexte sans question : ${JSON.stringify(ctx)}`);
            for (const [c, m] of cPairs) {
              try {
                const res = E.evaluate(ctx, answersAll(ctx, c, m), CFG);
                evaluations++;
                if (!res.complete) problems.push(`incomplet : ${size}/${role}/${ccn} ${c}`);
                if (res.global.display_score < 0 || res.global.display_score > 100) problems.push(`score hors bornes : ${size}/${ccn} ${c}`);
                const seen = new Set();
                for (const a of res.roadmap) {
                  for (const id of [a.question_id, ...(a.related_questions || [])].filter(Boolean)) {
                    if (seen.has(id)) problems.push(`doublon roadmap ${id} : ${size}/${role}/${ccn} ${c}`);
                    seen.add(id);
                  }
                }
                if (res.very_good && (res.red_flags.length || res.critical.length)) problems.push(`très bon résultat incohérent : ${size}/${ccn} ${c}`);
                const pay = E.buildPayload({ result: res, context: ctx, contact: {}, utm: {}, meta: {} }, CFG);
                RE.build(res, pay, CFG, {});
              } catch (e) {
                crashed++;
                problems.push(`exception ${size}/${role}/${ccn} ${c} : ${e.message}`);
              }
            }
          }
        }
      }
    }
  }
  ok(crashed === 0, `aucune exception sur ${evaluations} évaluations (${crashed} échecs)`);
  ok(problems.length === 0, `aucun écart d'invariant sur ${contexts} contextes` + (problems.length ? ' — ' + problems.slice(0, 5).join(' | ') : ''));
  console.log(`    ${contexts} contextes × ${cPairs.length} jeux de réponses = ${evaluations} évaluations`);
}

group('Réponses aléatoires');
{
  let seed = 20261026;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const sizes = Q.CONTEXT.find(f => f.id === 'company_size').options.map(o => o.id);
  let runs = 0; const problems = [];
  for (let i = 0; i < 400; i++) {
    const size = sizes[Math.floor(rnd() * sizes.length)];
    const ctx = { respondent_role: 'drh', company_size: size, hr_organization: 'hr_team' };
    if (size !== '1-10') ctx.has_cse = ['yes', 'no', 'in_progress'][Math.floor(rnd() * 3)];
    const ccn = ['1486', '3248', 'unknown', 'none'][Math.floor(rnd() * 4)];
    Object.assign(ctx, E.agreementContext(ccn, CFG));
    if (ccn === '1486') ctx.forfait_jours = ['yes', 'no', 'unknown'][Math.floor(rnd() * 3)];
    const answers = {};
    for (const q of E.questionsFor(ctx, CFG)) {
      const opts = E.answerOptions(q, CFG);
      answers[q.id] = opts[Math.floor(rnd() * opts.length)].id;
    }
    try {
      const res = E.evaluate(ctx, answers, CFG);
      runs++;
      if (!res.complete) problems.push('incomplet');
      /* Toutes les réponses « non applicable » : plus aucun score, le moteur ne doit pas casser. */
      if (res.global.score !== null && (res.global.display_score < 0 || res.global.display_score > 100)) problems.push('score hors bornes');
      const pay = E.buildPayload({ result: res, context: ctx, contact: {}, utm: {}, meta: {} }, CFG);
      if (JSON.stringify(pay).indexOf('undefined') >= 0) problems.push('payload avec undefined');
      RE.build(res, pay, CFG, {});
    } catch (e) { problems.push('exception : ' + e.message); }
  }
  ok(problems.length === 0, `${runs} tirages aléatoires sans écart` + (problems.length ? ' — ' + problems.slice(0, 3).join(' | ') : ''));
}

group('Cas limites');
{
  const ctx = { respondent_role: 'drh', company_size: '50-249', has_cse: 'yes', hr_organization: 'hr_team',
    collective_agreement_known: 'none', collective_agreement_idcc: null };
  const empty = E.evaluate(ctx, {}, CFG);
  eq(empty.complete, false, 'aucune réponse : résultat incomplet');
  ok(empty.missing.length > 0, 'aucune réponse : questions manquantes listées');
  eq(empty.global.score, null, 'aucune réponse : pas de score');
  eq(empty.red_flags.length, 0, 'aucune réponse : aucun red flag');

  const partial = E.evaluate(ctx, { Q1: 'yes' }, CFG);
  eq(partial.complete, false, 'réponses partielles : résultat incomplet');

  /* Toutes les questions à « non applicable » quand c'est permis : aucun score, aucune exception. */
  const na = {};
  for (const q of E.questionsFor(ctx, CFG)) {
    const opts = E.answerOptions(q, CFG);
    na[q.id] = (opts.find(o => o.id === 'na') || opts[opts.length - 1]).id;
  }
  const resNa = E.evaluate(ctx, na, CFG);
  ok(resNa.complete, '« non applicable » partout : résultat complet');
  ok(resNa.pillars.every(p => !p.evaluated || p.display_score !== null), '« non applicable » partout : piliers cohérents');

  const bad = E.evaluate(ctx, { Q1: 'reponse_inexistante' }, CFG);
  ok(bad.missing.includes('Q1'), 'réponse inconnue traitée comme absente');
  ok(E.evaluate(null, null, CFG).missing.length > 0, 'contexte et réponses nuls tolérés');
  ok(E.evaluate({}, {}, CFG).questions_count > 0, 'contexte vide : des questions restent posées');
}

/* ================================================================== */
console.log('');
console.log(`  taille maximale transmise au webhook : ${(biggestEmail.bytes / 1024).toFixed(1)} Ko (profil ${biggestEmail.profile}, rapport HTML + payload)`);
console.log('');
if (failures.length) {
  for (const f of failures) console.error('  ÉCHEC — ' + f);
  console.error(`\n${failures.length} échec(s) sur ${pass + failures.length} assertions.\n`);
  process.exit(1);
}
console.log(`${pass} assertions vérifiées, aucun échec.\n`);
