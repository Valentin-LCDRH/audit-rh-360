/*! Audit RH 360° — Le Club des RH · v1.0.0 · bundle lisible
 *  Généré par scripts/build.js. Ne pas modifier à la main : voir le dépôt pour les sources. */

/* Configuration métier, sérialisée depuis src/config et src/data par scripts/build.js.
   Les champs de traçabilité (sources juridiques, articles, notes de validation, descriptions
   des règles de qualification) ne sont pas repris : ils ne sont pas lus à l'exécution. */
(function (w) {
  'use strict';
  w.ARH_QUESTIONS = {
  "version": "0.2.0",
  "ANSWER_SCALES": {
    "C": [
      {
        "id": "yes",
        "label": "Oui, totalement",
        "score": 100
      },
      {
        "id": "partial",
        "label": "Partiellement / à vérifier",
        "score": 50
      },
      {
        "id": "no",
        "label": "Non / pas encore",
        "score": 0
      },
      {
        "id": "unknown",
        "label": "Je ne sais pas",
        "score": 0,
        "vigilance": true
      },
      {
        "id": "na",
        "label": "Non applicable",
        "score": null
      }
    ],
    "M": [
      {
        "id": "A",
        "score": 0
      },
      {
        "id": "B",
        "score": 33
      },
      {
        "id": "C",
        "score": 67
      },
      {
        "id": "D",
        "score": 100
      }
    ]
  },
  "PILLARS": [
    {
      "id": "compliance",
      "order": 1,
      "score_field": "compliance_score",
      "label": "Conformité & fondamentaux RH",
      "short_label": "Fondamentaux RH",
      "strength_text": "Vos documents et registres de base semblent tenus et suivis.",
      "weak_text": "Plusieurs fondamentaux documentaires méritent une revue."
    },
    {
      "id": "payroll_admin",
      "order": 2,
      "score_field": "payroll_admin_score",
      "label": "Paie & administration RH",
      "short_label": "Paie & administration",
      "strength_text": "Votre paie et votre administration du personnel reposent sur des process fiables.",
      "weak_text": "La fiabilité de la paie et de l'administration repose encore sur des personnes plus que sur des process."
    },
    {
      "id": "employee_relations",
      "order": 3,
      "score_field": "employee_relations_score",
      "label": "Relations sociales",
      "short_label": "Relations sociales",
      "strength_text": "Votre dialogue social est anticipé et suivi.",
      "weak_text": "Le dialogue social est géré de façon plutôt réactive."
    },
    {
      "id": "recruitment",
      "order": 4,
      "score_field": "recruitment_score",
      "label": "Recrutement & onboarding",
      "short_label": "Recrutement",
      "strength_text": "Vos recrutements et votre intégration suivent un cadre commun.",
      "weak_text": "Vos pratiques de recrutement et d'intégration varient selon les équipes."
    },
    {
      "id": "development",
      "order": 5,
      "score_field": "development_score",
      "label": "Compétences & développement RH",
      "short_label": "Compétences",
      "strength_text": "Le développement des compétences est relié aux besoins de l'entreprise.",
      "weak_text": "Le développement des compétences est peu anticipé."
    },
    {
      "id": "compensation",
      "order": 6,
      "score_field": "compensation_score",
      "label": "Rémunération & équité",
      "short_label": "Rémunération",
      "strength_text": "Vos décisions salariales reposent sur un cadre partagé et des données fiables.",
      "weak_text": "Les décisions salariales manquent d'un cadre commun et de données pour les objectiver."
    },
    {
      "id": "management_qvct",
      "order": 7,
      "score_field": "management_qvct_score",
      "label": "Management, QVCT & prévention",
      "short_label": "Management & prévention",
      "strength_text": "La prévention est pilotée et vos managers sont outillés.",
      "weak_text": "La prévention et l'accompagnement des managers restent peu structurés."
    },
    {
      "id": "hr_operations_data",
      "order": 8,
      "score_field": "hr_operations_data_score",
      "label": "Organisation, SIRH & pilotage RH",
      "short_label": "Pilotage RH",
      "strength_text": "Votre fonction RH est pilotée avec des priorités claires et des données fiables.",
      "weak_text": "La fonction RH manque encore d'outils et de données pour piloter."
    }
  ],
  "CONTEXT": [
    {
      "id": "respondent_role",
      "label": "Votre fonction",
      "required": true,
      "options": [
        {
          "id": "ceo",
          "label": "CEO / Dirigeant"
        },
        {
          "id": "drh",
          "label": "DRH"
        },
        {
          "id": "daf",
          "label": "DAF"
        },
        {
          "id": "other",
          "label": "Autre"
        }
      ]
    },
    {
      "id": "company_size",
      "label": "Effectif de votre entreprise",
      "required": true,
      "help_text": "Indiquez l'effectif habituel. Les obligations qui dépendent d'un seuil s'apprécient selon des règles de calcul précises : le diagnostic en tient compte de façon simplifiée.",
      "options": [
        {
          "id": "1-10",
          "label": "1 à 10 salariés",
          "min": 1,
          "max": 10
        },
        {
          "id": "11-49",
          "label": "11 à 49 salariés",
          "min": 11,
          "max": 49
        },
        {
          "id": "50-249",
          "label": "50 à 249 salariés",
          "min": 50,
          "max": 249
        },
        {
          "id": "250-999",
          "label": "250 à 999 salariés",
          "min": 250,
          "max": 999
        },
        {
          "id": "1000+",
          "label": "1 000 salariés et plus",
          "min": 1000,
          "max": null
        }
      ]
    },
    {
      "id": "has_cse",
      "label": "Disposez-vous d'un CSE ?",
      "required": true,
      "help_text": "Le CSE est obligatoire lorsque l'entreprise atteint au moins 11 salariés pendant 12 mois consécutifs (effectif calculé selon les règles du Code du travail).",
      "applicability": {
        "field": "company_size",
        "in": [
          "11-49",
          "50-249",
          "250-999",
          "1000+"
        ]
      },
      "options": [
        {
          "id": "yes",
          "label": "Oui"
        },
        {
          "id": "no",
          "label": "Non"
        },
        {
          "id": "in_progress",
          "label": "En cours de mise en place"
        }
      ]
    },
    {
      "id": "collective_agreement",
      "type": "ccn_search",
      "required": true,
      "label": "Quelle convention collective appliquez-vous ?",
      "help_text": "Cela nous permet d'adapter certaines vérifications à votre situation.",
      "placeholder": "Rechercher par nom ou numéro IDCC..."
    },
    {
      "id": "hr_organization",
      "label": "Qui porte les RH aujourd'hui ?",
      "required": true,
      "options": [
        {
          "id": "hr_team",
          "label": "Équipe RH dédiée"
        },
        {
          "id": "finance",
          "label": "Direction financière"
        },
        {
          "id": "leadership",
          "label": "Direction"
        },
        {
          "id": "external",
          "label": "Prestataire externe"
        },
        {
          "id": "other",
          "label": "Autre",
          "detail": {
            "id": "hr_organization_other",
            "label": "Précisez",
            "placeholder": "Précisez en quelques mots",
            "required": true,
            "maxlength": 120
          }
        }
      ]
    }
  ],
  "QUESTIONS": [
    {
      "id": "Q1",
      "pillar": "compliance",
      "type": "C",
      "weight": 3,
      "short_label": "Modèles de contrats et documents salariés",
      "question": "Vos modèles de contrats de travail, avenants et documents remis aux salariés sont-ils régulièrement revus pour tenir compte des évolutions légales, conventionnelles et de vos pratiques internes ?",
      "help_text": "Contrats, avenants, notices, chartes : ce sont les documents qui engagent l'entreprise au quotidien. Une revue régulière évite d'utiliser des clauses devenues obsolètes.",
      "allow_na": false,
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Des modèles non revus peuvent contenir des clauses devenues inadaptées.",
      "recommendation_by_answer": {
        "partial": "Réaliser une revue documentaire afin d'identifier les modèles nécessitant une mise à jour ou une harmonisation.",
        "no": "Réaliser une revue documentaire afin d'identifier les modèles nécessitant une mise à jour ou une harmonisation, puis planifier une revue annuelle.",
        "unknown": "Identifier qui est responsable des modèles de documents RH et vérifier la date de leur dernière mise à jour."
      },
      "commercial_tags": [
        "audit_rh"
      ]
    },
    {
      "id": "Q2",
      "pillar": "compliance",
      "type": "C",
      "weight": 3,
      "short_label": "Registre unique du personnel et registres RH",
      "question": "Votre registre unique du personnel et les autres registres RH applicables à votre entreprise sont-ils correctement tenus et à jour ?",
      "help_text": "Le registre unique du personnel recense chaque salarié dès son embauche. D'autres registres peuvent s'ajouter selon votre situation.",
      "allow_na": false,
      "legal_rule": [
        "LR_REGISTRE_PERSONNEL"
      ],
      "red_flag_conditions": [
        {
          "answers": [
            "no",
            "unknown"
          ],
          "obligation": "LR_REGISTRE_PERSONNEL"
        }
      ],
      "applicability": null,
      "area_text": "Les registres obligatoires doivent être tenus à jour en continu.",
      "recommendation_by_answer": {
        "partial": "Contrôler la complétude du registre unique du personnel (entrées, sorties, mentions obligatoires) et lister les autres registres applicables.",
        "no": "Mettre à jour le registre unique du personnel en priorité et définir qui le tient à chaque entrée et sortie.",
        "unknown": "Vérifier l'existence et la mise à jour du registre unique du personnel et des autres registres applicables."
      },
      "commercial_tags": [
        "audit_rh"
      ]
    },
    {
      "id": "Q3",
      "pillar": "compliance",
      "type": "C",
      "weight": 2,
      "short_label": "Informations et affichages obligatoires",
      "question": "Les informations et affichages obligatoires applicables à votre entreprise sont-ils à jour et correctement accessibles aux salariés ?",
      "help_text": "Certaines informations doivent être portées à la connaissance des salariés (affichage physique ou tout moyen accessible). La liste dépend notamment de votre effectif.",
      "allow_na": false,
      "legal_rule": [
        "LR_AFFICHAGES"
      ],
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Les informations obligatoires évoluent avec la réglementation et l'effectif.",
      "recommendation_by_answer": {
        "partial": "Réaliser une revue des informations et affichages applicables à l'entreprise.",
        "no": "Réaliser une revue des informations et affichages applicables à l'entreprise et désigner un responsable de leur mise à jour.",
        "unknown": "Réaliser une revue des informations et affichages applicables à l'entreprise."
      },
      "commercial_tags": [
        "audit_rh"
      ]
    },
    {
      "id": "Q4",
      "pillar": "compliance",
      "type": "C",
      "weight": 3,
      "short_label": "Règlement intérieur",
      "question": "Votre règlement intérieur est-il à jour au regard des obligations applicables à votre entreprise ?",
      "help_text": "Le règlement intérieur fixe notamment les règles d'hygiène, de sécurité et de discipline. Sa mise à jour suit une procédure précise.",
      "allow_na": false,
      "legal_rule": [
        "LR_REGLEMENT_INTERIEUR"
      ],
      "red_flag_conditions": [
        {
          "answers": [
            "no",
            "unknown"
          ],
          "obligation": "LR_REGLEMENT_INTERIEUR"
        }
      ],
      "applicability": {
        "field": "company_size",
        "in": [
          "50-249",
          "250-999",
          "1000+"
        ]
      },
      "area_text": "Le règlement intérieur doit suivre les évolutions réglementaires et internes.",
      "recommendation_by_answer": {
        "partial": "Faire relire le règlement intérieur au regard des évolutions réglementaires et vérifier la procédure suivie lors de sa dernière modification.",
        "no": "Mettre en place ou actualiser le règlement intérieur en respectant la procédure applicable (consultation, dépôt, publicité).",
        "unknown": "Vérifier l'existence du règlement intérieur, sa date de mise à jour et la procédure suivie."
      },
      "commercial_tags": [
        "audit_rh"
      ]
    },
    {
      "id": "Q5",
      "pillar": "payroll_admin",
      "type": "M",
      "weight": 3,
      "short_label": "Sécurisation du processus de paie",
      "question": "Comment qualifieriez-vous la sécurisation de votre processus de paie ?",
      "help_text": "Il s'agit de la façon dont les éléments variables sont collectés, contrôlés et validés avant chaque paie.",
      "answers": {
        "A": "Le processus repose encore largement sur des échanges manuels et des contrôles individuels.",
        "B": "Les principales étapes sont définies, mais certaines anomalies sont encore détectées tardivement.",
        "C": "La collecte des variables, les responsabilités et les contrôles sont clairement organisés.",
        "D": "Le processus est formalisé, tracé et permet d'identifier les anomalies avant validation de la paie."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Des contrôles définis avant validation limitent les erreurs de paie et leurs régularisations.",
      "recommendation_by_answer": {
        "A": "Cartographier le processus de paie (collecte des variables, responsables, échéances) et instaurer des contrôles avant validation.",
        "B": "Formaliser une liste de contrôles avant validation de la paie pour détecter les anomalies plus tôt.",
        "C": "Tracer les contrôles réalisés et suivre les anomalies récurrentes pour en traiter les causes."
      },
      "commercial_tags": [
        "orkest",
        "drh_externalise"
      ]
    },
    {
      "id": "Q6",
      "pillar": "payroll_admin",
      "type": "M",
      "weight": 2,
      "short_label": "Gestion des dossiers salariés",
      "question": "Comment sont gérées les données et pièces administratives des salariés ?",
      "help_text": "Contrats, pièces justificatives, informations personnelles et historiques administratifs.",
      "answers": {
        "A": "Les informations sont dispersées entre plusieurs outils, fichiers ou échanges.",
        "B": "Une partie est centralisée, mais des recherches ou retraitements restent fréquents.",
        "C": "Les dossiers sont centralisés et globalement fiables.",
        "D": "Les données sont centralisées, à jour, facilement accessibles et leur complétude est contrôlée."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Des dossiers dispersés ralentissent la gestion et fragilisent la traçabilité.",
      "recommendation_by_answer": {
        "A": "Définir un emplacement unique pour les dossiers salariés et la liste des pièces attendues par dossier.",
        "B": "Achever la centralisation des dossiers et supprimer les copies parallèles.",
        "C": "Mettre en place un contrôle périodique de complétude des dossiers."
      },
      "commercial_tags": [
        "orkest"
      ]
    },
    {
      "id": "Q7",
      "pillar": "payroll_admin",
      "type": "M",
      "weight": 2,
      "short_label": "Entrées, mobilités et sorties",
      "question": "Dans quelle mesure vos entrées, changements de situation et sorties sont-ils sécurisés ?",
      "help_text": "Embauches, changements de poste ou de temps de travail, départs : les étapes administratives associées.",
      "answers": {
        "A": "Ils dépendent principalement des habitudes de chaque personne.",
        "B": "Des process existent mais leur application est variable.",
        "C": "Des étapes et responsabilités communes sont clairement définies.",
        "D": "Les process sont standardisés, suivis et permettent d'identifier rapidement les étapes manquantes."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Des étapes oubliées à l'entrée ou à la sortie ont souvent des conséquences en paie.",
      "recommendation_by_answer": {
        "A": "Formaliser une check-list commune pour les entrées, changements de situation et sorties.",
        "B": "Désigner un responsable par étape et vérifier l'application des check-lists.",
        "C": "Suivre l'avancement de chaque dossier pour repérer rapidement les étapes manquantes."
      },
      "commercial_tags": [
        "orkest"
      ]
    },
    {
      "id": "Q8",
      "pillar": "payroll_admin",
      "type": "M",
      "weight": 3,
      "short_label": "Continuité de l'administration RH et de la paie",
      "question": "Si la personne clé en charge de votre administration RH / paie était absente pendant un mois, pourriez-vous assurer la continuité des principaux processus ?",
      "help_text": "Cette question mesure la dépendance de vos processus critiques à une seule personne.",
      "answers": {
        "A": "Très difficilement.",
        "B": "Oui, mais avec des difficultés importantes.",
        "C": "Oui, grâce à des process et relais identifiés.",
        "D": "Oui, sans dégradation significative grâce à une organisation documentée et sécurisée."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Une dépendance à une seule personne fragilise la paie et l'administration.",
      "recommendation_by_answer": {
        "A": "Documenter les processus critiques (paie, déclarations, entrées/sorties) et désigner un relais formé.",
        "B": "Compléter la documentation des processus critiques et organiser un binôme ou un relais externe.",
        "C": "Tester périodiquement le relais identifié sur un cycle de paie complet."
      },
      "commercial_tags": [
        "drh_externalise",
        "orkest"
      ]
    },
    {
      "id": "Q9",
      "pillar": "employee_relations",
      "type": "C",
      "weight": 3,
      "short_label": "Élections des représentants du personnel",
      "question": "Les élections et renouvellements de vos représentants du personnel sont-ils correctement anticipés et organisés ?",
      "help_text": "Cela inclut le calendrier des mandats, le protocole préélectoral et, en l'absence de candidat, le procès-verbal correspondant. L'obligation s'applique lorsque l'effectif d'au moins 11 salariés est atteint pendant 12 mois consécutifs.",
      "allow_na": true,
      "na_label": "Non applicable : 11 salariés atteints depuis moins de 12 mois consécutifs",
      "legal_rule": [
        "LR_CSE"
      ],
      "red_flag_conditions": [
        {
          "answers": [
            "no",
            "unknown"
          ],
          "obligation": "LR_CSE"
        }
      ],
      "applicability": {
        "any": [
          {
            "field": "company_size",
            "in": [
              "11-49",
              "50-249",
              "250-999",
              "1000+"
            ]
          },
          {
            "field": "has_cse",
            "in": [
              "yes",
              "in_progress"
            ]
          }
        ]
      },
      "area_text": "Les échéances électorales doivent être anticipées pour éviter une interruption de la représentation du personnel.",
      "recommendation_by_answer": {
        "partial": "Établir le calendrier des mandats en cours et planifier les prochaines étapes électorales.",
        "no": "Vérifier votre situation au regard des seuils applicables et organiser les élections ou formaliser le procès-verbal adapté.",
        "unknown": "Vérifier la date de fin des mandats en cours, ou la date des dernières élections et du procès-verbal associé."
      },
      "commercial_tags": [
        "relations_sociales",
        "audit_rh"
      ]
    },
    {
      "id": "Q10",
      "pillar": "employee_relations",
      "type": "M",
      "weight": 3,
      "short_label": "Calendrier social",
      "question": "Comment gérez-vous votre calendrier social ?",
      "help_text": "Échéances sociales de l'année : consultations, négociations, entretiens, déclarations, élections.",
      "answers": {
        "A": "Les échéances sont principalement traitées lorsqu'elles arrivent.",
        "B": "Un calendrier existe mais certaines échéances restent gérées dans l'urgence.",
        "C": "Les principales échéances sont anticipées et préparées.",
        "D": "Le calendrier social est piloté en amont et intégré à la roadmap RH / direction."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": {
        "field": "company_size",
        "in": [
          "11-49",
          "50-249",
          "250-999",
          "1000+"
        ]
      },
      "area_text": "Un calendrier social anticipé évite de traiter les échéances dans l'urgence.",
      "recommendation_by_answer": {
        "A": "Construire un calendrier social annuel recensant toutes les échéances applicables.",
        "B": "Associer à chaque échéance un responsable et une date de préparation.",
        "C": "Intégrer le calendrier social à la feuille de route RH partagée avec la direction."
      },
      "commercial_tags": [
        "relations_sociales",
        "orkest"
      ]
    },
    {
      "id": "Q11",
      "pillar": "employee_relations",
      "type": "M",
      "weight": 3,
      "short_label": "Préparation et suivi des instances",
      "question": "Comment qualifieriez-vous la préparation et le suivi de vos instances représentatives ?",
      "help_text": "Ordres du jour, informations transmises, consultations, procès-verbaux et suivi des engagements.",
      "answers": {
        "A": "Le fonctionnement est principalement réactif.",
        "B": "Les obligations sont globalement respectées mais le suivi reste chronophage ou peu structuré.",
        "C": "Réunions, consultations, documents et engagements font l'objet d'un process fiable.",
        "D": "Le dialogue social est anticipé et utilisé comme un levier d'accompagnement des transformations."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": {
        "any": [
          {
            "field": "has_cse",
            "in": [
              "yes",
              "in_progress"
            ]
          },
          {
            "field": "company_size",
            "in": [
              "50-249",
              "250-999",
              "1000+"
            ]
          }
        ]
      },
      "area_text": "Un fonctionnement réactif des instances complique les consultations et projets.",
      "recommendation_by_answer": {
        "A": "Formaliser la préparation des réunions (ordre du jour, documents, délais) et le suivi des procès-verbaux.",
        "B": "Outiller le suivi des consultations et des engagements pris en réunion.",
        "C": "Associer les représentants du personnel en amont des projets de transformation."
      },
      "commercial_tags": [
        "relations_sociales"
      ]
    },
    {
      "id": "Q12",
      "pillar": "employee_relations",
      "type": "M",
      "weight": 2,
      "short_label": "Suivi des accords et engagements",
      "question": "Disposez-vous d'une vision centralisée des accords, engagements et actions issus du dialogue social ?",
      "help_text": "Accords d'entreprise, plans d'action, engagements pris en réunion et leurs échéances.",
      "answers": {
        "A": "Non, les informations sont très dispersées.",
        "B": "Partiellement.",
        "C": "Oui, les documents et échéances sont centralisés.",
        "D": "Oui, avec un suivi des engagements, échéances et actions associées."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": {
        "any": [
          {
            "field": "has_cse",
            "in": [
              "yes",
              "in_progress"
            ]
          },
          {
            "field": "company_size",
            "in": [
              "50-249",
              "250-999",
              "1000+"
            ]
          }
        ]
      },
      "area_text": "Sans vue d'ensemble, des échéances d'accords ou engagements peuvent être manquées.",
      "recommendation_by_answer": {
        "A": "Recenser les accords en vigueur, leurs dates d'échéance et les engagements associés.",
        "B": "Centraliser les accords et engagements dans un référentiel unique.",
        "C": "Compléter la vue centralisée des accords par un suivi des actions et des échéances."
      },
      "commercial_tags": [
        "relations_sociales",
        "orkest"
      ]
    },
    {
      "id": "C3",
      "pillar": "employee_relations",
      "type": "C",
      "weight": 2,
      "short_label": "Base de données économiques, sociales et environnementales (BDESE)",
      "question": "Votre base de données économiques, sociales et environnementales (BDESE) est-elle en place, alimentée et accessible aux représentants du personnel ?",
      "help_text": "La BDESE rassemble les informations économiques, sociales et environnementales mises à disposition du CSE.",
      "allow_na": false,
      "legal_rule": [
        "LR_BDESE"
      ],
      "red_flag_conditions": [
        {
          "answers": [
            "no",
            "unknown"
          ],
          "obligation": "LR_BDESE"
        }
      ],
      "applicability": {
        "field": "company_size",
        "in": [
          "50-249",
          "250-999",
          "1000+"
        ]
      },
      "area_text": "La BDESE doit être tenue à jour et accessible au CSE.",
      "recommendation_by_answer": {
        "partial": "Vérifier que la BDESE contient les rubriques attendues pour votre effectif et qu'elle est mise à jour.",
        "no": "Mettre en place la BDESE et organiser son alimentation régulière.",
        "unknown": "Vérifier l'existence de la BDESE, son contenu et les modalités d'accès du CSE."
      },
      "commercial_tags": [
        "relations_sociales",
        "audit_rh"
      ]
    },
    {
      "id": "C4",
      "pillar": "employee_relations",
      "type": "C",
      "weight": 2,
      "short_label": "Négociations obligatoires",
      "question": "Les négociations obligatoires applicables à votre entreprise sont-elles engagées selon le calendrier prévu ?",
      "help_text": "Elles concernent les entreprises où sont constituées une ou plusieurs sections syndicales représentatives. Si ce n'est pas votre cas, répondez « Non applicable ».",
      "allow_na": true,
      "na_label": "Non applicable (pas de section syndicale représentative)",
      "legal_rule": [
        "LR_NAO"
      ],
      "red_flag_conditions": [
        {
          "answers": [
            "no"
          ],
          "obligation": "LR_NAO"
        }
      ],
      "applicability": {
        "field": "company_size",
        "in": [
          "50-249",
          "250-999",
          "1000+"
        ]
      },
      "area_text": "Les négociations obligatoires suivent une périodicité fixée par la loi ou par accord.",
      "recommendation_by_answer": {
        "partial": "Vérifier que chaque thème de négociation obligatoire est couvert selon la périodicité applicable.",
        "no": "Établir le calendrier des négociations obligatoires et engager celles qui sont échues.",
        "unknown": "Vérifier la présence de sections syndicales représentatives et, le cas échéant, le calendrier des négociations."
      },
      "commercial_tags": [
        "relations_sociales",
        "audit_rh"
      ]
    },
    {
      "id": "Q13",
      "pillar": "recruitment",
      "type": "M",
      "weight": 2,
      "short_label": "Homogénéité du processus de recrutement",
      "question": "À quel point votre processus de recrutement est-il homogène entre les différentes équipes ?",
      "help_text": "Étapes, rôles des intervenants et règles de décision, d'une équipe à l'autre.",
      "answers": {
        "A": "Chaque manager recrute principalement selon ses propres pratiques.",
        "B": "Un cadre existe mais son application varie fortement.",
        "C": "Le process et les rôles sont clairement définis et globalement appliqués.",
        "D": "Le process est homogène, mesuré et régulièrement amélioré."
      },
      "variants": [
        {
          "id": "small",
          "when": {
            "field": "company_size",
            "in": [
              "1-10"
            ]
          },
          "short_label": "Structuration du recrutement",
          "question": "Votre manière de recruter est-elle suffisamment structurée pour être reproduite d'un recrutement à l'autre ?",
          "help_text": "Étapes, personnes impliquées et critères de décision, d'un recrutement à l'autre.",
          "answers": {
            "A": "Chaque recrutement se fait au cas par cas.",
            "B": "Quelques repères existent, mais ils changent d'un recrutement à l'autre.",
            "C": "Les étapes et les rôles sont définis et appliqués à chaque recrutement.",
            "D": "Le processus est défini, suivi et amélioré après chaque recrutement."
          },
          "recommendation_by_answer": {
            "A": "Formaliser les étapes clés d'un recrutement (besoin, sourcing, entretiens, décision) pour pouvoir les reproduire.",
            "B": "Stabiliser ces repères dans une trame simple, utilisée à chaque recrutement.",
            "C": "Faire un court bilan après chaque recrutement pour améliorer le processus."
          }
        }
      ],
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Des pratiques hétérogènes rendent les recrutements moins prévisibles.",
      "recommendation_by_answer": {
        "A": "Définir un processus de recrutement commun (étapes, rôles, délais) et le partager aux managers.",
        "B": "Accompagner les managers dans l'application du processus commun.",
        "C": "Mesurer le processus (délais, taux de conversion) pour l'améliorer."
      },
      "commercial_tags": [
        "recrutement"
      ]
    },
    {
      "id": "Q14",
      "pillar": "recruitment",
      "type": "M",
      "weight": 2,
      "short_label": "Objectivation des décisions de recrutement",
      "question": "Comment les décisions de recrutement sont-elles objectivées ?",
      "help_text": "Critères d'évaluation, grilles d'entretien, prise de décision collective.",
      "answers": {
        "A": "Principalement à l'appréciation des interviewers.",
        "B": "Des critères existent mais ne sont pas systématiquement utilisés.",
        "C": "Des critères et grilles communes structurent les décisions.",
        "D": "Les critères sont structurés, partagés, documentés et leur efficacité est régulièrement revue."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Des critères partagés fiabilisent les décisions et limitent les biais.",
      "recommendation_by_answer": {
        "A": "Définir des critères d'évaluation par poste et une grille d'entretien commune.",
        "B": "Rendre l'usage des grilles systématique et documenter les décisions.",
        "C": "Revoir périodiquement les critères au regard de la réussite des recrues."
      },
      "commercial_tags": [
        "recrutement"
      ]
    },
    {
      "id": "Q15",
      "pillar": "recruitment",
      "type": "M",
      "weight": 2,
      "short_label": "Onboarding",
      "question": "Comment qualifieriez-vous votre onboarding ?",
      "help_text": "L'intégration des nouveaux arrivants, de l'accord du candidat à la fin de la période d'essai.",
      "answers": {
        "A": "Il dépend principalement du manager.",
        "B": "Des étapes communes existent mais leur application varie.",
        "C": "Un parcours structuré est appliqué de manière homogène.",
        "D": "Le parcours est structuré, suivi dans le temps et son efficacité est mesurée."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Un parcours d'intégration commun sécurise les premiers mois.",
      "recommendation_by_answer": {
        "A": "Construire un parcours d'intégration commun (avant l'arrivée, premier jour, premiers mois).",
        "B": "Suivre l'application du parcours d'intégration par équipe.",
        "C": "Mesurer l'efficacité de l'intégration (retours des recrues, départs en période d'essai)."
      },
      "commercial_tags": [
        "recrutement"
      ]
    },
    {
      "id": "Q16",
      "pillar": "recruitment",
      "type": "M",
      "weight": 1,
      "short_label": "Pilotage des recrutements",
      "question": "Dans quelle mesure pilotez-vous l'efficacité de vos recrutements ?",
      "help_text": "Délais, sources, taux de conversion, coût, réussite des recrues.",
      "answers": {
        "A": "Peu ou pas d'indicateurs.",
        "B": "Quelques indicateurs opérationnels sont suivis.",
        "C": "Les principaux KPI permettent d'identifier les points d'amélioration.",
        "D": "Les données sont régulièrement utilisées pour arbitrer les ressources, canaux et process de recrutement."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Quelques indicateurs suffisent pour savoir où agir en priorité.",
      "recommendation_by_answer": {
        "A": "Suivre trois indicateurs simples : délai de recrutement, source des embauches, départs en période d'essai.",
        "B": "Compléter les indicateurs pour identifier les étapes à améliorer.",
        "C": "Utiliser les indicateurs pour arbitrer les canaux et les ressources de recrutement."
      },
      "commercial_tags": [
        "recrutement",
        "orkest"
      ]
    },
    {
      "id": "Q17",
      "pillar": "development",
      "type": "C",
      "weight": 3,
      "short_label": "Entretiens de parcours professionnel",
      "question": "Les entretiens de parcours professionnel applicables à vos salariés sont-ils planifiés, réalisés, documentés et suivis conformément aux obligations en vigueur ?",
      "help_text": "Entretiens consacrés aux perspectives d'évolution professionnelle, distincts de l'entretien annuel d'évaluation. Leur périodicité est fixée par la réglementation en vigueur.",
      "allow_na": false,
      "legal_rule": [
        "LR_ENTRETIEN_PARCOURS"
      ],
      "red_flag_conditions": [
        {
          "answers": [
            "no",
            "unknown"
          ],
          "obligation": "LR_ENTRETIEN_PARCOURS"
        }
      ],
      "applicability": null,
      "area_text": "Ces entretiens obéissent à une périodicité et à un formalisme réglementaires.",
      "recommendation_by_answer": {
        "partial": "Recenser, salarié par salarié, la date du dernier entretien et planifier ceux à réaliser.",
        "no": "Planifier les entretiens de parcours professionnel dus et mettre en place un suivi par salarié.",
        "unknown": "Vérifier, salarié par salarié, la date du dernier entretien de parcours professionnel et sa formalisation."
      },
      "commercial_tags": [
        "audit_rh"
      ]
    },
    {
      "id": "C6",
      "pillar": "development",
      "type": "C",
      "weight": 2,
      "short_label": "État des lieux du parcours professionnel",
      "question": "Pour les salariés concernés, l'état des lieux récapitulatif de leur parcours professionnel est-il réalisé et formalisé ?",
      "help_text": "Bilan périodique qui vérifie que le salarié a bénéficié des entretiens et actions prévus. Si aucun salarié n'a encore l'ancienneté requise, répondez « Non applicable ».",
      "allow_na": true,
      "na_label": "Non applicable (aucun salarié concerné à ce jour)",
      "legal_rule": [
        "LR_ETAT_DES_LIEUX_PARCOURS"
      ],
      "red_flag_conditions": [
        {
          "answers": [
            "no",
            "unknown"
          ],
          "obligation": "LR_ETAT_DES_LIEUX_PARCOURS"
        }
      ],
      "applicability": null,
      "area_text": "L'état des lieux récapitulatif est exigé à une échéance réglementaire.",
      "recommendation_by_answer": {
        "partial": "Identifier les salariés arrivant à l'échéance de l'état des lieux et vérifier leur dossier.",
        "no": "Réaliser les états des lieux dus et vérifier les entretiens et actions associés.",
        "unknown": "Identifier les salariés concernés par l'état des lieux et vérifier leur situation."
      },
      "commercial_tags": [
        "audit_rh"
      ]
    },
    {
      "id": "Q18",
      "pillar": "development",
      "type": "M",
      "weight": 2,
      "short_label": "Détermination des besoins de formation",
      "question": "Comment vos besoins en formation sont-ils déterminés ?",
      "help_text": "La façon dont le plan de développement des compétences est construit.",
      "answers": {
        "A": "Principalement au fil des demandes individuelles.",
        "B": "Les besoins sont collectés mais peu priorisés.",
        "C": "Ils sont priorisés en fonction des besoins des équipes et métiers.",
        "D": "Ils découlent d'une analyse des compétences nécessaires et leur impact est ensuite évalué."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Des formations priorisées selon les besoins métiers ont plus d'impact.",
      "recommendation_by_answer": {
        "A": "Organiser une collecte annuelle des besoins de formation auprès des managers.",
        "B": "Prioriser les besoins selon les enjeux des équipes et le budget disponible.",
        "C": "Relier le plan de formation aux compétences clés et évaluer son impact."
      },
      "commercial_tags": [
        "drh_externalise"
      ]
    },
    {
      "id": "Q19",
      "pillar": "development",
      "type": "M",
      "weight": 2,
      "short_label": "Cartographie des compétences",
      "question": "Quelle visibilité avez-vous sur les compétences critiques dont l'entreprise aura besoin dans les 12 à 24 prochains mois ?",
      "help_text": "Compétences sans lesquelles l'activité ou les projets de l'entreprise seraient fragilisés.",
      "answers": {
        "A": "Très faible.",
        "B": "Quelques besoins ont été identifiés de manière informelle.",
        "C": "Les principales compétences critiques sont identifiées.",
        "D": "Elles sont cartographiées et alimentent les décisions de recrutement, formation et mobilité."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Identifier les compétences critiques permet d'anticiper recrutements et formations.",
      "recommendation_by_answer": {
        "A": "Identifier avec la direction les compétences critiques pour les deux prochaines années.",
        "B": "Formaliser les compétences critiques et les rattacher aux postes concernés.",
        "C": "Utiliser la cartographie des compétences pour arbitrer recrutement, formation et mobilité."
      },
      "commercial_tags": [
        "drh_externalise"
      ]
    },
    {
      "id": "Q20",
      "pillar": "development",
      "type": "M",
      "weight": 1,
      "short_label": "Lisibilité des parcours d'évolution",
      "question": "Vos collaborateurs et managers comprennent-ils les possibilités d'évolution au sein de l'entreprise et les compétences nécessaires pour y accéder ?",
      "help_text": "Mobilités possibles, passerelles entre métiers et critères d'accès.",
      "answers": {
        "A": "Très peu.",
        "B": "Cela dépend fortement des équipes ou managers.",
        "C": "Les principaux parcours et critères sont identifiés.",
        "D": "Les parcours sont structurés, transparents et intégrés aux discussions de développement."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Des parcours lisibles favorisent la mobilité interne et la fidélisation.",
      "recommendation_by_answer": {
        "A": "Décrire les principales évolutions possibles et les compétences attendues.",
        "B": "Partager les parcours d'évolution avec l'ensemble des managers.",
        "C": "Intégrer les parcours aux entretiens de développement."
      },
      "commercial_tags": [
        "drh_externalise"
      ]
    },
    {
      "id": "Q21",
      "pillar": "compensation",
      "type": "M",
      "weight": 2,
      "short_label": "Cadre des décisions salariales",
      "question": "Deux managers confrontés à une même décision salariale disposent-ils d'un cadre suffisamment clair pour prendre des décisions cohérentes ?",
      "help_text": "Règles d'augmentation, de positionnement à l'embauche et de promotion.",
      "answers": {
        "A": "Non, les décisions sont largement discrétionnaires.",
        "B": "Quelques principes existent mais sont interprétés différemment.",
        "C": "Une politique et des règles communes structurent les décisions.",
        "D": "Les règles sont formalisées, documentées et appuyées sur des données fiables."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Un cadre commun rend les décisions salariales cohérentes et explicables.",
      "recommendation_by_answer": {
        "A": "Formaliser quelques règles communes (embauche, augmentation, promotion).",
        "B": "Harmoniser l'interprétation des règles lors des revues salariales.",
        "C": "Appuyer les règles sur des données de marché et internes fiables."
      },
      "commercial_tags": [
        "compensation"
      ]
    },
    {
      "id": "Q22",
      "pillar": "compensation",
      "type": "M",
      "weight": 2,
      "short_label": "Architecture des emplois",
      "question": "Dans quelle mesure votre architecture des emplois et niveaux permet-elle de comparer des postes de manière cohérente ?",
      "help_text": "Classification des postes par famille de métiers et niveau de responsabilité.",
      "answers": {
        "A": "Nous n'avons pas réellement d'architecture structurée.",
        "B": "Des classifications existent mais sont incomplètes ou obsolètes.",
        "C": "Les principaux emplois et niveaux sont structurés.",
        "D": "L'architecture est maintenue à jour et utilisée pour les décisions RH et salariales."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Une architecture des emplois est la base de comparaisons salariales cohérentes.",
      "recommendation_by_answer": {
        "A": "Construire une première architecture des emplois (familles, niveaux).",
        "B": "Mettre à jour les classifications et compléter les emplois manquants.",
        "C": "Utiliser l'architecture des emplois dans les décisions salariales et de mobilité."
      },
      "commercial_tags": [
        "compensation"
      ]
    },
    {
      "id": "Q23",
      "pillar": "compensation",
      "type": "M",
      "weight": 3,
      "short_label": "Objectivation des écarts de rémunération",
      "question": "Pouvez-vous expliquer et objectiver les principaux écarts de rémunération entre des salariés occupant des postes comparables ?",
      "help_text": "Capacité à justifier un écart par des critères objectifs (expérience, performance, marché…).",
      "answers": {
        "A": "Difficilement.",
        "B": "Partiellement, avec des données ou critères incomplets.",
        "C": "Oui, grâce à des données et critères identifiés.",
        "D": "Oui, avec des analyses régulières permettant également d'identifier et corriger les écarts injustifiés."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Pouvoir justifier les écarts salariaux devient un enjeu majeur d'équité et de transparence.",
      "recommendation_by_answer": {
        "A": "Réaliser une première analyse des écarts de rémunération par poste comparable.",
        "B": "Compléter les données et définir les critères objectifs qui justifient un écart.",
        "C": "Mettre en place une analyse régulière et un plan de correction des écarts injustifiés."
      },
      "commercial_tags": [
        "compensation"
      ]
    },
    {
      "id": "C5",
      "pillar": "compensation",
      "type": "C",
      "weight": 2,
      "short_label": "Index de l'égalité professionnelle",
      "question": "Votre index de l'égalité professionnelle est-il calculé, publié et suivi selon les obligations applicables ?",
      "help_text": "Indicateurs relatifs aux écarts entre les femmes et les hommes, à calculer et publier chaque année.",
      "allow_na": false,
      "legal_rule": [
        "LR_INDEX_EGALITE"
      ],
      "red_flag_conditions": [
        {
          "answers": [
            "no",
            "unknown"
          ],
          "obligation": "LR_INDEX_EGALITE"
        }
      ],
      "applicability": {
        "field": "company_size",
        "in": [
          "50-249",
          "250-999",
          "1000+"
        ]
      },
      "area_text": "Le calcul et la publication de l'index suivent un calendrier annuel.",
      "recommendation_by_answer": {
        "partial": "Vérifier le calcul, la publication et la transmission de l'index, ainsi que les mesures de correction éventuelles.",
        "no": "Calculer et publier l'index de l'égalité professionnelle et définir les mesures de correction si nécessaire.",
        "unknown": "Vérifier si l'index a été calculé et publié pour la dernière échéance."
      },
      "commercial_tags": [
        "compensation",
        "audit_rh"
      ]
    },
    {
      "id": "Q24",
      "pillar": "compensation",
      "type": "C",
      "weight": 3,
      "short_label": "Préparation à la transparence salariale",
      "question": "Votre organisation est-elle préparée aux obligations de transparence salariale qui lui seront applicables ?",
      "help_text": "De nouvelles obligations de transparence des rémunérations sont issues du droit européen.",
      "allow_na": false,
      "legal_rule": [
        "LR_TRANSPARENCE_SALARIALE"
      ],
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Les obligations de transparence salariale demandent des données et critères préparés en amont.",
      "recommendation_by_answer": {
        "partial": "Identifier les obligations qui vous seront applicables et les données à préparer.",
        "no": "Préparer les données et critères de rémunération nécessaires aux futures obligations de transparence.",
        "unknown": "Vérifier les obligations de transparence salariale applicables à votre effectif et leur calendrier."
      },
      "commercial_tags": [
        "compensation"
      ]
    },
    {
      "id": "Q25",
      "pillar": "management_qvct",
      "type": "C",
      "weight": 3,
      "short_label": "DUERP",
      "question": "Votre document unique d'évaluation des risques professionnels (DUERP) est-il à jour et adapté aux risques réellement rencontrés dans votre entreprise ?",
      "help_text": "Le DUERP recense les risques de chaque unité de travail et les actions de prévention associées. Il est obligatoire dès le premier salarié.",
      "allow_na": false,
      "legal_rule": [
        "LR_DUERP"
      ],
      "red_flag_conditions": [
        {
          "answers": [
            "no",
            "unknown"
          ],
          "obligation": "LR_DUERP"
        }
      ],
      "applicability": null,
      "area_text": "Le DUERP doit refléter les risques réels et être mis à jour selon les règles applicables.",
      "recommendation_by_answer": {
        "partial": "Revoir le DUERP avec les équipes de terrain pour qu'il reflète les risques réels, et vérifier sa date de mise à jour.",
        "no": "Mettre à jour le DUERP en priorité, avec les unités de travail et les actions de prévention associées.",
        "unknown": "Vérifier l'existence du DUERP, sa date de dernière mise à jour et son accessibilité."
      },
      "commercial_tags": [
        "audit_rh"
      ]
    },
    {
      "id": "Q26",
      "pillar": "management_qvct",
      "type": "M",
      "weight": 3,
      "short_label": "Démarche de prévention",
      "question": "Comment votre DUERP et vos démarches de prévention sont-ils utilisés dans la pratique ?",
      "help_text": "Il s'agit de l'usage réel : actions décidées, responsables, suivi.",
      "answers": {
        "A": "Principalement comme une obligation documentaire.",
        "B": "Quelques actions en découlent mais leur suivi est irrégulier.",
        "C": "Les risques identifiés donnent lieu à des actions suivies.",
        "D": "La prévention est pilotée dans le temps avec responsabilités, échéances et suivi des actions."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "La prévention produit des effets lorsque les actions sont suivies dans le temps.",
      "recommendation_by_answer": {
        "A": "Associer à chaque risque prioritaire une action, un responsable et une échéance.",
        "B": "Mettre en place un suivi régulier des actions de prévention.",
        "C": "Piloter la prévention avec des indicateurs et une revue périodique en comité de direction."
      },
      "commercial_tags": [
        "drh_externalise"
      ]
    },
    {
      "id": "Q27",
      "pillar": "management_qvct",
      "type": "M",
      "weight": 2,
      "short_label": "Analyse de l'absentéisme et du turnover",
      "question": "Lorsque l'absentéisme ou le turnover évoluent anormalement dans une équipe, êtes-vous capable d'en identifier les causes et d'agir ?",
      "help_text": "Capacité à repérer une dérive, en comprendre les causes et engager des actions.",
      "answers": {
        "A": "Nous disposons de peu de visibilité.",
        "B": "Les indicateurs sont disponibles mais l'analyse reste ponctuelle.",
        "C": "Nous pouvons identifier les principales causes et mettre en place des actions.",
        "D": "Les indicateurs et signaux faibles sont régulièrement analysés et déclenchent des actions suivies."
      },
      "variants": [
        {
          "id": "small",
          "when": {
            "field": "company_size",
            "in": [
              "1-10"
            ]
          },
          "question": "Lorsque vous constatez une hausse des départs ou de l'absentéisme, disposez-vous des informations nécessaires pour en comprendre les causes et agir ?",
          "help_text": "Capacité à repérer une hausse des départs ou des absences, à en comprendre les causes et à agir.",
          "recommendation_by_answer": {
            "A": "Suivre simplement les départs et les absences, mois par mois.",
            "B": "Échanger avec les personnes concernées pour comprendre les causes lorsqu'une hausse apparaît.",
            "C": "Suivre les actions engagées et mesurer leurs effets."
          }
        }
      ],
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Repérer tôt une dérive d'absentéisme ou de turnover permet d'agir avant qu'elle ne s'installe.",
      "recommendation_by_answer": {
        "A": "Suivre l'absentéisme et le turnover par équipe, chaque mois.",
        "B": "Analyser les causes lorsqu'un indicateur dépasse un seuil défini.",
        "C": "Suivre les actions engagées et mesurer leurs effets."
      },
      "commercial_tags": [
        "drh_externalise",
        "orkest"
      ]
    },
    {
      "id": "Q28",
      "pillar": "management_qvct",
      "type": "M",
      "weight": 2,
      "short_label": "Autonomie RH des managers",
      "question": "Dans quelle mesure vos managers savent-ils gérer les situations RH courantes et identifier celles nécessitant l'intervention des RH ?",
      "help_text": "Absences, conflits, entretiens, demandes courantes des collaborateurs.",
      "answers": {
        "A": "Ils sollicitent très fréquemment les RH, y compris sur les situations courantes.",
        "B": "Leur niveau d'autonomie varie fortement.",
        "C": "Ils disposent d'un cadre clair et sont globalement autonomes.",
        "D": "Ils sont formés, outillés et disposent de règles d'escalade clairement définies."
      },
      "variants": [
        {
          "id": "small",
          "when": {
            "field": "company_size",
            "in": [
              "1-10"
            ]
          },
          "short_label": "Autonomie RH des encadrants",
          "question": "Les personnes qui encadrent des collaborateurs disposent-elles d'un cadre suffisamment clair pour gérer les situations RH courantes et savoir quand solliciter un appui RH ?",
          "help_text": "Absences, tensions, entretiens, demandes courantes. Si personne n'encadre d'équipe en dehors de la direction, choisissez « Non applicable ».",
          "answers": {
            "A": "Elles sollicitent très fréquemment un appui, y compris pour les situations courantes.",
            "B": "Leur niveau d'autonomie varie fortement.",
            "C": "Elles disposent d'un cadre clair et sont globalement autonomes.",
            "D": "Elles sont formées, outillées et savent quand solliciter un appui."
          },
          "allow_na": true,
          "na_label": "Non applicable : personne n'encadre d'équipe en dehors de la direction",
          "recommendation_by_answer": {
            "A": "Formaliser quelques repères simples sur les situations RH les plus fréquentes.",
            "B": "Accompagner les encadrants et préciser quand solliciter un appui.",
            "C": "Compléter ce cadre par une formation ciblée des encadrants."
          }
        }
      ],
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Des managers outillés traitent les situations courantes et savent quand alerter.",
      "recommendation_by_answer": {
        "A": "Formaliser un guide du manager sur les situations RH les plus fréquentes.",
        "B": "Former les managers et définir des règles d'escalade vers les RH.",
        "C": "Compléter le cadre par des formations ciblées et un retour d'expérience régulier."
      },
      "commercial_tags": [
        "drh_externalise"
      ]
    },
    {
      "id": "Q29",
      "pillar": "hr_operations_data",
      "type": "M",
      "weight": 3,
      "short_label": "Feuille de route RH",
      "question": "Votre roadmap RH est-elle formalisée, priorisée et reliée aux enjeux de l'entreprise ?",
      "help_text": "Les priorités RH de l'année et leur lien avec la stratégie de l'entreprise.",
      "answers": {
        "A": "Nous fonctionnons principalement en réaction aux sujets qui arrivent.",
        "B": "Des priorités existent mais sont peu formalisées ou régulièrement bousculées.",
        "C": "Une roadmap claire et priorisée existe.",
        "D": "La roadmap découle des enjeux de l'entreprise, comporte des objectifs mesurables et fait l'objet d'un suivi régulier."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Une feuille de route RH priorisée aligne les actions RH sur les enjeux de l'entreprise.",
      "recommendation_by_answer": {
        "A": "Définir avec la direction trois à cinq priorités RH pour les douze prochains mois.",
        "B": "Formaliser la feuille de route RH et la partager avec la direction.",
        "C": "Associer à chaque priorité des objectifs mesurables et une revue régulière."
      },
      "commercial_tags": [
        "drh_externalise",
        "orkest"
      ]
    },
    {
      "id": "Q30",
      "pillar": "hr_operations_data",
      "type": "M",
      "weight": 2,
      "short_label": "Fiabilité des données RH",
      "question": "Disposez-vous d'une source de référence permettant d'obtenir rapidement des données RH fiables ?",
      "help_text": "Effectifs, mouvements, rémunérations, absences : une source qui fait foi.",
      "answers": {
        "A": "Les informations sont dispersées entre plusieurs sources.",
        "B": "Une source principale existe mais nécessite régulièrement des retraitements.",
        "C": "Les principales données sont centralisées et globalement fiables.",
        "D": "Les données sont centralisées, gouvernées et directement exploitables pour le pilotage."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Une source de données fiable est la condition de tout pilotage RH.",
      "recommendation_by_answer": {
        "A": "Désigner une source de référence pour les données RH clés.",
        "B": "Fiabiliser la source principale pour réduire les retraitements.",
        "C": "Définir des règles de gouvernance des données (responsables, mises à jour, contrôles)."
      },
      "commercial_tags": [
        "orkest"
      ]
    },
    {
      "id": "Q31",
      "pillar": "hr_operations_data",
      "type": "M",
      "weight": 1,
      "short_label": "Outils RH et automatisation",
      "question": "Dans quelle mesure vos outils RH réduisent-ils réellement les tâches administratives et doubles saisies ?",
      "help_text": "SIRH, logiciel de paie, outils de recrutement, de formation ou de gestion des temps.",
      "answers": {
        "A": "De nombreux processus reposent encore sur Excel, emails ou ressaisies.",
        "B": "Plusieurs outils existent mais communiquent peu entre eux.",
        "C": "Les principaux processus sont digitalisés avec peu de doubles saisies.",
        "D": "Les outils RH sont intégrés et les principales tâches répétitives sont automatisées."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Des outils mieux connectés libèrent du temps pour les sujets à valeur ajoutée.",
      "recommendation_by_answer": {
        "A": "Identifier les tâches les plus chronophages et les processus à digitaliser en priorité.",
        "B": "Connecter les outils existants pour supprimer les doubles saisies.",
        "C": "Automatiser les tâches répétitives restantes."
      },
      "commercial_tags": [
        "orkest"
      ]
    },
    {
      "id": "Q32",
      "pillar": "hr_operations_data",
      "type": "M",
      "weight": 2,
      "short_label": "Usage des indicateurs RH",
      "question": "Vos indicateurs RH influencent-ils réellement les décisions prises par la fonction RH et la direction ?",
      "help_text": "Au-delà du suivi : les indicateurs éclairent-ils les arbitrages ?",
      "answers": {
        "A": "Nous disposons de peu d'indicateurs fiables.",
        "B": "Des indicateurs sont produits, mais servent surtout au suivi, peu aux décisions.",
        "C": "Les principaux KPI sont utilisés dans le pilotage RH.",
        "D": "Les données RH alimentent régulièrement les arbitrages de la direction et permettent de mesurer l'impact des actions engagées."
      },
      "legal_rule": null,
      "red_flag_conditions": [],
      "applicability": null,
      "area_text": "Des indicateurs utiles éclairent les décisions plutôt que de seulement les documenter.",
      "recommendation_by_answer": {
        "A": "Définir un socle de cinq à huit indicateurs RH fiables.",
        "B": "Relier chaque indicateur à une décision ou une action possible.",
        "C": "Présenter les indicateurs RH dans les arbitrages de direction et mesurer l'impact des actions."
      },
      "commercial_tags": [
        "orkest",
        "drh_externalise"
      ]
    }
  ]
};
  w.ARH_RULES = {
  "release": {
    "mode": "production",
    "require_legal_review": false
  },
  "scoring": {
    "display_rounding": 0,
    "min_questions_per_pillar": 1
  },
  "maturity_levels": [
    {
      "id": "structured",
      "min": 80,
      "label": "Bien structuré"
    },
    {
      "id": "consolidate",
      "min": 60,
      "label": "À consolider"
    },
    {
      "id": "to_structure",
      "min": 40,
      "label": "Plusieurs sujets à structurer"
    },
    {
      "id": "to_secure",
      "min": 0,
      "label": "Plusieurs priorités à sécuriser"
    }
  ],
  "answer_status": {
    "red_flag": "À sécuriser",
    "critical_structure": "À structurer en priorité",
    "unknown": "À vérifier",
    "partial": "À vérifier",
    "weak_maturity": "À structurer",
    "mid_maturity": "À consolider",
    "top": "Maîtrisé"
  },
  "thresholds": {
    "weak_max_score": 0,
    "critical_structure_answers": [
      "B"
    ],
    "critical_weight": 3,
    "partial_max_score": 50,
    "optimisation_scores": [
      67
    ],
    "low_pillar_below": 60,
    "strength_min_score": 80,
    "strength_fallback_min": 67,
    "max_strengths": 3,
    "max_areas_to_structure": 3,
    "very_good": {
      "min_global": 80,
      "no_red_flag": true,
      "no_critical": true,
      "no_pillar_below": 60
    }
  },
  "roadmap_priorities": [
    {
      "priority": 1,
      "id": "red_flag",
      "label": "Sujets à sécuriser en priorité"
    },
    {
      "priority": 2,
      "id": "critical_weak",
      "label": "Points critiques à traiter",
      "label_by_tone": {
        "critical_structure": "À structurer en priorité"
      }
    },
    {
      "priority": 3,
      "id": "low_pillar",
      "label": "Piliers à structurer"
    },
    {
      "priority": 4,
      "id": "partial",
      "label": "Points à consolider"
    },
    {
      "priority": 5,
      "id": "optimisation",
      "label": "Pistes d'optimisation"
    }
  ],
  "roadmap_display_limit": {
    "free_results": 3,
    "free_max_priority": 4,
    "report": null
  },
  "reason_templates": {
    "red_flag": "Vous indiquez « {answer} » sur un sujet encadré par la réglementation.",
    "critical_weak": "Sujet critique pour lequel votre réponse indique qu'il n'est pas encore en place.",
    "critical_structure": "Sujet critique qui existe mais reste insuffisamment structuré.",
    "low_pillar": "Le pilier « {pillar} » obtient {score}/100.",
    "partial": "Votre réponse indique une mise en place partielle.",
    "optimisation": "Votre pratique est en place ; elle peut encore être renforcée."
  },
  "result_texts": {
    "global_by_level": {
      "structured": "Votre organisation RH apparaît bien structurée.",
      "consolidate": "Votre organisation RH apparaît globalement structurée, avec plusieurs axes à consolider.",
      "to_structure": "Votre organisation RH repose sur des bases réelles, avec plusieurs sujets à structurer.",
      "to_secure": "Vos réponses font ressortir plusieurs priorités à sécuriser et à structurer."
    },
    "red_flag_suffix": {
      "levels": [
        "structured",
        "consolidate"
      ],
      "one": "Un sujet reste toutefois à sécuriser en priorité.",
      "many": "{n} sujets restent toutefois à sécuriser en priorité."
    },
    "very_good": {
      "title": "Votre organisation RH apparaît bien structurée",
      "body": "Vos réponses ne font ressortir aucun sujet prioritaire majeur à ce stade.",
      "strengths_title": "Vos principaux points forts",
      "optimisations_title": "Quelques pistes d'optimisation"
    },
    "red_flags_title": {
      "one": "1 sujet à sécuriser en priorité",
      "many": "{n} sujets à sécuriser en priorité"
    },
    "red_flag_body": {
      "no": "Vous indiquez que ce point n'est pas en place. Il mérite d'être vérifié et traité en priorité.",
      "unknown": "Vous ne savez pas si ce point est en place. Il mérite d'être vérifié en priorité."
    },
    "areas_title": {
      "one": "1 axe à structurer",
      "many": "{n} axes à structurer"
    },
    "vigilance_title": {
      "one": "1 point à vérifier",
      "many": "{n} points à vérifier"
    },
    "strengths_title": "Vos points forts",
    "strengths_fallback_title": "Vos points d'appui",
    "pillar_not_evaluated": "Non évalué au regard de votre situation",
    "preview": {
      "title": "Vos premières actions",
      "subtitle": "Aperçu de votre roadmap",
      "remaining": {
        "one": "+ 1 action dans votre rapport détaillé",
        "many": "+ {n} actions dans votre rapport détaillé"
      },
      "very_good_more": "Retrouvez l'ensemble de votre diagnostic et de vos recommandations dans votre rapport détaillé."
    },
    "vigilance_note": "Certaines réponses « Je ne sais pas » sont comptées comme des points à vérifier."
  },
  "disclaimer": "Cet outil constitue un pré-diagnostic réalisé à partir de vos réponses déclaratives. Il ne constitue ni un audit juridique, ni une certification de conformité. Certaines obligations peuvent varier selon votre effectif, votre convention collective, votre secteur et votre situation particulière.",
  "lead_interest": {
    "weak_pillar_below": 50,
    "rules": [
      {
        "tag": "audit_rh",
        "when": {
          "any": [
            {
              "metric": "red_flags_count",
              "gte": 2
            },
            {
              "metric": "pillar_weak_answers",
              "pillar": "compliance",
              "gte": 2
            },
            {
              "metric": "pillar_score",
              "pillar": "compliance",
              "lt": 50
            },
            {
              "metric": "pillars_with_critical",
              "gte": 3
            }
          ]
        }
      },
      {
        "tag": "drh_externalise",
        "when": {
          "all": [
            {
              "metric": "weak_pillars_count",
              "gte": 3
            },
            {
              "any": [
                {
                  "field": "hr_organization",
                  "in": [
                    "leadership",
                    "finance",
                    "external",
                    "other"
                  ]
                },
                {
                  "field": "respondent_role",
                  "in": [
                    "ceo",
                    "daf"
                  ]
                },
                {
                  "metric": "answer_score",
                  "question": "Q8",
                  "lte": 33
                }
              ]
            }
          ]
        }
      },
      {
        "tag": "orkest",
        "when": {
          "all": [
            {
              "metric": "global_score",
              "gte": 60
            },
            {
              "metric": "tagged_weak_count",
              "tag": "orkest",
              "gte": 2
            }
          ]
        }
      },
      {
        "tag": "recrutement",
        "when": {
          "any": [
            {
              "all": [
                {
                  "metric": "pillar_score",
                  "pillar": "recruitment",
                  "lt": 60
                },
                {
                  "metric": "rank_from_bottom",
                  "pillar": "recruitment",
                  "lte": 2
                }
              ]
            },
            {
              "metric": "pillar_signal_count",
              "pillar": "recruitment",
              "gte": 1
            },
            {
              "metric": "pillar_weak_answers",
              "pillar": "recruitment",
              "gte": 2
            }
          ]
        }
      },
      {
        "tag": "compensation",
        "when": {
          "any": [
            {
              "all": [
                {
                  "metric": "pillar_score",
                  "pillar": "compensation",
                  "lt": 60
                },
                {
                  "metric": "rank_from_bottom",
                  "pillar": "compensation",
                  "lte": 2
                }
              ]
            },
            {
              "metric": "pillar_signal_count",
              "pillar": "compensation",
              "gte": 1
            },
            {
              "all": [
                {
                  "metric": "answer_score",
                  "question": "CCN3248_CLASSIF",
                  "lte": 50
                },
                {
                  "metric": "answer_score",
                  "question": "CCN3248_MINIMA",
                  "lte": 50
                }
              ]
            }
          ]
        }
      },
      {
        "tag": "metallurgie_classification",
        "when": {
          "metric": "answer_score",
          "question": "CCN3248_CLASSIF",
          "lte": 50
        }
      },
      {
        "tag": "metallurgie_minima",
        "when": {
          "metric": "answer_score",
          "question": "CCN3248_MINIMA",
          "lte": 50
        }
      },
      {
        "tag": "relations_sociales",
        "when": {
          "any": [
            {
              "all": [
                {
                  "metric": "pillar_score",
                  "pillar": "employee_relations",
                  "lt": 60
                },
                {
                  "metric": "rank_from_bottom",
                  "pillar": "employee_relations",
                  "lte": 2
                }
              ]
            },
            {
              "metric": "pillar_signal_count",
              "pillar": "employee_relations",
              "gte": 1
            }
          ]
        }
      }
    ]
  },
  "payload": {
    "contact": [
      "firstname",
      "lastname",
      "email",
      "company"
    ],
    "context": [
      "respondent_role",
      "company_size",
      "has_cse",
      "hr_organization",
      "hr_organization_other",
      "collective_agreement_idcc",
      "collective_agreement_label",
      "collective_agreement_short_name",
      "collective_agreement_known"
    ]
  },
  "ui": {
    "auto_advance_ms": 300
  },
  "hero": {
    "eyebrow": "Audit RH 360°",
    "title": "Faites le point sur votre organisation RH en quelques minutes",
    "lead": "Évaluez vos pratiques RH, identifiez vos principales zones de risque et obtenez une roadmap personnalisée de vos priorités.",
    "cta": "Démarrer mon audit RH",
    "meta": [
      "Moins de 10 minutes",
      "Résultat personnalisé"
    ]
  },
  "lead_form": {
    "title": "Recevez votre rapport détaillé + votre roadmap RH personnalisée",
    "intro": "Retrouvez :",
    "benefits": [
      {
        "text": "le détail de vos 8 piliers RH",
        "when": "always"
      },
      {
        "text": "les points à sécuriser",
        "when": "has_red_flags"
      },
      {
        "text": "vos axes de structuration",
        "when": "has_areas"
      },
      {
        "text": "une roadmap priorisée des actions à mener",
        "when": "not_very_good"
      },
      {
        "text": "vos pistes d'optimisation et les recommandations associées",
        "when": "very_good"
      }
    ],
    "fields": [
      {
        "id": "firstname",
        "label": "Prénom",
        "required": true
      },
      {
        "id": "lastname",
        "label": "Nom",
        "required": true
      },
      {
        "id": "email",
        "label": "Email professionnel",
        "required": true,
        "type": "email"
      },
      {
        "id": "company",
        "label": "Entreprise",
        "required": true
      }
    ],
    "cta": "Recevoir mon rapport",
    "consent_scope": "audit_report_and_followup",
    "privacy_note": "Vos informations servent uniquement à vous envoyer votre rapport et, si vous le souhaitez, à échanger avec vous sur vos résultats.",
    "privacy_url": "https://www.leclubdesrh.fr/politique-de-confidentialite"
  },
  "commercial_cta": {
    "title": "Besoin d'approfondir certains sujets ?",
    "text": "Le pré-diagnostic permet d'identifier vos principales priorités. Un consultant RH senior peut approfondir l'analyse, sécuriser les points identifiés et construire avec vous une roadmap adaptée à votre organisation.",
    "cta": "Échanger sur mon audit RH",
    "cta_id": "meeting"
  },
  "analytics": {
    "timing": {
      "max_segment_seconds": 300
    }
  },
  "utm_keys": [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content"
  ],
  "storage": {
    "progress_key": "arh_progress",
    "utm_key": "arh_utm",
    "progress_ttl_days": 30,
    "last_metrics_key": "arh_last_metrics"
  },
  "method_version": "weighted-questions-v1"
};
  w.ARH_LEGAL = {
  "version": "2026-09-18",
  "RULES": {
    "LR_REGISTRE_PERSONNEL": {
      "id": "LR_REGISTRE_PERSONNEL",
      "status": "verified",
      "legal_reviewed_at": null,
      "applicability_condition": null
    },
    "LR_AFFICHAGES": {
      "id": "LR_AFFICHAGES",
      "status": "verified",
      "legal_reviewed_at": null,
      "applicability_condition": null
    },
    "LR_REGLEMENT_INTERIEUR": {
      "id": "LR_REGLEMENT_INTERIEUR",
      "status": "verified",
      "legal_reviewed_at": null,
      "applicability_condition": {
        "field": "company_size",
        "in": [
          "50-249",
          "250-999",
          "1000+"
        ]
      }
    },
    "LR_CSE": {
      "id": "LR_CSE",
      "status": "verified",
      "legal_reviewed_at": null,
      "applicability_condition": {
        "field": "company_size",
        "in": [
          "11-49",
          "50-249",
          "250-999",
          "1000+"
        ]
      }
    },
    "LR_BDESE": {
      "id": "LR_BDESE",
      "status": "verified",
      "legal_reviewed_at": null,
      "applicability_condition": {
        "field": "company_size",
        "in": [
          "50-249",
          "250-999",
          "1000+"
        ]
      }
    },
    "LR_NAO": {
      "id": "LR_NAO",
      "status": "verified",
      "legal_reviewed_at": null,
      "applicability_condition": {
        "field": "company_size",
        "in": [
          "50-249",
          "250-999",
          "1000+"
        ]
      }
    },
    "LR_INDEX_EGALITE": {
      "id": "LR_INDEX_EGALITE",
      "status": "verified",
      "legal_reviewed_at": null,
      "applicability_condition": {
        "field": "company_size",
        "in": [
          "50-249",
          "250-999",
          "1000+"
        ]
      }
    },
    "LR_TRANSPARENCE_SALARIALE": {
      "id": "LR_TRANSPARENCE_SALARIALE",
      "status": "legal_validation_required",
      "legal_reviewed_at": null,
      "applicability_condition": null
    },
    "LR_ENTRETIEN_PARCOURS": {
      "id": "LR_ENTRETIEN_PARCOURS",
      "status": "verified",
      "legal_reviewed_at": null,
      "applicability_condition": null
    },
    "LR_ETAT_DES_LIEUX_PARCOURS": {
      "id": "LR_ETAT_DES_LIEUX_PARCOURS",
      "status": "legal_validation_required",
      "legal_reviewed_at": null,
      "applicability_condition": null
    },
    "LR_DUERP": {
      "id": "LR_DUERP",
      "status": "verified",
      "legal_reviewed_at": null,
      "applicability_condition": null
    },
    "LR_SYNTEC_FORFAIT_JOURS": {
      "id": "LR_SYNTEC_FORFAIT_JOURS",
      "status": "verified",
      "legal_reviewed_at": null,
      "applicability_condition": {
        "all": [
          {
            "field": "collective_agreement_idcc",
            "in": [
              "1486"
            ]
          },
          {
            "field": "forfait_jours",
            "in": [
              "yes"
            ]
          }
        ]
      }
    },
    "LR_METALLURGIE_CLASSIFICATION": {
      "id": "LR_METALLURGIE_CLASSIFICATION",
      "status": "verified",
      "legal_reviewed_at": null,
      "applicability_condition": {
        "field": "collective_agreement_idcc",
        "in": [
          "3248"
        ]
      }
    },
    "LR_METALLURGIE_MINIMA": {
      "id": "LR_METALLURGIE_MINIMA",
      "status": "verified",
      "legal_reviewed_at": null,
      "applicability_condition": {
        "field": "collective_agreement_idcc",
        "in": [
          "3248"
        ]
      }
    },
    "LR_EFFECTIF": {
      "id": "LR_EFFECTIF",
      "status": "legal_validation_required",
      "legal_reviewed_at": null,
      "applicability_condition": null
    }
  }
};
  w.ARH_CCN_MODULES = {
  "version": "2026-09-18",
  "modules": {
    "1486": {
      "id": "syntec",
      "context_questions": [
        {
          "id": "forfait_jours",
          "required": true,
          "label": "Certains de vos salariés sont-ils au forfait annuel en jours ?",
          "help_text": "Le forfait annuel en jours décompte le temps de travail en jours plutôt qu'en heures, généralement pour des cadres autonomes.",
          "options": [
            {
              "id": "yes",
              "label": "Oui"
            },
            {
              "id": "no",
              "label": "Non"
            },
            {
              "id": "unknown",
              "label": "Je ne sais pas"
            }
          ]
        }
      ],
      "questions": [
        {
          "id": "CCN1486_FJ",
          "ccn_module": "syntec",
          "pillar": "compliance",
          "type": "C",
          "weight": 3,
          "short_label": "Cadre des forfaits annuels en jours",
          "action_title": "Vérifier le cadre de vos forfaits jours",
          "question": "Avez-vous vérifié que vos conventions de forfait annuel en jours respectent les conditions prévues par votre convention collective et que leur suivi est correctement réalisé ?",
          "help_text": "La vérification porte notamment sur : l'éligibilité des salariés concernés, la convention individuelle écrite, les conditions prévues par votre convention collective, le nombre de jours, la rémunération, le suivi de la charge de travail, le respect des temps de repos et les entretiens de suivi.",
          "allow_na": false,
          "legal_rule": [
            "LR_SYNTEC_FORFAIT_JOURS"
          ],
          "red_flag_conditions": [
            {
              "answers": [
                "no",
                "unknown"
              ],
              "obligation": "LR_SYNTEC_FORFAIT_JOURS"
            }
          ],
          "applicability": {
            "all": [
              {
                "field": "collective_agreement_idcc",
                "in": [
                  "1486"
                ]
              },
              {
                "field": "forfait_jours",
                "in": [
                  "yes"
                ]
              }
            ]
          },
          "area_text": "Vos réponses indiquent qu'une revue des conditions d'éligibilité, de formalisation et de suivi de vos forfaits jours pourrait être pertinente.",
          "recommendation_by_answer": {
            "partial": "Vérifier le cadre applicable à vos forfaits jours : revoir, salarié par salarié, l'éligibilité, la convention individuelle écrite et le suivi de la charge de travail.",
            "no": "Vérifier le cadre applicable à vos forfaits jours : revoir l'éligibilité des salariés concernés, les conventions individuelles écrites, les conditions conventionnelles et le suivi de la charge de travail.",
            "unknown": "Identifier les salariés au forfait jours, puis vérifier leurs conventions individuelles, les conditions conventionnelles applicables et le suivi réalisé."
          },
          "commercial_tags": [
            "audit_rh"
          ]
        }
      ],
      "roadmap_groups": []
    },
    "3248": {
      "id": "metallurgie",
      "context_questions": [],
      "questions": [
        {
          "id": "CCN3248_CLASSIF",
          "ccn_module": "metallurgie",
          "pillar": "compliance",
          "type": "C",
          "weight": 3,
          "short_label": "Classification conventionnelle des emplois",
          "action_title": "Sécuriser la classification de vos emplois",
          "question": "Vos emplois ont-ils été décrits, cotés et classés selon le système de classification prévu par la convention collective de la métallurgie ?",
          "help_text": "La convention collective nationale de la métallurgie prévoit un système unique de classification fondé sur l'emploi réellement tenu. Chaque emploi est décrit puis coté selon les critères conventionnels afin de déterminer sa classe et son groupe d'emploi.",
          "allow_na": false,
          "legal_rule": [
            "LR_METALLURGIE_CLASSIFICATION"
          ],
          "red_flag_conditions": [
            {
              "answers": [
                "no",
                "unknown"
              ],
              "obligation": "LR_METALLURGIE_CLASSIFICATION"
            }
          ],
          "applicability": {
            "all": [
              {
                "field": "collective_agreement_idcc",
                "in": [
                  "3248"
                ]
              }
            ]
          },
          "area_text": "Votre réponse indique que la classification de certains emplois pourrait nécessiter une revue au regard du référentiel de la branche Métallurgie.",
          "recommendation_by_answer": {
            "partial": "Vérifier la description des emplois réellement tenus, leur cotation selon les critères conventionnels et leur classement dans la classe et le groupe d'emploi correspondants.",
            "no": "Décrire les emplois réellement tenus, les coter selon les critères conventionnels, puis les classer dans la classe et le groupe d'emploi correspondants.",
            "unknown": "Vérifier si chaque emploi a été décrit, coté et classé selon le système de la convention collective, et comment le classement a été communiqué aux salariés."
          },
          "commercial_tags": [
            "metallurgie_classification",
            "audit_rh"
          ]
        },
        {
          "id": "CCN3248_MINIMA",
          "ccn_module": "metallurgie",
          "pillar": "compliance",
          "type": "C",
          "weight": 3,
          "short_label": "Minima conventionnels",
          "action_title": "Vérifier les minima conventionnels applicables",
          "question": "Avez-vous vérifié que les rémunérations de vos salariés respectent les minima conventionnels applicables à leur classification et à leur organisation du temps de travail ?",
          "help_text": "Les minima conventionnels applicables dépendent notamment de la classification des emplois. Certaines modalités d'organisation du temps de travail peuvent avoir une incidence sur les montants applicables.",
          "allow_na": false,
          "legal_rule": [
            "LR_METALLURGIE_MINIMA"
          ],
          "red_flag_conditions": [
            {
              "answers": [
                "no",
                "unknown"
              ],
              "obligation": "LR_METALLURGIE_MINIMA"
            }
          ],
          "applicability": {
            "all": [
              {
                "field": "collective_agreement_idcc",
                "in": [
                  "3248"
                ]
              }
            ]
          },
          "area_text": "Vos réponses indiquent qu'une vérification de la cohérence entre classification, organisation du temps de travail et rémunération pourrait être pertinente.",
          "recommendation_by_answer": {
            "partial": "Contrôler que les rémunérations pratiquées respectent les minima correspondant aux situations des salariés concernés.",
            "no": "Contrôler, salarié par salarié, que les rémunérations pratiquées respectent les minima correspondant à leur classement et à leur organisation du temps de travail.",
            "unknown": "Identifier les minima applicables à chaque situation (classement, organisation du temps de travail) et les comparer aux rémunérations pratiquées."
          },
          "commercial_tags": [
            "metallurgie_minima",
            "compensation",
            "audit_rh"
          ]
        }
      ],
      "roadmap_groups": [
        {
          "id": "metallurgie_classif_minima",
          "questions": [
            "CCN3248_CLASSIF",
            "CCN3248_MINIMA"
          ],
          "max_score": 50,
          "title": "Revoir classification et minima conventionnels",
          "recommendation": "Sécuriser la description et la cotation des emplois, leur classement conventionnel, puis vérifier la cohérence des rémunérations avec les minima applicables.",
          "reason": "Classification et minima conventionnels ressortent tous les deux : une revue commune évite de traiter deux fois le même sujet."
        }
      ]
    }
  }
};
  w.ARH_CCN_LIST = {
  "version": "2026-09-18-seed",
  "special": [
    {
      "id": "unknown",
      "label": "Je ne connais pas ma convention collective"
    },
    {
      "id": "none",
      "label": "Mon entreprise n'applique pas de convention collective"
    }
  ],
  "entries": [
    {
      "idcc": "16",
      "display": "Transports routiers et activités auxiliaires du transport",
      "label": "Convention collective nationale des transports routiers et activités auxiliaires du transport du 21 décembre 1950",
      "aliases": [
        "transport",
        "logistique"
      ]
    },
    {
      "idcc": "44",
      "display": "Industries chimiques et connexes",
      "label": "Convention collective nationale des industries chimiques et connexes du 30 décembre 1952",
      "aliases": [
        "chimie"
      ]
    },
    {
      "idcc": "86",
      "display": "Entreprises de la publicité et assimilées",
      "label": "Convention collective nationale de travail des cadres, techniciens et employés de la publicité française du 22 avril 1955",
      "aliases": [
        "publicite",
        "agence"
      ]
    },
    {
      "idcc": "573",
      "display": "Commerces de gros",
      "label": "Convention collective nationale des commerces de gros",
      "aliases": [
        "grossiste",
        "negoce"
      ]
    },
    {
      "idcc": "787",
      "display": "Cabinets d'experts-comptables et de commissaires aux comptes",
      "label": "Convention collective nationale des cabinets d'experts-comptables et de commissaires aux comptes",
      "aliases": [
        "expertise comptable",
        "comptable",
        "cac"
      ]
    },
    {
      "idcc": "1090",
      "display": "Services de l'automobile",
      "label": "Convention collective nationale du commerce et de la réparation de l'automobile, du cycle et du motocycle et des activités connexes, ainsi que du contrôle technique automobile du 15 janvier 1981",
      "aliases": [
        "automobile",
        "garage",
        "concession"
      ]
    },
    {
      "idcc": "1351",
      "display": "Entreprises de prévention et de sécurité",
      "label": "Convention collective nationale des entreprises de prévention et de sécurité du 15 février 1985",
      "aliases": [
        "securite privee",
        "gardiennage"
      ]
    },
    {
      "idcc": "1413",
      "display": "Travail temporaire — salariés permanents",
      "label": "Accord national du 23 janvier 1986 relatif aux salariés permanents des entreprises de travail temporaire",
      "aliases": [
        "interim",
        "ett"
      ]
    },
    {
      "idcc": "1483",
      "display": "Commerce de détail de l'habillement et des articles textiles",
      "label": "Convention collective nationale du commerce de détail de l'habillement et des articles textiles du 25 novembre 1987",
      "aliases": [
        "habillement",
        "pret a porter",
        "textile"
      ]
    },
    {
      "idcc": "1486",
      "display": "Bureaux d'études techniques, cabinets d'ingénieurs-conseils et sociétés de conseils",
      "short_name": "Syntec",
      "label": "Convention collective nationale des bureaux d'études techniques, des cabinets d'ingénieurs-conseils et des sociétés de conseils du 15 décembre 1987 mise à jour par avenant n° 46 du 16 juillet 2021",
      "aliases": [
        "syntec",
        "cinov",
        "bet",
        "esn",
        "ssii",
        "conseil",
        "ingenierie"
      ]
    },
    {
      "idcc": "1501",
      "display": "Restauration rapide",
      "label": "Convention collective nationale de la restauration rapide du 18 mars 1988",
      "aliases": [
        "fast food"
      ]
    },
    {
      "idcc": "1516",
      "display": "Organismes de formation",
      "label": "Convention collective nationale des organismes de formation du 10 juin 1988",
      "aliases": [
        "formation professionnelle"
      ]
    },
    {
      "idcc": "1527",
      "display": "Immobilier",
      "label": "Convention collective nationale de l'immobilier, administrateurs de biens, sociétés immobilières, agents immobiliers du 9 septembre 1988",
      "aliases": [
        "agence immobiliere",
        "syndic"
      ]
    },
    {
      "idcc": "1596",
      "display": "Bâtiment — ouvriers (entreprises jusqu'à 10 salariés)",
      "label": "Convention collective nationale concernant les ouvriers employés par les entreprises du bâtiment visées par le décret du 1er mars 1962 (c'est-à-dire occupant jusqu'à 10 salariés)",
      "aliases": [
        "batiment",
        "btp"
      ]
    },
    {
      "idcc": "1597",
      "display": "Bâtiment — ouvriers (entreprises de plus de 10 salariés)",
      "label": "Convention collective nationale des ouvriers employés par les entreprises du bâtiment non visées par le décret du 1er mars 1962 (c'est-à-dire occupant plus de 10 salariés) du 7 mars 2018",
      "aliases": [
        "batiment",
        "btp"
      ]
    },
    {
      "idcc": "1672",
      "display": "Sociétés d'assurances",
      "label": "Convention collective nationale des sociétés d'assurances du 27 mai 1992",
      "aliases": [
        "assurance"
      ]
    },
    {
      "idcc": "1979",
      "display": "Hôtels, cafés, restaurants (HCR)",
      "short_name": "HCR",
      "label": "Convention collective nationale des hôtels, cafés, restaurants (HCR) du 30 avril 1997",
      "aliases": [
        "hcr",
        "hotellerie",
        "restauration",
        "restaurant"
      ]
    },
    {
      "idcc": "1996",
      "display": "Pharmacie d'officine",
      "label": "Convention collective nationale de la pharmacie d'officine du 3 décembre 1997",
      "aliases": [
        "pharmacie"
      ]
    },
    {
      "idcc": "2098",
      "display": "Prestataires de services dans le domaine du secteur tertiaire",
      "label": "Convention collective nationale du personnel des prestataires de services dans le domaine du secteur tertiaire du 13 août 1999",
      "aliases": [
        "centre d'appels",
        "tertiaire"
      ]
    },
    {
      "idcc": "2120",
      "display": "Banque",
      "label": "Convention collective nationale de la banque du 10 janvier 2000",
      "aliases": [
        "banque",
        "bancaire"
      ]
    },
    {
      "idcc": "2148",
      "display": "Télécommunications",
      "label": "Convention collective nationale des télécommunications du 26 avril 2000",
      "aliases": [
        "telecom"
      ]
    },
    {
      "idcc": "2156",
      "display": "Grands magasins et magasins populaires",
      "label": "Convention collective nationale des grands magasins et des magasins populaires du 30 juin 2000",
      "aliases": [
        "grand magasin"
      ]
    },
    {
      "idcc": "2216",
      "display": "Commerce de détail et de gros à prédominance alimentaire",
      "label": "Convention collective nationale du commerce de détail et de gros à prédominance alimentaire du 12 juillet 2001",
      "aliases": [
        "grande distribution",
        "supermarche",
        "alimentaire"
      ]
    },
    {
      "idcc": "2264",
      "display": "Hospitalisation privée",
      "label": "Convention collective nationale de l'hospitalisation privée",
      "aliases": [
        "clinique",
        "ehpad prive"
      ]
    },
    {
      "idcc": "2332",
      "display": "Entreprises d'architecture",
      "label": "Convention collective nationale des entreprises d'architecture du 27 février 2003",
      "aliases": [
        "architecte"
      ]
    },
    {
      "idcc": "2941",
      "display": "Aide, accompagnement, soins et services à domicile (BAD)",
      "label": "Convention collective nationale de la branche de l'aide, de l'accompagnement, des soins et des services à domicile du 21 mai 2010",
      "aliases": [
        "aide a domicile",
        "bad",
        "services a la personne"
      ]
    },
    {
      "idcc": "3043",
      "display": "Entreprises de propreté et services associés",
      "label": "Convention collective nationale des entreprises de propreté et services associés du 26 juillet 2011",
      "aliases": [
        "proprete",
        "nettoyage"
      ]
    },
    {
      "idcc": "3248",
      "display": "Métallurgie",
      "label": "Convention collective nationale de la métallurgie",
      "aliases": [
        "metallurgie",
        "uimm",
        "industrie"
      ]
    },
    {
      "idcc": "3253",
      "display": "Salariés des cabinets d'avocats",
      "label": "Convention collective nationale des salariés des cabinets d'avocats du 21 juin 2024",
      "aliases": [
        "avocat",
        "cabinet d'avocats"
      ]
    }
  ]
};
})(typeof window !== 'undefined' ? window : globalThis);

/*!
 * Audit RH 360° — Le Club des RH
 * MOTEUR (fonctions pures, sans DOM ni réseau). Toutes les règles viennent de la configuration :
 * ARH_QUESTIONS (questions.js), ARH_LEGAL (legal-rules.js), ARH_RULES (scoring.js).
 *
 * Point d'entrée : evaluate(context, answers[, cfg]) -> résultat complet (scores, red flags,
 * roadmap, points forts, signaux commerciaux internes). Déterministe et testable.
 *
 * Seuils : les valeurs décimales sont conservées ; les comparaisons aux seuils (niveaux, pilier
 * faible, cas « très bon résultat ») se font sur le score AFFICHÉ (arrondi), pour que le libellé
 * soit toujours cohérent avec le chiffre vu par l'utilisateur.
 */
(function (root) {
  'use strict';

  /* ================================================================
   * Configuration
   * ================================================================ */
  /* Les modules conventionnels (ccn-modules.js) ajoutent leurs questions à la liste générale : leur
   * applicabilité porte la condition d'IDCC. Ajouter un module ne touche ni au moteur ni à l'interface. */
  var cachedDefault = null;
  function defaultConfig() {
    if (cachedDefault && cachedDefault.src === root.ARH_QUESTIONS) return cachedDefault;
    var base = root.ARH_QUESTIONS, mods = (root.ARH_CCN_MODULES && root.ARH_CCN_MODULES.modules) || {};
    var extra = [];
    Object.keys(mods).forEach(function (idcc) { (mods[idcc].questions || []).forEach(function (q) { extra.push(q); }); });
    var Q = {};
    Object.keys(base).forEach(function (k) { Q[k] = base[k]; });
    Q.QUESTIONS = base.QUESTIONS.concat(extra);
    cachedDefault = { Q: Q, R: root.ARH_RULES, L: root.ARH_LEGAL, CCN: root.ARH_CCN_LIST || { entries: [], special: [] },
      MOD: root.ARH_CCN_MODULES || { modules: {} }, src: base };
    return cachedDefault;
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* Copie de configuration avec surcharges (tests, mode démo) :
   *   { rules: { LR_X: 'verified' }, questions: { C5: { enabled: false } } }
   * Sert à démontrer qu'activer Q24 ou désactiver l'Index ne touche ni au moteur ni à l'interface. */
  function withOverrides(cfg, over) {
    var c = { Q: clone(cfg.Q), R: over.release ? mergeRelease(cfg.R, over.release) : cfg.R, L: clone(cfg.L), CCN: cfg.CCN, MOD: cfg.MOD };
    over = over || {};
    Object.keys(over.rules || {}).forEach(function (id) { if (c.L.RULES[id]) c.L.RULES[id].status = over.rules[id]; });
    Object.keys(over.questions || {}).forEach(function (id) {
      c.Q.QUESTIONS.forEach(function (q) { if (q.id === id) Object.keys(over.questions[id]).forEach(function (k) { q[k] = over.questions[id][k]; }); });
    });
    return c;
  }

  function mergeRelease(R, release) {
    var r = {}; Object.keys(R).forEach(function (k) { r[k] = R[k]; });
    r.release = release; return r;
  }

  /* ================================================================
   * Conditions
   * ================================================================ */
  function evalCond(c, ctx) {
    if (c === null || c === undefined) return true;
    if (c.all) return c.all.every(function (x) { return evalCond(x, ctx); });
    if (c.any) return c.any.some(function (x) { return evalCond(x, ctx); });
    if (c.not) return !evalCond(c.not, ctx);
    if (c.in) return c.in.indexOf(ctx[c.field]) >= 0;
    if (c.not_in) return c.not_in.indexOf(ctx[c.field]) < 0;
    return false;
  }

  /* Une règle est active si elle est vérifiée ; en production, elle doit AUSSI avoir été relue par un
   * juriste (`legal_reviewed_at`). Sinon, ses questions et ses red flags restent désactivés. */
  function ruleVerified(id, cfg) {
    var r = cfg.L.RULES[id];
    if (!r || r.status !== 'verified') return false;
    var rel = cfg.R.release || {};
    return !(rel.mode === 'production' && rel.require_legal_review && !r.legal_reviewed_at);
  }
  /* Une obligation s'applique si elle est vérifiée ET que son champ d'application couvre le contexte. */
  function obligationApplies(id, ctx, cfg) {
    return ruleVerified(id, cfg) && evalCond(cfg.L.RULES[id].applicability_condition, ctx);
  }

  function isActive(q, cfg) {
    if (q.enabled === false) return false;
    return (q.legal_rule || []).every(function (id) { return ruleVerified(id, cfg); });
  }
  function isApplicable(q, ctx, cfg) { return isActive(q, cfg) && evalCond(q.applicability, ctx); }

  /* Wording adaptatif : même question (id, poids, scoring), textes adaptés au contexte. */
  var VARIANT_FIELDS = ['question', 'help_text', 'short_label', 'area_text', 'answers', 'recommendation_by_answer', 'allow_na', 'na_label'];
  function resolveQuestion(q, ctx) {
    var v = (q.variants || []).filter(function (x) { return evalCond(x.when, ctx); })[0];
    if (!v) return q;
    var r = {};
    Object.keys(q).forEach(function (k) { r[k] = q[k]; });
    VARIANT_FIELDS.forEach(function (k) { if (k in v) r[k] = v[k]; });
    r.variant_id = v.id;
    return r;
  }

  function pillarOrder(cfg) { var o = {}; cfg.Q.PILLARS.forEach(function (p) { o[p.id] = p.order; }); return o; }
  function pillarById(cfg) { var o = {}; cfg.Q.PILLARS.forEach(function (p) { o[p.id] = p; }); return o; }

  /* Questions posées, dans l'ordre du parcours (pilier, puis ordre de configuration). */
  function questionsFor(ctx, cfg) {
    cfg = cfg || defaultConfig();
    ctx = normalizeContext(ctx, cfg);
    var po = pillarOrder(cfg);
    return cfg.Q.QUESTIONS
      .map(function (q, i) { return { q: q, i: i }; })
      .filter(function (x) { return isApplicable(x.q, ctx, cfg); })
      .sort(function (a, b) { return (po[a.q.pillar] - po[b.q.pillar]) || (a.i - b.i); })
      .map(function (x) { return resolveQuestion(x.q, ctx); });
  }

  /* Piliers réellement parcourus (au moins une question), avec leurs questions. */
  function pillarsFor(ctx, cfg) {
    cfg = cfg || defaultConfig();
    var qs = questionsFor(ctx, cfg);
    return cfg.Q.PILLARS.slice().sort(function (a, b) { return a.order - b.order; })
      .map(function (p) { return { pillar: p, questions: qs.filter(function (q) { return q.pillar === p.id; }) }; })
      .filter(function (x) { return x.questions.length > 0; });
  }

  /* ================================================================
   * Contexte (avec questions de contextualisation des modules conventionnels)
   * ================================================================ */
  function moduleFor(ctx, cfg) {
    var idcc = ctx && ctx.collective_agreement_idcc;
    return idcc && cfg.MOD.modules[idcc] ? cfg.MOD.modules[idcc] : null;
  }
  /* Écrans de contexte : la liste générale + les questions du module dont l'IDCC est sélectionné,
   * insérées juste après la question « convention collective ». Elles ne comptent jamais dans le score. */
  function contextSteps(ctx, cfg) {
    cfg = cfg || defaultConfig();
    var steps = [], mod = moduleFor(ctx, cfg);
    cfg.Q.CONTEXT.forEach(function (f) {
      if (!evalCond(f.applicability, ctx || {})) return;   // ex. CSE non demandé sous 11 salariés
      steps.push(f);
      if (f.type === 'ccn_search' && mod) (mod.context_questions || []).forEach(function (c) { steps.push(c); });
    });
    return steps;
  }

  /* Contexte effectif : les valeurs des champs de contexte non applicables sont ignorées (ex. « CSE : oui »
   * saisi puis effectif ramené à 1-10). */
  function normalizeContext(ctx, cfg) {
    cfg = cfg || defaultConfig();
    var c = {};
    Object.keys(ctx || {}).forEach(function (k) { c[k] = ctx[k]; });
    cfg.Q.CONTEXT.forEach(function (f) { if (f.applicability && !evalCond(f.applicability, c)) delete c[f.id]; });
    /* Précision liée à une option (« Autre → préciser ») : conservée seulement si l'option est choisie. */
    cfg.Q.CONTEXT.forEach(function (f) {
      (f.options || []).forEach(function (o) { if (o.detail && c[f.id] !== o.id) delete c[o.detail.id]; });
    });
    return c;
  }

  /* Recherche de convention : « Syntec », « CCN Syntec », « IDCC 1486 », « 1486 », partie du nom.
   * Retourne toujours des entrées normalisées de la liste ; le texte tapé ne sert jamais de règle. */
  function norm(t) {
    return String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  }
  var CCN_STOP = { ccn: 1, idcc: 1, convention: 1, collective: 1, conventions: 1, collectives: 1, nationale: 1, national: 1, de: 1, des: 1, du: 1, la: 1, le: 1, les: 1, et: 1, d: 1, l: 1 };
  function searchAgreements(query, cfg, limit) {
    cfg = cfg || defaultConfig();
    var tokens = norm(query).split(' ').filter(function (t) { return t && !CCN_STOP[t]; });
    if (!tokens.length) return [];
    var digits = tokens.filter(function (t) { return /^\d+$/.test(t); }), words = tokens.filter(function (t) { return !/^\d+$/.test(t); });
    var out = [];
    cfg.CCN.entries.forEach(function (e) {
      var hay = ' ' + norm([e.label, e.display || '', e.short_name || '', (e.aliases || []).join(' ')].join(' ')) + ' ';
      var okDigits = digits.every(function (d) { return e.idcc === d.replace(/^0+/, '') || e.idcc.indexOf(d.replace(/^0+/, '')) === 0; });
      var okWords = words.every(function (w) { return hay.indexOf(' ' + w) >= 0; });
      if (!okDigits || !okWords) return;
      var exact = digits.some(function (d) { return e.idcc === d.replace(/^0+/, ''); }) ||
        words.some(function (w) { return norm(e.short_name) === w; });
      out.push({ e: e, rank: exact ? 0 : 1 });
    });
    return out.sort(function (a, b) { return (a.rank - b.rank) || (Number(a.e.idcc) - Number(b.e.idcc)); })
      .slice(0, limit || 8).map(function (x) { return x.e; });
  }
  /* Valeurs de contexte stockées pour une convention sélectionnée ou une alternative explicite. */
  function agreementContext(choice, cfg) {
    cfg = cfg || defaultConfig();
    var sp = (cfg.CCN.special || []).filter(function (x) { return x.id === choice; })[0];
    if (sp) return { collective_agreement_idcc: null, collective_agreement_label: sp.label, collective_agreement_short_name: null, collective_agreement_known: sp.id };
    var e = cfg.CCN.entries.filter(function (x) { return x.idcc === String(choice); })[0];
    if (!e) return null;
    return { collective_agreement_idcc: e.idcc, collective_agreement_label: e.label, collective_agreement_short_name: e.short_name || null, collective_agreement_known: 'known' };
  }

  /* ================================================================
   * Réponses et scores
   * ================================================================ */
  function answerOptions(q, cfg) {
    if (q.type === 'M') {
      var m = cfg.Q.ANSWER_SCALES.M.map(function (a) { return { id: a.id, label: q.answers[a.id], score: a.score }; });
      if (q.allow_na) m.push({ id: 'na', label: q.na_label, score: null });   // exclu du score
      return m;
    }
    return cfg.Q.ANSWER_SCALES.C
      .filter(function (a) { return a.id !== 'na' || q.allow_na; })
      .map(function (a) { return { id: a.id, label: a.id === 'na' && q.na_label ? q.na_label : a.label, score: a.score, vigilance: !!a.vigilance }; });
  }
  function findOption(q, answerId, cfg) {
    return answerOptions(q, cfg).filter(function (o) { return o.id === answerId; })[0] || null;
  }

  function round(v, d) { if (v === null || v === undefined) return null; var f = Math.pow(10, d || 0); return Math.round(v * f) / f; }
  function levelFor(displayScore, cfg) {
    if (displayScore === null) return null;
    var lv = cfg.R.maturity_levels.slice().sort(function (a, b) { return b.min - a.min; });
    for (var i = 0; i < lv.length; i++) if (displayScore >= lv[i].min) return lv[i];
    return lv[lv.length - 1];
  }
  function weighted(items) {
    var num = 0, den = 0;
    items.forEach(function (it) { num += it.score * it.weight; den += 100 * it.weight; });
    return den > 0 ? num / den * 100 : null;
  }

  function statusFor(it, cfg) {
    var S = cfg.R.answer_status;
    if (it.red_flag) return S.red_flag;
    if (it.answer_id === 'unknown') return S.unknown;
    if (it.critical_structure) return S.critical_structure;
    if (it.answer_id === 'partial') return S.partial;
    if (it.score >= 100) return S.top;
    if (it.score <= 0) return it.type === 'C' ? S.red_flag : S.weak_maturity;
    return S.mid_maturity;
  }

  function tpl(s, vars) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined ? vars[k] : m; }); }

  /* ================================================================
   * Évaluation complète
   * ================================================================ */
  function evaluate(ctx, answers, cfg) {
    cfg = cfg || defaultConfig();
    ctx = normalizeContext(ctx, cfg);
    answers = answers || {};
    var R = cfg.R, T = R.thresholds, D = R.scoring.display_rounding;
    var PB = pillarById(cfg), PO = pillarOrder(cfg);
    var qs = questionsFor(ctx, cfg);
    var qOrder = {}; cfg.Q.QUESTIONS.forEach(function (q, i) { qOrder[q.id] = i; });

    /* ---- 1. Réponses ---- */
    var items = [], missing = [];
    qs.forEach(function (q) {
      var a = answers[q.id];
      var opt = a === undefined || a === null ? null : findOption(q, a, cfg);
      if (!opt) { missing.push(q.id); return; }
      var it = {
        question_id: q.id, pillar: q.pillar, type: q.type, weight: q.weight,
        answer_id: opt.id, answer_label: opt.label, score: opt.score,
        in_score: opt.score !== null, vigilance: !!opt.vigilance,
        short_label: q.short_label, variant_id: q.variant_id || null, q: q
      };
      it.red_flag = it.in_score && q.red_flag_conditions.some(function (rf) {
        return rf.answers.indexOf(opt.id) >= 0 && obligationApplies(rf.obligation, ctx, cfg);
      });
      it.critical_strong = !it.red_flag && it.in_score && q.weight === T.critical_weight && it.score <= T.weak_max_score;
      it.critical_structure = !it.red_flag && it.in_score && q.weight === T.critical_weight && q.type === 'M' &&
        T.critical_structure_answers.indexOf(opt.id) >= 0;
      it.status = it.in_score ? statusFor(it, cfg) : null;
      items.push(it);
    });
    var scored = items.filter(function (it) { return it.in_score; });

    /* ---- 2. Scores ---- */
    var pillars = cfg.Q.PILLARS.slice().sort(function (a, b) { return a.order - b.order; }).map(function (p) {
      var asked = qs.filter(function (q) { return q.pillar === p.id; });
      var its = scored.filter(function (it) { return it.pillar === p.id; });
      var evaluated = its.length >= R.scoring.min_questions_per_pillar;
      var sc = evaluated ? weighted(its) : null;
      var disp = round(sc, D);
      var lv = levelFor(disp, cfg);
      return {
        id: p.id, label: p.label, short_label: p.short_label, order: p.order, score_field: p.score_field,
        evaluated: evaluated, score: sc, display_score: disp,
        level: lv ? lv.id : null, level_label: lv ? lv.label : R.result_texts.pillar_not_evaluated,
        applicable_count: asked.length, scored_count: its.length,
        red_flags_count: its.filter(function (it) { return it.red_flag; }).length,
        strength_text: p.strength_text, weak_text: p.weak_text
      };
    });
    var ev = pillars.filter(function (p) { return p.evaluated; });
    ev.slice().sort(function (a, b) { return (a.score - b.score) || (a.order - b.order); })
      .forEach(function (p, i) { p.rank_from_bottom = i + 1; });

    var gScore = weighted(scored), gDisp = round(gScore, D), gLv = levelFor(gDisp, cfg);
    var global = {
      score: gScore, display_score: gDisp, level: gLv ? gLv.id : null, level_label: gLv ? gLv.label : null,
      text: gLv ? R.result_texts.global_by_level[gLv.id] : null,
      applicable_count: qs.length, scored_count: scored.length, weight_sum: scored.reduce(function (s, it) { return s + it.weight; }, 0)
    };

    /* ---- 3. Roadmap (hiérarchie stricte, sans doublon) ---- */
    var listed = {};
    function sortItems(arr) {
      return arr.slice().sort(function (a, b) {
        return (b.weight - a.weight) || (a.score - b.score) || (PO[a.pillar] - PO[b.pillar]) || (qOrder[a.question_id] - qOrder[b.question_id]);
      });
    }
    function action(it, priority, tone, reasonKey, description) {
      listed[it.question_id] = true;
      return {
        priority: priority, tone: tone, question_id: it.question_id, pillar: it.pillar,
        pillar_label: PB[it.pillar].label, title: it.q.action_title || it.short_label, subject: it.short_label,
        description: description || it.q.area_text,
        reason: tpl(R.reason_templates[reasonKey], { answer: it.answer_label, pillar: PB[it.pillar].label }),
        recommendation: it.q.recommendation_by_answer[it.answer_id] || null,
        status: it.status, answer_label: it.answer_label, weight: it.weight
      };
    }
    var roadmap = [];
    sortItems(scored.filter(function (it) { return it.red_flag; })).forEach(function (it) {
      var body = R.result_texts.red_flag_body[it.answer_id] || R.result_texts.red_flag_body.no;
      roadmap.push(action(it, 1, 'secure', 'red_flag', body));
    });
    sortItems(scored.filter(function (it) { return !listed[it.question_id] && (it.critical_strong || it.critical_structure); }))
      .sort(function (a, b) { return (a.critical_strong === b.critical_strong ? 0 : a.critical_strong ? -1 : 1); })
      .forEach(function (it) {
        roadmap.push(action(it, 2, it.critical_strong ? 'critical' : 'critical_structure', it.critical_strong ? 'critical_weak' : 'critical_structure'));
      });
    ev.filter(function (p) { return p.display_score < T.low_pillar_below; })
      .sort(function (a, b) { return (a.score - b.score) || (a.order - b.order); })
      .forEach(function (p) {
        var weakest = scored.filter(function (it) { return it.pillar === p.id && !listed[it.question_id] && it.score < 100; })
          .sort(function (a, b) { return (a.score - b.score) || (b.weight - a.weight) || (qOrder[a.question_id] - qOrder[b.question_id]); })
          .slice(0, 2);
        if (!weakest.length) return;   // tout le pilier est déjà couvert par des priorités supérieures
        weakest.forEach(function (it) { listed[it.question_id] = true; });
        roadmap.push({
          priority: 3, tone: 'structure', question_id: null, related_questions: weakest.map(function (it) { return it.question_id; }),
          pillar: p.id, pillar_label: p.label, title: p.label, description: p.weak_text,
          reason: tpl(R.reason_templates.low_pillar, { pillar: p.label, score: p.display_score }),
          recommendation: weakest.map(function (it) { return it.q.recommendation_by_answer[it.answer_id]; }).filter(Boolean).join(' '),
          status: R.answer_status.weak_maturity, weight: null
        });
      });
    sortItems(scored.filter(function (it) { return !listed[it.question_id] && it.score <= T.partial_max_score; })).forEach(function (it) {
      roadmap.push(action(it, 4, 'consolidate', 'partial'));
    });
    sortItems(scored.filter(function (it) { return !listed[it.question_id] && T.optimisation_scores.indexOf(it.score) >= 0; })).forEach(function (it) {
      roadmap.push(action(it, 5, 'optimise', 'optimisation'));
    });

    var redFlags = roadmap.filter(function (a) { return a.priority === 1; });
    var RS = R.result_texts.red_flag_suffix;
    if (redFlags.length && RS && RS.levels.indexOf(global.level) >= 0)
      global.text += ' ' + (redFlags.length > 1 ? RS.many : RS.one).replace('{n}', redFlags.length);
    var critical = roadmap.filter(function (a) { return a.priority === 2; });

    /* ---- 4. Cas « très bon résultat » ---- */
    var VG = T.very_good;
    var veryGood = gDisp !== null && gDisp >= VG.min_global &&
      (!VG.no_red_flag || redFlags.length === 0) &&
      (!VG.no_critical || critical.length === 0) &&
      ev.every(function (p) { return p.display_score >= VG.no_pillar_below; });

    /* ---- 5. Points forts (piliers sans sujet à sécuriser) ---- */
    function strengthsFrom(min) {
      return ev.filter(function (p) { return p.display_score >= min && p.red_flags_count === 0; })
        .sort(function (a, b) { return (b.score - a.score) || (a.order - b.order); })
        .slice(0, T.max_strengths)
        .map(function (p) { return { pillar: p.id, label: p.label, score: p.score, display_score: p.display_score, text: p.strength_text }; });
    }
    var strengths = strengthsFrom(T.strength_min_score), strengthsFallback = false;
    if (!strengths.length) { strengths = strengthsFrom(T.strength_fallback_min); strengthsFallback = strengths.length > 0; }

    /* ---- 6. Axes à structurer / optimisations ---- */
    var areas = veryGood ? [] : roadmap.filter(function (a) {
      return a.priority === 2 || a.priority === 3 || (a.priority === 4 && a.question_id && itemById(a.question_id).score <= 33);
    });
    var optimisations = veryGood ? roadmap.filter(function (a) { return a.priority >= 4; }) : roadmap.filter(function (a) { return a.priority === 5; });
    function itemById(id) { return items.filter(function (it) { return it.question_id === id; })[0]; }

    /* ---- 6 bis. Regroupement d'actions liées (modules conventionnels, `roadmap_groups`) ----
     * Les constats restent distincts (sujets à sécuriser, axes) ; seule la roadmap fusionne les
     * actions quand TOUTES les questions du groupe ressortent (score <= max_score). */
    Object.keys(cfg.MOD.modules || {}).forEach(function (k) {
      (cfg.MOD.modules[k].roadmap_groups || []).forEach(function (g) {
        var hits = roadmap.filter(function (a) {
          var it = a.question_id && itemById(a.question_id);
          return it && g.questions.indexOf(a.question_id) >= 0 && it.score <= g.max_score;
        });
        if (hits.length !== g.questions.length) return;
        var first = hits[0], at = roadmap.indexOf(first);
        var merged = {
          priority: first.priority, tone: first.tone, question_id: null, group_id: g.id,
          related_questions: hits.map(function (a) { return a.question_id; }),
          pillar: first.pillar, pillar_label: first.pillar_label, title: g.title, subject: g.title,
          description: g.reason, reason: g.reason, recommendation: g.recommendation, status: first.status, weight: first.weight
        };
        roadmap = roadmap.filter(function (a) { return hits.indexOf(a) < 0; });
        roadmap.splice(Math.min(at, roadmap.length), 0, merged);
      });
    });

    /* ---- 7. Aperçu gratuit de la roadmap (jamais complété artificiellement) ---- */
    var DL = R.roadmap_display_limit, preview;
    if (veryGood) {
      preview = { mode: 'optimisations', actions: optimisations.slice(0, DL.free_results) };
      preview.remaining_count = optimisations.length - preview.actions.length;
    } else {
      var prio = roadmap.filter(function (a) { return a.priority <= DL.free_max_priority; });
      preview = { mode: prio.length ? 'priorities' : 'none', actions: prio.slice(0, DL.free_results) };
      preview.remaining_count = roadmap.length - preview.actions.length;
    }

    /* ---- 7 bis. « Je ne sais pas » non déjà visibles ailleurs (ni red flag, ni axe affiché) ----
     * Un « Je ne sais pas » compte toujours dans vigilance_count, mais n'est listé ici que s'il
     * n'apparaît nulle part ailleurs à l'écran : jamais deux fois le même sujet. */
    var shownQids = {};
    function markShown(a) { if (a.question_id) shownQids[a.question_id] = true; (a.related_questions || []).forEach(function (qid) { shownQids[qid] = true; }); }
    redFlags.forEach(markShown);
    areas.slice(0, T.max_areas_to_structure).forEach(markShown);
    var vigilanceItems = items.filter(function (it) { return it.vigilance && !shownQids[it.question_id]; })
      .map(function (it) {
        return {
          question_id: it.question_id, pillar: it.pillar, pillar_label: PB[it.pillar].label,
          title: it.q.action_title || it.short_label, subject: it.short_label,
          description: it.q.area_text || null
        };
      });

    var result = {
      method_version: R.method_version,
      config_version: cfg.Q.version, legal_rules_version: cfg.L.version,
      context: ctx,
      complete: missing.length === 0, missing: missing,
      questions_count: qs.length,
      global: global,
      pillars: pillars,
      items: items.map(function (it) { var o = {}; Object.keys(it).forEach(function (k) { if (k !== 'q') o[k] = it[k]; }); return o; }),
      red_flags: redFlags,
      critical: critical,
      roadmap: roadmap,
      areas_to_structure: areas,
      strengths: strengths, strengths_fallback: strengthsFallback,
      optimisations: optimisations,
      free_preview: preview,
      very_good: veryGood,
      vigilance_count: items.filter(function (it) { return it.vigilance; }).length,
      vigilance_items: vigilanceItems,
      lowest_pillar: ev.length ? ev.filter(function (p) { return p.rank_from_bottom === 1; })[0].id : null
    };
    var lead = leadInterest(result, ctx, cfg);
    result.lead_interest = lead.tags;
    result.lead_signals = lead.signals;
    return result;
  }

  /* ================================================================
   * Qualification commerciale interne (jamais affichée)
   * ================================================================ */
  function metrics(res, cfg) {
    var P = {}; res.pillars.forEach(function (p) { P[p.id] = p; });
    var byQ = {}; res.items.forEach(function (it) { byQ[it.question_id] = it; });
    var qTags = {}; cfg.Q.QUESTIONS.forEach(function (q) { qTags[q.id] = q.commercial_tags; });
    /* Signaux par domaine : red flags + toutes les priorités 2. Dispersion (audit_rh) : red flags +
       priorités 2 FORTES uniquement (une situation B n'est pas un sujet de sécurisation). */
    var signalPillars = {}, strongPillars = {};
    res.red_flags.concat(res.critical).forEach(function (a) { signalPillars[a.pillar] = (signalPillars[a.pillar] || 0) + 1; });
    res.red_flags.concat(res.critical.filter(function (a) { return a.tone === 'critical'; })).forEach(function (a) { strongPillars[a.pillar] = true; });
    var wb = cfg.R.lead_interest.weak_pillar_below;
    return {
      red_flags_count: function () { return res.red_flags.length; },
      critical_count: function () { return res.critical.length; },
      critical_strong_count: function () { return res.critical.filter(function (a) { return a.tone === 'critical'; }).length; },
      global_score: function () { return res.global.display_score; },
      pillar_score: function (l) { return P[l.pillar] && P[l.pillar].evaluated ? P[l.pillar].display_score : null; },
      weak_pillars_count: function () { return res.pillars.filter(function (p) { return p.evaluated && p.display_score < wb; }).length; },
      rank_from_bottom: function (l) { return P[l.pillar] && P[l.pillar].evaluated ? P[l.pillar].rank_from_bottom : null; },
      pillar_signal_count: function (l) { return signalPillars[l.pillar] || 0; },
      pillar_weak_answers: function (l) { return res.items.filter(function (it) { return it.pillar === l.pillar && it.in_score && it.score === 0; }).length; },
      pillars_with_critical: function () { return Object.keys(strongPillars).length; },
      tagged_weak_count: function (l) { return res.items.filter(function (it) { return it.in_score && it.score <= 33 && (qTags[it.question_id] || []).indexOf(l.tag) >= 0; }).length; },
      answer_score: function (l) { var it = byQ[l.question]; return it && it.in_score ? it.score : null; },
      red_flag_on: function (l) { return l.questions.some(function (id) { return byQ[id] && byQ[id].red_flag; }) ? 1 : 0; }
    };
  }
  function cmp(v, l) {
    if (v === null || v === undefined) return false;
    if ('gte' in l && !(v >= l.gte)) return false;
    if ('gt' in l && !(v > l.gt)) return false;
    if ('lte' in l && !(v <= l.lte)) return false;
    if ('lt' in l && !(v < l.lt)) return false;
    return true;
  }
  function leafText(l, v) {
    var op = 'gte' in l ? '≥ ' + l.gte : 'gt' in l ? '> ' + l.gt : 'lte' in l ? '≤ ' + l.lte : '< ' + l.lt;
    return l.metric + (l.pillar ? '[' + l.pillar + ']' : l.question ? '[' + l.question + ']' : l.tag ? '[' + l.tag + ']' : '') + ' = ' + (Math.round(v * 10) / 10) + ' (' + op + ')';
  }
  function evalLead(c, M, ctx, reasons) {
    if (c.all) { var r = []; var ok = c.all.every(function (x) { return evalLead(x, M, ctx, r); }); if (ok) Array.prototype.push.apply(reasons, r); return ok; }
    if (c.any) { var hit = false; c.any.forEach(function (x) { if (evalLead(x, M, ctx, reasons)) hit = true; }); return hit; }
    if (c.not) return !evalLead(c.not, M, ctx, []);
    if (c.field) { var ok2 = evalCond(c, ctx); if (ok2) reasons.push(c.field + ' = ' + ctx[c.field]); return ok2; }
    var v = M[c.metric](c);
    var ok3 = cmp(v, c);
    if (ok3) reasons.push(leafText(c, v));
    return ok3;
  }
  function leadInterest(res, ctx, cfg) {
    var M = metrics(res, cfg), tags = [], signals = [];
    cfg.R.lead_interest.rules.forEach(function (rule) {
      var reasons = [];
      if (evalLead(rule.when, M, ctx, reasons)) { tags.push(rule.tag); signals.push({ tag: rule.tag, reasons: reasons }); }
    });
    return { tags: tags, signals: signals };
  }

  /* ================================================================
   * Payload (préparé pour Pipedrive / Brevo, envoyé nulle part par le moteur)
   * ================================================================ */
  function buildPayload(o, cfg) {
    cfg = cfg || defaultConfig();
    var res = o.result, ctx = normalizeContext(o.context || res.context, cfg), contact = o.contact || {}, utm = o.utm || {}, meta = o.meta || {};
    var p = {};
    cfg.R.payload.contact.forEach(function (k) { p[k] = contact[k] ? String(contact[k]).trim() : ''; });
    cfg.R.payload.context.forEach(function (k) { p[k] = ctx[k] || ''; });
    /* forfait_jours n'a de sens que si le module de la convention sélectionnée le pose. */
    var mod = moduleFor(ctx, cfg);
    p.forfait_jours = mod && (mod.context_questions || []).some(function (c) { return c.id === 'forfait_jours'; }) ? (ctx.forfait_jours || '') : '';
    p.global_score = res.global.display_score;
    res.pillars.forEach(function (pl) { p[pl.score_field] = pl.evaluated ? pl.display_score : null; });
    p.red_flags_count = res.red_flags.length;
    p.red_flags = res.red_flags.map(function (a) { return a.subject || a.title; });
    p.critical_issues_count = res.critical.length;
    p.top_priorities = res.very_good ? [] : res.roadmap.filter(function (a) { return a.priority <= 3; }).slice(0, 3).map(function (a) { return a.title; });
    p.areas_to_structure = res.areas_to_structure.map(function (a) { return a.subject || a.title; });
    p.strengths = res.strengths.map(function (s) { return s.label; });
    p.lead_interest = res.lead_interest.slice();
    cfg.R.utm_keys.forEach(function (k) { p[k] = utm[k] || ''; });
    p.audit_id = meta.audit_id || '';
    p.config_version = res.config_version;
    p.legal_rules_version = res.legal_rules_version;
    p.completed_at = meta.completed_at || '';
    p.page_url = meta.page_url || '';
    p.consent_scope = cfg.R.lead_form.consent_scope || '';
    p.method_version = res.method_version;
    p.pillar_details = res.pillars.map(function (pl) {
      return { pillar: pl.id, score: pl.score, display_score: pl.display_score, evaluated: pl.evaluated, level: pl.level,
        applicable_count: pl.applicable_count, scored_count: pl.scored_count, red_flags_count: pl.red_flags_count };
    });
    p.lead_signals = res.lead_signals;
    p.audit_metrics = meta.metrics || null;
    p.answers_json = JSON.stringify(res.items.map(function (it) {
      return { question_id: it.question_id, variant_id: it.variant_id, pillar: it.pillar, answer_id: it.answer_id, score: it.score,
        weight: it.weight, applicable: true, in_score: it.in_score, red_flag: it.red_flag };
    }));
    return p;
  }

  /* ================================================================
   * Progression (abandon / reprise) et UTM — pur, le stockage est fait par l'interface
   * ================================================================ */
  function serializeProgress(state, now) {
    return JSON.stringify({ v: 1, saved_at: (now || new Date()).toISOString(), state: state });
  }
  /* Le contenu vient du navigateur du visiteur : il peut être tronqué, périmé ou modifié.
   * Un état invalide doit repartir de zéro, jamais faire échouer le rendu. */
  var STEPS = { intro: 1, context: 1, question: 1, results: 1 };
  function plain(o) { return !!o && typeof o === 'object' && !Array.isArray(o); }
  function restoreProgress(raw, now, ttlDays) {
    if (!raw) return null;
    var o;
    try { o = JSON.parse(raw); } catch (e) { return null; }
    if (!o || o.v !== 1 || !plain(o.state) || !o.saved_at) return null;
    var age = ((now || new Date()).getTime() - new Date(o.saved_at).getTime()) / 86400000;
    if (!(age >= 0) || age > (ttlDays || 30)) return null;
    var st = o.state;
    if (!STEPS[st.step] || !plain(st.context) || !plain(st.answers)) return null;
    if (typeof st.ctxIndex !== 'number' || st.ctxIndex < 0) st.ctxIndex = 0;
    if (typeof st.qIndex !== 'number' || st.qIndex < 0) st.qIndex = 0;
    if (!plain(st.metrics)) st.metrics = null;
    return st;
  }
  /* Les UTM de l'URL priment ; sinon on garde ceux déjà mémorisés pendant la visite. */
  function resolveUtm(search, storedJson, keys) {
    var fromUrl = {}, any = false;
    String(search || '').replace(/^\?/, '').split('&').forEach(function (pair) {
      if (!pair) return;
      var i = pair.indexOf('='), k = decodeURIComponent(i < 0 ? pair : pair.slice(0, i)), v = i < 0 ? '' : decodeURIComponent(pair.slice(i + 1).replace(/\+/g, ' '));
      if (keys.indexOf(k) >= 0 && v) { fromUrl[k] = v; any = true; }
    });
    var stored = {};
    try { stored = storedJson ? JSON.parse(storedJson) || {} : {}; } catch (e) { stored = {}; }
    var src = any ? fromUrl : stored, out = {};
    keys.forEach(function (k) { out[k] = src[k] || ''; });
    return { utm: out, from_url: any };
  }

  /* ================================================================
   * Mesure de durée et de friction (pur : l'horloge est passée en paramètre)
   * ================================================================ */
  function newMetrics(now) {
    return { started_at: now, results_at: null, resumed: false, questionnaire_ms: 0, pillar_ms: {},
      segment: null, back_count: 0, answer_changes: 0, last_question_id: null, last_pillar: null };
  }
  /* Ferme le segment d'écran en cours (plafonné) et l'ajoute au questionnaire et à son pilier. */
  function closeSegment(m, now, capSeconds) {
    if (!m || !m.segment) return m;
    var dt = Math.max(0, Math.min(now - m.segment.t0, (capSeconds || 300) * 1000));
    m.questionnaire_ms += dt;
    m.pillar_ms[m.segment.pillar] = (m.pillar_ms[m.segment.pillar] || 0) + dt;
    m.segment = null;
    return m;
  }
  /* Ouvre un segment sur une question (ferme le précédent). */
  function openSegment(m, question, now, capSeconds) {
    closeSegment(m, now, capSeconds);
    m.segment = { pillar: question.pillar, t0: now };
    m.last_question_id = question.id; m.last_pillar = question.pillar;
    return m;
  }
  function metricsSummary(m) {
    if (!m) return null;
    var pillars = {};
    Object.keys(m.pillar_ms).forEach(function (k) { pillars[k] = Math.round(m.pillar_ms[k] / 1000); });
    return {
      audit_duration_seconds: m.results_at ? Math.round((m.results_at - m.started_at) / 1000) : null,
      questionnaire_duration_seconds: Math.round(m.questionnaire_ms / 1000),
      pillar_duration_seconds: pillars,
      audit_resumed: !!m.resumed,
      back_count: m.back_count, answer_changes: m.answer_changes,
      last_question_id: m.last_question_id, last_pillar: m.last_pillar
    };
  }

  var API = {
    defaultConfig: defaultConfig, withOverrides: withOverrides,
    evalCond: evalCond, obligationApplies: obligationApplies,
    isActive: isActive, isApplicable: isApplicable,
    questionsFor: questionsFor, pillarsFor: pillarsFor, answerOptions: answerOptions, resolveQuestion: resolveQuestion,
    contextSteps: contextSteps, normalizeContext: normalizeContext, moduleFor: moduleFor, searchAgreements: searchAgreements, agreementContext: agreementContext,
    levelFor: levelFor, evaluate: evaluate, buildPayload: buildPayload,
    serializeProgress: serializeProgress, restoreProgress: restoreProgress, resolveUtm: resolveUtm,
    newMetrics: newMetrics, openSegment: openSegment, closeSegment: closeSegment, metricsSummary: metricsSummary
  };
  root.ARH_ENGINE = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);

/*!
 * Audit RH 360° — Le Club des RH
 * GABARIT DE L'EMAIL DE RAPPORT (« Votre diagnostic RH 360° »).
 *
 * Dépendance de PRODUCTION : le HTML produit ici est envoyé au webhook avec le payload, puis
 * expédié par Brevo. HTML compatible messagerie (tableaux + styles en ligne), transférable
 * (direction générale, direction financière…).
 *
 * Fonction pure : aucun DOM, aucun réseau. Tous les textes viennent de la configuration.
 */
(function (root) {
  'use strict';

  function esc(t) { return String(t === null || t === undefined ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function label(cfg, field, id) {
    var c = cfg.Q.CONTEXT.filter(function (x) { return x.id === field; })[0];
    var o = c && c.options ? c.options.filter(function (x) { return x.id === id; })[0] : null;
    return o ? o.label : (id || '—');
  }

  /* ------------------------------------------------------------------
   * Email « Votre diagnostic RH 360° » contenu complet du rapport.
   * ------------------------------------------------------------------ */
  function buildReportEmail(res, payload, cfg, opts) {
    var meetingHref = (opts && opts.meeting_url) || '#';
    var R = cfg.R, V = '#5E17EB', INK = '#131214', INK2 = '#5E5963', LINE = '#E9E4F0', OR = '#C0661A';
    var ctx = res.context;
    var h = [];
    function p(t, st) { h.push('<p style="margin:0 0 12px;font-size:15px;line-height:1.55;color:' + INK2 + ';' + (st || '') + '">' + t + '</p>'); }
    function h2(t) { h.push('<h2 style="margin:32px 0 12px;font-size:18px;line-height:1.3;color:' + INK + '">' + esc(t) + '</h2>'); }
    function item(title, body, rec, color) {
      h.push('<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 10px;border:1px solid ' + LINE + ';border-left:3px solid ' + (color || V) + ';border-radius:8px"><tr><td style="padding:12px 14px">' +
        '<div style="font-size:15px;font-weight:600;color:' + INK + '">' + esc(title) + '</div>' +
        (body ? '<div style="font-size:14px;color:' + INK2 + ';margin-top:4px">' + esc(body) + '</div>' : '') +
        (rec ? '<div style="font-size:14px;color:' + INK + ';margin-top:6px"><strong>Action :</strong> ' + esc(rec) + '</div>' : '') +
        '</td></tr></table>');
    }

    h.push('<div style="background:#F7F3FE;padding:24px 12px;font-family:Arial,Helvetica,sans-serif">');
    h.push('<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px"><tr><td style="padding:32px 28px">');
    h.push('<div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:' + V + ';font-weight:700">Le Club des RH · Audit RH 360°</div>');
    h.push('<h1 style="margin:8px 0 16px;font-size:24px;line-height:1.25;color:' + INK + '">Votre diagnostic RH 360°</h1>');
    p('Bonjour ' + esc(payload.firstname) + ',');
    p('Voici le détail de votre pré-diagnostic RH' + (payload.company ? ' pour <strong>' + esc(payload.company) + '</strong>' : '') + ' : vos scores, les sujets à sécuriser et une roadmap priorisée de vos prochaines actions.');

    h2('1. Contexte');
    p(esc(label(cfg, 'company_size', ctx.company_size)) + ' · CSE : ' + esc(label(cfg, 'has_cse', ctx.has_cse)) +
      ' · Organisation RH : ' + esc(label(cfg, 'hr_organization', ctx.hr_organization)) + (ctx.hr_organization_other ? ' (' + esc(ctx.hr_organization_other) + ')' : '') +
      (ctx.collective_agreement_label ? ' · Convention collective : ' + esc(ctx.collective_agreement_label) + (ctx.collective_agreement_idcc ? ' (IDCC ' + esc(ctx.collective_agreement_idcc) + ')' : '') : '') +
      ' · ' + res.questions_count + ' questions.');

    h2('2. Score global');
    h.push('<div style="font-size:40px;font-weight:700;color:' + INK + '">' + res.global.display_score + '<span style="font-size:18px;color:' + INK2 + '"> / 100</span></div>');
    p(esc(res.very_good ? R.result_texts.very_good.body : res.global.text), 'margin-top:6px');

    h2('3. Scores par pilier');
    h.push('<table role="presentation" width="100%" cellpadding="0" cellspacing="0">');
    res.pillars.forEach(function (pl) {
      var w = pl.evaluated ? Math.max(2, Math.round(pl.display_score)) : 0;
      h.push('<tr><td style="padding:6px 0;font-size:14px;color:' + INK + '">' + esc(pl.label) + '</td>' +
        '<td style="padding:6px 0;font-size:14px;text-align:right;color:' + INK2 + ';white-space:nowrap">' + (pl.evaluated ? pl.display_score + ' / 100' : 'Non évalué') + '</td></tr>' +
        '<tr><td colspan="2" style="padding:0 0 8px"><div style="background:#EFEAF6;border-radius:4px;height:6px"><div style="background:' + (pl.evaluated ? (pl.display_score >= 60 ? V : OR) : '#EFEAF6') + ';width:' + w + '%;height:6px;border-radius:4px"></div></div></td></tr>');
    });
    h.push('</table>');

    h2('4. Sujets à sécuriser');
    if (res.red_flags.length) res.red_flags.forEach(function (a) { item(a.subject || a.title, a.description, a.recommendation, OR); });
    else p('Vos réponses ne font ressortir aucun sujet réglementaire à sécuriser en priorité.');

    h2('5. Priorités');
    var prio = res.critical;
    if (prio.length) prio.forEach(function (a) { item((a.subject || a.title) + ' — ' + a.status, a.description, a.recommendation); });
    else p('Aucun point critique supplémentaire.');

    h2('6. Axes à structurer');
    var areas = res.areas_to_structure.filter(function (a) { return a.priority !== 2; });
    if (areas.length) areas.forEach(function (a) { item(a.subject || a.title, a.description, a.recommendation, '#9B78F4'); });
    else p(res.very_good ? 'Aucun axe à structurer : votre organisation apparaît bien structurée.' : 'Aucun axe supplémentaire.');

    h2('7. Points forts');
    if (res.strengths.length) res.strengths.forEach(function (s) { item(s.label + ' — ' + s.display_score + ' / 100', s.text, null, '#1E8E5A'); });
    else p('Vos points forts apparaîtront à mesure que vos pratiques se structurent.');

    h2('8. Roadmap détaillée');
    R.roadmap_priorities.forEach(function (pr) {
      var acts = res.roadmap.filter(function (a) { return a.priority === pr.priority; });
      if (!acts.length) return;
      h.push('<div style="font-size:13px;font-weight:700;color:' + V + ';margin:16px 0 8px;text-transform:uppercase;letter-spacing:.05em">' + esc(res.very_good && pr.priority >= 4 ? R.result_texts.very_good.optimisations_title : pr.label) + '</div>');
      acts.forEach(function (a) { item(a.title + (a.priority === 2 && pr.label_by_tone && pr.label_by_tone[a.tone] ? ' — ' + pr.label_by_tone[a.tone] : ''), a.reason, a.recommendation); });
    });

    h2('9. Hypothèses');
    p(esc(R.disclaimer), 'font-size:13px');

    h.push('<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;background:#F7F3FE;border-radius:10px"><tr><td style="padding:20px">' +
      '<div style="font-size:16px;font-weight:700;color:' + INK + '">' + esc(R.commercial_cta.title) + '</div>' +
      '<div style="font-size:14px;color:' + INK2 + ';margin:6px 0 14px">' + esc(R.commercial_cta.text) + '</div>' +
      '<a href="' + esc(meetingHref) + '" style="display:inline-block;background:' + V + ';color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 18px;border-radius:8px">' + esc(R.commercial_cta.cta) + '</a>' +
      '</td></tr></table>');
    h.push('</td></tr></table></div>');
    return { subject: 'Votre diagnostic RH 360°', html: h.join('') };
  }

  var API = { build: buildReportEmail };
  root.ARH_REPORT_EMAIL = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);

/*!
 * Audit RH 360° — Le Club des RH
 * ENVOIS (rapport, rendez-vous). Seule couche de l'application qui parle au réseau.
 *
 * Configuration : window.ARH_INTEGRATIONS_CONFIG, défini par la page AVANT le chargement du bundle
 * (voir docs/INTEGRATIONS.md et src/config/integrations.example.js). Rien de secret n'y figure :
 * un Catch Hook Zapier est une URL publique en écriture seule.
 *
 * Tant que `report_webhook_url` est vide, l'envoi est SIMULÉ ici même (aucun appel réseau) et
 * l'interface l'indique (« aucun email n'est envoyé »). Tant que `meeting_path` est vide, le CTA
 * de rendez-vous est inactif et l'interface le signale.
 */
(function (root) {
  'use strict';

  var C = root.ARH_INTEGRATIONS_CONFIG || {};

  /* Mode simulé : aucun webhook configuré. Lu par l'interface pour afficher l'avertissement. */
  function isMock() { return !C.report_webhook_url; }

  /* Envoi simulé : même forme de promesse et même latence perçue que l'envoi réel. */
  function simulate() {
    return new Promise(function (resolve) {
      root.setTimeout(function () { resolve({ ok: true, mock: true }); }, 700);
    });
  }

  /* Corps du POST : champs à plat (mappage direct dans Zapier) + payload_json complet
   * + le rapport HTML prêt pour Brevo. Encodage formulaire = requête simple, aucun préflight. */
  function body(payload, email) {
    var b = new root.URLSearchParams();
    Object.keys(payload).forEach(function (k) {
      var v = payload[k];
      b.set(k, v === null || v === undefined ? '' : (typeof v === 'object' ? JSON.stringify(v) : String(v)));
    });
    b.set('payload_json', JSON.stringify(payload));
    b.set('report_subject', email.subject);
    b.set('report_html', email.html);
    return b;
  }

  /* Un Catch Hook Zapier renvoie les en-têtes CORS : on lit donc le statut HTTP et on peut
   * signaler un échec réel au visiteur (sinon un Zap en erreur passait pour un succès).
   * Si la réponse n'est pas lisible (proxy d'entreprise, extension, CORS retiré), on retente
   * une fois en `no-cors` : la donnée part, et on reste optimiste plutôt que de perdre le lead.
   * `report_webhook_mode` : 'auto' (défaut) · 'cors' (strict) · 'no-cors' (toujours optimiste). */
  function submitReport(payload, email) {
    if (isMock()) return simulate();
    var mode = C.report_webhook_mode || 'auto';
    var url = C.report_webhook_url, data = body(payload, email);
    if (mode === 'no-cors') return opaque(url, data);
    return root.fetch(url, { method: 'POST', mode: 'cors', body: data })
      .then(function (res) { return { ok: !!res && res.ok, mock: false, status: res ? res.status : null }; })
      .catch(function () { return mode === 'cors' ? { ok: false, mock: false, status: null } : opaque(url, data); });
  }
  function opaque(url, data) {
    return root.fetch(url, { method: 'POST', mode: 'no-cors', body: data })
      .then(function () { return { ok: true, mock: false, opaque: true }; })
      .catch(function () { return { ok: false, mock: false, opaque: true }; });
  }

  /* URL du rendez-vous reconstruite sur le domaine visité (staging Webflow ou production) :
   * seul le CHEMIN est configuré, jamais un domaine en dur. null si non configuré. */
  function meetingUrl() {
    if (!C.meeting_path) return null;
    try {
      var u = new root.URL(C.meeting_path, root.location.origin);
      if (u.origin !== root.location.origin) return null;   // chemin seulement, jamais un domaine tiers
      return u.origin + u.pathname + u.search + u.hash;
    } catch (e) { return null; }
  }

  var API = { isMock: isMock, submitReport: submitReport, meetingUrl: meetingUrl, config: C };
  root.ARH_INTEGRATIONS = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);

/*!
 * Audit RH 360° — PROFILS DE RECETTE (panneau de test et tests automatisés).
 * Chargés dans le bundle mais exploitables uniquement sur une page data-arh-env="preprod".
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
      context: { respondent_role: 'drh', company_size: '50-249', has_cse: 'yes', hr_organization: 'hr_team', forfait_jours: 'no' }, ccn: '1486',
      base: { C: 'yes', M: 'C' },
      answers: { Q1: 'partial', Q3: 'partial', C3: 'partial', C4: 'na', Q10: 'B', Q12: 'B', Q16: 'A', Q19: 'B', Q20: 'B', Q22: 'B', Q23: 'B', Q27: 'B', Q29: 'B', Q31: 'B', Q32: 'B' } },

    { id: 'eti_data', label: 'ETI mature, faible sur data / pilotage',
      context: { respondent_role: 'drh', company_size: '250-999', has_cse: 'yes', hr_organization: 'hr_team' }, ccn: '3248',
      base: { C: 'yes', M: 'D' },
      answers: { Q6: 'B', Q16: 'B', Q27: 'B', Q29: 'B', Q30: 'A', Q31: 'A', Q32: 'A', Q12: 'C', Q20: 'C' } },

    { id: 'tres_mature', label: 'Organisation très mature · aucun problème significatif',
      context: { respondent_role: 'drh', company_size: '1000+', has_cse: 'yes', hr_organization: 'hr_team' }, ccn: '2120',
      base: { C: 'yes', M: 'D' },
      answers: { Q16: 'C', Q20: 'C', Q31: 'C', Q12: 'C', Q19: 'C' } },

    { id: 'score_eleve_red_flag', label: 'Score élevé avec un red flag réglementaire',
      context: { respondent_role: 'drh', company_size: '250-999', has_cse: 'yes', hr_organization: 'hr_team' }, ccn: 'unknown',
      base: { C: 'yes', M: 'D' },
      answers: { Q25: 'no', Q16: 'C', Q20: 'C', Q31: 'C' } },

    { id: 'tpe_sans_cse', label: 'TPE sans CSE (pilier « Relations sociales » non évalué)',
      context: { respondent_role: 'ceo', company_size: '1-10', hr_organization: 'external' }, ccn: 'none',
      base: { C: 'yes', M: 'C' },
      answers: { Q1: 'partial', Q8: 'B', Q13: 'B', Q19: 'B', Q22: 'A', Q29: 'B', Q30: 'B', Q32: 'B' } },

    { id: 'syntec_forfait_jours', label: 'ESN Syntec · forfaits jours à vérifier',
      context: { respondent_role: 'drh', company_size: '50-249', has_cse: 'yes', hr_organization: 'hr_team', forfait_jours: 'yes' }, ccn: '1486',
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

/*!
 * Audit RH 360° — Le Club des RH
 * INTERFACE. Aucun texte métier ici : questions, libellés, seuils et règles viennent de la
 * configuration ; les calculs viennent de engine.js.
 *
 * Point de montage : <div id="arh-audit"></div> (ajouter data-arh-env="preprod" sur une page de
 * recette). Ordre de chargement garanti par le bundle (scripts/build.js) : configuration, données,
 * engine.js, report-email.js, integrations.js, dev/profiles.js, app.js.
 *
 * Environnement : 'production' par défaut. 'preprod' active les outils de recette et la simulation
 * d'envoi explicite. Voir docs/WEBFLOW.md.
 */
(function (root, doc) {
  'use strict';

  var E = root.ARH_ENGINE, RE = root.ARH_REPORT_EMAIL, I = root.ARH_INTEGRATIONS;
  var mount = doc.getElementById('arh-audit');
  if (!mount) {
    if (root.console) console.error('[ARH] Point de montage #arh-audit absent de la page.');
    return;
  }
  /* Le script peut être inséré deux fois (code de page + code du site, ou aperçu Webflow) :
   * la seconde exécution écraserait le parcours en cours et doublerait les écouteurs. */
  if (mount.getAttribute('data-arh-booted') === 'true') {
    if (root.console) console.warn('[ARH] Déjà initialisé sur cette page : second chargement ignoré.');
    return;
  }

  /* Environnement : 'production' par défaut. 'preprod' uniquement si la page le déclare. */
  var ENV = mount.getAttribute('data-arh-env') === 'preprod' ? 'preprod' : 'production';

  /* Un module manquant est une erreur d'intégration : message explicite plutôt qu'un bloc vide. */
  var MISSING = [['ARH_ENGINE', E], ['ARH_QUESTIONS', root.ARH_QUESTIONS], ['ARH_RULES', root.ARH_RULES],
    ['ARH_LEGAL', root.ARH_LEGAL], ['ARH_CCN_LIST', root.ARH_CCN_LIST], ['ARH_CCN_MODULES', root.ARH_CCN_MODULES],
    ['ARH_REPORT_EMAIL', RE], ['ARH_INTEGRATIONS', I]]
    .filter(function (x) { return !x[1]; }).map(function (x) { return x[0]; });
  if (MISSING.length) {
    if (root.console) console.error('[ARH] Modules manquants : ' + MISSING.join(', ') + '. Vérifiez le chargement du bundle.');
    if (ENV === 'preprod') mount.textContent = 'Audit RH 360° — modules manquants : ' + MISSING.join(', ') + '.';
    return;
  }
  mount.setAttribute('data-arh-booted', 'true');
  if (!doc.documentElement.getAttribute('lang')) mount.setAttribute('lang', 'fr');   // contenu en français

  /* Garde-fou juridique : piloté par scoring.js (release.require_legal_review), source unique.
   * À true, toute règle sans `legal_reviewed_at` est désactivée en production (questions ET red flags). */
  var REQUIRE_REVIEW = (root.ARH_RULES.release || {}).require_legal_review === true;
  var BASE = E.withOverrides(E.defaultConfig(), { release: { mode: ENV, require_legal_review: REQUIRE_REVIEW } }), R = BASE.R;
  /* Outils de recette : jamais sur une page de production, même avec ?test=1 (ils exposeraient
   * le payload CRM et les signaux commerciaux internes). */
  var DEV = ENV === 'preprod' && (mount.getAttribute('data-arh-dev') === 'true' ||
    /[?&]test=1\b/.test(root.location.search) || /(^|[#&])test\b/.test(root.location.hash));
  var HERO = R.hero;

  /* ================================================================
   * État
   * ================================================================ */
  var S = freshState(), saved = null, sending = false, formErrors = {}, contactDraft = {}, devOpen = false, devLog = [], fired = {};
  var overrides = { rules: {}, questions: {} };
  function freshState() {
    return { step: 'intro', ctxIndex: 0, qIndex: 0, context: {}, answers: {}, converted: false,
      audit_id: 'arh_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7), started_at: null, completed_at: null,
      metrics: null };
  }
  function cfg() {
    var hasOver = Object.keys(overrides.rules).length || Object.keys(overrides.questions).length;
    return hasOver ? E.withOverrides(BASE, overrides) : BASE;
  }

  /* ---------- Stockage (toujours protégé : navigation privée, stockage bloqué…) ---------- */
  function store(kind, key, val) { try { root[kind].setItem(key, val); } catch (e) { /* sans stockage, le parcours reste utilisable */ } }
  function load(kind, key) { try { return root[kind].getItem(key); } catch (e) { return null; } }
  function drop(kind, key) { try { root[kind].removeItem(key); } catch (e) { /* idem */ } }
  function save() { if (S.step !== 'intro') store('localStorage', R.storage.progress_key, E.serializeProgress(S)); }

  var U = E.resolveUtm(root.location.search, load('sessionStorage', R.storage.utm_key), R.utm_keys);
  if (U.from_url) store('sessionStorage', R.storage.utm_key, JSON.stringify(U.utm));
  var UTM = U.utm;

  /* ---------- Analytics (même mécanisme que le simulateur RPO) ---------- */
  function track(event, props, once) {
    if (once) { if (fired[event]) return; fired[event] = true; }
    var data = { audit: 'audit_rh_360', source: UTM.utm_source || '', campaign: UTM.utm_campaign || '' };
    if (S.context.company_size) data.company_size = S.context.company_size;
    Object.keys(props || {}).forEach(function (k) { data[k] = props[k]; });
    root.dataLayer = root.dataLayer || [];
    var hasGtm = !!(root.google_tag_manager && Object.keys(root.google_tag_manager).some(function (k) { return k.indexOf('GTM-') === 0; }));
    if (hasGtm || typeof root.gtag !== 'function') root.dataLayer.push(Object.assign({ event: event }, data));
    else root.gtag('event', event, data);
    devLog.unshift(event + ' ' + JSON.stringify(data));
    if (DEV) renderDev();
  }

  /* ================================================================
   * Utilitaires d'affichage
   * ================================================================ */
  function esc(t) { return String(t === null || t === undefined ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function plural(n, forms) { return (n > 1 ? forms.many : forms.one).replace('{n}', n); }
  function ctxLabel(field, id) {
    var c = BASE.Q.CONTEXT.filter(function (x) { return x.id === field; })[0];
    var o = c && c.options ? c.options.filter(function (x) { return x.id === id; })[0] : null;
    return o ? o.label : '';
  }
  function questions() { return E.questionsFor(S.context, cfg()); }
  function pillarsFor() { return E.pillarsFor(S.context, cfg()); }

  var view = doc.createElement('div');
  mount.classList.add('arh');
  mount.innerHTML = '';
  mount.appendChild(view);

  function go(step, patch) {
    S.step = step;
    Object.keys(patch || {}).forEach(function (k) { S[k] = patch[k]; });
    save();
    render();
    var top = mount.getBoundingClientRect().top;
    if (top < 0 || top > root.innerHeight * 0.4) mount.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var h = view.querySelector('.arh-h2, .arh-h1');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  /* ================================================================
   * Écrans
   * ================================================================ */
  function renderIntro() {
    var s = saved && saved.answers ? saved : null;
    var answered = s ? Object.keys(s.answers).length : 0;
    return '<section class="arh-screen arh-hero">' +
      '<span class="arh-eyebrow">' + esc(HERO.eyebrow) + '</span>' +
      '<h1 class="arh-h1">' + esc(HERO.title) + '</h1>' +
      '<p class="arh-lead">' + esc(HERO.lead) + '</p>' +
      '<ul class="arh-meta">' + HERO.meta.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' +
      '<button class="arh-btn" data-act="start">' + esc(HERO.cta) + '</button>' +
      (s && (answered || s.step !== 'intro') ? '<div class="arh-resume"><span>Vous avez un audit en cours' + (answered ? ' (' + answered + ' réponses)' : '') + '.</span>' +
        '<button class="arh-link" data-act="resume">Reprendre mon audit</button></div>' : '') +
      '<ul class="arh-pillars-preview" aria-label="Les 8 piliers évalués">' + BASE.Q.PILLARS.map(function (p) { return '<li>' + esc(p.label) + '</li>'; }).join('') + '</ul>' +
      '</section>';
  }

  function optionsHtml(opts, selected, muted, labelledby) {
    return '<ul class="arh-options" ' + (labelledby ? 'role="group" aria-labelledby="' + labelledby + '"' : 'role="list"') + '>' + opts.map(function (o, i) {
      return '<li><button type="button" class="arh-option' + (muted && muted(o) ? ' arh-option-muted' : '') + '" data-opt="' + esc(o.id) + '" aria-pressed="' + (selected === o.id) + '">' +
        '<span class="arh-radio" aria-hidden="true"></span><span>' + esc(o.label) + '</span><span class="arh-sr"> (touche ' + (i + 1) + ')</span></button></li>';
    }).join('') + '</ul>';
  }

  function ctxSteps() { return E.contextSteps(S.context, cfg()); }

  function renderContext() {
    var fields = ctxSteps(), f = fields[S.ctxIndex], val = S.context[f.id];
    var isSearch = f.type === 'ccn_search';
    var picked = !isSearch && f.options ? f.options.filter(function (o) { return o.id === val; })[0] : null;
    var detail = picked && picked.detail;
    var done = isSearch ? !!S.context.collective_agreement_known
      : !!val && !(detail && detail.required && !(S.context[detail.id] || '').trim());
    return '<section class="arh-screen arh-card">' +
      '<div class="arh-top"><span class="arh-step-label">Votre contexte</span><span class="arh-count">' + (S.ctxIndex + 1) + ' / ' + fields.length + '</span></div>' +
      '<div class="arh-progress" aria-hidden="true"><span style="width:' + Math.round(S.ctxIndex / fields.length * 100) + '%"></span></div>' +
      '<div class="arh-qhead"><h2 class="arh-h2" id="arh-ctx-title">' + esc(f.label) + '</h2>' + (f.help_text && !isSearch ? tipBtn() : '') + '</div>' +
      (isSearch ? '<p class="arh-muted" style="margin:6px 0 0">' + esc(f.help_text) + '</p>'
        : (f.help_text ? '<p class="arh-tip" id="arh-tip" hidden>' + esc(f.help_text) + '</p>' : '')) +
      (isSearch ? renderCcnSearch(f) : optionsHtml(f.options, val, null, 'arh-ctx-title')) +
      (detail ? '<div class="arh-detail"><label for="arh-detail">' + esc(detail.label) + '</label>' +
        '<input id="arh-detail" class="arh-input" type="text" autocomplete="off" maxlength="' + (detail.maxlength || 120) + '"' +
        ' data-detail="' + esc(detail.id) + '" placeholder="' + esc(detail.placeholder || '') + '" value="' + esc(S.context[detail.id] || '') + '"></div>' : '') +
      '<div class="arh-nav"><button class="arh-btn arh-btn-ghost" data-act="back">Précédent</button>' +
      '<button class="arh-btn ' + (isSearch ? '' : 'arh-btn-secondary') + '" data-act="ctx-next"' + (done ? '' : ' disabled') + '>' + (isSearch ? 'Continuer' : 'Suivant') + '</button></div>' +
      '</section>';
  }

  /* Recherche de convention collective : sélection obligatoire dans la liste normalisée, ou l'une des
   * deux alternatives explicites. Plusieurs actions sur l'écran : pas d'avance automatique. */
  var ccnQuery = '', ccnActive = -1;
  function ccnOptionLabel(e) { return (e.display || e.label) + ' — IDCC ' + e.idcc + (e.short_name ? ' (' + e.short_name + ')' : ''); }
  function renderCcnSearch(f) {
    var c = S.context, CCN = cfg().CCN, h = '<div class="arh-ccn">';
    if (c.collective_agreement_known === 'known') {
      var sel = CCN.entries.filter(function (x) { return x.idcc === c.collective_agreement_idcc; })[0];
      h += '<div class="arh-ccn-selected"><div><span class="arh-small">Convention sélectionnée</span><strong>' + esc(sel && sel.display || c.collective_agreement_label) + '</strong>' +
        '<span class="arh-small">IDCC ' + esc(c.collective_agreement_idcc) + (c.collective_agreement_short_name ? ' · ' + esc(c.collective_agreement_short_name) : '') + '</span></div>' +
        '<button class="arh-link" data-act="ccn-clear">Modifier</button></div>';
    } else {
      h += '<label class="arh-sr" for="arh-ccn">' + esc(f.label) + '</label>' +
        '<input id="arh-ccn" class="arh-input" type="search" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="arh-ccn-list"' +
        ' placeholder="' + esc(f.placeholder) + '" value="' + esc(ccnQuery) + '">' +
        '<ul class="arh-ccn-list" id="arh-ccn-list" role="listbox" hidden></ul>';
    }
    h += '<div class="arh-ccn-alt">' + (CCN.special || []).map(function (sp) {
      return '<button type="button" class="arh-option arh-option-muted" data-ccn-special="' + esc(sp.id) + '" aria-pressed="' + (c.collective_agreement_known === sp.id) + '">' +
        '<span class="arh-radio" aria-hidden="true"></span><span>' + esc(sp.label) + '</span></button>';
    }).join('') + '</div></div>';
    return h;
  }
  function updateCcnResults() {
    var inp = view.querySelector('#arh-ccn'), list = view.querySelector('#arh-ccn-list');
    if (!inp || !list) return;
    var res = E.searchAgreements(ccnQuery, cfg(), 8);
    ccnActive = res.length ? 0 : -1;
    list.innerHTML = res.length ? res.map(function (e, i) {
      return '<li role="option" id="arh-ccn-opt-' + i + '" data-ccn-idcc="' + esc(e.idcc) + '" aria-selected="' + (i === ccnActive) + '">' + esc(ccnOptionLabel(e)) + '</li>';
    }).join('') : (ccnQuery.trim().length >= 2 ? '<li class="arh-ccn-empty" aria-disabled="true">Aucune convention trouvée. Essayez le numéro IDCC, ou choisissez une option ci-dessous.</li>' : '');
    list.hidden = !list.innerHTML;
    inp.setAttribute('aria-expanded', String(!list.hidden));
    if (ccnActive >= 0) inp.setAttribute('aria-activedescendant', 'arh-ccn-opt-0'); else inp.removeAttribute('aria-activedescendant');
  }
  function moveCcn(delta) {
    var opts = view.querySelectorAll('#arh-ccn-list [data-ccn-idcc]');
    if (!opts.length) return;
    ccnActive = (ccnActive + delta + opts.length) % opts.length;
    Array.prototype.forEach.call(opts, function (o, i) { o.setAttribute('aria-selected', String(i === ccnActive)); });
    view.querySelector('#arh-ccn').setAttribute('aria-activedescendant', 'arh-ccn-opt-' + ccnActive);
    opts[ccnActive].scrollIntoView({ block: 'nearest' });
  }
  function chooseCcn(choice) {
    var v = E.agreementContext(choice, cfg());
    if (!v) return;
    Object.keys(v).forEach(function (k) { S.context[k] = v[k]; });
    ccnQuery = ''; save(); render();
    var next = view.querySelector('[data-act="ctx-next"]'); if (next) next.focus();
  }
  function tipBtn() { return '<button type="button" class="arh-tip-btn" data-act="tip" aria-expanded="false" aria-controls="arh-tip" aria-label="Plus d\'informations">?</button>'; }

  function renderQuestion() {
    var qs = questions(), q = qs[S.qIndex], C = cfg();
    if (!q) {
      if (!qs.length) return renderQuestionEmpty();
      S.qIndex = 0; q = qs[0];   // index hors bornes (configuration modifiée) : on repart au début
    }
    var ps = pillarsFor(), pIdx = 0;
    ps.forEach(function (x, i) { if (x.pillar.id === q.pillar) pIdx = i; });
    var val = S.answers[q.id];
    var opts = E.answerOptions(q, C);
    return '<section class="arh-screen arh-card">' +
      '<div class="arh-top"><span class="arh-step-label">Pilier ' + (pIdx + 1) + '/' + ps.length + ' — ' + esc(ps[pIdx].pillar.label) + '</span>' +
      '<span class="arh-count">' + (S.qIndex + 1) + ' / ' + qs.length + '</span></div>' +
      '<div class="arh-progress" aria-hidden="true"><span style="width:' + Math.round(S.qIndex / qs.length * 100) + '%"></span></div>' +
      '<div class="arh-qhead"><h2 class="arh-h2" id="arh-q-title">' + esc(q.question) + '</h2>' + tipBtn() + '</div>' +
      '<p class="arh-tip" id="arh-tip" hidden>' + esc(q.help_text) + '</p>' +
      optionsHtml(opts, val, function (o) { return o.id === 'unknown' || o.id === 'na'; }, 'arh-q-title') +
      '<div class="arh-nav"><button class="arh-btn arh-btn-ghost" data-act="back">Précédent</button>' +
      '<button class="arh-btn arh-btn-secondary" data-act="q-next"' + (val ? '' : ' disabled') + '>' + (S.qIndex === qs.length - 1 ? 'Voir mon résultat' : 'Suivant') + '</button></div>' +
      '<p class="arh-small arh-kbd-hint">Astuce : touches 1 à ' + opts.length + ' pour répondre.</p>' +
      '</section>';
  }
  /* Aucune question applicable (règles désactivées, configuration réduite) : écran explicite. */
  function renderQuestionEmpty() {
    return '<section class="arh-screen arh-card"><h2 class="arh-h2">Nous ne pouvons pas établir de diagnostic</h2>' +
      '<p class="arh-lead" style="margin-top:14px">Aucune question ne s\'applique à la situation décrite. ' +
      'Vous pouvez revenir en arrière pour ajuster votre contexte, ou nous contacter directement.</p>' +
      '<div class="arh-nav"><button class="arh-btn arh-btn-ghost" data-act="back">Précédent</button>' +
      '<button class="arh-btn arh-btn-secondary" data-act="restart">Recommencer l\'audit</button></div></section>';
  }

  /* ---------- Résultat ---------- */
  function itemHtml(a, kind) {
    var cls = kind === 'secure' ? ' arh-item-secure' : kind === 'strength' ? ' arh-item-strength' : kind === 'optim' ? ' arh-item-optim' : '';
    var tagCls = kind === 'secure' ? ' arh-tag-secure' : kind === 'strength' ? ' arh-tag-strength' : '';
    return '<li class="arh-item' + cls + '"><div class="arh-item-head"><h4>' + esc(a.title) + '</h4>' +
      (a.tag ? '<span class="arh-tag' + tagCls + '">' + esc(a.tag) + '</span>' : '') + '</div>' +
      (a.body ? '<p>' + esc(a.body) + '</p>' : '') + (a.rec ? '<p class="arh-rec">' + esc(a.rec) + '</p>' : '') + '</li>';
  }

  function renderResults() {
    var C = cfg(), res = E.evaluate(S.context, S.answers, C), T = R.result_texts;
    if (!res.complete) {   // effectif modifié, nouvelles questions : on reprend à la première manquante
      var idx = questions().map(function (q) { return q.id; }).indexOf(res.missing[0]);
      S.step = 'question'; S.qIndex = Math.max(0, idx); save();
      return renderQuestion();
    }
    var g = res.global, lv = g.level, nAreas = Math.min(R.thresholds.max_areas_to_structure, res.areas_to_structure.length);
    var h = '<div class="arh-screen arh-results">';

    /* Bloc 1 — score global */
    h += '<section class="arh-card arh-score-card' + (res.very_good ? ' arh-good' : '') + '" aria-labelledby="arh-res-title">';
    if (res.very_good) h += '<div class="arh-good-mark" aria-hidden="true">✓</div>';
    h += '<span class="arh-eyebrow">Votre diagnostic RH</span>';
    h += '<h2 class="arh-h2" id="arh-res-title" style="margin-top:14px">' + esc(res.very_good ? T.very_good.title : 'Votre diagnostic RH 360°') + '</h2>';
    h += '<div class="arh-score-row"><div class="arh-score" aria-label="Score global ' + g.display_score + ' sur 100">' + g.display_score + '<small>/ 100</small></div>' +
      '<div class="arh-gauge" aria-hidden="true"><i style="left:' + g.display_score + '%"></i></div></div>';
    h += '<p class="arh-lead" style="margin-top:14px">' + esc(res.very_good ? T.very_good.body : g.text) + '</p>';
    h += '<p class="arh-context-line">' + esc([ctxLabel('company_size', S.context.company_size), (S.context.hr_organization === 'other' && S.context.hr_organization_other ? S.context.hr_organization_other : ctxLabel('hr_organization', S.context.hr_organization)), res.questions_count + ' questions'].filter(Boolean).join(' · ')) + '</p>';
    h += '</section>';

    /* Bloc 1bis — mini navbar sticky vers les sections (reste visible au scroll) */
    h += '<nav class="arh-subnav" aria-label="Aller à une section du résultat"><div class="arh-subnav-inner">' +
      (res.red_flags.length ? '<a href="#arh-sec-red-flags" class="arh-chip arh-chip-warn"><b>' + res.red_flags.length + '</b> ' + (res.red_flags.length > 1 ? 'sujets à sécuriser' : 'sujet à sécuriser') + '</a>' : '<span class="arh-chip"><b>0</b> sujet réglementaire à sécuriser</span>') +
      (res.very_good || !nAreas ? '' : '<a href="#arh-sec-areas" class="arh-chip"><b>' + nAreas + '</b> ' + (nAreas > 1 ? 'axes à structurer' : 'axe à structurer') + '</a>') +
      (res.strengths.length ? '<a href="#arh-sec-strengths" class="arh-chip"><b>' + res.strengths.length + '</b> ' + (res.strengths.length > 1 ? 'points forts' : 'point fort') + '</a>' : '') +
      (res.vigilance_items.length ? '<a href="#arh-sec-vigilance" class="arh-chip"><b>' + res.vigilance_items.length + '</b> à vérifier</a>' : '') +
      (S.converted ? '<a href="#arh-done" class="arh-chip arh-chip-brand">Votre rapport</a>' : '<a href="#arh-gate" class="arh-chip arh-chip-brand">' + esc(R.lead_form.cta) + '</a>') + '</div></nav>';

    /* Bloc 2 — points forts calculés une fois, utilisés au bloc "points d'appui" plus bas */
    var strengthsHtml = res.strengths.length ? '<section class="arh-card" id="arh-sec-strengths"><div class="arh-section-head"><h3 class="arh-h3">' +
      esc(res.very_good ? T.very_good.strengths_title : res.strengths_fallback ? T.strengths_fallback_title : T.strengths_title) + '</h3></div><ul class="arh-items">' +
      res.strengths.map(function (s) { return itemHtml({ title: s.label, tag: s.display_score + ' / 100', body: s.text }, 'strength'); }).join('') + '</ul></section>' : '';

    /* Cas « très bon résultat » : les points forts passent en tête (règle produit validée). */
    if (res.very_good) h += strengthsHtml;

    /* Bloc 3 — premières actions (aperçu de roadmap) */
    var FP = res.free_preview, PV = T.preview;
    if (FP.mode === 'optimisations' && FP.actions.length) {
      h += '<section class="arh-card"><div class="arh-section-head"><h3 class="arh-h3">' + esc(T.very_good.optimisations_title) + '</h3></div><ul class="arh-items">' +
        FP.actions.map(function (a) { return itemHtml({ title: a.title, body: a.recommendation }, 'optim'); }).join('') + '</ul>' +
        '<p class="arh-small" style="margin:14px 0 0">' + esc(PV.very_good_more) + '</p></section>';
    } else if (FP.mode === 'priorities') {
      h += '<section class="arh-card"><div class="arh-section-head"><h3 class="arh-h3">' + esc(PV.title) + '</h3><span class="arh-small">' + esc(PV.subtitle) + '</span></div><ol class="arh-roadmap">' +
        FP.actions.map(function (a) {
          return '<li><div><span class="arh-tag' + (a.priority === 1 ? ' arh-tag-secure' : '') + '">' + esc(priorityLabel(a)) + '</span>' +
            '<h4>' + esc(a.title) + '</h4><p>' + esc(a.recommendation || a.description) + '</p></div></li>';
        }).join('') + '</ol>' +
        (FP.remaining_count > 0 ? '<div class="arh-locked">' + esc(plural(FP.remaining_count, PV.remaining)) + '</div>' : '') + '</section>';
    }

    /* Bloc 4 — scores par pilier */
    h += '<section class="arh-card"><div class="arh-section-head"><h3 class="arh-h3">Vos scores par pilier</h3></div><ul class="arh-bars">' +
      res.pillars.map(function (p) {
        if (!p.evaluated) return '<li class="arh-bar-ne"><div class="arh-bar-top"><b>' + esc(p.label) + '</b><span class="arh-bar-val">Non évalué</span></div><div class="arh-bar-track"></div><div class="arh-bar-sub">' + esc(T.pillar_not_evaluated) + '</div></li>';
        return '<li><div class="arh-bar-top"><b>' + esc(p.label) + '</b><span class="arh-bar-val">' + p.display_score + '</span></div>' +
          '<div class="arh-bar-track" role="img" aria-label="' + esc(p.label + ' : ' + p.display_score + ' sur 100, ' + p.level_label) + '"><div class="arh-bar-fill arh-fill-' + p.level + '" style="width:' + Math.max(2, p.display_score) + '%"></div></div>' +
          '<div class="arh-bar-sub">' + esc(p.level_label) + (p.red_flags_count ? ' · ' + p.red_flags_count + ' à sécuriser' : '') + '</div></li>';
      }).join('') + '</ul></section>';

    /* Bloc 5 — différents sujets : sujets à sécuriser puis axes à structurer */
    if (res.red_flags.length) {
      h += '<section class="arh-card" id="arh-sec-red-flags"><div class="arh-section-head"><h3 class="arh-h3">' + esc(plural(res.red_flags.length, T.red_flags_title)) + '</h3></div><ul class="arh-items">' +
        res.red_flags.map(function (a) { return itemHtml({ title: a.subject || a.title, body: a.description }, 'secure'); }).join('') + '</ul></section>';
    }
    var maxA = R.thresholds.max_areas_to_structure;
    if (res.areas_to_structure.length) {
      h += '<section class="arh-card" id="arh-sec-areas"><div class="arh-section-head"><h3 class="arh-h3">' + esc(plural(Math.min(maxA, res.areas_to_structure.length), T.areas_title)) + '</h3></div><ul class="arh-items">' +
        res.areas_to_structure.slice(0, maxA).map(function (a) { return itemHtml({ title: a.subject || a.title, body: a.description }); }).join('') + '</ul>' +
        (res.areas_to_structure.length > maxA ? '<p class="arh-small" style="margin:12px 0 0">+ ' + (res.areas_to_structure.length - maxA) + ' autres dans votre rapport détaillé.</p>' : '') + '</section>';
    }
    if (res.vigilance_items.length) {
      h += '<section class="arh-card" id="arh-sec-vigilance"><div class="arh-section-head"><h3 class="arh-h3">' + esc(plural(res.vigilance_items.length, T.vigilance_title)) + '</h3></div>' +
        '<p class="arh-muted" style="margin:0 0 14px">' + esc(T.vigilance_note) + '</p><ul class="arh-items">' +
        res.vigilance_items.map(function (a) { return itemHtml({ title: a.subject || a.title, body: a.description }); }).join('') + '</ul></section>';
    }

    /* Bloc 6 — points forts (déjà affichés plus haut si le résultat est très bon) */
    if (!res.very_good) h += strengthsHtml;

    /* Bloc 7 — lead gate / post-conversion (formulaire) */
    h += S.converted ? renderConverted() : renderGate(res);

    h += '<p class="arh-disclaimer">' + esc(R.disclaimer) + '</p>';
    h += '<div class="arh-actions-row"><button class="arh-btn arh-btn-ghost" data-act="edit">Modifier mes réponses</button>' +
      '<button class="arh-btn arh-btn-ghost" data-act="restart">Recommencer l\'audit</button></div>';
    h += '</div>';
    return h;
  }

  function benefitShown(when, res) {
    return when === 'always' || (when === 'has_red_flags' && res.red_flags.length > 0) ||
      (when === 'has_areas' && res.areas_to_structure.length > 0) ||
      (when === 'not_very_good' && !res.very_good) || (when === 'very_good' && res.very_good);
  }
  /* Production sans webhook configuré : l'envoi n'aboutirait pas. On ne demande donc aucune
   * coordonnée et on ne promet pas de rapport (collecte sans finalité réalisable). La recette
   * (preprod) conserve le parcours complet avec envoi simulé. */
  function renderGateUnavailable() {
    return '<section class="arh-card arh-gate" id="arh-gate"><h3 class="arh-h3" style="font-size:22px">Votre rapport détaillé</h3>' +
      '<p class="arh-muted" style="margin:10px 0 0">L\'envoi du rapport détaillé par email n\'est pas encore activé sur cette page. ' +
      'Vos résultats ci-dessus restent consultables et vous pouvez échanger directement avec un consultant.</p>' +
      (I.meetingUrl() ? '<p style="margin:18px 0 0"><a class="arh-btn" data-act="meeting" href="' + esc(I.meetingUrl()) + '">' + esc(R.commercial_cta.cta) + ' <span aria-hidden="true">→</span></a></p>' : '') +
      '</section>';
  }
  function renderGate(res) {
    var F = R.lead_form;
    if (ENV === 'production' && I.isMock()) return renderGateUnavailable();
    return '<section class="arh-card arh-gate" id="arh-gate"><h3 class="arh-h3" style="font-size:22px">' + esc(F.title) + '</h3>' +
      '<p class="arh-muted" style="margin:10px 0 6px">' + esc(F.intro) + '</p>' +
      '<ul class="arh-benefits">' + F.benefits.filter(function (b) { return benefitShown(b.when, res); }).map(function (b) { return '<li>' + esc(b.text) + '</li>'; }).join('') + '</ul>' +
      '<form class="arh-form" novalidate data-form="lead">' + F.fields.map(function (f) {
        var err = formErrors[f.id];
        return '<div class="arh-field' + (f.id === 'email' || f.id === 'company' ? '' : '') + '"><label for="arh-f-' + f.id + '">' + esc(f.label) + '</label>' +
          '<input class="arh-input" id="arh-f-' + f.id + '" name="' + f.id + '" type="' + (f.type || 'text') + '" autocomplete="' + ({ firstname: 'given-name', lastname: 'family-name', email: 'email', company: 'organization' }[f.id] || 'off') + '"' +
          ' value="' + esc(contactDraft[f.id] || '') + '"' + (err ? ' aria-invalid="true" aria-describedby="arh-e-' + f.id + '"' : '') + ' required>' +
          (err ? '<div class="arh-error" id="arh-e-' + f.id + '">' + esc(err) + '</div>' : '') + '</div>';
      }).join('') +
      (formErrors._send ? '<p class="arh-error arh-full" role="alert">' + esc(formErrors._send) + '</p>' : '') +
      '<div class="arh-full"><button class="arh-btn" type="submit"' + (sending ? ' disabled aria-busy="true"' : '') + '>' + (sending ? 'Envoi en cours…' : esc(F.cta)) + '</button>' +
      (sending ? '<p class="arh-sr" role="status">Envoi de votre rapport en cours…</p>' : '') +
      '<p class="arh-small" style="margin:10px 0 0">' + esc(F.privacy_note) + ' <a class="arh-link" style="font-weight:500" href="' + esc(F.privacy_url) + '" target="_blank" rel="noopener">Politique de confidentialité</a></p></div>' +
      '</form></section>';
  }

  function renderConverted() {
    var C = R.commercial_cta;
    return '<section class="arh-card" id="arh-done"><div class="arh-done-mark"><span aria-hidden="true">✓</span> Votre rapport est en route</div>' +
      '<p class="arh-muted" style="margin:10px 0 0">Il contient le détail de vos réponses, les sujets à sécuriser et votre roadmap RH complète. Vous pouvez le transférer à votre direction.</p>' +
      (ENV === 'preprod' && I.isMock() ? '<p class="arh-small" style="margin:10px 0 0">Recette : aucun email n\'est réellement envoyé. <button class="arh-link" data-act="preview-email">Voir l\'aperçu du rapport</button></p>' : '') +
      '</section>' +
      '<section class="arh-card arh-cta-block"><h3 class="arh-h3" style="font-size:22px">' + esc(C.title) + '</h3>' +
      '<p class="arh-muted" style="margin:8px 0 0">' + esc(C.text) + '</p>' +
      (I.meetingUrl() || ENV === 'preprod'
        ? '<a class="arh-btn" data-act="meeting" href="' + esc(I.meetingUrl() || '#rendez-vous') + '">' + esc(C.cta) + ' <span aria-hidden="true">→</span></a>'
        : '') +
      '<p class="arh-small" data-meeting-note hidden style="color:#CFCAD6;margin:12px 0 0">Recette : chemin de la page de rendez-vous non configuré (meeting_path).</p></section>';
  }

  /* ================================================================
   * Rendu et événements
   * ================================================================ */
  /* Mesure de durée (invisible) : un segment par écran de question, fermé hors questionnaire. */
  var CAP = R.analytics.timing.max_segment_seconds;
  function syncTiming() {
    var m = S.metrics;
    if (!m || m.results_at) return;
    var q = S.step === 'question' ? questions()[S.qIndex] : null;
    if (q && !doc.hidden) return E.openSegment(m, q, Date.now(), CAP);
    E.closeSegment(m, Date.now(), CAP);
    if (q) { m.last_question_id = q.id; m.last_pillar = q.pillar; }   // point atteint, même page masquée
  }
  function metricsProps() {
    var sm = E.metricsSummary(S.metrics);
    return sm ? { audit_duration_seconds: sm.audit_duration_seconds, questionnaire_duration_seconds: sm.questionnaire_duration_seconds,
      pillar_duration_seconds: sm.pillar_duration_seconds, audit_resumed: sm.audit_resumed,
      back_count: sm.back_count, answer_changes: sm.answer_changes } : {};
  }

  function render() {
    syncTiming();
    var html;
    if (S.step === 'intro') html = renderIntro();
    else if (S.step === 'context') html = renderContext();
    else if (S.step === 'question') html = renderQuestion();
    else html = renderResults();
    view.innerHTML = html;
    if (S.step === 'results' && !S.converted) {
      var res = E.evaluate(S.context, S.answers, cfg());
      if (res.complete && !S.completion_tracked) {   // une seule fois par audit, même après rechargement
        S.completion_tracked = true;
        if (S.metrics) { E.closeSegment(S.metrics, Date.now(), CAP); S.metrics.results_at = Date.now(); }
        save();
        if (S.metrics) store('localStorage', R.storage.last_metrics_key, JSON.stringify({   // local uniquement, aucune donnée personnelle
          completed_at: new Date().toISOString(), company_size: S.context.company_size, respondent_role: S.context.respondent_role,
          questions_count: res.questions_count, metrics: E.metricsSummary(S.metrics) }));
        track('audit_completed', Object.assign(resultProps(res), metricsProps()));
      }
      if (res.complete && !fired['results_viewed_' + S.audit_id]) {   // une fois par visite
        fired['results_viewed_' + S.audit_id] = true;
        track('results_viewed', resultProps(res));
      }
    }
    if (DEV) renderDev();
  }
  function priorityLabel(a) {
    var p = R.roadmap_priorities[a.priority - 1];
    return (p.label_by_tone && p.label_by_tone[a.tone]) || p.label;
  }
  function resultProps(res) {
    return { global_score: res.global.display_score, lowest_pillar: res.lowest_pillar || '', red_flags_count: res.red_flags.length };
  }

  /* Sélection marquée sur place (pas de re-rendu), puis passage automatique à l'écran suivant. */
  var advancing = false;
  function markPressed(val) {
    Array.prototype.forEach.call(view.querySelectorAll('[data-opt]'), function (b) {
      var on = b.getAttribute('data-opt') === val;
      b.setAttribute('aria-pressed', String(on));
      b.classList.toggle('arh-option-picked', on);   // retour visuel immédiat avant l'écran suivant
    });
    var n = view.querySelector('[data-act="ctx-next"], [data-act="q-next"]'); if (n) n.disabled = false;
  }
  function answerContext(val) {
    var f = ctxSteps()[S.ctxIndex];
    var opt = (f.options || []).filter(function (o) { return o.id === val; })[0];
    (f.options || []).forEach(function (o) { if (o.detail && o.id !== val) delete S.context[o.detail.id]; });   // détail d'une autre option
    S.context[f.id] = val;
    if (opt && opt.detail) {   // champ à préciser : pas d'avance automatique
      save(); render();
      var d = view.querySelector('#arh-detail'); if (d) d.focus();
      return;
    }
    save(); markPressed(val);
    setTimeout(ctxNext, R.ui.auto_advance_ms);
  }
  function ctxNext() {
    var steps = ctxSteps(), f = steps[S.ctxIndex];
    if (f.type === 'ccn_search' ? !S.context.collective_agreement_known : (f.required && !S.context[f.id])) return;
    var od = (f.options || []).filter(function (o) { return o.id === S.context[f.id]; })[0];
    if (od && od.detail) {
      var di = view.querySelector('#arh-detail'); if (di) S.context[od.detail.id] = di.value.trim();
      if (od.detail.required && !S.context[od.detail.id]) { if (di) di.focus(); return; }
    }
    if (S.ctxIndex < steps.length - 1) return go('context', { ctxIndex: S.ctxIndex + 1 });
    track('context_completed', { hr_organization: S.context.hr_organization, respondent_role: S.context.respondent_role }, true);
    go('question', { qIndex: 0 });
  }

  function answerQuestion(val) {
    var q = questions()[S.qIndex];
    if (S.metrics && S.answers[q.id] && S.answers[q.id] !== val) S.metrics.answer_changes++;
    S.answers[q.id] = val;
    save(); markPressed(val);
    setTimeout(qNext, R.ui.auto_advance_ms);
  }
  function qNext() {
    var qs = questions(), q = qs[S.qIndex];
    if (!q || !S.answers[q.id]) return;
    var next = qs[S.qIndex + 1];
    if ((!next || next.pillar !== q.pillar) && !fired['pc_' + q.pillar]) {
      fired['pc_' + q.pillar] = true;
      var pm = S.metrics ? E.closeSegment(S.metrics, Date.now(), CAP) : null;
      track('pillar_completed', { pillar: q.pillar, pillar_duration_seconds: pm ? Math.round((pm.pillar_ms[q.pillar] || 0) / 1000) : null });
    }
    if (!next) { S.completed_at = new Date().toISOString(); return go('results'); }
    go('question', { qIndex: S.qIndex + 1 });
  }

  function back() {
    if (S.metrics && !S.metrics.results_at) S.metrics.back_count++;
    if (S.step === 'question') return S.qIndex > 0 ? go('question', { qIndex: S.qIndex - 1 }) : go('context', { ctxIndex: ctxSteps().length - 1 });
    if (S.step === 'context') return S.ctxIndex > 0 ? go('context', { ctxIndex: S.ctxIndex - 1 }) : go('intro');
  }

  function submitLead(form) {
    var F = R.lead_form, errors = {};
    F.fields.forEach(function (f) {
      var v = (form.elements[f.id].value || '').trim();
      contactDraft[f.id] = v;
      if (f.required && !v) errors[f.id] = 'Ce champ est nécessaire pour vous envoyer le rapport.';
      else if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) errors[f.id] = 'Adresse email invalide.';
    });
    formErrors = errors;
    if (Object.keys(errors).length) { render(); var first = view.querySelector('[aria-invalid="true"]'); if (first) first.focus(); return; }
    var C = cfg(), res = E.evaluate(S.context, S.answers, C);
    var payload = E.buildPayload({ result: res, context: S.context, contact: contactDraft, utm: UTM,
      meta: { audit_id: S.audit_id, completed_at: S.completed_at || new Date().toISOString(), page_url: root.location.href.split('#')[0],
        metrics: E.metricsSummary(S.metrics) } }, C);
    var email = RE.build(res, payload, C, { meeting_url: I.meetingUrl() });
    lastEmail = email; lastPayload = payload;
    sending = true; render();
    I.submitReport(payload, email).then(function (r) {
      sending = false;
      if (!r || !r.ok) { formErrors = { _send: 'L\'envoi n\'a pas abouti. Vérifiez votre connexion puis réessayez.' }; return render(); }
      S.converted = true; save();
      track('report_requested', resultProps(res));
      render();
      var done = view.querySelector('#arh-done'); if (done) done.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
  var lastEmail = null, lastPayload = null;

  function previewEmail() {
    if (!lastEmail || ENV !== 'preprod') return;
    var m = doc.createElement('div');
    m.className = 'arh-modal';
    m.innerHTML = '<div class="arh-modal-box" role="dialog" aria-modal="true" aria-label="Aperçu de l\'email"><div class="arh-modal-head"><span>Aperçu : « ' + esc(lastEmail.subject) + ' » (gabarit Brevo, recette)</span>' +
      '<button class="arh-btn arh-btn-ghost" data-close>Fermer</button></div><iframe title="Aperçu de l\'email"></iframe></div>';
    mount.appendChild(m);
    m.querySelector('iframe').srcdoc = '<!doctype html><meta charset="utf-8">' + lastEmail.html;
    function close() { m.remove(); doc.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    m.addEventListener('click', function (e) { if (e.target === m || e.target.hasAttribute('data-close')) close(); });
    doc.addEventListener('keydown', onKey);
    m.querySelector('[data-close]').focus();
  }

  mount.addEventListener('click', function (e) {
    var cc = e.target.closest('[data-ccn-idcc], [data-ccn-special]');
    if (cc && mount.contains(cc)) return chooseCcn(cc.getAttribute('data-ccn-idcc') || cc.getAttribute('data-ccn-special'));
    var t = e.target.closest('[data-act], [data-opt]');
    if (!t || !mount.contains(t)) return;
    if (t.hasAttribute('data-opt')) {
      if (advancing) return;
      advancing = true; setTimeout(function () { advancing = false; }, R.ui.auto_advance_ms + 40);
      var v = t.getAttribute('data-opt');
      return S.step === 'context' ? answerContext(v) : answerQuestion(v);
    }
    var act = t.getAttribute('data-act');
    if (act === 'start') {
      S = freshState(); S.started_at = new Date().toISOString(); S.metrics = E.newMetrics(Date.now()); contactDraft = {}; formErrors = {};
      track('audit_started', null, true);
      go('context', { ctxIndex: 0 });
    } else if (act === 'resume') {
      S = saved; saved = null;
      if (S.metrics) { S.metrics.resumed = true; S.metrics.segment = null; }   // l'interruption n'est pas comptée
      go(S.step === 'intro' ? 'context' : S.step);
    } else if (act === 'back') back();
    else if (act === 'ctx-next') ctxNext();
    else if (act === 'ccn-clear') {
      ['collective_agreement_idcc', 'collective_agreement_label', 'collective_agreement_short_name', 'collective_agreement_known'].forEach(function (k) { delete S.context[k]; });
      save(); render(); var inp = view.querySelector('#arh-ccn'); if (inp) inp.focus();
    }
    else if (act === 'q-next') qNext();
    else if (act === 'tip') {
      var tip = view.querySelector('#arh-tip'), open = t.getAttribute('aria-expanded') === 'true';
      t.setAttribute('aria-expanded', String(!open)); tip.hidden = open;
    } else if (act === 'edit') go('question', { qIndex: 0 });
    else if (act === 'restart') { drop('localStorage', R.storage.progress_key); S = freshState(); saved = null; go('intro'); }
    else if (act === 'preview-email') previewEmail();
    else if (act === 'meeting') {
      track('meeting_cta_clicked', resultProps(E.evaluate(S.context, S.answers, cfg())));   // jamais de tag commercial interne dans GA4
      if (!I.meetingUrl()) { e.preventDefault(); var n = view.querySelector('[data-meeting-note]'); if (n) n.hidden = false; }
    }
  });
  mount.addEventListener('submit', function (e) {
    if (e.target.getAttribute('data-form') === 'lead') { e.preventDefault(); submitLead(e.target); }
  });
  mount.addEventListener('input', function (e) {
    if (e.target.id === 'arh-ccn') { ccnQuery = e.target.value; updateCcnResults(); }
    if (e.target.id === 'arh-detail') {
      S.context[e.target.getAttribute('data-detail')] = e.target.value;
      var nb = view.querySelector('[data-act="ctx-next"]'); if (nb) nb.disabled = !e.target.value.trim();
    }
  });
  mount.addEventListener('keydown', function (e) {
    if (e.target.id === 'arh-detail' && e.key === 'Enter') { e.preventDefault(); ctxNext(); }
    if (e.target.id === 'arh-ccn') {
      if (e.key === 'ArrowDown') { e.preventDefault(); moveCcn(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveCcn(-1); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        var o = view.querySelectorAll('#arh-ccn-list [data-ccn-idcc]')[ccnActive];
        if (o) chooseCcn(o.getAttribute('data-ccn-idcc'));
      } else if (e.key === 'Escape') { var l = view.querySelector('#arh-ccn-list'); if (l) l.hidden = true; }
    }
  });
  doc.addEventListener('keydown', function (e) {
    if ((S.step !== 'question' && S.step !== 'context') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (S.step === 'context' && ctxSteps()[S.ctxIndex].type === 'ccn_search') return;   // écran multi-actions
    if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || '')) || e.target.isContentEditable) return;
    /* La page Webflow contient d'autres contenus : ne pas répondre si le focus est ailleurs
     * ou si l'audit n'est pas visible (sinon taper « 1 » dans le pied de page répond à une question). */
    if (!mount.contains(doc.activeElement) && doc.activeElement !== doc.body) return;
    var box = mount.getBoundingClientRect();
    if (box.bottom < 0 || box.top > root.innerHeight) return;
    var n = parseInt(e.key, 10);
    if (n >= 1 && n <= 9) { var b = view.querySelectorAll('[data-opt]')[n - 1]; if (b) { e.preventDefault(); b.click(); } }
  });

  /* ================================================================
   * Outils de recette (préproduction uniquement : data-arh-env="preprod" + data-arh-dev="true",
   * ?test=1 ou #test). Jamais actifs sur une page de production.
   * ================================================================ */
  var devEl = null, devBtn = null;
  function renderDev() {
    if (!devBtn) {
      devBtn = doc.createElement('button');
      devBtn.className = 'arh-dev-toggle'; devBtn.type = 'button';
      devBtn.addEventListener('click', function () { devOpen = !devOpen; renderDev(); });
      devEl = doc.createElement('aside');
      devEl.className = 'arh-dev'; devEl.setAttribute('aria-label', 'Outils de recette');
      devEl.addEventListener('click', onDevClick); devEl.addEventListener('change', onDevChange);
      mount.appendChild(devBtn); mount.appendChild(devEl);
    }
    devBtn.textContent = devOpen ? 'Fermer les outils' : 'Outils de recette';
    devEl.hidden = !devOpen;
    if (!devOpen) return;
    var C = cfg(), res = S.context.company_size ? E.evaluate(S.context, S.answers, C) : null;
    var P = root.ARH_PROFILES;
    var payload = lastPayload || (res && res.complete ? E.buildPayload({ result: res, context: S.context, utm: UTM, meta: { audit_id: S.audit_id } }, C) : null);
    devEl.innerHTML = '<div class="arh-dev-head"><strong>Outils de recette — préproduction</strong><button class="arh-btn arh-btn-ghost" data-dev="close">Fermer</button></div>' +
      '<p class="arh-small" style="margin:4px 0 0">Indisponible sur une page de production.' +
      (I.isMock() ? ' Envoi du rapport simulé : aucun email ne part.' : ' Webhook configuré : les envois sont RÉELS.') + '</p>' +
      '<h3>Profils préconfigurés</h3><div class="arh-dev-profiles">' + (P ? P.PROFILES.map(function (p, i) {
        return '<button data-dev="profile" data-id="' + p.id + '">' + (i + 1) + '. ' + esc(p.label) + '</button>';
      }).join('') : '<span class="arh-small">profiles.js non chargé</span>') + '</div>' +
      '<p class="arh-small">Ouvre directement le résultat. « Modifier mes réponses » permet ensuite de parcourir le questionnaire pré-rempli.</p>' +
      '<h3>Règles (sans toucher à l\'interface)</h3>' +
      '<label><input type="checkbox" data-dev="rules"' + (overrides.rules.LR_TRANSPARENCE_SALARIALE ? ' checked' : '') + '> Simuler la validation juridique en attente (active Q24 et C6)</label>' +
      '<label><input type="checkbox" data-dev="index"' + (overrides.questions.C5 ? ' checked' : '') + '> Désactiver l\'Index égalité (C5)</label>' +
      '<h3>Moteur</h3><pre>' + esc(res ? JSON.stringify({
        global: res.global.score === null ? null : Math.round(res.global.score * 100) / 100, niveau: res.global.level, complet: res.complete,
        questions: res.questions_count, tres_bon_resultat: res.very_good,
        red_flags: res.red_flags.map(function (a) { return a.question_id; }), priorites_2: res.critical.map(function (a) { return a.question_id + ' (' + a.tone + ')'; }),
        piliers: res.pillars.map(function (p) { return p.id + ' ' + (p.evaluated ? Math.round(p.score * 10) / 10 : 'non évalué') + ' · ' + p.applicable_count + ' q.'; })
      }, null, 2) : 'Contexte non renseigné') + '</pre>' +
      '<h3>Mesures — audit en cours</h3><pre>' + esc(S.metrics ? JSON.stringify(E.metricsSummary(S.metrics), null, 2) : 'Non mesuré (profil préconfiguré)') + '</pre>' +
      '<h3>Mesures — dernier audit terminé sur ce navigateur</h3><pre>' + esc(lastMetricsText()) + '</pre>' +
      '<h3>Signaux commerciaux (internes)</h3><pre>' + esc(res ? JSON.stringify(res.lead_signals, null, 2) : '—') + '</pre>' +
      '<h3>Payload CRM ' + (lastPayload ? '(dernier envoi)' : '(aperçu, sans contact)') + '</h3><pre>' + esc(payload ? JSON.stringify(payload, null, 2) : '—') + '</pre>' +
      '<h3>Événements dataLayer</h3><pre>' + esc(devLog.slice(0, 20).join('\n') || '—') + '</pre>' +
      '<h3>UTM retenues</h3><pre>' + esc(JSON.stringify(UTM)) + '</pre>' +
      '<p style="margin-top:16px"><button class="arh-btn arh-btn-secondary" data-dev="reset">Tout réinitialiser</button></p>';
  }
  function lastMetricsText() {
    try { var o = JSON.parse(load('localStorage', R.storage.last_metrics_key) || 'null'); return o ? JSON.stringify(o, null, 2) : '—'; }
    catch (e) { return '—'; }
  }
  function onDevClick(e) {
    var t = e.target.closest('[data-dev]'); if (!t) return;
    var a = t.getAttribute('data-dev');
    if (a === 'close') { devOpen = false; renderDev(); }
    else if (a === 'profile') {
      var p = root.ARH_PROFILES.PROFILES.filter(function (x) { return x.id === t.getAttribute('data-id'); })[0];
      S = freshState(); S.context = root.ARH_PROFILES.contextFor(p, cfg()); S.answers = root.ARH_PROFILES.answersFor(p, cfg());
      S.started_at = S.completed_at = new Date().toISOString(); lastPayload = null; lastEmail = null; contactDraft = {}; formErrors = {};
      if (root.innerWidth < 900) devOpen = false;
      go('results');
    } else if (a === 'reset') {
      drop('localStorage', R.storage.progress_key); drop('sessionStorage', R.storage.utm_key);
      overrides = { rules: {}, questions: {} }; S = freshState(); saved = null; lastPayload = null; lastEmail = null; devLog = []; fired = {};
      go('intro');
    }
  }
  function onDevChange(e) {
    var a = e.target.getAttribute('data-dev');
    if (a === 'rules') overrides.rules = e.target.checked ? { LR_TRANSPARENCE_SALARIALE: 'verified', LR_ETAT_DES_LIEUX_PARCOURS: 'verified' } : {};
    if (a === 'index') overrides.questions = e.target.checked ? { C5: { enabled: false } } : {};
    lastPayload = null;
    render();
  }

  /* ================================================================
   * Démarrage
   * ================================================================ */
  /* Page masquée : on arrête le chronomètre ; page quittée en cours d'audit : dernier point atteint. */
  doc.addEventListener('visibilitychange', function () { syncTiming(); save(); });
  root.addEventListener('pagehide', function () {
    if ((S.step === 'context' || S.step === 'question') && !fired.audit_exit) {
      var sm = E.metricsSummary(S.metrics) || {};
      track('audit_exit', { step: S.step, last_question_id: sm.last_question_id || '', last_pillar: sm.last_pillar || '',
        question_index: S.step === 'question' ? S.qIndex + 1 : 0, questions_count: S.step === 'question' ? questions().length : 0,
        questionnaire_duration_seconds: sm.questionnaire_duration_seconds || 0 }, true);
    }
    if (S.metrics) E.closeSegment(S.metrics, Date.now(), CAP);
    save();
  });

  saved = E.restoreProgress(load('localStorage', R.storage.progress_key), new Date(), R.storage.progress_ttl_days);
  if (saved && saved.step === 'results' && saved.converted) saved = null;   // audit terminé et rapport demandé : on repart de zéro
  render();
  if ('IntersectionObserver' in root) {
    var io = new root.IntersectionObserver(function (en) { if (en[0].isIntersecting) { track('audit_view', null, true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(mount);
  } else track('audit_view', null, true);
})(window, document);
