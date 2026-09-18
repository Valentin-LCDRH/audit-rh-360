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
 * vide tant qu'elle n'a pas eu lieu ; `legal_reviewed_at` = date de cette relecture. En mode production
 * (scoring.js › release), une règle sans `legal_reviewed_at` est désactivée (questions et red flags).
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
      source_checked_at: '2026-02-05', verified_at: CHECKED, validated_by: null, legal_reviewed_at: null,
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
      source_checked_at: '2026-07-08', verified_at: CHECKED, validated_by: null, legal_reviewed_at: null,
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
      source_checked_at: '2026-05-28', verified_at: CHECKED, validated_by: null, legal_reviewed_at: null,
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
      source_checked_at: null, verified_at: CHECKED, validated_by: null, legal_reviewed_at: null,
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
      source_checked_at: '2025-10-27', verified_at: CHECKED, validated_by: null, legal_reviewed_at: null,
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
      source_checked_at: null, verified_at: CHECKED, validated_by: null, legal_reviewed_at: null,
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
      source_checked_at: '2025-07-10', verified_at: CHECKED, validated_by: null, legal_reviewed_at: null,
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
      source_checked_at: '2026-09-10', verified_at: CHECKED, validated_by: null, legal_reviewed_at: null,
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
      source_checked_at: '2026-02-20', verified_at: CHECKED, validated_by: null, legal_reviewed_at: null,
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
      source_checked_at: '2026-02-20', verified_at: CHECKED, validated_by: null, legal_reviewed_at: null,
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
      source_checked_at: '2026-07-22', verified_at: CHECKED, validated_by: null, legal_reviewed_at: null,
      notes: 'Dépôt dématérialisé prévu par L4121-3-1 : fonctionnement effectif du portail non vérifié (non utilisé par la question). Sanctions modifiées par la loi n° 2026-534 du 25/06/2026 : non utilisées (le produit ne parle pas de sanctions).'
    },

    LR_SYNTEC_FORFAIT_JOURS: {
      id: 'LR_SYNTEC_FORFAIT_JOURS', status: 'verified',
      title: 'Forfait annuel en jours — Syntec (IDCC 1486)',
      legal_rule: 'Code du travail : le forfait annuel en jours exige l\'accord du salarié et une convention individuelle écrite (L3121-55), un accord collectif le prévoyant (L3121-63, entreprise ou à défaut branche) et comportant les clauses de L3121-64 ; il est réservé aux cadres autonomes et aux salariés à durée du travail non prédéterminable disposant d\'une réelle autonomie (L3121-58) ; l\'employeur s\'assure régulièrement que la charge de travail est raisonnable (L3121-60) ; repos quotidien et hebdomadaire restent dus (L3121-62). À défaut de clauses de suivi dans l\'accord : document de contrôle, charge compatible avec les repos et entretien annuel (L3121-65). Syntec (accord du 22 juin 1999 modifié par les avenants du 1er avril 2014 et n° 2 du 13 décembre 2022, étendu par arrêté du 12 juin 2024, en vigueur depuis le 1er juillet 2024) : éligibilité (large autonomie et, au minimum, position 2.3 de la grille des cadres, ou rémunération supérieure à 2 fois le plafond annuel de la sécurité sociale, ou mandataire social) ; convention individuelle écrite précisant missions, nombre de jours, rémunération et entretiens ; 218 jours maximum (solidarité incluse) ; rémunération au moins égale à 120 % du minimum conventionnel (122 % en position 2.3), vérifiée chaque année ; suivi des jours objectif, fiable et contradictoire ; repos de 11 h / 35 h et amplitude maximale de 13 h ; procédure d\'alerte sur la charge ; au moins un entretien par an.',
      applicability: 'Entreprises appliquant la convention IDCC 1486 et ayant des salariés au forfait annuel en jours (déclaration de l\'utilisateur). Un accord d\'entreprise sur le forfait jours prime sur l\'accord de branche (L3121-63).',
      applicability_condition: { all: [{ field: 'collective_agreement_idcc', in: ['1486'] }, { field: 'forfait_jours', in: ['yes'] }] },
      periodicity: { interview_min_per_year: 1, remuneration_check: 'annuelle', max_days: 218 },
      articles: ['C. trav. L3121-55', 'L3121-58 à L3121-66', 'Accord Syntec du 22 juin 1999, chap. II, art. 4 (avenants 2014 et n° 2 du 13/12/2022)'],
      source: [
        { label: 'Légifrance — Code du travail, conventions de forfait (L3121-53 à L3121-66)', url: 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000006189633/' },
        { label: 'Légifrance — L3121-64', url: LF + 'LEGIARTI000036262805' },
        { label: 'Légifrance — L3121-65', url: LF + 'LEGIARTI000036262800' },
        { label: 'Légifrance (KALI) — Syntec, avenant n° 2 du 13 décembre 2022 à l\'accord du 22 juin 1999', url: 'https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000047348407' },
        { label: 'Légifrance (JORF) — Arrêté d\'extension du 12 juin 2024', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049747149' },
        { label: 'Légifrance (KALI) — Syntec, avenant du 1er avril 2014', url: 'https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000029264464' }
      ],
      source_checked_at: '2026-09-18', verified_at: CHECKED, validated_by: null, legal_reviewed_at: null,
      notes: 'La question reste générique (« conditions prévues par votre convention collective ») : aucun seuil n\'est affiché ni utilisé pour déclencher un red flag. Le red flag repose sur la déclaration de l\'utilisateur (Non / Je ne sais pas). Points d\'interprétation listés dans LEGAL_VALIDATION_REQUIRED (non bloquants en maquette ; en production, la règle reste désactivée tant que legal_reviewed_at est vide).'
    },

    LR_METALLURGIE_CLASSIFICATION: {
      id: 'LR_METALLURGIE_CLASSIFICATION', status: 'verified',
      title: 'Classification des emplois — Métallurgie (IDCC 3248)',
      legal_rule: 'Convention collective nationale de la métallurgie du 7 février 2022 (étendue par arrêté du 14 décembre 2022, avenant du 11 juillet 2023 étendu le 12 décembre 2023), en vigueur depuis le 1er janvier 2024 (art. 182). Titre V : chaque emploi est décrit et classé sur la base de la réalité de l\'emploi tenu (art. 59) ; cotation selon six critères classants à dix degrés (complexité de l\'activité, connaissances, autonomie, contribution, encadrement/coopération, communication — art. 60 et 61), donnant 18 classes et 9 groupes (art. 62) ; l\'employeur établit une fiche descriptive de l\'emploi avant la cotation et la communique au salarié (art. 63.1) ; à la première application puis à l\'embauche, il notifie par écrit à chaque salarié le classement de son emploi ; le salarié peut demander des explications sous un mois, l\'employeur répond sous un mois en indiquant le degré retenu pour chaque critère (art. 63.2) ; consultation du CSE sur les modalités de mise en œuvre à partir de 50 salariés (art. 63.3) ; la première application ne peut réduire la rémunération annuelle totale brute (art. 69).',
      applicability: 'Entreprises appliquant la convention collective nationale de la métallurgie (IDCC 3248), sélectionnée par son IDCC.',
      applicability_condition: { field: 'collective_agreement_idcc', in: ['3248'] },
      periodicity: 'À la première application (1er janvier 2024), à chaque embauche et à chaque évolution significative et durable de l\'emploi (art. 63.2.3) ; fiche réexaminée lors de l\'entretien professionnel (art. 63.1).',
      articles: ['CCN métallurgie du 7 février 2022 (IDCC 3248), art. 59 à 64, 68, 69, 182'],
      source: [
        { label: 'Légifrance (KALI) — CCN de la métallurgie du 7 février 2022', url: 'https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000046993250' },
        { label: 'Légifrance (KALI) — art. 60, critères classants', url: 'https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000046315184' },
        { label: 'Légifrance (KALI) — art. 63.1, fiche descriptive (version avenant 2023)', url: 'https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000048437148' },
        { label: 'Légifrance (KALI) — art. 63.2.1, notification du classement', url: 'https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000046315204' },
        { label: 'Légifrance (JORF) — arrêté d\'extension du 14 décembre 2022', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000046772742' },
        { label: 'Légifrance (JORF) — arrêté d\'extension de l\'avenant du 11 juillet 2023', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000048567712' }
      ],
      source_checked_at: '2026-09-18', verified_at: CHECKED, validated_by: null, legal_reviewed_at: null,
      notes: 'Question générique (décrits, cotés, classés) : aucun critère, degré ni seuil n\'est affiché ni utilisé pour un red flag, qui repose sur la déclaration de l\'utilisateur (Non / Je ne sais pas). Articles lus via un outil de synthèse : seuls les extraits cités sont textuels, à relire mot à mot. Points d\'interprétation dans LEGAL_VALIDATION_REQUIRED.'
    },

    LR_METALLURGIE_MINIMA: {
      id: 'LR_METALLURGIE_MINIMA', status: 'verified',
      title: 'Salaires minima hiérarchiques — Métallurgie (IDCC 3248)',
      legal_rule: 'CCN de la métallurgie (IDCC 3248) : barème national unique de salaires minima hiérarchiques par classe d\'emploi (art. 138 ; barème en vigueur : annexe 6-1 créée par l\'avenant du 20 février 2026, étendu par arrêté du 20 mai 2026). Les minima sont adaptés à l\'horaire de travail effectif et supportent les majorations pour heures supplémentaires ou pour rémunération forfaitaire (forfaits en heures sur l\'année : +15 % ou +30 % ; forfait en jours : +30 %, proratisé si le nombre de jours est réduit), avec proratisation en cas d\'entrée, de départ, de suspension ou de changement de classement en cours d\'année ; barème adapté pour les débutants du groupe F (art. 139). Assiette de comparaison : éléments bruts soumis à cotisations, hors prime d\'ancienneté, majorations pour conditions particulières de travail, primes exceptionnelles, épargne salariale et frais (art. 140). Entreprises de 150 salariés au plus : report possible de l\'application du barème unique, au plus tard jusqu\'au 1er janvier 2030, sous conditions (art. 141).',
      applicability: 'Entreprises appliquant la convention collective nationale de la métallurgie (IDCC 3248). Les montants évoluent chaque année : aucun montant n\'est stocké ni affiché par l\'audit.',
      applicability_condition: { field: 'collective_agreement_idcc', in: ['3248'] },
      periodicity: 'Barème révisé par accord de branche (annuel à ce jour) ; vérification à chaque nouveau barème et à chaque changement de classement ou d\'organisation du temps de travail.',
      articles: ['CCN métallurgie (IDCC 3248), art. 138 à 143, annexe 6-1'],
      source: [
        { label: 'Légifrance (KALI) — CCN de la métallurgie du 7 février 2022', url: 'https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000046993250' },
        { label: 'Légifrance (KALI) — art. 139, adaptation et majorations des minima (version avenant 2023)', url: 'https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000048487963' },
        { label: 'Légifrance (KALI) — annexe 6-1, barème à partir de 2026 (avenant du 20 février 2026)', url: 'https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000054254729' },
        { label: 'Légifrance (JORF) — arrêté d\'extension du 20 mai 2026', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054200599' }
      ],
      source_checked_at: '2026-09-18', verified_at: CHECKED, validated_by: null, legal_reviewed_at: null,
      notes: 'Question générique (« minima applicables à leur classification et à leur organisation du temps de travail ») : aucun montant ni pourcentage n\'est affiché ni utilisé pour un red flag. Pourcentages des forfaits en heures lus en synthèse seulement. Points d\'interprétation dans LEGAL_VALIDATION_REQUIRED.'
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
      source_checked_at: null, verified_at: CHECKED, validated_by: null, legal_reviewed_at: null,
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
    { rule: 'LR_SYNTEC_FORFAIT_JOURS', blocking: false, questions: ['CCN1486_FJ'],
      point: 'À valider par un juriste avant production : (1) sort des conventions individuelles signées avant le 01/07/2024 (ancien seuil position 3, deux entretiens par an) — aucune disposition transitoire trouvée ; (2) portée du critère « 2 fois le PASS » (salariés sous la position 2.3, non-cadres) et articulation avec L3121-58 ; (3) seuil de rémunération (120 % / 122 %) pour un forfait réduit ou une année incomplète ; (4) plafond conventionnel de 230 jours en cas de renonciation face au plafond supplétif de 235 jours ; (5) marge d\'un accord d\'entreprise pour déroger à la branche ; (6) conséquences d\'un suivi défaillant (jurisprudence non lue) ; (7) textes non lus en détail : chapitre X « déconnexion » (avenant 2022), article 4.4 consolidé, annexe II de classification, L3131-1 et L3132-2.' },
    { rule: 'LR_METALLURGIE_CLASSIFICATION', blocking: false, questions: ['CCN3248_CLASSIF'],
      point: 'À valider par un juriste avant production : (1) formalisme de la fiche descriptive et de la cotation (art. 63.1 : « établit » et communique « par tout moyen » ; cotation détaillée communiquée seulement sur demande) ; (2) articulation avec un éventuel accord d\'entreprise sur la classification (C. trav. L2253-1, non lu) ; (3) portée et durée de la garantie de rémunération de première application (art. 69) ; (4) voies de contestation au-delà de la demande d\'explications ; (5) exclusions de l\'arrêté d\'extension du 14/12/2022 lues en synthèse (aucune relevée sur les art. 59-69) ; (6) articles lus via un outil de synthèse : relecture mot à mot.' },
    { rule: 'LR_METALLURGIE_MINIMA', blocking: false, questions: ['CCN3248_MINIMA'],
      point: 'À valider par un juriste avant production : (1) période de comparaison aux minima (annuelle ou mensuelle) — aucune clause explicite lue ; (2) report du barème unique jusqu\'au 01/01/2030 pour les entreprises de 150 salariés au plus (art. 141) : conditions et formalités non lues intégralement — une entreprise en report peut légitimement appliquer d\'autres minima ; (3) chevauchement éventuel avec des accords territoriaux encore en vigueur (valeur du point, minima) ; (4) seuils exacts des majorations de forfaits en heures (+15 % / +30 %) lus en synthèse ; (5) relecture mot à mot des art. 138 à 143.' },
    { rule: 'LR_ENTRETIEN_PARCOURS', blocking: false, questions: ['Q17'],
      point: 'Q17 reste active (libellé sans périodicité). Confirmer les mesures transitoires de la loi n° 2025-989 pour la périodicité des entretiens.' }
  ];

  /* Règles vérifiées mais susceptibles d'évoluer rapidement : à revérifier à chaque version. */
  var LEGAL_WATCH = [
    { rule: 'LR_INDEX_EGALITE', reason: 'Évolution annoncée par le projet de loi de transposition de la directive 2023/970.' },
    { rule: 'LR_ENTRETIEN_PARCOURS', reason: 'Réforme récente (loi n° 2025-989), entrée en application progressive.' },
    { rule: 'LR_DUERP', reason: 'Loi n° 2026-534 du 25/06/2026 ; portail de dépôt dématérialisé.' },
    { rule: 'LR_METALLURGIE_MINIMA', reason: 'Barème des salaires minima révisé chaque année par avenant de branche.' }
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
