/*!
 * Audit RH 360° — Le Club des RH
 * SOURCE DE VÉRITÉ MÉTIER : piliers, contextualisation, échelles de réponse, questions.
 *
 * Aucune question, aucun libellé de réponse ni aucun score ne doit être écrit dans l'interface :
 * tout vient d'ici. Les règles réglementaires (seuils, périodicités, sources) sont dans
 * legal-rules.js et référencées par leur identifiant (`legal_rule`), jamais recopiées.
 *
 * Conventions
 * - `type`   : 'C' (compliance, échelle C) ou 'M' (maturity, échelle M).
 * - `weight` : 1 secondaire · 2 important · 3 critique.
 * - `applicability` : null = toujours posée ; sinon condition déclarative (voir ARH_RULES.conditions
 *   dans scoring.js pour la grammaire). Une question non applicable est exclue du score.
 * - Activation : une question liée à des règles (`legal_rule`) reste INACTIVE tant qu'une de ses
 *   règles n'est pas au statut 'verified' dans legal-rules.js (voir LEGAL_VALIDATION_REQUIRED).
 * - `enabled` (facultatif, true par défaut) : interrupteur éditorial. `enabled: false` retire la question
 *   du parcours et du score sans toucher à l'interface ni au moteur (ex. désactiver l'Index égalité).
 * - `red_flag_conditions` : [{ answers, obligation }] — un red flag exige À LA FOIS une réponse
 *   déclenchante ET l'obligation `obligation` (legal-rules.js) vérifiée et applicable au contexte.
 * - `recommendation_by_answer` : texte d'action pour chaque réponse non maximale.
 * - `commercial_tags` : usage interne (qualification), JAMAIS affiché.
 */
