/*
 * Audit RH 360° — tests du moteur (brief §46). Sans dépendance.
 * Ligne de commande : scripts/test.sh · Navigateur : test/engine.test.html
 */
(function () {
  'use strict';
  var E = globalThis.ARH_ENGINE, P = globalThis.ARH_PROFILES, CFG = E.defaultConfig();
  var out = typeof print === 'function' ? print : function (s) { console.log(s); };
  var results = [];

  function test(name, fn) {
    try { fn(); results.push({ name: name, ok: true }); }
    catch (e) { results.push({ name: name, ok: false, msg: e.message }); }
  }
  function ok(c, msg) { if (!c) throw new Error(msg || 'assertion'); }
  function eq(a, b, msg) {
    var same = typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) < 1e-9 : JSON.stringify(a) === JSON.stringify(b);
    if (!same) throw new Error((msg ? msg + ' : ' : '') + 'attendu ' + JSON.stringify(b) + ', obtenu ' + JSON.stringify(a));
  }
  function profile(id) { return P.PROFILES.filter(function (p) { return p.id === id; })[0]; }
  function run(id, cfg) { var p = profile(id); cfg = cfg || CFG; return E.evaluate(p.context, P.answersFor(p, cfg), cfg); }
  function all(ctx, C, M, over, cfg) {
    cfg = cfg || CFG;
    var a = {}; cfg.Q.QUESTIONS.forEach(function (q) { a[q.id] = q.type === 'C' ? C : M; });
    Object.keys(over || {}).forEach(function (k) { a[k] = over[k]; });
    return E.evaluate(ctx, a, cfg);
  }
  function ids(list) { return list.map(function (x) { return x.question_id || x.pillar; }); }
  function pillar(res, id) { return res.pillars.filter(function (p) { return p.id === id; })[0]; }
  var CTX50 = { respondent_role: 'drh', company_size: '50-249', has_cse: 'yes', collective_agreement: '', hr_organization: 'internal_team' };
  var CTX5 = { respondent_role: 'ceo', company_size: '1-10', has_cse: 'no', collective_agreement: '', hr_organization: 'leadership' };

  /* ================= Profils ================= */
  test('Profil 1 — PME peu structurée : plusieurs red flags, niveau « priorités à sécuriser »', function () {
    var r = run('pme_fragile');
    ok(r.complete, 'parcours complet');
    eq(ids(r.red_flags), ['Q2', 'Q9', 'Q17', 'Q25'], 'red flags');
    eq(r.global.level, 'to_secure');
    ok(r.lead_interest.indexOf('audit_rh') >= 0 && r.lead_interest.indexOf('drh_externalise') >= 0, 'tags audit_rh + drh_externalise');
    ok(!r.very_good);
    eq(r.roadmap[0].priority, 1, 'la roadmap commence par les red flags');
  });

  test('Profil 2 — PME structurée avec axes de maturité : aucun red flag, axes à structurer', function () {
    var r = run('pme_intermediaire');
    eq(r.red_flags.length, 0);
    ok(r.global.display_score >= 60 && r.global.display_score < 80, 'score ' + r.global.display_score);
    ok(r.areas_to_structure.length >= 3, 'axes');
    ok(r.critical.every(function (a) { return a.tone === 'critical_structure'; }), 'poids 3 + B = « À structurer en priorité »');
    ok(r.lead_interest.indexOf('audit_rh') < 0, 'pas d\'audit_rh sans sujet de sécurisation');
  });

  test('Profil 3 — ETI conforme mais faible data / pilotage', function () {
    var r = run('eti_data');
    eq(pillar(r, 'compliance').display_score, 100);
    eq(r.red_flags.length, 0);
    eq(r.lowest_pillar, 'hr_operations_data');
    ok(pillar(r, 'hr_operations_data').display_score < 40);
    ok(r.lead_interest.indexOf('orkest') >= 0, 'tag orkest');
    ok(r.lead_interest.indexOf('audit_rh') < 0, 'pas d\'audit_rh');
    ok(!r.very_good, 'un pilier faible empêche le cas « très bon »');
  });

  test('Profil 4 — Très mature : aucun faux problème', function () {
    var r = run('tres_mature');
    ok(r.global.display_score > 85, 'score > 85');
    ok(r.very_good, 'cas très bon résultat');
    eq(r.red_flags.length, 0); eq(r.critical.length, 0); eq(r.areas_to_structure.length, 0);
    ok(r.roadmap.every(function (a) { return a.priority >= 4; }), 'aucune priorité 1 à 3');
    ok(r.optimisations.length > 0 && r.optimisations.every(function (a) { return a.priority >= 4; }), 'seulement des optimisations');
    eq(r.strengths.length, 3); ok(!r.strengths_fallback);
    eq(r.lead_interest, [], 'aucun tag commercial forcé');
    eq(E.buildPayload({ result: r }).top_priorities, [], 'aucune « priorité » dans le payload');
  });

  test('Profil 5 — Nombreux « Non applicable » : exclus du score', function () {
    var cfg = E.withOverrides(CFG, { rules: { LR_ETAT_DES_LIEUX_PARCOURS: 'verified' } });
    var base = all(CTX50, 'yes', 'D', {}, cfg);
    var r = all(CTX50, 'yes', 'D', { C4: 'na', C6: 'na' }, cfg);
    eq(r.global.score, 100, 'N/A n\'abaisse pas le score');
    eq(r.global.scored_count, base.global.scored_count - 2);
    eq(pillar(r, 'employee_relations').applicable_count, pillar(base, 'employee_relations').applicable_count, 'questions applicables inchangées');
    var r2 = all(CTX50, 'yes', 'A', { C4: 'na', C6: 'na', Q5: 'D' }, cfg);
    var its = r2.items.filter(function (it) { return it.in_score; });
    var num = 0, den = 0; its.forEach(function (it) { num += it.score * it.weight; den += 100 * it.weight; });
    eq(r2.global.score, num / den * 100, 'formule pondérée hors N/A');
  });

  test('Profil 6 — Score élevé + red flag : le red flag reste prioritaire', function () {
    var r = run('score_eleve_red_flag');
    ok(r.global.display_score >= 80, 'score ' + r.global.display_score);
    eq(ids(r.red_flags), ['Q25']);
    eq(r.roadmap[0].question_id, 'Q25');
    ok(!r.very_good, 'pas de message « aucun sujet prioritaire »');
    ok(r.strengths.every(function (s) { return s.pillar !== 'management_qvct'; }), 'le pilier du red flag n\'est pas un point fort');
    eq(E.buildPayload({ result: r }).red_flags_count, 1);
    ok(/à sécuriser en priorité/.test(r.global.text), 'le texte global mentionne le sujet à sécuriser');
  });

  test('Profil 7 — Réponses entièrement négatives', function () {
    var r = all(CTX50, 'no', 'A');
    eq(r.global.score, 0);
    ok(r.pillars.filter(function (p) { return p.evaluated; }).every(function (p) { return p.score === 0; }));
    eq(r.strengths, []);
    ok(r.red_flags.length >= 7, 'red flags : ' + ids(r.red_flags));
    eq(r.global.level, 'to_secure');
  });

  test('Profil 8 — Réponses entièrement positives', function () {
    var r = all(CTX50, 'yes', 'D');
    eq(r.global.score, 100);
    ok(r.very_good);
    eq(r.roadmap, []); eq(r.optimisations, []);
    eq(r.strengths.length, 3);
  });

  test('Profil 9 — Abandon / reprise', function () {
    var now = new Date('2026-09-18T10:00:00Z');
    var state = { step: 'question', index: 7, context: CTX50, answers: { Q1: 'yes', Q2: 'partial' } };
    var raw = E.serializeProgress(state, now);
    eq(E.restoreProgress(raw, new Date('2026-09-20T10:00:00Z'), 30), state, 'reprise');
    eq(E.restoreProgress(raw, new Date('2026-11-01T10:00:00Z'), 30), null, 'expiration');
    eq(E.restoreProgress('{pas du json', now, 30), null, 'donnée corrompue');
    var r = E.evaluate(CTX50, state.answers);
    ok(!r.complete && r.missing.length === r.questions_count - 2, 'audit incomplet signalé');
  });

  test('Profil 10 — Mobile : vérification manuelle dans le navigateur (voir docs/QA-PHASE2.md)', function () { ok(true); });

  /* ================= Cas transverses ================= */
  test('Aucune UTM : champs vides, pas d\'erreur', function () {
    var u = E.resolveUtm('', null, CFG.R.utm_keys);
    eq(u.utm, { utm_source: '', utm_medium: '', utm_campaign: '', utm_content: '' });
    var p = E.buildPayload({ result: run('pme_intermediaire'), utm: u.utm });
    eq(p.utm_source, '');
  });

  test('UTM : l\'URL prime, sinon on garde celles de la visite', function () {
    var stored = JSON.stringify({ utm_source: 'linkedin', utm_campaign: 'rentree' });
    eq(E.resolveUtm('?utm_source=event&utm_medium=email', stored, CFG.R.utm_keys).utm.utm_source, 'event');
    eq(E.resolveUtm('?page=2', stored, CFG.R.utm_keys).utm.utm_campaign, 'rentree');
  });

  test('Données manquantes : aucune réponse, contact vide', function () {
    var r = E.evaluate(CTX50, {});
    eq(r.global.score, null); ok(!r.complete);
    ok(r.pillars.every(function (p) { return !p.evaluated; }));
    var p = E.buildPayload({ result: r });
    eq(p.email, ''); eq(p.global_score, null);
    eq(E.evaluate(CTX50, { Q1: 'réponse inconnue' }).missing.indexOf('Q1') >= 0, true, 'réponse invalide ignorée');
  });

  test('Retour arrière / modification d\'une réponse', function () {
    var p = profile('tres_mature'), a = P.answersFor(p, CFG);
    var before = E.evaluate(p.context, a);
    a.Q25 = 'unknown';
    var after = E.evaluate(p.context, a);
    eq(ids(after.red_flags), ['Q25']); ok(after.global.score < before.global.score);
    a.Q25 = 'yes';
    eq(E.evaluate(p.context, a).global.score, before.global.score, 'retour à l\'état initial');
  });

  test('Questions conditionnelles selon l\'effectif et le CSE', function () {
    function has(ctx, id) { return E.questionsFor(ctx).some(function (q) { return q.id === id; }); }
    ['Q4', 'Q9', 'C3', 'C4', 'C5', 'Q10', 'Q11', 'Q12'].forEach(function (id) { ok(!has(CTX5, id), id + ' absente pour 1-10 sans CSE'); });
    ['Q4', 'Q9', 'C3', 'C4', 'C5', 'Q11', 'Q12'].forEach(function (id) { ok(has(CTX50, id), id + ' présente pour 50-249'); });
    ok(!has(CTX50, 'Q24') && !has(CTX50, 'C6'), 'Q24 et C6 inactives (validation juridique)');
    var c11 = { company_size: '11-49', has_cse: 'no' };
    ok(has(c11, 'Q9') && !has(c11, 'Q11') && !has(c11, 'Q4'), '11-49 sans CSE : élections oui, instances non, RI non');
    ok(E.questionsFor(CTX5).length <= 36 && E.questionsFor(CTX50).length <= 36, 'volume <= 36');
  });

  test('Relations sociales non évaluée (1-10 sans CSE) : exclue du score, jamais 0 ni 100', function () {
    var r = all(CTX5, 'yes', 'D', { Q1: 'no' });
    var er = pillar(r, 'employee_relations');
    ok(!er.evaluated && er.score === null && er.display_score === null, 'non évalué');
    eq(er.level_label, 'Non évalué au regard de votre situation');
    eq(E.buildPayload({ result: r }).employee_relations_score, null);
    ok(r.global.score < 100 && r.global.score > 80, 'global calculé sur les autres piliers');
  });

  test('Changement d\'effectif après réponse : réponses conservées, prises en compte selon l\'applicabilité', function () {
    var a = { Q4: 'no', C3: 'no' };
    var big = E.evaluate(CTX50, a), small = E.evaluate({ company_size: '11-49', has_cse: 'yes' }, a);
    ok(ids(big.red_flags).indexOf('Q4') >= 0, 'RI compté à 50+');
    ok(small.items.every(function (it) { return it.question_id !== 'Q4' && it.question_id !== 'C3'; }), 'ignorées à 11-49');
    ok(ids(E.evaluate(CTX50, a).red_flags).indexOf('Q4') >= 0, 'retour à 50+ : réponse retrouvée');
  });

  test('Calcul des scores (exemple posé à la main)', function () {
    var r = E.evaluate(CTX5, { Q1: 'yes', Q2: 'partial', Q3: 'no' });
    eq(pillar(r, 'compliance').score, (100 * 3 + 50 * 3 + 0 * 2) / (100 * 8) * 100, 'pilier conformité = 56,25');
    eq(pillar(r, 'compliance').display_score, 56);
    var m = E.evaluate(CTX5, { Q5: 'B', Q6: 'C', Q7: 'D', Q8: 'A' });
    eq(pillar(m, 'payroll_admin').score, (33 * 3 + 67 * 2 + 100 * 2 + 0) / 1000 * 100);
    var both = E.evaluate(CTX5, { Q1: 'yes', Q2: 'partial', Q3: 'no', Q5: 'B', Q6: 'C', Q7: 'D', Q8: 'A' });
    eq(both.global.score, (450 + 433) / 1800 * 100, 'global = toutes questions pondérées (pas la moyenne des piliers)');
    ok(Math.abs(both.global.score - (56.25 + 43.3) / 2) > 0.1, 'différent de la moyenne simple');
  });

  test('Niveau déterminé sur le score affiché (79,6 → 80 → « Bien structuré »)', function () {
    eq(E.levelFor(80, CFG).id, 'structured'); eq(E.levelFor(79, CFG).id, 'consolidate');
    eq(E.levelFor(0, CFG).id, 'to_secure'); eq(E.levelFor(null, CFG), null);
  });

  test('Égalité entre piliers : départage déterministe par ordre des piliers', function () {
    var r = all(CTX50, 'yes', 'D');
    eq(r.strengths.map(function (s) { return s.pillar; }), ['compliance', 'payroll_admin', 'employee_relations']);
    var t = all(CTX50, 'yes', 'A', {});
    var ranks = t.pillars.filter(function (p) { return p.evaluated && p.score === 0; }).map(function (p) { return p.rank_from_bottom; });
    eq(ranks, ranks.slice().sort(function (a, b) { return a - b; }), 'rangs croissants selon l\'ordre');
  });

  test('Red flag = réponse + obligation applicable (jamais la réponse seule)', function () {
    var tpeCse = { company_size: '1-10', has_cse: 'yes' };
    var r = E.evaluate(tpeCse, { Q9: 'no' });
    ok(r.items.some(function (it) { return it.question_id === 'Q9'; }), 'Q9 posée (CSE déclaré)');
    eq(r.red_flags.length, 0, 'pas de red flag : obligation CSE non applicable sous 11');
    eq(E.evaluate({ company_size: '11-49', has_cse: 'yes' }, { Q9: 'no' }).red_flags.length, 1);
    var cfg = E.withOverrides(CFG, { rules: { LR_DUERP: 'legal_validation_required' } });
    ok(E.questionsFor(CTX50, cfg).every(function (q) { return q.id !== 'Q25'; }), 'règle non validée = question inactive');
    eq(E.evaluate(CTX50, { C4: 'unknown' }).red_flags.length, 0, 'C4 « Je ne sais pas » = vigilance');
    eq(E.evaluate(CTX50, { C4: 'no' }).red_flags.length, 1);
    eq(E.evaluate(CTX50, { Q3: 'no' }).red_flags.length, 0, 'Q3 : pas de red flag automatique');
    eq(E.evaluate(CTX50, { Q1: 'no' }).red_flags.length, 0, 'Q1 : pas de red flag');
  });

  test('C6 : red flag porté par l\'obligation, pas par la taille', function () {
    var cfg = E.withOverrides(CFG, { rules: { LR_ETAT_DES_LIEUX_PARCOURS: 'verified' } });
    eq(E.evaluate(CTX5, { C6: 'no' }, cfg).red_flags.length, 1, 'aussi sous 50 salariés');
  });

  test('Roadmap : ordre strict, sans doublon, deux tonalités en priorité 2', function () {
    ['pme_fragile', 'pme_intermediaire', 'eti_data', 'tpe_sans_cse'].forEach(function (id) {
      var r = run(id), seen = {};
      r.roadmap.forEach(function (a, i) {
        if (i) ok(a.priority >= r.roadmap[i - 1].priority, id + ' : ordre des priorités');
        (a.question_id ? [a.question_id] : a.related_questions).forEach(function (q) { ok(!seen[q], id + ' : doublon ' + q); seen[q] = true; });
        CFG.R.roadmap_action_fields.forEach(function (f) { ok(f in a, id + ' : champ ' + f); });
      });
    });
    var r = E.evaluate(CTX50, { Q5: 'B', Q6: 'D', Q7: 'D', Q8: 'A', Q1: 'partial', Q2: 'yes', Q3: 'yes', Q4: 'yes',
      Q13: 'B', Q14: 'D', Q15: 'D', Q16: 'D' });
    var byQ = {}; r.roadmap.forEach(function (a) { byQ[a.question_id] = a; });
    eq(byQ.Q8.priority, 2); eq(byQ.Q8.tone, 'critical');
    eq(byQ.Q5.priority, 2); eq(byQ.Q5.tone, 'critical_structure'); eq(byQ.Q5.status, 'À structurer en priorité');
    eq(byQ.Q13.priority, 4, 'B poids 2 = priorité 4');
    eq(byQ.Q1.priority, 4, 'Partiellement poids 3 = priorité 4');
    ok(r.red_flags.length === 0, 'B poids 3 jamais présenté comme red flag');
  });

  test('Aperçu gratuit : jusqu\'à 3 vraies priorités, jamais complété, optimisations si très bon résultat', function () {
    var vg = run('tres_mature');
    eq(vg.free_preview.mode, 'optimisations');
    ok(vg.free_preview.actions.every(function (a) { return a.priority >= 4; }), 'aucune « priorité » inventée');
    var one = all(CTX50, 'yes', 'D', { Q25: 'no', Q20: 'C' });
    eq(one.free_preview.mode, 'priorities');
    eq(one.free_preview.actions.map(function (a) { return a.question_id; }), ['Q25'], 'une seule action pertinente = une seule affichée');
    eq(one.free_preview.remaining_count, 1, 'la piste d\'optimisation reste dans le rapport');
    var many = run('pme_fragile');
    eq(many.free_preview.actions.length, 3);
    eq(many.free_preview.remaining_count, many.roadmap.length - 3);
    ['pme_intermediaire', 'eti_data', 'tpe_sans_cse', 'score_eleve_red_flag'].forEach(function (id) {
      ok(run(id).free_preview.actions.every(function (a) { return a.priority <= 4; }), id + ' : pas d\'optimisation affichée comme priorité');
    });
  });

  test('Wording adaptatif TPE : même question, même scoring, textes adaptés', function () {
    function q(ctx, id) { return E.questionsFor(ctx).filter(function (x) { return x.id === id; })[0]; }
    var big = { company_size: '50-249', has_cse: 'yes' };
    ok(/reproduite/.test(q(CTX5, 'Q13').question) && /homogène/.test(q(big, 'Q13').question), 'Q13');
    ok(/hausse des départs/.test(q(CTX5, 'Q27').question) && /dans une équipe/.test(q(big, 'Q27').question), 'Q27');
    ok(/encadrent/.test(q(CTX5, 'Q28').question) && /managers/.test(q(big, 'Q28').question), 'Q28');
    eq(q(CTX5, 'Q13').weight, q(big, 'Q13').weight, 'même poids');
    ok(E.answerOptions(q(CTX5, 'Q28'), CFG).some(function (o) { return o.id === 'na'; }), 'Q28 : N/A pour une TPE');
    ok(!E.answerOptions(q(big, 'Q28'), CFG).some(function (o) { return o.id === 'na'; }), 'Q28 : pas de N/A au-delà');
    var withNa = E.evaluate(CTX5, { Q25: 'yes', Q26: 'D', Q27: 'D', Q28: 'na' });
    eq(pillar(withNa, 'management_qvct').score, 100, 'Q28 N/A exclue du score');
    eq(pillar(withNa, 'management_qvct').applicable_count, 4, 'toujours comptée comme posée');
    eq(withNa.items.filter(function (it) { return it.question_id === 'Q28'; })[0].variant_id, 'small', 'variante tracée');
    ok(/reproduire/.test(E.evaluate(CTX5, { Q13: 'A' }).roadmap[0].recommendation), 'recommandation de la variante');
  });

  test('Mesure de durée : questionnaire, piliers, plafond, retours et modifications', function () {
    var t0 = 1000000, m = E.newMetrics(t0);
    var q1 = { id: 'Q1', pillar: 'compliance' }, q5 = { id: 'Q5', pillar: 'payroll_admin' };
    E.openSegment(m, q1, t0 + 60000, 300);          // 60 s de contextualisation : non comptées
    E.openSegment(m, q5, t0 + 70000, 300);          // 10 s sur Q1
    E.closeSegment(m, t0 + 70000 + 3600000, 300);   // onglet abandonné 1 h : plafonné à 300 s
    m.back_count = 2; m.answer_changes = 1; m.results_at = t0 + 90000;
    var s2 = E.metricsSummary(m);
    eq(s2.pillar_duration_seconds, { compliance: 10, payroll_admin: 300 });
    eq(s2.questionnaire_duration_seconds, 310, 'hors contextualisation');
    eq(s2.audit_duration_seconds, 90, 'horloge murale Démarrer -> résultat');
    eq([s2.back_count, s2.answer_changes, s2.last_question_id, s2.last_pillar], [2, 1, 'Q5', 'payroll_admin']);
    eq(E.closeSegment(m, t0 + 99999999, 300).questionnaire_ms, 310000, 'segment déjà fermé : aucun ajout');
    var p = E.buildPayload({ result: run('pme_intermediaire'), meta: { metrics: s2 } });
    eq(p.audit_metrics.questionnaire_duration_seconds, 310, 'mesures jointes au payload');
  });

  test('Tags commerciaux : plusieurs possibles, drh_externalise exige l\'organisation RH', function () {
    ok(run('pme_fragile').lead_interest.length >= 2);
    var ctx = { respondent_role: 'drh', company_size: '50-249', has_cse: 'yes', hr_organization: 'internal_team' };
    var weak = all(ctx, 'no', 'A', { Q8: 'D' });
    ok(weak.lead_interest.indexOf('drh_externalise') < 0, 'équipe RH interne, pas de dépendance : pas de drh_externalise');
    var dep = all(ctx, 'no', 'A');
    ok(dep.lead_interest.indexOf('drh_externalise') >= 0, 'dépendance à une personne (Q8) : drh_externalise');
    var comp = all(CTX50, 'yes', 'D', { Q23: 'A' });
    ok(pillar(comp, 'compensation').display_score >= 60 && comp.lead_interest.indexOf('compensation') >= 0, 'signal critique de domaine au-dessus de 60');
    ok(run('tres_mature').lead_signals.length === 0);
    ok(run('pme_fragile').lead_signals.every(function (s) { return s.reasons.length > 0; }), 'chaque tag est justifié');
  });

  test('Activation / désactivation par configuration uniquement (Q24, Index)', function () {
    var on = E.withOverrides(CFG, { rules: { LR_TRANSPARENCE_SALARIALE: 'verified' } });
    ok(E.questionsFor(CTX50, on).some(function (q) { return q.id === 'Q24'; }), 'Q24 activable');
    var off = E.withOverrides(CFG, { questions: { C5: { enabled: false } } });
    ok(E.questionsFor(CTX50, off).every(function (q) { return q.id !== 'C5'; }), 'Index désactivable');
    ok(pillar(E.evaluate(CTX50, { Q21: 'D' }, off), 'compensation').evaluated);
  });

  test('Payload : tous les champs prévus, réponses complètes en JSON', function () {
    var r = run('pme_intermediaire');
    var p = E.buildPayload({ result: r, contact: { firstname: ' Léa ', lastname: 'Martin', email: 'lea@exemple.fr', company: 'ACME' }, meta: { audit_id: 'a1' } });
    var R = CFG.R.payload;
    [].concat(R.contact, R.context, R.scores, R.risks, R.roadmap, R.commercial, R.acquisition, R.meta, R.detail, [R.raw]).forEach(function (k) { ok(k in p, 'champ ' + k); });
    eq(p.firstname, 'Léa');
    eq(JSON.parse(p.answers_json).length, r.items.length);
    ok(p.pillar_details.every(function (d) { return 'applicable_count' in d; }), 'nb de questions applicables par pilier');
  });

  test('Textes produits : aucune formulation interdite', function () {
    P.PROFILES.forEach(function (pr) {
      var r = run(pr.id);
      var txt = JSON.stringify([r.roadmap, r.strengths, r.global.text, r.pillars.map(function (p) { return p.level_label; })]).toLowerCase();
      CFG.R.forbidden_wording.forEach(function (f) { ok(txt.indexOf(f) < 0, pr.id + ' : « ' + f + ' »'); });
    });
  });

  /* ================= Sortie ================= */
  var ko = results.filter(function (r) { return !r.ok; });
  results.forEach(function (r) { out((r.ok ? '  ✓ ' : '  ✗ ') + r.name + (r.ok ? '' : '\n      → ' + r.msg)); });
  out((ko.length ? 'ÉCHEC' : 'OK') + ' — ' + (results.length - ko.length) + ' / ' + results.length + ' tests au vert');
  globalThis.ARH_TEST_RESULTS = results;
  if (ko.length && typeof print === 'function') throw new Error(ko.length + ' test(s) en échec');
})();
