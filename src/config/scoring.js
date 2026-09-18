/*!
 * Audit RH 360° — Le Club des RH
 * RÈGLES MÉTIER : scoring, seuils, red flags, hiérarchie de restitution, roadmap, qualification
 * commerciale, textes de restitution, payload et analytics.
 *
 * Tout est déclaratif. Le moteur (Phase 2) se contente d'appliquer ces règles : modifier un seuil,
 * un libellé ou une règle de qualification ne demande aucune modification de l'interface.
 */
(function (root) {
  'use strict';

  var RULES = {

    /* ------------------------------------------------------------------
     * Grammaire des conditions (applicabilité, red flags conditionnels, qualification)
     *   { field: 'company_size', in: [...] }        valeur de contexte dans la liste
     *   { field: 'company_size', not_in: [...] }    valeur de contexte hors de la liste
     *   { all: [cond, ...] }                         toutes vraies
     *   { any: [cond, ...] }                         au moins une vraie
     *   { not: cond }                                négation
     *   null                                         toujours vrai
     * Les champs utilisables sont ceux de CONTEXT (questions.js).
     * ------------------------------------------------------------------ */
    conditions: { fields: ['respondent_role', 'company_size', 'has_cse', 'collective_agreement', 'hr_organization'] },

    /* ------------------------------------------------------------------
     * Scoring
     *   score_pilier = Σ(score × poids) / Σ(100 × poids) × 100, sur les questions
     *   actives, applicables et hors « Non applicable ».
     *   score_global = même formule sur l'ensemble des questions retenues (pas une moyenne de piliers).
     *   Décimales conservées en interne ; arrondi uniquement à l'affichage.
     * ------------------------------------------------------------------ */
    scoring: {
      display_rounding: 0,          // nombre de décimales affichées
      min_questions_per_pillar: 1,  // en dessous : pilier « non évalué » (score null), exclu des classements
      unknown_counts_as_zero: true  // « Je ne sais pas » = 0 + vigilance
    },

    /* Seuils de maturité (bornes basses incluses). Utilisés pour le global et pour chaque pilier. */
    maturity_levels: [
      { id: 'structured',   min: 80, label: 'Bien structuré' },
      { id: 'consolidate',  min: 60, label: 'À consolider' },
      { id: 'to_structure', min: 40, label: 'Plusieurs sujets à structurer' },
      { id: 'to_secure',    min: 0,  label: 'Plusieurs priorités à sécuriser' }
    ],

    /* Statut affiché au niveau d'une réponse (vocabulaire imposé : jamais « non conforme »). */
    answer_status: {
      red_flag: 'À sécuriser',
      critical_structure: 'À structurer en priorité',
      unknown: 'À vérifier',
      partial: 'À vérifier',
      weak_maturity: 'À structurer',   // réponses M de score <= weak_max_score
      mid_maturity: 'À consolider',
      top: 'Maîtrisé'
    },

    /* ------------------------------------------------------------------
     * Hiérarchie de restitution et roadmap (ordre strict, sans doublon :
     * une question n'apparaît qu'une fois, au niveau le plus prioritaire).
     * ------------------------------------------------------------------ */
    thresholds: {
      weak_max_score: 0,           // « réponse faible » = score <= 0 (Non, Je ne sais pas, situation A)
      critical_structure_answers: ['B'],   // poids 3 + ces situations M -> priorité 2 « À structurer en priorité »
      critical_weight: 3,
      partial_max_score: 50,       // priorité 4 : toute autre réponse de score <= 50 (B, Partiellement, faibles poids 1-2)
      optimisation_scores: [67],   // situation C : piste d'optimisation
      low_pillar_below: 60,        // pilier « faible maturité » si score < 60
      strength_min_score: 80,      // pilier point fort
      strength_fallback_min: 67,   // si aucun pilier >= 80 : points d'appui >= 67
      max_strengths: 3,
      max_areas_to_structure: 3,
      /* Cas « très bon résultat » : aucune priorité n'est inventée. Toutes les conditions sont requises. */
      very_good: { min_global: 80, no_red_flag: true, no_critical: true, no_pillar_below: 60 }
    },

    roadmap_priorities: [
      { priority: 1, id: 'red_flag',         label: 'Sujets à sécuriser en priorité',
        rule: 'Réponse déclenchant un red flag réglementaire.' },
      { priority: 2, id: 'critical_weak',    label: 'Points critiques à traiter',
        rule: 'Question de poids 3 avec Non, Je ne sais pas ou situation A, hors red flag (tonalité forte). Question de poids 3 en situation B : même priorité, tonalité « À structurer en priorité ». Jamais présenté comme un red flag.' },
      { priority: 3, id: 'low_pillar',       label: 'Piliers à structurer',
        rule: 'Pilier dont le score est < low_pillar_below : une action de pilier, alimentée par ses réponses les plus faibles non déjà listées.' },
      { priority: 4, id: 'partial',          label: 'Points à consolider',
        rule: 'Toute autre réponse de score <= 50 non déjà listée (« Partiellement », situation B hors poids 3, réponses faibles de poids 1-2).' },
      { priority: 5, id: 'optimisation',     label: 'Pistes d\'optimisation',
        rule: 'Situation C (score 67) : présentée comme optimisation, jamais comme problème.' }
    ],

    /* Ordre de tri à l'intérieur d'une même priorité (déterministe). */
    roadmap_sort: ['weight_desc', 'score_asc', 'pillar_order_asc', 'question_order_asc'],
    roadmap_display_limit: { free_results: 3, report: null },   // null = pas de limite dans le rapport

    /* Champs stockés pour chaque action de roadmap. */
    roadmap_action_fields: ['title', 'description', 'pillar', 'priority', 'reason', 'recommendation', 'question_id'],

    /* Gabarits de `reason` (texte court expliquant pourquoi l'action est là). */
    reason_templates: {
      red_flag: 'Vous indiquez « {answer} » sur un sujet encadré par la réglementation.',
      critical_weak: 'Sujet critique pour lequel votre réponse indique qu\'il n\'est pas encore en place.',
      critical_structure: 'Sujet critique qui existe mais reste insuffisamment structuré.',
      low_pillar: 'Le pilier « {pillar} » obtient {score}/100.',
      partial: 'Votre réponse indique une mise en place partielle.',
      optimisation: 'Votre pratique est en place ; elle peut encore être renforcée.'
    },

    /* ------------------------------------------------------------------
     * Textes de restitution (sobres, jamais anxiogènes)
     * ------------------------------------------------------------------ */
    result_texts: {
      global_by_level: {
        structured:   'Votre organisation RH apparaît bien structurée.',
        consolidate:  'Votre organisation RH apparaît globalement structurée, avec plusieurs axes à consolider.',
        to_structure: 'Votre organisation RH repose sur des bases réelles, avec plusieurs sujets à structurer.',
        to_secure:    'Vos réponses font ressortir plusieurs priorités à sécuriser et à structurer.'
      },
      very_good: {
        title: 'Votre organisation RH apparaît bien structurée',
        body: 'Vos réponses ne font ressortir aucun sujet prioritaire majeur à ce stade.',
        strengths_title: 'Vos principaux points forts',
        optimisations_title: 'Quelques pistes d\'optimisation'
      },
      red_flags_title: { one: '1 sujet à sécuriser en priorité', many: '{n} sujets à sécuriser en priorité' },
      red_flag_body: {
        no: 'Vous indiquez que ce point n\'est pas en place. Il mérite d\'être vérifié et traité en priorité.',
        unknown: 'Vous ne savez pas si ce point est en place. Il mérite d\'être vérifié en priorité.'
      },
      areas_title: { one: '1 axe à structurer', many: '{n} axes à structurer' },
      strengths_title: 'Vos points forts',
      strengths_fallback_title: 'Vos points d\'appui',
      pillar_not_evaluated: 'Non évalué au regard de votre situation',
      vigilance_note: 'Certaines réponses « Je ne sais pas » sont comptées comme des points à vérifier.'
    },

    disclaimer: 'Cet outil constitue un pré-diagnostic réalisé à partir de vos réponses déclaratives. Il ne constitue ni un audit juridique, ni une certification de conformité. Certaines obligations peuvent varier selon votre effectif, votre convention collective, votre secteur et votre situation particulière.',

    /* Mots interdits dans tout texte affiché (contrôlé par validate-config). */
    forbidden_wording: ['non conforme', 'non-conforme', 'illégal', 'risque juridique majeur', 'en danger', 'sanction'],

    /* ------------------------------------------------------------------
     * Qualification commerciale — INTERNE, JAMAIS AFFICHÉE
     * Chaque règle est évaluée indépendamment : une simulation peut avoir plusieurs tags.
     * Métriques disponibles : red_flags_count, critical_issues_count, global_score,
     * pillar_scores[id], weak_pillars_count (piliers < weak_pillar_below), rank_from_bottom[id]
     * (1 = pilier le plus faible), tagged_weak_count[tag] (questions portant ce tag avec score <= 33).
     * ------------------------------------------------------------------ */
    lead_interest: {
      /* Signaux INTERNES d'orientation, pas un diagnostic commercial : plusieurs tags possibles,
         chacun accompagné des raisons qui l'ont déclenché (lead_signals). */
      weak_pillar_below: 50,
      /* Métriques : red_flags_count · critical_count (priorité 2, deux tonalités) ·
         critical_strong_count (priorité 2 forte) · global_score · pillar_score[pillar] ·
         weak_pillars_count (< weak_pillar_below) · rank_from_bottom[pillar] (1 = plus faible) ·
         pillar_signal_count[pillar] (red flags + priorités 2 du pilier) ·
         pillar_weak_answers[pillar] (réponses de score 0 dans le pilier) ·
         pillars_with_critical (nb de piliers portant un red flag ou une priorité 2) ·
         tagged_weak_count[tag] (questions portant ce tag avec score <= 33) ·
         answer_score[question] · red_flag_on[questions]. */
      rules: [
        { tag: 'audit_rh',
          description: 'Plusieurs sujets réglementaires ou fondamentaux à sécuriser, ou sujets critiques dispersés.',
          when: { any: [
            { metric: 'red_flags_count', gte: 2 },
            { metric: 'pillar_weak_answers', pillar: 'compliance', gte: 2 },
            { metric: 'pillar_score', pillar: 'compliance', lt: 50 },
            { metric: 'pillars_with_critical', gte: 3 } ] } },
        { tag: 'drh_externalise',
          description: 'Faible maturité transverse ET fonction RH peu structurée, portée par la direction, sous-dimensionnée ou dépendante d\'une personne.',
          when: { all: [
            { metric: 'weak_pillars_count', gte: 3 },
            { any: [ { field: 'hr_organization', in: ['leadership', 'external', 'small_team', 'other'] },
                     { field: 'respondent_role', in: ['ceo', 'daf'] },
                     { metric: 'answer_score', question: 'Q8', lte: 33 } ] } ] } },
        { tag: 'orkest',
          description: 'Organisation globalement mature, fragilités de process, documentation, données, outils ou pilotage.',
          when: { all: [ { metric: 'global_score', gte: 60 },
                         { metric: 'tagged_weak_count', tag: 'orkest', gte: 2 } ] } },
        { tag: 'recrutement',
          description: 'Recrutement & onboarding ressort (pilier faible et parmi les 2 plus faibles, ou signal critique du domaine).',
          when: { any: [ { all: [ { metric: 'pillar_score', pillar: 'recruitment', lt: 60 },
                                  { metric: 'rank_from_bottom', pillar: 'recruitment', lte: 2 } ] },
                         { metric: 'pillar_signal_count', pillar: 'recruitment', gte: 1 },
                         { metric: 'pillar_weak_answers', pillar: 'recruitment', gte: 2 } ] } },
        { tag: 'compensation',
          description: 'Rémunération & équité ressort (pilier faible et parmi les 2 plus faibles, ou signal critique du domaine).',
          when: { any: [ { all: [ { metric: 'pillar_score', pillar: 'compensation', lt: 60 },
                                  { metric: 'rank_from_bottom', pillar: 'compensation', lte: 2 } ] },
                         { metric: 'pillar_signal_count', pillar: 'compensation', gte: 1 } ] } },
        { tag: 'relations_sociales',
          description: 'Relations sociales ressort (pilier évalué, faible et parmi les 2 plus faibles, ou signal critique du domaine).',
          when: { any: [ { all: [ { metric: 'pillar_score', pillar: 'employee_relations', lt: 60 },
                                  { metric: 'rank_from_bottom', pillar: 'employee_relations', lte: 2 } ] },
                         { metric: 'pillar_signal_count', pillar: 'employee_relations', gte: 1 } ] } }
      ]
    },

    /* ------------------------------------------------------------------
     * Payload CRM / Brevo (préparé, NON branché en Phase 1-2 : payload mocké)
     * ------------------------------------------------------------------ */
    payload: {
      contact: ['firstname', 'lastname', 'email', 'company'],
      context: ['respondent_role', 'company_size', 'has_cse', 'collective_agreement', 'hr_organization'],
      scores: ['global_score', 'compliance_score', 'payroll_admin_score', 'employee_relations_score',
               'recruitment_score', 'development_score', 'compensation_score', 'management_qvct_score',
               'hr_operations_data_score'],
      risks: ['red_flags_count', 'red_flags', 'critical_issues_count'],
      roadmap: ['top_priorities', 'areas_to_structure', 'strengths'],
      commercial: ['lead_interest'],
      acquisition: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'],
      meta: ['audit_id', 'config_version', 'legal_rules_version', 'completed_at', 'page_url'],
      detail: ['method_version', 'pillar_details', 'lead_signals'],   // pilier : score, statut, nb de questions applicables
      raw: 'answers_json'   // intégralité des réponses : [{ question_id, answer_id, score, applicable, red_flag }]
    },

    /* Contact : téléphone volontairement absent en V1. */
    lead_form: {
      title: 'Recevez votre rapport détaillé + votre roadmap RH personnalisée',
      text: 'Recevez par email le détail de vos réponses, les sujets à sécuriser et une roadmap personnalisée de vos prochaines actions RH.',
      fields: [
        { id: 'firstname', label: 'Prénom', required: true },
        { id: 'lastname', label: 'Nom', required: true },
        { id: 'email', label: 'Email professionnel', required: true, type: 'email' },
        { id: 'company', label: 'Entreprise', required: true }
      ],
      cta: 'Recevoir mon rapport',
      privacy_note: 'Vos informations servent uniquement à vous envoyer votre rapport et, si vous le souhaitez, à échanger avec vous sur vos résultats.',
      privacy_url: 'https://www.leclubdesrh.fr/politique-de-confidentialite'
    },

    commercial_cta: {
      title: 'Besoin d\'approfondir certains sujets ?',
      text: 'Le pré-diagnostic permet d\'identifier vos principales priorités. Un consultant RH senior peut approfondir l\'analyse, sécuriser les points identifiés et construire avec vous une roadmap adaptée à votre organisation.',
      cta: 'Échanger sur mon audit RH',
      /* Destination MOCKÉE en Phase 2 (aucune redirection réelle). Chemin définitif à renseigner avant
         la Phase 4/5 ; comme pour le simulateur RPO, seul le chemin sera utilisé, sur le domaine visité. */
      url: '#mock-rendez-vous',
      mock: true
    },

    /* ------------------------------------------------------------------
     * Analytics (GA4 via dataLayer / GTM, même mécanisme que le simulateur RPO)
     * ------------------------------------------------------------------ */
    analytics: {
      events: ['audit_view', 'audit_started', 'context_completed', 'pillar_completed', 'audit_completed',
               'results_viewed', 'report_requested', 'meeting_cta_clicked'],
      properties: ['company_size', 'global_score', 'lowest_pillar', 'red_flags_count', 'source']
    },
    utm_keys: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'],
    storage: { progress_key: 'arh_progress', utm_key: 'arh_utm', progress_ttl_days: 30 },
    method_version: 'weighted-questions-v1'
  };

  root.ARH_RULES = RULES;
  if (typeof module !== 'undefined' && module.exports) module.exports = RULES;
})(typeof window !== 'undefined' ? window : globalThis);