(function (root) {
  'use strict';

  var EDITORIAL_SOURCE = 'Brief Audit RH 360° Le Club des RH (sept. 2026)';
  var EDITORIAL_DATE = '2026-09-18';

  /* ------------------------------------------------------------------
   * Échelles de réponse
   * ------------------------------------------------------------------ */
  var ANSWER_SCALES = {
    C: [
      { id: 'yes',     label: 'Oui, totalement',           score: 100 },
      { id: 'partial', label: 'Partiellement / à vérifier', score: 50 },
      { id: 'no',      label: 'Non / pas encore',          score: 0 },
      { id: 'unknown', label: 'Je ne sais pas',            score: 0, vigilance: true },
      { id: 'na',      label: 'Non applicable',            score: null }   // exclu du scoring
    ],
    /* Les lettres ne sont jamais affichées : l'utilisateur voit uniquement les situations. */
    M: [
      { id: 'A', score: 0 },
      { id: 'B', score: 33 },
      { id: 'C', score: 67 },
      { id: 'D', score: 100 }
    ]
  };

  /* ------------------------------------------------------------------
   * Les 8 piliers (ordre = ordre du parcours = ordre de départage en cas d'égalité)
   * `score_field` : nom du champ dans le payload CRM.
   * ------------------------------------------------------------------ */
  var PILLARS = [
    { id: 'compliance', order: 1, score_field: 'compliance_score',
      label: 'Conformité & fondamentaux RH', short_label: 'Fondamentaux RH',
      strength_text: 'Vos documents et registres de base semblent tenus et suivis.',
      weak_text: 'Plusieurs fondamentaux documentaires méritent une revue.' },
    { id: 'payroll_admin', order: 2, score_field: 'payroll_admin_score',
      label: 'Paie & administration RH', short_label: 'Paie & administration',
      strength_text: 'Votre paie et votre administration du personnel reposent sur des process fiables.',
      weak_text: 'La fiabilité de la paie et de l\'administration repose encore sur des personnes plus que sur des process.' },
    { id: 'employee_relations', order: 3, score_field: 'employee_relations_score',
      label: 'Relations sociales', short_label: 'Relations sociales',
      strength_text: 'Votre dialogue social est anticipé et suivi.',
      weak_text: 'Le dialogue social est géré de façon plutôt réactive.' },
    { id: 'recruitment', order: 4, score_field: 'recruitment_score',
      label: 'Recrutement & onboarding', short_label: 'Recrutement',
      strength_text: 'Vos recrutements et votre intégration suivent un cadre commun.',
      weak_text: 'Vos pratiques de recrutement et d\'intégration varient selon les équipes.' },
    { id: 'development', order: 5, score_field: 'development_score',
      label: 'Compétences & développement RH', short_label: 'Compétences',
      strength_text: 'Le développement des compétences est relié aux besoins de l\'entreprise.',
      weak_text: 'Le développement des compétences est peu anticipé.' },
    { id: 'compensation', order: 6, score_field: 'compensation_score',
      label: 'Rémunération & équité', short_label: 'Rémunération',
      strength_text: 'Vos décisions salariales reposent sur un cadre partagé et des données fiables.',
      weak_text: 'Les décisions salariales manquent d\'un cadre commun et de données pour les objectiver.' },
    { id: 'management_qvct', order: 7, score_field: 'management_qvct_score',
      label: 'Management, QVCT & prévention', short_label: 'Management & prévention',
      strength_text: 'La prévention est pilotée et vos managers sont outillés.',
      weak_text: 'La prévention et l\'accompagnement des managers restent peu structurés.' },
    { id: 'hr_operations_data', order: 8, score_field: 'hr_operations_data_score',
      label: 'Organisation, SIRH & pilotage RH', short_label: 'Pilotage RH',
      strength_text: 'Votre fonction RH est pilotée avec des priorités claires et des données fiables.',
      weak_text: 'La fonction RH manque encore d\'outils et de données pour piloter.' }
  ];

  /* ------------------------------------------------------------------
   * Contextualisation (avant le questionnaire, aucune coordonnée)
   * ------------------------------------------------------------------ */
  var CONTEXT = [
    { id: 'respondent_role', label: 'Votre fonction', required: true, options: [
      { id: 'ceo', label: 'Dirigeant / CEO' },
      { id: 'drh', label: 'DRH' },
      { id: 'rrh', label: 'RRH' },
      { id: 'head_of_people', label: 'Head of People / People Lead' },
      { id: 'daf', label: 'Responsable administratif / financier' },
      { id: 'other', label: 'Autre' }
    ] },
    { id: 'company_size', label: 'Effectif de votre entreprise', required: true,
      help_text: 'Indiquez l\'effectif habituel. Les obligations qui dépendent d\'un seuil s\'apprécient selon des règles de calcul précises : le diagnostic en tient compte de façon simplifiée.',
      options: [
        { id: '1-10', label: '1 à 10 salariés', min: 1, max: 10 },
        { id: '11-49', label: '11 à 49 salariés', min: 11, max: 49 },
        { id: '50-249', label: '50 à 249 salariés', min: 50, max: 249 },
        { id: '250-999', label: '250 à 999 salariés', min: 250, max: 999 },
        { id: '1000+', label: '1 000 salariés et plus', min: 1000, max: null }
      ] },
    { id: 'has_cse', label: 'Disposez-vous d\'un CSE ?', required: true, options: [
      { id: 'yes', label: 'Oui' },
      { id: 'no', label: 'Non' },
      { id: 'in_progress', label: 'En cours de mise en place' },
      { id: 'unknown', label: 'Non concerné / Je ne sais pas' }
    ] },
    { id: 'collective_agreement', label: 'Convention collective', required: false, free_text: true,
      placeholder: 'Ex. Syntec, Commerce de gros… (facultatif)' },
    { id: 'hr_organization', label: 'Qui porte les RH aujourd\'hui ?', required: true, options: [
      { id: 'internal_team', label: 'Une équipe RH structurée en interne' },
      { id: 'small_team', label: 'Une à deux personnes dédiées aux RH' },
      { id: 'leadership', label: 'Principalement la direction (dirigeant, DAF…)' },
      { id: 'external', label: 'Principalement un prestataire externe (expert-comptable, consultant…)' },
      { id: 'other', label: 'Autre organisation' }
    ] }
  ];

  /* Raccourcis de conditions (grammaire décrite dans scoring.js) */
  var SIZE_11_PLUS = { field: 'company_size', in: ['11-49', '50-249', '250-999', '1000+'] };
  var SIZE_50_PLUS = { field: 'company_size', in: ['50-249', '250-999', '1000+'] };
  var HAS_INSTANCES = { any: [ { field: 'has_cse', in: ['yes', 'in_progress'] }, SIZE_50_PLUS ] };

  /* ------------------------------------------------------------------
   * Questions
   * Champs obligatoires : voir validate-config.js (REQUIRED_QUESTION_FIELDS).
   * ------------------------------------------------------------------ */
  var QUESTIONS = [

    /* ============ Pilier 1 — Conformité & fondamentaux RH ============ */
    { id: 'Q1', pillar: 'compliance', type: 'C', weight: 3, risk_level: 'eleve',
      short_label: 'Modèles de contrats et documents salariés',
      question: 'Vos modèles de contrats de travail, avenants et documents remis aux salariés sont-ils régulièrement revus pour tenir compte des évolutions légales, conventionnelles et de vos pratiques internes ?',
      help_text: 'Contrats, avenants, notices, chartes : ce sont les documents qui engagent l\'entreprise au quotidien. Une revue régulière évite d\'utiliser des clauses devenues obsolètes.',
      allow_na: false,
      /* Pas d'obligation légale de « revue régulière » : bonne pratique de sécurisation documentaire. */
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [],
      applicability: null,
      area_text: 'Des modèles non revus peuvent contenir des clauses devenues inadaptées.',
      recommendation_by_answer: {
        partial: 'Réaliser une revue documentaire afin d\'identifier les modèles nécessitant une mise à jour ou une harmonisation.',
        no: 'Réaliser une revue documentaire afin d\'identifier les modèles nécessitant une mise à jour ou une harmonisation, puis planifier une revue annuelle.',
        unknown: 'Identifier qui est responsable des modèles de documents RH et vérifier la date de leur dernière mise à jour.'
      },
      commercial_tags: ['audit_rh'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'Q2', pillar: 'compliance', type: 'C', weight: 3, risk_level: 'eleve',
      short_label: 'Registre unique du personnel et registres RH',
      question: 'Votre registre unique du personnel et les autres registres RH applicables à votre entreprise sont-ils correctement tenus et à jour ?',
      help_text: 'Le registre unique du personnel recense chaque salarié dès son embauche. D\'autres registres peuvent s\'ajouter selon votre situation.',
      allow_na: false,   // obligation applicable dès le premier salarié
      legal_flag: true, legal_rule: ['LR_REGISTRE_PERSONNEL'],
      red_flag_conditions: [{ answers: ['no', 'unknown'], obligation: 'LR_REGISTRE_PERSONNEL' }],
      applicability: null,
      area_text: 'Les registres obligatoires doivent être tenus à jour en continu.',
      recommendation_by_answer: {
        partial: 'Contrôler la complétude du registre unique du personnel (entrées, sorties, mentions obligatoires) et lister les autres registres applicables.',
        no: 'Mettre à jour le registre unique du personnel en priorité et définir qui le tient à chaque entrée et sortie.',
        unknown: 'Vérifier l\'existence et la mise à jour du registre unique du personnel et des autres registres applicables.'
      },
      commercial_tags: ['audit_rh'],
      source: 'legal_rules', verified_at: null },

    { id: 'Q3', pillar: 'compliance', type: 'C', weight: 2, risk_level: 'modere',
      short_label: 'Informations et affichages obligatoires',
      question: 'Les informations et affichages obligatoires applicables à votre entreprise sont-ils à jour et correctement accessibles aux salariés ?',
      help_text: 'Certaines informations doivent être portées à la connaissance des salariés (affichage physique ou tout moyen accessible). La liste dépend notamment de votre effectif.',
      allow_na: false,
      legal_flag: true, legal_rule: ['LR_AFFICHAGES'],
      red_flag_conditions: [],   // poids 2 : remonte en priorité 2/4 selon la réponse, pas en red flag
      applicability: null,
      area_text: 'Les informations obligatoires évoluent avec la réglementation et l\'effectif.',
      recommendation_by_answer: {
        partial: 'Réaliser une revue des informations et affichages applicables à l\'entreprise.',
        no: 'Réaliser une revue des informations et affichages applicables à l\'entreprise et désigner un responsable de leur mise à jour.',
        unknown: 'Réaliser une revue des informations et affichages applicables à l\'entreprise.'
      },
      commercial_tags: ['audit_rh'],
      source: 'legal_rules', verified_at: null },

    { id: 'Q4', conditional_id: 'C1', pillar: 'compliance', type: 'C', weight: 3, risk_level: 'eleve',
      short_label: 'Règlement intérieur',
      question: 'Votre règlement intérieur est-il à jour au regard des obligations applicables à votre entreprise ?',
      help_text: 'Le règlement intérieur fixe notamment les règles d\'hygiène, de sécurité et de discipline. Sa mise à jour suit une procédure précise.',
      allow_na: false,
      legal_flag: true, legal_rule: ['LR_REGLEMENT_INTERIEUR'],
      red_flag_conditions: [{ answers: ['no', 'unknown'], obligation: 'LR_REGLEMENT_INTERIEUR' }],
      applicability: SIZE_50_PLUS,
      area_text: 'Le règlement intérieur doit suivre les évolutions réglementaires et internes.',
      recommendation_by_answer: {
        partial: 'Faire relire le règlement intérieur au regard des évolutions réglementaires et vérifier la procédure suivie lors de sa dernière modification.',
        no: 'Mettre en place ou actualiser le règlement intérieur en respectant la procédure applicable (consultation, dépôt, publicité).',
        unknown: 'Vérifier l\'existence du règlement intérieur, sa date de mise à jour et la procédure suivie.'
      },
      commercial_tags: ['audit_rh'],
      source: 'legal_rules', verified_at: null },

    /* ============ Pilier 2 — Paie & administration RH ============ */
    { id: 'Q5', pillar: 'payroll_admin', type: 'M', weight: 3, risk_level: 'eleve',
      short_label: 'Sécurisation du processus de paie',
      question: 'Comment qualifieriez-vous la sécurisation de votre processus de paie ?',
      help_text: 'Il s\'agit de la façon dont les éléments variables sont collectés, contrôlés et validés avant chaque paie.',
      answers: {
        A: 'Le processus repose encore largement sur des échanges manuels et des contrôles individuels.',
        B: 'Les principales étapes sont définies, mais certaines anomalies sont encore détectées tardivement.',
        C: 'La collecte des variables, les responsabilités et les contrôles sont clairement organisés.',
        D: 'Le processus est formalisé, tracé et permet d\'identifier les anomalies avant validation de la paie.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Des contrôles définis avant validation limitent les erreurs de paie et leurs régularisations.',
      recommendation_by_answer: {
        A: 'Cartographier le processus de paie (collecte des variables, responsables, échéances) et instaurer des contrôles avant validation.',
        B: 'Formaliser une liste de contrôles avant validation de la paie pour détecter les anomalies plus tôt.',
        C: 'Tracer les contrôles réalisés et suivre les anomalies récurrentes pour en traiter les causes.'
      },
      commercial_tags: ['orkest', 'drh_externalise'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'Q6', pillar: 'payroll_admin', type: 'M', weight: 2, risk_level: 'modere',
      short_label: 'Gestion des dossiers salariés',
      question: 'Comment sont gérées les données et pièces administratives des salariés ?',
      help_text: 'Contrats, pièces justificatives, informations personnelles et historiques administratifs.',
      answers: {
        A: 'Les informations sont dispersées entre plusieurs outils, fichiers ou échanges.',
        B: 'Une partie est centralisée, mais des recherches ou retraitements restent fréquents.',
        C: 'Les dossiers sont centralisés et globalement fiables.',
        D: 'Les données sont centralisées, à jour, facilement accessibles et leur complétude est contrôlée.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Des dossiers dispersés ralentissent la gestion et fragilisent la traçabilité.',
      recommendation_by_answer: {
        A: 'Définir un emplacement unique pour les dossiers salariés et la liste des pièces attendues par dossier.',
        B: 'Achever la centralisation des dossiers et supprimer les copies parallèles.',
        C: 'Mettre en place un contrôle périodique de complétude des dossiers.'
      },
      commercial_tags: ['orkest'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'Q7', pillar: 'payroll_admin', type: 'M', weight: 2, risk_level: 'modere',
      short_label: 'Entrées, mobilités et sorties',
      question: 'Dans quelle mesure vos entrées, changements de situation et sorties sont-ils sécurisés ?',
      help_text: 'Embauches, changements de poste ou de temps de travail, départs : les étapes administratives associées.',
      answers: {
        A: 'Ils dépendent principalement des habitudes de chaque personne.',
        B: 'Des process existent mais leur application est variable.',
        C: 'Des étapes et responsabilités communes sont clairement définies.',
        D: 'Les process sont standardisés, suivis et permettent d\'identifier rapidement les étapes manquantes.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Des étapes oubliées à l\'entrée ou à la sortie ont souvent des conséquences en paie.',
      recommendation_by_answer: {
        A: 'Formaliser une check-list commune pour les entrées, changements de situation et sorties.',
        B: 'Désigner un responsable par étape et vérifier l\'application des check-lists.',
        C: 'Suivre l\'avancement de chaque dossier pour repérer rapidement les étapes manquantes.'
      },
      commercial_tags: ['orkest'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'Q8', pillar: 'payroll_admin', type: 'M', weight: 3, risk_level: 'eleve',
      short_label: 'Continuité de l\'administration RH et de la paie',
      question: 'Si la personne clé en charge de votre administration RH / paie était absente pendant un mois, pourriez-vous assurer la continuité des principaux processus ?',
      help_text: 'Cette question mesure la dépendance de vos processus critiques à une seule personne.',
      answers: {
        A: 'Très difficilement.',
        B: 'Oui, mais avec des difficultés importantes.',
        C: 'Oui, grâce à des process et relais identifiés.',
        D: 'Oui, sans dégradation significative grâce à une organisation documentée et sécurisée.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Une dépendance à une seule personne fragilise la paie et l\'administration.',
      recommendation_by_answer: {
        A: 'Documenter les processus critiques (paie, déclarations, entrées/sorties) et désigner un relais formé.',
        B: 'Compléter la documentation des processus critiques et organiser un binôme ou un relais externe.',
        C: 'Tester périodiquement le relais identifié sur un cycle de paie complet.'
      },
      commercial_tags: ['drh_externalise', 'orkest'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    /* ============ Pilier 3 — Relations sociales ============ */
    { id: 'Q9', conditional_id: 'C2', pillar: 'employee_relations', type: 'C', weight: 3, risk_level: 'eleve',
      short_label: 'Élections des représentants du personnel',
      question: 'Les élections et renouvellements de vos représentants du personnel sont-ils correctement anticipés et organisés ?',
      help_text: 'Cela inclut le calendrier des mandats, le protocole préélectoral et, en l\'absence de candidat, le procès-verbal correspondant.',
      allow_na: false,
      legal_flag: true, legal_rule: ['LR_CSE'],
      red_flag_conditions: [{ answers: ['no', 'unknown'], obligation: 'LR_CSE' }],
      applicability: { any: [ SIZE_11_PLUS, { field: 'has_cse', in: ['yes', 'in_progress'] } ] },
      area_text: 'Les échéances électorales doivent être anticipées pour éviter une interruption de la représentation du personnel.',
      recommendation_by_answer: {
        partial: 'Établir le calendrier des mandats en cours et planifier les prochaines étapes électorales.',
        no: 'Vérifier votre situation au regard des seuils applicables et organiser les élections ou formaliser le procès-verbal adapté.',
        unknown: 'Vérifier la date de fin des mandats en cours, ou la date des dernières élections et du procès-verbal associé.'
      },
      commercial_tags: ['relations_sociales', 'audit_rh'],
      source: 'legal_rules', verified_at: null },

    { id: 'Q10', pillar: 'employee_relations', type: 'M', weight: 3, risk_level: 'eleve',
      short_label: 'Calendrier social',
      question: 'Comment gérez-vous votre calendrier social ?',
      help_text: 'Échéances sociales de l\'année : consultations, négociations, entretiens, déclarations, élections.',
      answers: {
        A: 'Les échéances sont principalement traitées lorsqu\'elles arrivent.',
        B: 'Un calendrier existe mais certaines échéances restent gérées dans l\'urgence.',
        C: 'Les principales échéances sont anticipées et préparées.',
        D: 'Le calendrier social est piloté en amont et intégré à la roadmap RH / direction.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [],
      applicability: SIZE_11_PLUS,
      area_text: 'Un calendrier social anticipé évite de traiter les échéances dans l\'urgence.',
      recommendation_by_answer: {
        A: 'Construire un calendrier social annuel recensant toutes les échéances applicables.',
        B: 'Associer à chaque échéance un responsable et une date de préparation.',
        C: 'Intégrer le calendrier social à la feuille de route RH partagée avec la direction.'
      },
      commercial_tags: ['relations_sociales', 'orkest'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'Q11', pillar: 'employee_relations', type: 'M', weight: 3, risk_level: 'eleve',
      short_label: 'Préparation et suivi des instances',
      question: 'Comment qualifieriez-vous la préparation et le suivi de vos instances représentatives ?',
      help_text: 'Ordres du jour, informations transmises, consultations, procès-verbaux et suivi des engagements.',
      answers: {
        A: 'Le fonctionnement est principalement réactif.',
        B: 'Les obligations sont globalement respectées mais le suivi reste chronophage ou peu structuré.',
        C: 'Réunions, consultations, documents et engagements font l\'objet d\'un process fiable.',
        D: 'Le dialogue social est anticipé et utilisé comme un levier d\'accompagnement des transformations.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [],
      applicability: HAS_INSTANCES,
      area_text: 'Un fonctionnement réactif des instances complique les consultations et projets.',
      recommendation_by_answer: {
        A: 'Formaliser la préparation des réunions (ordre du jour, documents, délais) et le suivi des procès-verbaux.',
        B: 'Outiller le suivi des consultations et des engagements pris en réunion.',
        C: 'Associer les représentants du personnel en amont des projets de transformation.'
      },
      commercial_tags: ['relations_sociales'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'Q12', pillar: 'employee_relations', type: 'M', weight: 2, risk_level: 'modere',
      short_label: 'Suivi des accords et engagements',
      question: 'Disposez-vous d\'une vision centralisée des accords, engagements et actions issus du dialogue social ?',
      help_text: 'Accords d\'entreprise, plans d\'action, engagements pris en réunion et leurs échéances.',
      answers: {
        A: 'Non, les informations sont très dispersées.',
        B: 'Partiellement.',
        C: 'Oui, les documents et échéances sont centralisés.',
        D: 'Oui, avec un suivi des engagements, échéances et actions associées.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [],
      applicability: HAS_INSTANCES,
      area_text: 'Sans vue d\'ensemble, des échéances d\'accords ou engagements peuvent être manquées.',
      recommendation_by_answer: {
        A: 'Recenser les accords en vigueur, leurs dates d\'échéance et les engagements associés.',
        B: 'Centraliser les accords et engagements dans un référentiel unique.',
        C: 'Compléter la vue centralisée des accords par un suivi des actions et des échéances.'
      },
      commercial_tags: ['relations_sociales', 'orkest'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'C3', pillar: 'employee_relations', type: 'C', weight: 2, risk_level: 'modere',
      short_label: 'Base de données économiques, sociales et environnementales (BDESE)',
      question: 'Votre BDESE est-elle en place, alimentée et accessible aux représentants du personnel ?',
      help_text: 'La BDESE rassemble les informations économiques et sociales mises à disposition du CSE.',
      allow_na: false,
      legal_flag: true, legal_rule: ['LR_BDESE'],
      red_flag_conditions: [{ answers: ['no', 'unknown'], obligation: 'LR_BDESE' }],
      applicability: SIZE_50_PLUS,
      area_text: 'La BDESE doit être tenue à jour et accessible au CSE.',
      recommendation_by_answer: {
        partial: 'Vérifier que la BDESE contient les rubriques attendues pour votre effectif et qu\'elle est mise à jour.',
        no: 'Mettre en place la BDESE et organiser son alimentation régulière.',
        unknown: 'Vérifier l\'existence de la BDESE, son contenu et les modalités d\'accès du CSE.'
      },
      commercial_tags: ['relations_sociales', 'audit_rh'],
      source: 'legal_rules', verified_at: null },

    { id: 'C4', pillar: 'employee_relations', type: 'C', weight: 2, risk_level: 'modere',
      short_label: 'Négociations obligatoires',
      question: 'Les négociations obligatoires applicables à votre entreprise sont-elles engagées selon le calendrier prévu ?',
      help_text: 'Elles concernent les entreprises où sont constituées une ou plusieurs sections syndicales représentatives. Si ce n\'est pas votre cas, répondez « Non applicable ».',
      allow_na: true, na_label: 'Non applicable (pas de section syndicale représentative)',
      legal_flag: true, legal_rule: ['LR_NAO'],
      /* « Je ne sais pas » : l'existence d'une section syndicale représentative (condition de
         l'obligation) n'est pas établie -> vigilance « À vérifier », pas de red flag. */
      red_flag_conditions: [{ answers: ['no'], obligation: 'LR_NAO' }],
      applicability: SIZE_50_PLUS,
      area_text: 'Les négociations obligatoires suivent une périodicité fixée par la loi ou par accord.',
      recommendation_by_answer: {
        partial: 'Vérifier que chaque thème de négociation obligatoire est couvert selon la périodicité applicable.',
        no: 'Établir le calendrier des négociations obligatoires et engager celles qui sont échues.',
        unknown: 'Vérifier la présence de sections syndicales représentatives et, le cas échéant, le calendrier des négociations.'
      },
      commercial_tags: ['relations_sociales', 'audit_rh'],
      source: 'legal_rules', verified_at: null },

    /* ============ Pilier 4 — Recrutement & onboarding ============ */
    { id: 'Q13', pillar: 'recruitment', type: 'M', weight: 2, risk_level: 'modere',
      short_label: 'Homogénéité du processus de recrutement',
      question: 'À quel point votre processus de recrutement est-il homogène entre les différentes équipes ?',
      help_text: 'Étapes, rôles des intervenants et règles de décision, d\'une équipe à l\'autre.',
      answers: {
        A: 'Chaque manager recrute principalement selon ses propres pratiques.',
        B: 'Un cadre existe mais son application varie fortement.',
        C: 'Le process et les rôles sont clairement définis et globalement appliqués.',
        D: 'Le process est homogène, mesuré et régulièrement amélioré.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Des pratiques hétérogènes rendent les recrutements moins prévisibles.',
      recommendation_by_answer: {
        A: 'Définir un processus de recrutement commun (étapes, rôles, délais) et le partager aux managers.',
        B: 'Accompagner les managers dans l\'application du processus commun.',
        C: 'Mesurer le processus (délais, taux de conversion) pour l\'améliorer.'
      },
      commercial_tags: ['recrutement'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'Q14', pillar: 'recruitment', type: 'M', weight: 2, risk_level: 'modere',
      short_label: 'Objectivation des décisions de recrutement',
      question: 'Comment les décisions de recrutement sont-elles objectivées ?',
      help_text: 'Critères d\'évaluation, grilles d\'entretien, prise de décision collective.',
      answers: {
        A: 'Principalement à l\'appréciation des interviewers.',
        B: 'Des critères existent mais ne sont pas systématiquement utilisés.',
        C: 'Des critères et grilles communes structurent les décisions.',
        D: 'Les critères sont structurés, partagés, documentés et leur efficacité est régulièrement revue.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Des critères partagés fiabilisent les décisions et limitent les biais.',
      recommendation_by_answer: {
        A: 'Définir des critères d\'évaluation par poste et une grille d\'entretien commune.',
        B: 'Rendre l\'usage des grilles systématique et documenter les décisions.',
        C: 'Revoir périodiquement les critères au regard de la réussite des recrues.'
      },
      commercial_tags: ['recrutement'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'Q15', pillar: 'recruitment', type: 'M', weight: 2, risk_level: 'modere',
      short_label: 'Onboarding',
      question: 'Comment qualifieriez-vous votre onboarding ?',
      help_text: 'L\'intégration des nouveaux arrivants, de l\'accord du candidat à la fin de la période d\'essai.',
      answers: {
        A: 'Il dépend principalement du manager.',
        B: 'Des étapes communes existent mais leur application varie.',
        C: 'Un parcours structuré est appliqué de manière homogène.',
        D: 'Le parcours est structuré, suivi dans le temps et son efficacité est mesurée.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Un parcours d\'intégration commun sécurise les premiers mois.',
      recommendation_by_answer: {
        A: 'Construire un parcours d\'intégration commun (avant l\'arrivée, premier jour, premiers mois).',
        B: 'Suivre l\'application du parcours d\'intégration par équipe.',
        C: 'Mesurer l\'efficacité de l\'intégration (retours des recrues, départs en période d\'essai).'
      },
      commercial_tags: ['recrutement'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'Q16', pillar: 'recruitment', type: 'M', weight: 1, risk_level: 'faible',
      short_label: 'Pilotage des recrutements',
      question: 'Dans quelle mesure pilotez-vous l\'efficacité de vos recrutements ?',
      help_text: 'Délais, sources, taux de conversion, coût, réussite des recrues.',
      answers: {
        A: 'Peu ou pas d\'indicateurs.',
        B: 'Quelques indicateurs opérationnels sont suivis.',
        C: 'Les principaux KPI permettent d\'identifier les points d\'amélioration.',
        D: 'Les données sont régulièrement utilisées pour arbitrer les ressources, canaux et process de recrutement.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Quelques indicateurs suffisent pour savoir où agir en priorité.',
      recommendation_by_answer: {
        A: 'Suivre trois indicateurs simples : délai de recrutement, source des embauches, départs en période d\'essai.',
        B: 'Compléter les indicateurs pour identifier les étapes à améliorer.',
        C: 'Utiliser les indicateurs pour arbitrer les canaux et les ressources de recrutement.'
      },
      commercial_tags: ['recrutement', 'orkest'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    /* ============ Pilier 5 — Compétences & développement RH ============ */
    { id: 'Q17', pillar: 'development', type: 'C', weight: 3, risk_level: 'eleve',
      short_label: 'Entretiens de parcours professionnel',
      question: 'Les entretiens de parcours professionnel applicables à vos salariés sont-ils planifiés, réalisés, documentés et suivis conformément aux obligations en vigueur ?',
      help_text: 'Entretiens consacrés aux perspectives d\'évolution professionnelle, distincts de l\'entretien annuel d\'évaluation. Leur périodicité est fixée par la réglementation en vigueur.',
      /* IMPORTANT : aucune périodicité dans le libellé. Elle vient de LR_ENTRETIEN_PARCOURS. */
      allow_na: false,
      legal_flag: true, legal_rule: ['LR_ENTRETIEN_PARCOURS'],
      red_flag_conditions: [{ answers: ['no', 'unknown'], obligation: 'LR_ENTRETIEN_PARCOURS' }],
      applicability: null,
      area_text: 'Ces entretiens obéissent à une périodicité et à un formalisme réglementaires.',
      recommendation_by_answer: {
        partial: 'Recenser, salarié par salarié, la date du dernier entretien et planifier ceux à réaliser.',
        no: 'Planifier les entretiens de parcours professionnel dus et mettre en place un suivi par salarié.',
        unknown: 'Vérifier, salarié par salarié, la date du dernier entretien de parcours professionnel et sa formalisation.'
      },
      commercial_tags: ['audit_rh'],
      source: 'legal_rules', verified_at: null },

    { id: 'C6', pillar: 'development', type: 'C', weight: 2, risk_level: 'modere',
      short_label: 'État des lieux du parcours professionnel',
      question: 'Pour les salariés concernés, l\'état des lieux récapitulatif de leur parcours professionnel est-il réalisé et formalisé ?',
      help_text: 'Bilan périodique qui vérifie que le salarié a bénéficié des entretiens et actions prévus. Si aucun salarié n\'a encore l\'ancienneté requise, répondez « Non applicable ».',
      allow_na: true, na_label: 'Non applicable (aucun salarié concerné à ce jour)',
      legal_flag: true, legal_rule: ['LR_ETAT_DES_LIEUX_PARCOURS'],
      /* Red flag porté par l'obligation (tout employeur), jamais par la taille. Question INACTIVE tant que
         LR_ETAT_DES_LIEUX_PARCOURS n'est pas validée (mesures transitoires). */
      red_flag_conditions: [{ answers: ['no', 'unknown'], obligation: 'LR_ETAT_DES_LIEUX_PARCOURS' }],
      applicability: null,
      area_text: 'L\'état des lieux récapitulatif est exigé à une échéance réglementaire.',
      recommendation_by_answer: {
        partial: 'Identifier les salariés arrivant à l\'échéance de l\'état des lieux et vérifier leur dossier.',
        no: 'Réaliser les états des lieux dus et vérifier les entretiens et actions associés.',
        unknown: 'Identifier les salariés concernés par l\'état des lieux et vérifier leur situation.'
      },
      commercial_tags: ['audit_rh'],
      source: 'legal_rules', verified_at: null },

    { id: 'Q18', pillar: 'development', type: 'M', weight: 2, risk_level: 'modere',
      short_label: 'Détermination des besoins de formation',
      question: 'Comment vos besoins en formation sont-ils déterminés ?',
      help_text: 'La façon dont le plan de développement des compétences est construit.',
      answers: {
        A: 'Principalement au fil des demandes individuelles.',
        B: 'Les besoins sont collectés mais peu priorisés.',
        C: 'Ils sont priorisés en fonction des besoins des équipes et métiers.',
        D: 'Ils découlent d\'une analyse des compétences nécessaires et leur impact est ensuite évalué.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Des formations priorisées selon les besoins métiers ont plus d\'impact.',
      recommendation_by_answer: {
        A: 'Organiser une collecte annuelle des besoins de formation auprès des managers.',
        B: 'Prioriser les besoins selon les enjeux des équipes et le budget disponible.',
        C: 'Relier le plan de formation aux compétences clés et évaluer son impact.'
      },
      commercial_tags: ['drh_externalise'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'Q19', pillar: 'development', type: 'M', weight: 2, risk_level: 'modere',
      short_label: 'Cartographie des compétences',
      question: 'Quelle visibilité avez-vous sur les compétences critiques dont l\'entreprise aura besoin dans les 12 à 24 prochains mois ?',
      help_text: 'Compétences sans lesquelles l\'activité ou les projets de l\'entreprise seraient fragilisés.',
      answers: {
        A: 'Très faible.',
        B: 'Quelques besoins ont été identifiés de manière informelle.',
        C: 'Les principales compétences critiques sont identifiées.',
        D: 'Elles sont cartographiées et alimentent les décisions de recrutement, formation et mobilité.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Identifier les compétences critiques permet d\'anticiper recrutements et formations.',
      recommendation_by_answer: {
        A: 'Identifier avec la direction les compétences critiques pour les deux prochaines années.',
        B: 'Formaliser les compétences critiques et les rattacher aux postes concernés.',
        C: 'Utiliser la cartographie des compétences pour arbitrer recrutement, formation et mobilité.'
      },
      commercial_tags: ['drh_externalise'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'Q20', pillar: 'development', type: 'M', weight: 1, risk_level: 'faible',
      short_label: 'Lisibilité des parcours d\'évolution',
      question: 'Vos collaborateurs et managers comprennent-ils les possibilités d\'évolution au sein de l\'entreprise et les compétences nécessaires pour y accéder ?',
      help_text: 'Mobilités possibles, passerelles entre métiers et critères d\'accès.',
      answers: {
        A: 'Très peu.',
        B: 'Cela dépend fortement des équipes ou managers.',
        C: 'Les principaux parcours et critères sont identifiés.',
        D: 'Les parcours sont structurés, transparents et intégrés aux discussions de développement.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Des parcours lisibles favorisent la mobilité interne et la fidélisation.',
      recommendation_by_answer: {
        A: 'Décrire les principales évolutions possibles et les compétences attendues.',
        B: 'Partager les parcours d\'évolution avec l\'ensemble des managers.',
        C: 'Intégrer les parcours aux entretiens de développement.'
      },
      commercial_tags: ['drh_externalise'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    /* ============ Pilier 6 — Rémunération & équité ============ */
    { id: 'Q21', pillar: 'compensation', type: 'M', weight: 2, risk_level: 'modere',
      short_label: 'Cadre des décisions salariales',
      question: 'Deux managers confrontés à une même décision salariale disposent-ils d\'un cadre suffisamment clair pour prendre des décisions cohérentes ?',
      help_text: 'Règles d\'augmentation, de positionnement à l\'embauche et de promotion.',
      answers: {
        A: 'Non, les décisions sont largement discrétionnaires.',
        B: 'Quelques principes existent mais sont interprétés différemment.',
        C: 'Une politique et des règles communes structurent les décisions.',
        D: 'Les règles sont formalisées, documentées et appuyées sur des données fiables.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Un cadre commun rend les décisions salariales cohérentes et explicables.',
      recommendation_by_answer: {
        A: 'Formaliser quelques règles communes (embauche, augmentation, promotion).',
        B: 'Harmoniser l\'interprétation des règles lors des revues salariales.',
        C: 'Appuyer les règles sur des données de marché et internes fiables.'
      },
      commercial_tags: ['compensation'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'Q22', pillar: 'compensation', type: 'M', weight: 2, risk_level: 'modere',
      short_label: 'Architecture des emplois',
      question: 'Dans quelle mesure votre architecture des emplois et niveaux permet-elle de comparer des postes de manière cohérente ?',
      help_text: 'Classification des postes par famille de métiers et niveau de responsabilité.',
      answers: {
        A: 'Nous n\'avons pas réellement d\'architecture structurée.',
        B: 'Des classifications existent mais sont incomplètes ou obsolètes.',
        C: 'Les principaux emplois et niveaux sont structurés.',
        D: 'L\'architecture est maintenue à jour et utilisée pour les décisions RH et salariales.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Une architecture des emplois est la base de comparaisons salariales cohérentes.',
      recommendation_by_answer: {
        A: 'Construire une première architecture des emplois (familles, niveaux).',
        B: 'Mettre à jour les classifications et compléter les emplois manquants.',
        C: 'Utiliser l\'architecture des emplois dans les décisions salariales et de mobilité.'
      },
      commercial_tags: ['compensation'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'Q23', pillar: 'compensation', type: 'M', weight: 3, risk_level: 'eleve',
      short_label: 'Objectivation des écarts de rémunération',
      question: 'Pouvez-vous expliquer et objectiver les principaux écarts de rémunération entre des salariés occupant des postes comparables ?',
      help_text: 'Capacité à justifier un écart par des critères objectifs (expérience, performance, marché…).',
      answers: {
        A: 'Difficilement.',
        B: 'Partiellement, avec des données ou critères incomplets.',
        C: 'Oui, grâce à des données et critères identifiés.',
        D: 'Oui, avec des analyses régulières permettant également d\'identifier et corriger les écarts injustifiés.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Pouvoir justifier les écarts salariaux devient un enjeu majeur d\'équité et de transparence.',
      recommendation_by_answer: {
        A: 'Réaliser une première analyse des écarts de rémunération par poste comparable.',
        B: 'Compléter les données et définir les critères objectifs qui justifient un écart.',
        C: 'Mettre en place une analyse régulière et un plan de correction des écarts injustifiés.'
      },
      commercial_tags: ['compensation'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'C5', pillar: 'compensation', type: 'C', weight: 2, risk_level: 'modere',
      short_label: 'Index de l\'égalité professionnelle',
      question: 'Votre index de l\'égalité professionnelle est-il calculé, publié et suivi selon les obligations applicables ?',
      help_text: 'Indicateurs relatifs aux écarts entre les femmes et les hommes, à calculer et publier chaque année.',
      allow_na: false,
      legal_flag: true, legal_rule: ['LR_INDEX_EGALITE'],
      red_flag_conditions: [{ answers: ['no', 'unknown'], obligation: 'LR_INDEX_EGALITE' }],
      applicability: SIZE_50_PLUS,
      area_text: 'Le calcul et la publication de l\'index suivent un calendrier annuel.',
      recommendation_by_answer: {
        partial: 'Vérifier le calcul, la publication et la transmission de l\'index, ainsi que les mesures de correction éventuelles.',
        no: 'Calculer et publier l\'index de l\'égalité professionnelle et définir les mesures de correction si nécessaire.',
        unknown: 'Vérifier si l\'index a été calculé et publié pour la dernière échéance.'
      },
      commercial_tags: ['compensation', 'audit_rh'],
      source: 'legal_rules', verified_at: null },

    { id: 'Q24', pillar: 'compensation', type: 'C', weight: 3, risk_level: 'eleve',
      short_label: 'Préparation à la transparence salariale',
      question: 'Votre organisation est-elle préparée aux obligations de transparence salariale qui lui seront applicables ?',
      help_text: 'De nouvelles obligations de transparence des rémunérations sont issues du droit européen.',
      allow_na: false,
      /* INACTIVE tant que la règle de transposition n'est pas documentée, sourcée et validée. */
      legal_flag: true, legal_rule: ['LR_TRANSPARENCE_SALARIALE'],
      red_flag_conditions: [],   // à définir lors de la validation : obligation future ≠ manquement actuel
      applicability: null,       // à définir selon les seuils de la transposition
      area_text: 'Les obligations de transparence salariale demandent des données et critères préparés en amont.',
      recommendation_by_answer: {
        partial: 'Identifier les obligations qui vous seront applicables et les données à préparer.',
        no: 'Préparer les données et critères de rémunération nécessaires aux futures obligations de transparence.',
        unknown: 'Vérifier les obligations de transparence salariale applicables à votre effectif et leur calendrier.'
      },
      commercial_tags: ['compensation'],
      source: 'legal_rules', verified_at: null },

    /* ============ Pilier 7 — Management, QVCT & prévention ============ */
    { id: 'Q25', pillar: 'management_qvct', type: 'C', weight: 3, risk_level: 'eleve',
      short_label: 'DUERP',
      question: 'Votre DUERP est-il à jour et adapté aux risques réellement rencontrés dans votre entreprise ?',
      help_text: 'Le document unique d\'évaluation des risques professionnels recense les risques de chaque unité de travail et les actions de prévention.',
      allow_na: false,   // obligation applicable dès le premier salarié
      legal_flag: true, legal_rule: ['LR_DUERP'],
      red_flag_conditions: [{ answers: ['no', 'unknown'], obligation: 'LR_DUERP' }],
      applicability: null,
      area_text: 'Le DUERP doit refléter les risques réels et être mis à jour selon les règles applicables.',
      recommendation_by_answer: {
        partial: 'Revoir le DUERP avec les équipes de terrain pour qu\'il reflète les risques réels, et vérifier sa date de mise à jour.',
        no: 'Mettre à jour le DUERP en priorité, avec les unités de travail et les actions de prévention associées.',
        unknown: 'Vérifier l\'existence du DUERP, sa date de dernière mise à jour et son accessibilité.'
      },
      commercial_tags: ['audit_rh'],
      source: 'legal_rules', verified_at: null },

    { id: 'Q26', pillar: 'management_qvct', type: 'M', weight: 3, risk_level: 'eleve',
      short_label: 'Démarche de prévention',
      question: 'Comment votre DUERP et vos démarches de prévention sont-ils utilisés dans la pratique ?',
      help_text: 'Il s\'agit de l\'usage réel : actions décidées, responsables, suivi.',
      answers: {
        A: 'Principalement comme une obligation documentaire.',
        B: 'Quelques actions en découlent mais leur suivi est irrégulier.',
        C: 'Les risques identifiés donnent lieu à des actions suivies.',
        D: 'La prévention est pilotée dans le temps avec responsabilités, échéances et suivi des actions.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'La prévention produit des effets lorsque les actions sont suivies dans le temps.',
      recommendation_by_answer: {
        A: 'Associer à chaque risque prioritaire une action, un responsable et une échéance.',
        B: 'Mettre en place un suivi régulier des actions de prévention.',
        C: 'Piloter la prévention avec des indicateurs et une revue périodique en comité de direction.'
      },
      commercial_tags: ['drh_externalise'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'Q27', pillar: 'management_qvct', type: 'M', weight: 2, risk_level: 'modere',
      short_label: 'Analyse de l\'absentéisme et du turnover',
      question: 'Lorsque l\'absentéisme ou le turnover évoluent anormalement dans une équipe, êtes-vous capable d\'en identifier les causes et d\'agir ?',
      help_text: 'Capacité à repérer une dérive, en comprendre les causes et engager des actions.',
      answers: {
        A: 'Nous disposons de peu de visibilité.',
        B: 'Les indicateurs sont disponibles mais l\'analyse reste ponctuelle.',
        C: 'Nous pouvons identifier les principales causes et mettre en place des actions.',
        D: 'Les indicateurs et signaux faibles sont régulièrement analysés et déclenchent des actions suivies.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Repérer tôt une dérive d\'absentéisme ou de turnover permet d\'agir avant qu\'elle ne s\'installe.',
      recommendation_by_answer: {
        A: 'Suivre l\'absentéisme et le turnover par équipe, chaque mois.',
        B: 'Analyser les causes lorsqu\'un indicateur dépasse un seuil défini.',
        C: 'Suivre les actions engagées et mesurer leurs effets.'
      },
      commercial_tags: ['drh_externalise', 'orkest'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'Q28', pillar: 'management_qvct', type: 'M', weight: 2, risk_level: 'modere',
      short_label: 'Autonomie RH des managers',
      question: 'Dans quelle mesure vos managers savent-ils gérer les situations RH courantes et identifier celles nécessitant l\'intervention des RH ?',
      help_text: 'Absences, conflits, entretiens, demandes courantes des collaborateurs.',
      answers: {
        A: 'Ils sollicitent très fréquemment les RH, y compris sur les situations courantes.',
        B: 'Leur niveau d\'autonomie varie fortement.',
        C: 'Ils disposent d\'un cadre clair et sont globalement autonomes.',
        D: 'Ils sont formés, outillés et disposent de règles d\'escalade clairement définies.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Des managers outillés traitent les situations courantes et savent quand alerter.',
      recommendation_by_answer: {
        A: 'Formaliser un guide du manager sur les situations RH les plus fréquentes.',
        B: 'Former les managers et définir des règles d\'escalade vers les RH.',
        C: 'Compléter le cadre par des formations ciblées et un retour d\'expérience régulier.'
      },
      commercial_tags: ['drh_externalise'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    /* ============ Pilier 8 — Organisation, SIRH & pilotage RH ============ */
    { id: 'Q29', pillar: 'hr_operations_data', type: 'M', weight: 3, risk_level: 'eleve',
      short_label: 'Feuille de route RH',
      question: 'Votre roadmap RH est-elle formalisée, priorisée et reliée aux enjeux business de l\'entreprise ?',
      help_text: 'Les priorités RH de l\'année et leur lien avec la stratégie de l\'entreprise.',
      answers: {
        A: 'Nous fonctionnons principalement en réaction aux sujets qui arrivent.',
        B: 'Des priorités existent mais sont peu formalisées ou régulièrement bousculées.',
        C: 'Une roadmap claire et priorisée existe.',
        D: 'La roadmap découle des enjeux business, comporte des objectifs mesurables et fait l\'objet d\'un suivi régulier.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Une feuille de route RH priorisée aligne les actions RH sur les enjeux de l\'entreprise.',
      recommendation_by_answer: {
        A: 'Définir avec la direction trois à cinq priorités RH pour les douze prochains mois.',
        B: 'Formaliser la feuille de route RH et la partager avec la direction.',
        C: 'Associer à chaque priorité des objectifs mesurables et une revue régulière.'
      },
      commercial_tags: ['drh_externalise', 'orkest'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'Q30', pillar: 'hr_operations_data', type: 'M', weight: 2, risk_level: 'modere',
      short_label: 'Fiabilité des données RH',
      question: 'Disposez-vous d\'une source de référence permettant d\'obtenir rapidement des données RH fiables ?',
      help_text: 'Effectifs, mouvements, rémunérations, absences : une source qui fait foi.',
      answers: {
        A: 'Les informations sont dispersées entre plusieurs sources.',
        B: 'Une source principale existe mais nécessite régulièrement des retraitements.',
        C: 'Les principales données sont centralisées et globalement fiables.',
        D: 'Les données sont centralisées, gouvernées et directement exploitables pour le pilotage.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Une source de données fiable est la condition de tout pilotage RH.',
      recommendation_by_answer: {
        A: 'Désigner une source de référence pour les données RH clés.',
        B: 'Fiabiliser la source principale pour réduire les retraitements.',
        C: 'Définir des règles de gouvernance des données (responsables, mises à jour, contrôles).'
      },
      commercial_tags: ['orkest'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'Q31', pillar: 'hr_operations_data', type: 'M', weight: 1, risk_level: 'faible',
      short_label: 'Outils RH et automatisation',
      question: 'Dans quelle mesure vos outils RH réduisent-ils réellement les tâches administratives et doubles saisies ?',
      help_text: 'SIRH, logiciel de paie, outils de recrutement, de formation ou de gestion des temps.',
      answers: {
        A: 'De nombreux processus reposent encore sur Excel, emails ou ressaisies.',
        B: 'Plusieurs outils existent mais communiquent peu entre eux.',
        C: 'Les principaux processus sont digitalisés avec peu de doubles saisies.',
        D: 'La stack RH est intégrée et les principales tâches répétitives sont automatisées.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Des outils mieux connectés libèrent du temps pour les sujets à valeur ajoutée.',
      recommendation_by_answer: {
        A: 'Identifier les tâches les plus chronophages et les processus à digitaliser en priorité.',
        B: 'Connecter les outils existants pour supprimer les doubles saisies.',
        C: 'Automatiser les tâches répétitives restantes.'
      },
      commercial_tags: ['orkest'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE },

    { id: 'Q32', pillar: 'hr_operations_data', type: 'M', weight: 2, risk_level: 'modere',
      short_label: 'Usage des indicateurs RH',
      question: 'Vos indicateurs RH influencent-ils réellement les décisions prises par la fonction RH et la direction ?',
      help_text: 'Au-delà du reporting : les indicateurs éclairent-ils les arbitrages ?',
      answers: {
        A: 'Nous disposons de peu d\'indicateurs fiables.',
        B: 'Des indicateurs sont produits mais principalement à des fins de reporting.',
        C: 'Les principaux KPI sont utilisés dans le pilotage RH.',
        D: 'Les données RH alimentent régulièrement les arbitrages de la direction et permettent de mesurer l\'impact des actions engagées.'
      },
      legal_flag: false, legal_rule: null,
      red_flag_conditions: [], applicability: null,
      area_text: 'Des indicateurs utiles éclairent les décisions plutôt que de seulement les documenter.',
      recommendation_by_answer: {
        A: 'Définir un socle de cinq à huit indicateurs RH fiables.',
        B: 'Relier chaque indicateur à une décision ou une action possible.',
        C: 'Présenter les indicateurs RH dans les arbitrages de direction et mesurer l\'impact des actions.'
      },
      commercial_tags: ['orkest', 'drh_externalise'],
      source: EDITORIAL_SOURCE, verified_at: EDITORIAL_DATE }
  ];

  var API = {
    version: '0.2.0',
    ANSWER_SCALES: ANSWER_SCALES,
    PILLARS: PILLARS,
    CONTEXT: CONTEXT,
    QUESTIONS: QUESTIONS
  };
  root.ARH_QUESTIONS = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
