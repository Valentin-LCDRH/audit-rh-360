/*!
 * Audit RH 360° — profils de test (maquette et tests automatisés).
 * Chaque profil = un contexte + une réponse par défaut par type + des réponses ciblées.
 * Les réponses aux questions non posées sont ignorées par le moteur.
 */
(function (root) {
  'use strict';

  var PROFILES = [
    { id: 'pme_fragile', label: 'PME peu structurée · plusieurs red flags',
      context: { respondent_role: 'ceo', company_size: '11-49', has_cse: 'no', hr_organization: 'leadership' }, ccn: 'unknown',
      base: { C: 'no', M: 'A' },
      answers: { Q1: 'partial', Q2: 'unknown', Q3: 'partial', Q5: 'B', Q7: 'B', Q13: 'B', Q15: 'B', Q18: 'B', Q21: 'B', Q26: 'B', Q28: 'B' } },

    { id: 'pme_intermediaire', label: 'PME intermédiaire',
      context: { respondent_role: 'drh', company_size: '50-249', has_cse: 'yes', hr_organization: 'small_team', forfait_jours: 'no' }, ccn: '1486',
      base: { C: 'yes', M: 'C' },
      answers: { Q1: 'partial', Q3: 'partial', C3: 'partial', C4: 'na', Q10: 'B', Q12: 'B', Q16: 'A', Q19: 'B', Q20: 'B', Q22: 'B', Q23: 'B', Q27: 'B', Q29: 'B', Q31: 'B', Q32: 'B' } },

    { id: 'eti_data', label: 'ETI mature, faible sur data / pilotage',
      context: { respondent_role: 'drh', company_size: '250-999', has_cse: 'yes', hr_organization: 'internal_team' }, ccn: '3248',
      base: { C: 'yes', M: 'D' },
      answers: { Q6: 'B', Q16: 'B', Q27: 'B', Q29: 'B', Q30: 'A', Q31: 'A', Q32: 'A', Q12: 'C', Q20: 'C' } },

    { id: 'tres_mature', label: 'Organisation très mature · aucun problème significatif',
      context: { respondent_role: 'drh', company_size: '1000+', has_cse: 'yes', hr_organization: 'internal_team' }, ccn: '2120',
      base: { C: 'yes', M: 'D' },
      answers: { Q16: 'C', Q20: 'C', Q31: 'C', Q12: 'C', Q19: 'C' } },

    { id: 'score_eleve_red_flag', label: 'Score élevé avec un red flag réglementaire',
      context: { respondent_role: 'drh', company_size: '250-999', has_cse: 'yes', hr_organization: 'internal_team' }, ccn: 'unknown',
      base: { C: 'yes', M: 'D' },
      answers: { Q25: 'no', Q16: 'C', Q20: 'C', Q31: 'C' } },

    { id: 'tpe_sans_cse', label: 'TPE sans CSE (pilier « Relations sociales » non évalué)',
      context: { respondent_role: 'ceo', company_size: '1-10', has_cse: 'unknown', hr_organization: 'external' }, ccn: 'none',
      base: { C: 'yes', M: 'C' },
      answers: { Q1: 'partial', Q8: 'B', Q13: 'B', Q19: 'B', Q22: 'A', Q29: 'B', Q30: 'B', Q32: 'B' } },

    { id: 'syntec_forfait_jours', label: 'ESN Syntec · forfaits jours à vérifier',
      context: { respondent_role: 'drh', company_size: '50-249', has_cse: 'yes', hr_organization: 'small_team', forfait_jours: 'yes' }, ccn: '1486',
      base: { C: 'yes', M: 'C' },
      answers: { CCN1486_FJ: 'partial', Q16: 'B', Q19: 'B', Q31: 'B' } },

    { id: 'pme_metallurgie', label: 'PME industrielle Métallurgie · classification et minima à revoir',
      context: { respondent_role: 'daf', company_size: '50-249', has_cse: 'yes', hr_organization: 'leadership' }, ccn: '3248',
      base: { C: 'yes', M: 'C' },
      answers: { CCN3248_CLASSIF: 'partial', CCN3248_MINIMA: 'unknown', Q8: 'B', Q19: 'B', Q22: 'B', Q23: 'B' } }
  ];

  /* Contexte complet : convention normalisée via le moteur (jamais un libellé tapé à la main). */
  function contextFor(profile, cfg) {
    var ctx = JSON.parse(JSON.stringify(profile.context));
    var v = profile.ccn ? root.ARH_ENGINE.agreementContext(profile.ccn, cfg) : null;
    Object.keys(v || {}).forEach(function (k) { ctx[k] = v[k]; });
    return ctx;
  }

  /* Réponses complètes d'un profil, pour toutes les questions de la configuration. */
  function answersFor(profile, cfg) {
    var out = {};
    cfg.Q.QUESTIONS.forEach(function (q) {
      var a = profile.answers[q.id] !== undefined ? profile.answers[q.id] : profile.base[q.type];
      if (a !== undefined) out[q.id] = a;
    });
    return out;
  }

  var API = { PROFILES: PROFILES, answersFor: answersFor, contextFor: contextFor };
  root.ARH_PROFILES = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
