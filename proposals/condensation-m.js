/*
 * PROPOSITION — NON APPLIQUÉE. Version condensée des 24 questions de maturité (type M).
 * Démarche : 1) raccourcir les situations A/B/C/D sans perdre leur sens ; 2) supprimer les
 * redondances question/réponses ; 3) basculer le contexte dans l'aide. Aucune question supprimée.
 * Les situations restent descriptives (jamais « Faible / Moyen / Bon / Excellent »).
 * Rendu comparatif : scripts/build-condensation.sh -> docs/PROPOSITION-CONDENSATION.md
 * Pour appliquer après décision : reporter `question` / `answers` (et `help_note`) dans questions.js.
 */
(function (root) {
  'use strict';
  root.ARH_CONDENSATION = {
    Q5: { question: 'Comment votre paie est-elle sécurisée ?',
      answers: { A: 'Surtout par des échanges manuels et des contrôles au cas par cas.', B: 'Les étapes sont définies, mais des anomalies sont détectées tardivement.', C: 'Collecte des variables, responsabilités et contrôles sont clairement organisés.', D: 'Le processus est formalisé et tracé : les anomalies sont repérées avant validation.' } },
    Q6: { question: 'Comment sont gérés les dossiers administratifs des salariés ?',
      answers: { A: 'Dispersés entre plusieurs outils, fichiers ou échanges.', B: 'En partie centralisés ; recherches et retraitements restent fréquents.', C: 'Centralisés et globalement fiables.', D: 'Centralisés, à jour, accessibles, avec un contrôle de complétude.' } },
    Q7: { question: 'Comment sont sécurisés vos entrées, changements de situation et sorties ?',
      answers: { A: 'Cela dépend des habitudes de chacun.', B: 'Des process existent, appliqués de façon variable.', C: 'Étapes et responsabilités communes sont clairement définies.', D: 'Process standardisés et suivis : les étapes manquantes sont vite repérées.' } },
    Q8: { question: 'Si la personne clé de votre paie / administration RH était absente un mois, la continuité serait-elle assurée ?',
      answers: { A: 'Très difficilement.', B: 'Oui, avec de fortes difficultés.', C: 'Oui, grâce à des process et relais identifiés.', D: 'Oui, sans dégradation : l\'organisation est documentée et sécurisée.' } },
    Q10: { question: 'Comment gérez-vous votre calendrier social ?',
      answers: { A: 'Les échéances sont traitées quand elles arrivent.', B: 'Un calendrier existe, mais certaines échéances se gèrent dans l\'urgence.', C: 'Les principales échéances sont anticipées et préparées.', D: 'Il est piloté en amont et intégré à la roadmap RH / direction.' } },
    Q11: { question: 'Comment préparez-vous et suivez-vous vos instances représentatives ?',
      answers: { A: 'De façon surtout réactive.', B: 'Les obligations sont respectées, mais le suivi est chronophage ou peu structuré.', C: 'Réunions, consultations, documents et engagements suivent un process fiable.', D: 'Le dialogue social est anticipé et sert à accompagner les transformations.' } },
    Q12: { question: 'Avez-vous une vision centralisée des accords et engagements issus du dialogue social ?',
      answers: { A: 'Non, les informations sont très dispersées.', B: 'Partiellement.', C: 'Oui, documents et échéances sont centralisés.', D: 'Oui, avec le suivi des engagements et des actions associées.' } },
    Q13: { question: 'Votre processus de recrutement est-il homogène entre les équipes ?',
      answers: { A: 'Chaque manager recrute à sa manière.', B: 'Un cadre existe, appliqué de façon très variable.', C: 'Process et rôles sont définis et globalement appliqués.', D: 'Le process est homogène, mesuré et régulièrement amélioré.' },
      note: 'Variante TPE inchangée.' },
    Q14: { question: 'Comment les décisions de recrutement sont-elles objectivées ?',
      answers: { A: 'Surtout au ressenti des interviewers.', B: 'Des critères existent, sans être systématiquement utilisés.', C: 'Des critères et grilles communes structurent les décisions.', D: 'Les critères sont partagés, documentés et régulièrement revus.' } },
    Q15: { question: 'Comment qualifieriez-vous votre onboarding ?',
      answers: { A: 'Il dépend surtout du manager.', B: 'Des étapes communes existent, appliquées de façon variable.', C: 'Un parcours structuré est appliqué partout.', D: 'Parcours structuré, suivi dans le temps, efficacité mesurée.' } },
    Q16: { question: 'Pilotez-vous l\'efficacité de vos recrutements ?',
      answers: { A: 'Peu ou pas d\'indicateurs.', B: 'Quelques indicateurs opérationnels sont suivis.', C: 'Les KPI révèlent les points d\'amélioration.', D: 'Les données servent à arbitrer ressources, canaux et process.' } },
    Q18: { question: 'Comment vos besoins en formation sont-ils déterminés ?',
      answers: { A: 'Au fil des demandes individuelles.', B: 'Ils sont collectés, mais peu priorisés.', C: 'Ils sont priorisés selon les besoins des équipes et métiers.', D: 'Ils découlent d\'une analyse des compétences, et leur impact est évalué.' } },
    Q19: { question: 'Quelle visibilité avez-vous sur les compétences critiques nécessaires d\'ici 12 à 24 mois ?',
      answers: { A: 'Très faible.', B: 'Quelques besoins sont identifiés, de façon informelle.', C: 'Les principales sont identifiées.', D: 'Elles sont cartographiées et guident recrutement, formation et mobilité.' } },
    Q20: { question: 'Vos équipes comprennent-elles les possibilités d\'évolution interne et les compétences requises ?',
      answers: { A: 'Très peu.', B: 'Cela dépend beaucoup des managers.', C: 'Les principaux parcours et critères sont identifiés.', D: 'Les parcours sont structurés, transparents et abordés en entretien.' },
      help_note: '« Vos équipes » couvre collaborateurs et managers (précisé dans l\'aide).' },
    Q21: { question: 'Deux managers face à une même décision salariale ont-ils un cadre commun pour décider de façon cohérente ?',
      answers: { A: 'Non, les décisions sont largement discrétionnaires.', B: 'Quelques principes existent, interprétés différemment.', C: 'Oui, une politique et des règles communes.', D: 'Oui, des règles formalisées et appuyées sur des données fiables.' } },
    Q22: { question: 'Votre architecture des emplois et niveaux permet-elle de comparer les postes de façon cohérente ?',
      answers: { A: 'Nous n\'avons pas d\'architecture réellement structurée.', B: 'Des classifications existent, incomplètes ou obsolètes.', C: 'Les principaux emplois et niveaux sont structurés.', D: 'Elle est tenue à jour et utilisée pour les décisions RH et salariales.' } },
    Q23: { question: 'Pouvez-vous objectiver les écarts de rémunération entre postes comparables ?',
      answers: { A: 'Difficilement.', B: 'Partiellement : données ou critères incomplets.', C: 'Oui, avec des données et critères identifiés.', D: 'Oui, et des analyses régulières permettent de corriger les écarts injustifiés.' },
      help_note: '« Expliquer » passe dans l\'aide : objectiver = pouvoir justifier un écart par des critères.' },
    Q26: { question: 'Dans la pratique, à quoi servent votre DUERP et vos démarches de prévention ?',
      answers: { A: 'Surtout à remplir une obligation documentaire.', B: 'Quelques actions en découlent, suivies irrégulièrement.', C: 'Les risques identifiés donnent lieu à des actions suivies.', D: 'La prévention est pilotée : responsables, échéances et suivi des actions.' } },
    Q27: { question: 'Quand l\'absentéisme ou le turnover dérive dans une équipe, savez-vous en identifier les causes et agir ?',
      answers: { A: 'Nous avons peu de visibilité.', B: 'Les indicateurs existent, mais l\'analyse reste ponctuelle.', C: 'Nous identifions les principales causes et agissons.', D: 'Indicateurs et signaux faibles sont analysés régulièrement et suivis d\'actions.' },
      note: 'Variante TPE inchangée.' },
    Q28: { question: 'Vos managers savent-ils gérer les situations RH courantes et repérer celles qui nécessitent les RH ?',
      answers: { A: 'Ils sollicitent les RH même pour les situations courantes.', B: 'Leur autonomie varie fortement.', C: 'Ils ont un cadre clair et sont globalement autonomes.', D: 'Ils sont formés, outillés et ont des règles d\'escalade claires.' },
      note: 'Variante TPE inchangée.' },
    Q29: { question: 'Votre roadmap RH est-elle formalisée, priorisée et reliée aux enjeux de l\'entreprise ?',
      answers: { A: 'Nous réagissons surtout aux sujets qui arrivent.', B: 'Des priorités existent, peu formalisées ou souvent bousculées.', C: 'Une roadmap claire et priorisée existe.', D: 'Elle découle des enjeux de l\'entreprise, avec objectifs mesurables et suivi régulier.' } },
    Q30: { question: 'Avez-vous une source de référence pour obtenir rapidement des données RH fiables ?',
      answers: { A: 'Les données sont dispersées entre plusieurs sources.', B: 'Une source principale existe, mais demande souvent des retraitements.', C: 'Les principales données sont centralisées et fiables.', D: 'Centralisées, gouvernées et directement exploitables pour piloter.' } },
    Q31: { question: 'Vos outils RH réduisent-ils vraiment les tâches administratives et doubles saisies ?',
      answers: { A: 'Beaucoup de processus reposent sur Excel, emails ou ressaisies.', B: 'Plusieurs outils existent, mais communiquent peu.', C: 'Les principaux processus sont digitalisés, avec peu de doubles saisies.', D: 'Les outils sont intégrés et les tâches répétitives automatisées.' } },
    Q32: { question: 'Vos indicateurs RH influencent-ils vraiment les décisions RH et de direction ?',
      answers: { A: 'Nous avons peu d\'indicateurs fiables.', B: 'Des indicateurs sont produits, mais servent surtout au suivi.', C: 'Les KPI clés sont utilisés dans le pilotage RH.', D: 'Ils alimentent les arbitrages de la direction et mesurent l\'impact des actions.' } }
  };
})(typeof window !== 'undefined' ? window : globalThis);
