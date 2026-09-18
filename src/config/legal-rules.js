/*!
 * Audit RH 360° — Le Club des RH
 * RÉFÉRENTIEL RÉGLEMENTAIRE (France). Source de vérité des règles, séparée des questions.
 *
 * Statuts
 *  - 'verified'                  : règle lue sur une source officielle, sourcée et datée.
 *                                  Les questions qui en dépendent sont ACTIVES.
 *  - 'legal_validation_required' : règle incertaine ou non en vigueur. Les questions qui en
 *                                  dépendent sont INACTIVES jusqu'à validation (voir liste en bas).
 *
 * `verified_at` = date de lecture de la source. `source_checked_at` = date « Vérifié le » affichée
 * par la source quand elle existe. `validated_by` = contre-signature humaine (juriste / DRH),
 * vide tant qu'elle n'a pas eu lieu.
 *
 * Sources autorisées : service-public.gouv.fr, legifrance.gouv.fr, travail-emploi.gouv.fr,
 * urssaf.fr, eur-lex.europa.eu. Jamais de cabinet, blog ou concurrent.
 *
 * Ces informations servent à auditer et mettre à jour les règles : elles ne sont pas destinées à
 * être affichées telles quelles à l'utilisateur.
 */
(function (root) {
  'use strict';

  var CHECKED = '2026-09-18';
  var SP = 'https://entreprendre.service-public.gouv.fr/vosdroits/';
  var LF = 'https://www.legifrance.gouv.fr/codes/article_lc/';

  var RULES = {

    LR_REGISTRE_PERSONNEL: {
      id: 'LR_REGISTRE_PERSONNEL', status: 'verified',
      title: 'Registre unique du personnel',
      legal_rule: 'Tout employeur tient un registre unique du personnel mentionnant chaque salarié dès son embauche (identité, emploi, dates d\'entrée et de sortie, type de contrat). D\'autres registres peuvent s\'appliquer (dangers graves et imminents, alertes santé publique-environnement, questions/réponses du CSE, etc.).',
      applicability: 'Tout employeur, dès le premier salarié.',
      applicability_condition: null,
      periodicity: 'Tenue permanente, mise à jour à chaque entrée et sortie.',
      articles: ['C. trav. L1221-13 à L1221-15-1'],
      source: [{ label: 'Entreprendre.Service-Public — Registre unique du personnel (F1784)', url: SP + 'F1784' }],
      source_checked_at: '2026-02-05', verified_at: CHECKED, validated_by: null,
      notes: 'Conditions et durées de conservation des autres registres non détaillées par la fiche : la question reste générique (« registres applicables »).'
    },

    LR_AFFICHAGES: {
      id: 'LR_AFFICHAGES', status: 'verified',
      title: 'Informations et affichages obligatoires',
      legal_rule: 'Certaines informations doivent être affichées ou communiquées aux salariés par tout moyen. Trois paliers : tout employeur (inspection du travail, médecine du travail, urgences, consignes incendie, conventions collectives, égalité de rémunération, horaires et repos, interdiction de fumer/vapoter, harcèlement et discrimination, accès au DUERP…) ; à partir de 11 salariés (membres du CSE, élections) ; à partir de 50 salariés (index égalité, règlement intérieur, accord de participation…).',
      applicability: 'Tout employeur ; contenu complémentaire à partir de 11 et de 50 salariés.',
      applicability_condition: null,
      periodicity: 'Information permanente, à actualiser à chaque changement.',
      articles: ['C. trav. D4711-1', 'R4227-34 à R4227-41', 'L3171-1', 'L1152-4', 'L1153-1 à L1153-6'],
      source: [{ label: 'Entreprendre.Service-Public — Affichage obligatoire (F23106)', url: SP + 'F23106' }],
      source_checked_at: '2026-07-08', verified_at: CHECKED, validated_by: null,
      notes: 'Liste lue en synthèse. La question ne détaille pas la liste : elle renvoie à une revue.'
    },

    LR_REGLEMENT_INTERIEUR: {
      id: 'LR_REGLEMENT_INTERIEUR', status: 'verified',
      title: 'Règlement intérieur',
      legal_rule: 'Obligatoire dans les entreprises d\'au moins 50 salariés, au terme d\'un délai de 12 mois à compter de l\'atteinte du seuil (renvoi à L2312-2). Contenu : santé et sécurité, discipline et échelle des sanctions, droits de la défense, harcèlement moral et sexuel, protection des lanceurs d\'alerte. Procédure : consultation du CSE, dépôt au greffe du conseil de prud\'hommes, transmission à l\'inspection du travail, publicité auprès des salariés.',
      applicability: 'Entreprises d\'au moins 50 salariés (seuil atteint pendant 12 mois consécutifs, puis délai de 12 mois).',
      applicability_condition: { field: 'company_size', in: ['50-249', '250-999', '1000+'] },
      periodicity: 'Aucune ; mise à jour lorsque la réglementation ou les règles internes évoluent.',
      articles: ['C. trav. L1311-1', 'L1311-2', 'L1321-1 à L1321-6', 'L1322-1 à L1322-3'],
      source: [
        { label: 'Entreprendre.Service-Public — Règlement intérieur (F1905)', url: SP + 'F1905' },
        { label: 'Légifrance — L1311-2', url: LF + 'LEGIARTI000038610176/' }
      ],
      source_checked_at: '2026-05-28', verified_at: CHECKED, validated_by: null,
      notes: 'En dessous de 50 salariés, le règlement intérieur est facultatif : la question n\'est pas posée.'
    },

    LR_CSE: {
      id: 'LR_CSE', status: 'verified',
      title: 'CSE — mise en place et élections',
      legal_rule: 'Mise en place obligatoire si l\'effectif d\'au moins 11 salariés est atteint pendant 12 mois consécutifs. L\'employeur informe le personnel de l\'organisation des élections (tous les 4 ans), invite les syndicats à négocier le protocole préélectoral (2 mois avant l\'expiration des mandats en cas de renouvellement). Mandats de 4 ans par défaut (2 à 4 ans par accord). À défaut de candidat, procès-verbal de carence affiché et transmis à l\'inspection du travail.',
      applicability: 'Entreprises d\'au moins 11 salariés (12 mois consécutifs) ; attributions élargies à partir de 50 salariés (12 mois consécutifs + 12 mois).',
      applicability_condition: { field: 'company_size', in: ['11-49', '50-249', '250-999', '1000+'] },
      periodicity: 'Élections tous les 4 ans par défaut (durée des mandats).',
      articles: ['C. trav. L2311-2', 'L2312-2', 'L2312-3', 'L2314-4', 'L2314-5', 'L2314-8', 'L2314-9', 'L2314-33', 'L2314-34'],
      source: [
        { label: 'Entreprendre.Service-Public — CSE : élections (F34474)', url: SP + 'F34474' },
        { label: 'Légifrance — L2314-33 (version issue de la loi n° 2025-989)', url: LF + 'LEGIARTI000052437191' }
      ],
      source_checked_at: null, verified_at: CHECKED, validated_by: null,
      notes: 'L2314-33 modifié par la loi n° 2025-989 du 24/10/2025 (limite de mandats successifs supprimée — à confirmer, sans impact sur la question).'
    },

    LR_BDESE: {
      id: 'LR_BDESE', status: 'verified',
      title: 'Base de données économiques, sociales et environnementales',
      legal_rule: 'Obligatoire à partir de 50 salariés (seuil atteint 12 mois consécutifs, délai d\'un an pour se mettre en conformité). Moins de 300 salariés : support papier ou informatique, mise à jour au moins tous les 2 mois. 300 salariés et plus : support informatique, mise à jour au moins mensuelle, contenu plus détaillé. Contenu adaptable par accord.',
      applicability: 'Entreprises d\'au moins 50 salariés.',
      applicability_condition: { field: 'company_size', in: ['50-249', '250-999', '1000+'] },
      periodicity: 'Mise à jour bimestrielle (< 300) ou mensuelle (≥ 300).',
      articles: ['C. trav. L2312-18', 'R2312-7 à R2312-15'],
      source: [{ label: 'Entreprendre.Service-Public — BDESE (F32193)', url: SP + 'F32193' }],
      source_checked_at: '2025-10-27', verified_at: CHECKED, validated_by: null,
      notes: 'Détail des rubriques par effectif non relu : la question reste générique.'
    },

    LR_NAO: {
      id: 'LR_NAO', status: 'verified',
      title: 'Négociations obligatoires en entreprise',
      legal_rule: 'Dans les entreprises où sont constituées une ou plusieurs sections syndicales d\'organisations représentatives, l\'employeur engage au moins tous les 4 ans une négociation sur la rémunération (salaires effectifs, temps de travail, partage de la valeur ajoutée) et sur l\'égalité professionnelle et la qualité de vie et des conditions de travail. À partir de 300 salariés : négociation sur la gestion des emplois et des parcours professionnels. Un accord de méthode peut fixer calendrier et thèmes (4 ans maximum) ; à défaut d\'accord, négociations annuelles (rémunération, égalité) et triennale (GEPP, ≥ 300).',
      applicability: 'Entreprises dotées d\'au moins une section syndicale d\'organisation représentative (en pratique, à partir de 50 salariés). Non déductible de l\'effectif seul : réponse « Non applicable » proposée.',
      applicability_condition: { field: 'company_size', in: ['50-249', '250-999', '1000+'] },
      periodicity: 'Au moins tous les 4 ans (ordre public) ; annuelle / triennale à défaut d\'accord.',
      articles: ['C. trav. L2242-1', 'L2242-2', 'L2242-10', 'L2242-11', 'L2242-13'],
      source: [{ label: 'Légifrance — Code du travail, L2242-1 et suivants', url: 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000006189527/' }],
      source_checked_at: null, verified_at: CHECKED, validated_by: null,
      notes: 'L2242-10, L2242-11, L2242-13 lus en synthèse seulement. Le filtre « à partir de 50 salariés » est une simplification (des délégués syndicaux peuvent exister en dessous, via un élu du CSE) : voir LEGAL_VALIDATION_REQUIRED.'
    },

    LR_INDEX_EGALITE: {
      id: 'LR_INDEX_EGALITE', status: 'verified',
      title: 'Index de l\'égalité professionnelle femmes-hommes',
      legal_rule: 'Les entreprises d\'au moins 50 salariés calculent et publient chaque année, au plus tard le 1er mars, leur index (4 indicateurs de 50 à 250 salariés, 5 au-delà), sur leur site, dans la BDESE et sur Égapro. Note < 75 : mesures de correction ; note de 75 à 85 : objectifs de progression.',
      applicability: 'Entreprises d\'au moins 50 salariés.',
      applicability_condition: { field: 'company_size', in: ['50-249', '250-999', '1000+'] },
      periodicity: 'Annuelle (publication au plus tard le 1er mars).',
      articles: ['C. trav. L1142-8 à L1142-11', 'D1142-4 à D1142-14'],
      source: [{ label: 'Entreprendre.Service-Public — Index de l\'égalité professionnelle (F35103)', url: SP + 'F35103' }],
      source_checked_at: '2025-07-10', verified_at: CHECKED, validated_by: null,
      notes: 'Régime en vigueur à la date de vérification. Le projet de loi de transposition de la directive (UE) 2023/970 prévoit de le faire évoluer : voir LEGAL_WATCH.'
    },

    LR_TRANSPARENCE_SALARIALE: {
      id: 'LR_TRANSPARENCE_SALARIALE', status: 'legal_validation_required',
      title: 'Transparence des rémunérations (directive (UE) 2023/970)',
      legal_rule: null,   // NE PAS RENSEIGNER tant que la transposition française n'est pas publiée et lue.
      applicability: 'Inconnue en droit français à la date de vérification.',
      applicability_condition: null,
      periodicity: null,
      articles: [],
      source: [
        { label: 'Légifrance — Directive (UE) 2023/970', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047656481' },
        { label: 'Entreprendre.Service-Public — actualité du 10/09/2026 (projet de loi)', url: 'https://entreprendre.service-public.gouv.fr/actualites/A19060' }
      ],
      source_checked_at: '2026-09-10', verified_at: CHECKED, validated_by: null,
      notes: 'Délai de transposition : 7 juin 2026. Au 18/09/2026, aucune loi ni ordonnance de transposition sur Légifrance ; projet de loi présenté en Conseil des ministres le 10/09/2026, en attente d\'examen parlementaire. Seuils et calendrier : non stabilisés.'
    },

    LR_ENTRETIEN_PARCOURS: {
      id: 'LR_ENTRETIEN_PARCOURS', status: 'verified',
      title: 'Entretien de parcours professionnel et état des lieux récapitulatif',
      legal_rule: 'Tout salarié bénéficie d\'un entretien de parcours professionnel (distinct de l\'évaluation), donnant lieu à un écrit dont une copie lui est remise. Premier entretien au cours de la première année, puis périodicité fixée par L6315-1 (4 ans à la date de vérification). État des lieux récapitulatif : voir LR_ETAT_DES_LIEUX_PARCOURS. Entreprises d\'au moins 50 salariés : abondement du CPF si, sur la période, le salarié n\'a pas bénéficié des entretiens prévus et d\'au moins une formation non obligatoire.',
      applicability: 'Tout employeur ; abondement correctif du CPF à partir de 50 salariés.',
      applicability_condition: null,
      periodicity: { first_interview: 'au cours de la 1re année', interview_every_years: 4, summary_review_every_years: 8 },
      articles: ['C. trav. L6315-1', 'L6323-13', 'Loi n° 2025-989 du 24 octobre 2025, art. 3'],
      source: [
        { label: 'Légifrance — L6315-1 (en vigueur depuis le 31/12/2025)', url: LF + 'LEGIARTI000053279288' },
        { label: 'Légifrance — Loi n° 2025-989, art. 3', url: 'https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000052430965' },
        { label: 'Service-Public — Entretien professionnel (F32040)', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F32040' }
      ],
      source_checked_at: '2026-02-20', verified_at: CHECKED, validated_by: null,
      notes: 'La périodicité n\'est JAMAIS écrite dans les libellés : elle est lue ici. Mesures transitoires (cycles de 6 ans en cours, accords existants applicables jusqu\'au 01/10/2026) : voir LEGAL_VALIDATION_REQUIRED.'
    },

    LR_ETAT_DES_LIEUX_PARCOURS: {
      id: 'LR_ETAT_DES_LIEUX_PARCOURS', status: 'legal_validation_required',
      title: 'État des lieux récapitulatif du parcours professionnel',
      legal_rule: 'Tout employeur réalise, pour chaque salarié, un état des lieux récapitulatif de son parcours professionnel (entretiens réalisés, formation suivie, certification, progression salariale ou professionnelle), à la périodicité fixée par L6315-1 (8 ans à la date de vérification). Entreprises d\'au moins 50 salariés : abondement correctif du CPF si les conditions ne sont pas remplies (L6323-13).',
      applicability: 'Tout employeur, pour les salariés atteignant l\'ancienneté prévue par L6315-1. L\'abondement du CPF (≥ 50 salariés) est une conséquence, pas une condition de l\'obligation.',
      applicability_condition: null,   // l'obligation ne dépend pas de l'effectif
      periodicity: { summary_review_every_years: 8 },
      articles: ['C. trav. L6315-1', 'L6323-13', 'Loi n° 2025-989 du 24 octobre 2025, art. 3'],
      source: [
        { label: 'Légifrance — L6315-1 (en vigueur depuis le 31/12/2025)', url: LF + 'LEGIARTI000053279288' },
        { label: 'Service-Public — Entretien professionnel (F32040)', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F32040' }
      ],
      source_checked_at: '2026-02-20', verified_at: CHECKED, validated_by: null,
      notes: 'Mesures transitoires non vérifiées : passage de 6 à 8 ans pour les cycles en cours, application aux accords collectifs existants à compter du 01/10/2026. C6 reste INACTIVE tant que ce point n\'est pas documenté.'
    },

    LR_DUERP: {
      id: 'LR_DUERP', status: 'verified',
      title: 'Document unique d\'évaluation des risques professionnels',
      legal_rule: 'Obligatoire dès le premier salarié. Mise à jour à chaque aménagement important ou information nouvelle sur un risque, et au moins une fois par an à partir de 11 salariés. Versions conservées 40 ans. À partir de 50 salariés : programme annuel de prévention (PAPRIPACT) ; en dessous : liste d\'actions de prévention. Conditions d\'accès portées à la connaissance des salariés.',
      applicability: 'Tout employeur, dès le premier salarié.',
      applicability_condition: null,
      periodicity: 'Au moins annuelle à partir de 11 salariés ; à chaque changement significatif pour tous.',
      articles: ['C. trav. L4121-3', 'L4121-3-1', 'R4121-1 à R4121-4'],
      source: [
        { label: 'Entreprendre.Service-Public — DUERP (F35360)', url: SP + 'F35360' },
        { label: 'Légifrance — L4121-3-1', url: LF + 'LEGIARTI000043893919' }
      ],
      source_checked_at: '2026-07-22', verified_at: CHECKED, validated_by: null,
      notes: 'Dépôt dématérialisé prévu par L4121-3-1 : fonctionnement effectif du portail non vérifié (non utilisé par la question). Sanctions modifiées par la loi n° 2026-534 du 25/06/2026 : non utilisées (le produit ne parle pas de sanctions).'
    },

    LR_EFFECTIF: {
      id: 'LR_EFFECTIF', status: 'legal_validation_required',
      title: 'Appréciation de l\'effectif pour les seuils',
      legal_rule: null,
      applicability: 'Transverse.',
      applicability_condition: null,
      periodicity: null,
      articles: ['CSS L130-1', 'C. trav. L2311-2', 'L2312-2'],
      source: [{ label: 'Légifrance — CSS L130-1', url: LF + 'LEGIARTI000051287151' }],
      source_checked_at: null, verified_at: CHECKED, validated_by: null,
      notes: 'Le diagnostic utilise la tranche déclarée comme approximation. Seuils du Code du travail (CSE, RI, BDESE) : 12 mois consécutifs. Seuils relevant de L130-1 CSS : moyenne annuelle et franchissement sur 5 années civiles consécutives. Choix de simplification à valider.'
    }
  };

  /* ------------------------------------------------------------------
   * Règles à valider AVANT activation (ou avant de lever une simplification).
   * ------------------------------------------------------------------ */
  var LEGAL_VALIDATION_REQUIRED = [
    { rule: 'LR_TRANSPARENCE_SALARIALE', blocking: true, questions: ['Q24'],
      point: 'Directive (UE) 2023/970 non transposée au 18/09/2026 (projet de loi du 10/09/2026). Activer Q24 uniquement après publication du texte : seuils, dates d\'application, conditions de red flag (obligation future ≠ manquement actuel).' },
    { rule: 'LR_EFFECTIF', blocking: false, questions: ['Q4', 'Q9', 'C3', 'C4', 'C5'],
      point: 'Valider l\'usage de la tranche d\'effectif déclarée (sans tester la durée de franchissement du seuil) et la mention correspondante dans l\'aide contextuelle.' },
    { rule: 'LR_NAO', blocking: false, questions: ['C4'],
      point: 'Valider le filtre « à partir de 50 salariés » + option « Non applicable » plutôt qu\'une question de contexte sur la présence de délégués syndicaux.' },
    { rule: 'LR_ETAT_DES_LIEUX_PARCOURS', blocking: true, questions: ['C6'],
      point: 'Applicabilité exacte de l\'état des lieux pendant la transition (cycles de 6 ans en cours, accords existants au 01/10/2026) à documenter sur source officielle (Q&R du Ministère du Travail) avant d\'activer C6.' },
    { rule: 'LR_ENTRETIEN_PARCOURS', blocking: false, questions: ['Q17'],
      point: 'Q17 reste active (libellé sans périodicité). Confirmer les mesures transitoires de la loi n° 2025-989 pour la périodicité des entretiens.' }
  ];

  /* Règles vérifiées mais susceptibles d'évoluer rapidement : à revérifier à chaque version. */
  var LEGAL_WATCH = [
    { rule: 'LR_INDEX_EGALITE', reason: 'Évolution annoncée par le projet de loi de transposition de la directive 2023/970.' },
    { rule: 'LR_ENTRETIEN_PARCOURS', reason: 'Réforme récente (loi n° 2025-989), entrée en application progressive.' },
    { rule: 'LR_DUERP', reason: 'Loi n° 2026-534 du 25/06/2026 ; portail de dépôt dématérialisé.' }
  ];

  var API = {
    version: '2026-09-18',
    RULES: RULES,
    LEGAL_VALIDATION_REQUIRED: LEGAL_VALIDATION_REQUIRED,
    LEGAL_WATCH: LEGAL_WATCH
  };
  root.ARH_LEGAL = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
