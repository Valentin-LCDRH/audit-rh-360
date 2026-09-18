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
 * Périmètre V1 FIGÉ (2026-09-18) : Syntec (IDCC 1486) → forfait jours ; Métallurgie (IDCC 3248) →
 * classification + minima. Aucune troisième convention sans validation.
 * `roadmap_groups` (facultatif) : regroupe dans la roadmap des contrôles liés qui ressortent ensemble.
 */
(function (root) {
  'use strict';

  var SYNTEC = { field: 'collective_agreement_idcc', in: ['1486'] };
  var METALLURGIE = { field: 'collective_agreement_idcc', in: ['3248'] };

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

      ,

      /* Métallurgie : 2 contrôles distincts (la réponse à l'un n'est jamais déduite de l'autre).
         Aucune question préalable : la sélection de l'IDCC 3248 suffit. */
      '3248': {
        id: 'metallurgie',
        label: 'Métallurgie',
        context_questions: [],
        questions: [
          { id: 'CCN3248_CLASSIF', ccn_module: 'metallurgie', pillar: 'compliance', type: 'C', weight: 3, risk_level: 'eleve',
            short_label: 'Classification conventionnelle des emplois',
            action_title: 'Sécuriser la classification de vos emplois',
            question: 'Vos emplois ont-ils été décrits, cotés et classés selon le système de classification prévu par la convention collective de la métallurgie ?',
            help_text: 'La convention collective nationale de la métallurgie prévoit un système unique de classification fondé sur l\'emploi réellement tenu. Chaque emploi est décrit puis coté selon les critères conventionnels afin de déterminer sa classe et son groupe d\'emploi.',
            allow_na: false,
            legal_flag: true, legal_rule: ['LR_METALLURGIE_CLASSIFICATION'],
            red_flag_conditions: [{ answers: ['no', 'unknown'], obligation: 'LR_METALLURGIE_CLASSIFICATION' }],
            applicability: { all: [METALLURGIE] },
            area_text: 'Votre réponse indique que la classification de certains emplois pourrait nécessiter une revue au regard du référentiel de la branche Métallurgie.',
            recommendation_by_answer: {
              partial: 'Vérifier la description des emplois réellement tenus, leur cotation selon les critères conventionnels et leur classement dans la classe et le groupe d\'emploi correspondants.',
              no: 'Décrire les emplois réellement tenus, les coter selon les critères conventionnels, puis les classer dans la classe et le groupe d\'emploi correspondants.',
              unknown: 'Vérifier si chaque emploi a été décrit, coté et classé selon le système de la convention collective, et comment le classement a été communiqué aux salariés.'
            },
            commercial_tags: ['metallurgie_classification', 'audit_rh'],
            source: 'legal_rules', verified_at: null },

          { id: 'CCN3248_MINIMA', ccn_module: 'metallurgie', pillar: 'compliance', type: 'C', weight: 3, risk_level: 'eleve',
            short_label: 'Minima conventionnels',
            action_title: 'Vérifier les minima conventionnels applicables',
            question: 'Avez-vous vérifié que les rémunérations de vos salariés respectent les minima conventionnels applicables à leur classification et à leur organisation du temps de travail ?',
            help_text: 'Les minima conventionnels applicables dépendent notamment de la classification des emplois. Certaines modalités d\'organisation du temps de travail peuvent avoir une incidence sur les montants applicables.',
            allow_na: false,
            legal_flag: true, legal_rule: ['LR_METALLURGIE_MINIMA'],
            red_flag_conditions: [{ answers: ['no', 'unknown'], obligation: 'LR_METALLURGIE_MINIMA' }],
            applicability: { all: [METALLURGIE] },
            area_text: 'Vos réponses indiquent qu\'une vérification de la cohérence entre classification, organisation du temps de travail et rémunération pourrait être pertinente.',
            recommendation_by_answer: {
              partial: 'Contrôler que les rémunérations pratiquées respectent les minima correspondant aux situations des salariés concernés.',
              no: 'Contrôler, salarié par salarié, que les rémunérations pratiquées respectent les minima correspondant à leur classement et à leur organisation du temps de travail.',
              unknown: 'Identifier les minima applicables à chaque situation (classement, organisation du temps de travail) et les comparer aux rémunérations pratiquées.'
            },
            commercial_tags: ['metallurgie_minima', 'compensation', 'audit_rh'],
            source: 'legal_rules', verified_at: null }
        ],
        /* Roadmap : si les deux sujets ressortent (réponse de score <= 50), une seule action regroupée.
           Les constats (sujets à sécuriser, axes) restent distincts. */
        roadmap_groups: [
          { id: 'metallurgie_classif_minima', questions: ['CCN3248_CLASSIF', 'CCN3248_MINIMA'], max_score: 50,
            title: 'Revoir classification et minima conventionnels',
            recommendation: 'Sécuriser la description et la cotation des emplois, leur classement conventionnel, puis vérifier la cohérence des rémunérations avec les minima applicables.',
            reason: 'Classification et minima conventionnels ressortent tous les deux : une revue commune évite de traiter deux fois le même sujet.' }
        ]
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
