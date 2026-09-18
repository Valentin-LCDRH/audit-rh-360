/*!
 * Audit RH 360° — Le Club des RH
 * MODULES CONVENTIONNELS : IDCC -> questions de contextualisation + contrôles spécifiques.
 *
 * Principes (V1) :
 * - Un module se déclenche UNIQUEMENT sur `collective_agreement_idcc` (jamais sur un nom tapé).
 * - 1 à 2 contrôles réellement discriminants par convention, pas une checklist.
 * - `context_questions` : posées dans la contextualisation, juste après la convention collective ;
 *   elles servent à l'applicabilité et ne comptent JAMAIS dans le score.
 * - `questions` : même format que questions.js (pilier existant, type, poids, legal_rule, red flags…).
 *   Leur `applicability` doit contenir la condition d'IDCC.
 * - Ajouter un module = ajouter une entrée ici (+ sa règle dans legal-rules.js). Le moteur, l'interface,
 *   le scoring et le parcours ne changent pas.
 * - Une convention présente dans le sélecteur (ccn-list.js) n'a pas forcément de module.
 *
 * V1 : un seul module, Syntec (IDCC 1486), un seul sujet : le forfait annuel en jours.
 */
(function (root) {
  'use strict';

  var SYNTEC = { field: 'collective_agreement_idcc', in: ['1486'] };

  root.ARH_CCN_MODULES = {
    version: '2026-09-18',
    modules: {

      '1486': {
        id: 'syntec',
        label: 'Bureaux d\'études techniques, cabinets d\'ingénieurs-conseils et sociétés de conseils (Syntec)',
        context_questions: [
          { id: 'forfait_jours', required: true,
            label: 'Certains de vos salariés sont-ils au forfait annuel en jours ?',
            help_text: 'Le forfait annuel en jours décompte le temps de travail en jours plutôt qu\'en heures, généralement pour des cadres autonomes.',
            options: [
              { id: 'yes', label: 'Oui' },
              { id: 'no', label: 'Non' },
              { id: 'unknown', label: 'Je ne sais pas' }
            ] }
        ],
        questions: [
          { id: 'CCN1486_FJ', ccn_module: 'syntec', pillar: 'compliance', type: 'C', weight: 3, risk_level: 'eleve',
            short_label: 'Cadre des forfaits annuels en jours',
            action_title: 'Vérifier le cadre de vos forfaits jours',
            question: 'Avez-vous vérifié que vos conventions de forfait annuel en jours respectent les conditions prévues par votre convention collective et que leur suivi est correctement réalisé ?',
            help_text: 'La vérification porte notamment sur : l\'éligibilité des salariés concernés, la convention individuelle écrite, les conditions prévues par votre convention collective, le nombre de jours, la rémunération, le suivi de la charge de travail, le respect des temps de repos et les entretiens de suivi.',
            allow_na: false,
            legal_flag: true, legal_rule: ['LR_SYNTEC_FORFAIT_JOURS'],
            /* Red flag = réponse déclenchante + obligation vérifiée et applicable (IDCC 1486 ET forfait jours
               déclaré, portés par l'applicabilité de la question et de la règle). Utiliser le forfait jours
               n'est jamais un problème en soi. */
            red_flag_conditions: [{ answers: ['no', 'unknown'], obligation: 'LR_SYNTEC_FORFAIT_JOURS' }],
            applicability: { all: [SYNTEC, { field: 'forfait_jours', in: ['yes'] }] },
            area_text: 'Vos réponses indiquent qu\'une revue des conditions d\'éligibilité, de formalisation et de suivi de vos forfaits jours pourrait être pertinente.',
            recommendation_by_answer: {
              partial: 'Vérifier le cadre applicable à vos forfaits jours : revoir, salarié par salarié, l\'éligibilité, la convention individuelle écrite et le suivi de la charge de travail.',
              no: 'Vérifier le cadre applicable à vos forfaits jours : revoir l\'éligibilité des salariés concernés, les conventions individuelles écrites, les conditions conventionnelles et le suivi de la charge de travail.',
              unknown: 'Identifier les salariés au forfait jours, puis vérifier leurs conventions individuelles, les conditions conventionnelles applicables et le suivi réalisé.'
            },
            commercial_tags: ['audit_rh'],
            source: 'legal_rules', verified_at: null }
        ]
      }

    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
