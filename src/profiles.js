/*!
 * Audit RH 360° — profils de test (maquette et tests automatisés).
 * Chaque profil = un contexte + une réponse par défaut par type + des réponses ciblées.
 * Les réponses aux questions non posées sont ignorées par le moteur.
 */
(function (root) {
  'use strict';

  var PROFILES = [
    { id: 'pme_fragile', label: 'PME peu structurée · plusieurs red flags',
      context: { respondent_role: 'ceo', company_size: '11-49', has_cse: 'no', collective_agreement: '', hr_organization: 'leadership' },
      base: { C: 'no', M: 'A' },
      answers: { Q1: 'partial', Q2: 'unknown', Q3: 'partial', Q5: 'B', Q7: 'B', Q13: 'B', Q15: 'B', Q18: 'B', Q21: 'B', Q26: 'B', Q28: 'B' } },

    { id: 'pme_intermediaire', label: 'PME intermédiaire',
      context: { respondent_role: 'rrh', company_size: '50-249', has_cse: 'yes', collective_agreement: 'Syntec', hr_organization: 'small_team' },
      base: { C: 'yes', M: 'C' },
      answers: { Q1: 'partial', Q3: 'partial', C3: 'partial', C4: 'na', Q10: 'B', Q12: 'B', Q16: 'A', Q19: 'B', Q20: 'B', Q22: 'B', Q23: 'B', Q27: 'B', Q29: 'B', Q31: 'B', Q32: 'B' } },

    { id: 'eti_data', label: 'ETI mature, faible sur data / pilotage',
      context: { respondent_role: 'drh', company_size: '250-999', has_cse: 'yes', collective_agreement: 'Métallurgie', hr_organization: 'internal_team' },
      base: { C: 'yes', M: 'D' },
      answers: { Q6: 'B', Q16: 'B', Q27: 'B', Q29: 'B', Q30: 'A', Q31: 'A', Q32: 'A', Q12: 'C', Q20: 'C' } },

    { id: 'tres_mature', label: 'Organisation très mature · aucun problème significatif',
      context: { respondent_role: 'drh', company_size: '1000+', has_cse: 'yes', collective_agreement: 'Banque', hr_organization: 'internal_team' },
      base: { C: 'yes', M: 'D' },
      answers: { Q16: 'C', Q20: 'C', Q31: 'C', Q12: 'C', Q19: 'C' } },

    { id: 'score_eleve_red_flag', label: 'Score élevé avec un red flag réglementaire',
      context: { respondent_role: 'head_of_people', company_size: '250-999', has_cse: 'yes', collective_agreement: '', hr_organization: 'internal_team' },
      base: { C: 'yes', M: 'D' },
      answers: { Q25: 'no', Q16: 'C', Q20: 'C', Q31: 'C' } },

    { id: 'tpe_sans_cse', label: 'TPE sans CSE (pilier « Relations sociales » non évalué)',
      context: { respondent_role: 'ceo', company_size: '1-10', has_cse: 'unknown', collective_agreement: '', hr_organization: 'external' },
      base: { C: 'yes', M: 'C' },
      answers: { Q1: 'partial', Q8: 'B', Q13: 'B', Q19: 'B', Q22: 'A', Q29: 'B', Q30: 'B', Q32: 'B' } }
  ];

  /* Réponses complètes d'un profil, pour toutes les questions de la configuration. */
  function answersFor(profile, cfg) {
    var out = {};
    cfg.Q.QUESTIONS.forEach(function (q) {
      var a = profile.answers[q.id] !== undefined ? profile.answers[q.id] : profile.base[q.type];
      if (a !== undefined) out[q.id] = a;
    });
    return out;
  }

  var API = { PROFILES: PROFILES, answersFor: answersFor };
  root.ARH_PROFILES = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
