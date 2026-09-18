# Audit RH 360° — Grille métier (Phase 1)

> Document généré depuis `src/config/*.js` par `scripts/build-grille.sh`. Ne pas éditer à la main : modifier la configuration puis régénérer.
> Version config : `0.1.0-phase1` · référentiel réglementaire : `2026-09-18`.

## Échelles de réponse

**Type C — Compliance** : Oui, totalement = 100 · Partiellement / à vérifier = 50 · Non / pas encore = 0 · Je ne sais pas = 0 + vigilance · Non applicable = exclu du score. « Non applicable » n'est proposé que lorsque la question l'autorise (`allow_na`).

**Type M — Maturity** : quatre situations concrètes affichées sans lettre ni « niveau » ; scores A = 0 · B = 33 · C = 67 · D = 100.

## Contextualisation

- **Votre fonction** (`respondent_role`) : Dirigeant / CEO `ceo` · DRH `drh` · RRH `rrh` · Head of People / People Lead `head_of_people` · Responsable administratif / financier `daf` · Autre `other`
- **Effectif de votre entreprise** (`company_size`) : 1 à 10 salariés `1-10` · 11 à 49 salariés `11-49` · 50 à 249 salariés `50-249` · 250 à 999 salariés `250-999` · 1 000 salariés et plus `1000+`
- **Disposez-vous d'un CSE ?** (`has_cse`) : Oui `yes` · Non `no` · En cours de mise en place `in_progress` · Non concerné / Je ne sais pas `unknown`
- **Convention collective** (`collective_agreement`, facultatif) : texte libre
- **Qui porte les RH aujourd'hui ?** (`hr_organization`) : Une équipe RH structurée en interne `internal_team` · Une à deux personnes dédiées aux RH `small_team` · Principalement la direction (dirigeant, DAF…) `leadership` · Principalement un prestataire externe (expert-comptable, consultant…) `external` · Autre organisation `other`

## Pilier 1/8 — Conformité & fondamentaux RH

Score CRM : `compliance_score` · Point fort : « Vos documents et registres de base semblent tenus et suivis. » · À structurer : « Plusieurs fondamentaux documentaires méritent une revue. »

### Q1 — Modèles de contrats et documents salariés

**Vos modèles de contrats de travail, avenants et documents remis aux salariés sont-ils régulièrement revus pour tenir compte des évolutions légales, conventionnelles et de vos pratiques internes ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | C · 3 — critique · eleve |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `audit_rh` |
| Aide (tooltip) | Contrats, avenants, notices, chartes : ce sont les documents qui engagent l'entreprise au quotidien. Une revue régulière évite d'utiliser des clauses devenues obsolètes. |

| Réponse | Score | Recommandation |
|---|---|---|
| Oui, totalement | 100 | — (maîtrisé) |
| Partiellement / à vérifier | 50 | Réaliser une revue documentaire afin d'identifier les modèles nécessitant une mise à jour ou une harmonisation. |
| Non / pas encore | 0 | Réaliser une revue documentaire afin d'identifier les modèles nécessitant une mise à jour ou une harmonisation, puis planifier une revue annuelle. |
| Je ne sais pas | 0 + vigilance | Identifier qui est responsable des modèles de documents RH et vérifier la date de leur dernière mise à jour. |

### Q2 — Registre unique du personnel et registres RH

**Votre registre unique du personnel et les autres registres RH applicables à votre entreprise sont-ils correctement tenus et à jour ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | C · 3 — critique · eleve |
| Condition d'affichage | Toujours posée |
| Red flag | Oui si « Non / pas encore » ou « Je ne sais pas » |
| Legal flag · règle | Oui · `LR_REGISTRE_PERSONNEL` (verified) |
| Source · vérifiée le | [Entreprendre.Service-Public — Registre unique du personnel (F1784)](https://entreprendre.service-public.gouv.fr/vosdroits/F1784) · 2026-09-18 |
| Tags commerciaux (internes) | `audit_rh` |
| Aide (tooltip) | Le registre unique du personnel recense chaque salarié dès son embauche. D'autres registres peuvent s'ajouter selon votre situation. |

| Réponse | Score | Recommandation |
|---|---|---|
| Oui, totalement | 100 | — (maîtrisé) |
| Partiellement / à vérifier | 50 | Contrôler la complétude du registre unique du personnel (entrées, sorties, mentions obligatoires) et lister les autres registres applicables. |
| Non / pas encore | 0 | Mettre à jour le registre unique du personnel en priorité et définir qui le tient à chaque entrée et sortie. |
| Je ne sais pas | 0 + vigilance | Vérifier l'existence et la mise à jour du registre unique du personnel et des autres registres applicables. |

### Q3 — Informations et affichages obligatoires

**Les informations et affichages obligatoires applicables à votre entreprise sont-ils à jour et correctement accessibles aux salariés ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | C · 2 — important · modere |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Oui · `LR_AFFICHAGES` (verified) |
| Source · vérifiée le | [Entreprendre.Service-Public — Affichage obligatoire (F23106)](https://entreprendre.service-public.gouv.fr/vosdroits/F23106) · 2026-09-18 |
| Tags commerciaux (internes) | `audit_rh` |
| Aide (tooltip) | Certaines informations doivent être portées à la connaissance des salariés (affichage physique ou tout moyen accessible). La liste dépend notamment de votre effectif. |

| Réponse | Score | Recommandation |
|---|---|---|
| Oui, totalement | 100 | — (maîtrisé) |
| Partiellement / à vérifier | 50 | Réaliser une revue des informations et affichages applicables à l'entreprise. |
| Non / pas encore | 0 | Réaliser une revue des informations et affichages applicables à l'entreprise et désigner un responsable de leur mise à jour. |
| Je ne sais pas | 0 + vigilance | Réaliser une revue des informations et affichages applicables à l'entreprise. |

### Q4 (C1) — Règlement intérieur

**Votre règlement intérieur est-il à jour au regard des obligations applicables à votre entreprise ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | C · 3 — critique · eleve |
| Condition d'affichage | company_size ∈ {50-249, 250-999, 1000+} |
| Red flag | Oui si « Non / pas encore » ou « Je ne sais pas » |
| Legal flag · règle | Oui · `LR_REGLEMENT_INTERIEUR` (verified) |
| Source · vérifiée le | [Entreprendre.Service-Public — Règlement intérieur (F1905)](https://entreprendre.service-public.gouv.fr/vosdroits/F1905) ; [Légifrance — L1311-2](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038610176/) · 2026-09-18 |
| Tags commerciaux (internes) | `audit_rh` |
| Aide (tooltip) | Le règlement intérieur fixe notamment les règles d'hygiène, de sécurité et de discipline. Sa mise à jour suit une procédure précise. |

| Réponse | Score | Recommandation |
|---|---|---|
| Oui, totalement | 100 | — (maîtrisé) |
| Partiellement / à vérifier | 50 | Faire relire le règlement intérieur au regard des évolutions réglementaires et vérifier la procédure suivie lors de sa dernière modification. |
| Non / pas encore | 0 | Mettre en place ou actualiser le règlement intérieur en respectant la procédure applicable (consultation, dépôt, publicité). |
| Je ne sais pas | 0 + vigilance | Vérifier l'existence du règlement intérieur, sa date de mise à jour et la procédure suivie. |

## Pilier 2/8 — Paie & administration RH

Score CRM : `payroll_admin_score` · Point fort : « Votre paie et votre administration du personnel reposent sur des process fiables. » · À structurer : « La fiabilité de la paie et de l'administration repose encore sur des personnes plus que sur des process. »

### Q5 — Sécurisation du processus de paie

**Comment qualifieriez-vous la sécurisation de votre processus de paie ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 3 — critique · eleve |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `orkest` `drh_externalise` |
| Aide (tooltip) | Il s'agit de la façon dont les éléments variables sont collectés, contrôlés et validés avant chaque paie. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Le processus repose encore largement sur des échanges manuels et des contrôles individuels. | 0 | Cartographier le processus de paie (collecte des variables, responsables, échéances) et instaurer des contrôles avant validation. |
| B. Les principales étapes sont définies, mais certaines anomalies sont encore détectées tardivement. | 33 | Formaliser une liste de contrôles avant validation de la paie pour détecter les anomalies plus tôt. |
| C. La collecte des variables, les responsabilités et les contrôles sont clairement organisés. | 67 | Tracer les contrôles réalisés et suivre les anomalies récurrentes pour en traiter les causes. |
| D. Le processus est formalisé, tracé et permet d'identifier les anomalies avant validation de la paie. | 100 | — (point fort) |

### Q6 — Gestion des dossiers salariés

**Comment sont gérées les données et pièces administratives des salariés ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 2 — important · modere |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `orkest` |
| Aide (tooltip) | Contrats, pièces justificatives, informations personnelles et historiques administratifs. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Les informations sont dispersées entre plusieurs outils, fichiers ou échanges. | 0 | Définir un emplacement unique pour les dossiers salariés et la liste des pièces attendues par dossier. |
| B. Une partie est centralisée, mais des recherches ou retraitements restent fréquents. | 33 | Achever la centralisation des dossiers et supprimer les copies parallèles. |
| C. Les dossiers sont centralisés et globalement fiables. | 67 | Mettre en place un contrôle périodique de complétude des dossiers. |
| D. Les données sont centralisées, à jour, facilement accessibles et leur complétude est contrôlée. | 100 | — (point fort) |

### Q7 — Entrées, mobilités et sorties

**Dans quelle mesure vos entrées, changements de situation et sorties sont-ils sécurisés ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 2 — important · modere |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `orkest` |
| Aide (tooltip) | Embauches, changements de poste ou de temps de travail, départs : les étapes administratives associées. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Ils dépendent principalement des habitudes de chaque personne. | 0 | Formaliser une check-list commune pour les entrées, changements de situation et sorties. |
| B. Des process existent mais leur application est variable. | 33 | Désigner un responsable par étape et vérifier l'application des check-lists. |
| C. Des étapes et responsabilités communes sont clairement définies. | 67 | Suivre l'avancement de chaque dossier pour repérer rapidement les étapes manquantes. |
| D. Les process sont standardisés, suivis et permettent d'identifier rapidement les étapes manquantes. | 100 | — (point fort) |

### Q8 — Continuité de l'administration RH et de la paie

**Si la personne clé en charge de votre administration RH / paie était absente pendant un mois, pourriez-vous assurer la continuité des principaux processus ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 3 — critique · eleve |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `drh_externalise` `orkest` |
| Aide (tooltip) | Cette question mesure la dépendance de vos processus critiques à une seule personne. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Très difficilement. | 0 | Documenter les processus critiques (paie, déclarations, entrées/sorties) et désigner un relais formé. |
| B. Oui, mais avec des difficultés importantes. | 33 | Compléter la documentation des processus critiques et organiser un binôme ou un relais externe. |
| C. Oui, grâce à des process et relais identifiés. | 67 | Tester périodiquement le relais sur un cycle de paie complet. |
| D. Oui, sans dégradation significative grâce à une organisation documentée et sécurisée. | 100 | — (point fort) |

## Pilier 3/8 — Relations sociales

Score CRM : `employee_relations_score` · Point fort : « Votre dialogue social est anticipé et suivi. » · À structurer : « Le dialogue social est géré de façon plutôt réactive. »

### Q9 (C2) — Élections des représentants du personnel

**Les élections et renouvellements de vos représentants du personnel sont-ils correctement anticipés et organisés ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | C · 3 — critique · eleve |
| Condition d'affichage | (company_size ∈ {11-49, 50-249, 250-999, 1000+} OU has_cse ∈ {yes, in_progress}) |
| Red flag | Oui si « Non / pas encore » ou « Je ne sais pas » |
| Legal flag · règle | Oui · `LR_CSE` (verified) |
| Source · vérifiée le | [Entreprendre.Service-Public — CSE : élections (F34474)](https://entreprendre.service-public.gouv.fr/vosdroits/F34474) ; [Légifrance — L2314-33 (version issue de la loi n° 2025-989)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000052437191) · 2026-09-18 |
| Tags commerciaux (internes) | `relations_sociales` `audit_rh` |
| Aide (tooltip) | Cela inclut le calendrier des mandats, le protocole préélectoral et, en l'absence de candidat, le procès-verbal correspondant. |

| Réponse | Score | Recommandation |
|---|---|---|
| Oui, totalement | 100 | — (maîtrisé) |
| Partiellement / à vérifier | 50 | Établir le calendrier des mandats en cours et planifier les prochaines étapes électorales. |
| Non / pas encore | 0 | Vérifier votre situation au regard des seuils applicables et organiser les élections ou formaliser le procès-verbal adapté. |
| Je ne sais pas | 0 + vigilance | Vérifier la date de fin des mandats en cours, ou la date des dernières élections et du procès-verbal associé. |

### Q10 — Calendrier social

**Comment gérez-vous votre calendrier social ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 3 — critique · eleve |
| Condition d'affichage | company_size ∈ {11-49, 50-249, 250-999, 1000+} |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `relations_sociales` `orkest` |
| Aide (tooltip) | Échéances sociales de l'année : consultations, négociations, entretiens, déclarations, élections. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Les échéances sont principalement traitées lorsqu'elles arrivent. | 0 | Construire un calendrier social annuel recensant toutes les échéances applicables. |
| B. Un calendrier existe mais certaines échéances restent gérées dans l'urgence. | 33 | Associer à chaque échéance un responsable et une date de préparation. |
| C. Les principales échéances sont anticipées et préparées. | 67 | Intégrer le calendrier social à la feuille de route RH partagée avec la direction. |
| D. Le calendrier social est piloté en amont et intégré à la roadmap RH / direction. | 100 | — (point fort) |

### Q11 — Préparation et suivi des instances

**Comment qualifieriez-vous la préparation et le suivi de vos instances représentatives ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 3 — critique · eleve |
| Condition d'affichage | (has_cse ∈ {yes, in_progress} OU company_size ∈ {50-249, 250-999, 1000+}) |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `relations_sociales` |
| Aide (tooltip) | Ordres du jour, informations transmises, consultations, procès-verbaux et suivi des engagements. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Le fonctionnement est principalement réactif. | 0 | Formaliser la préparation des réunions (ordre du jour, documents, délais) et le suivi des procès-verbaux. |
| B. Les obligations sont globalement respectées mais le suivi reste chronophage ou peu structuré. | 33 | Outiller le suivi des consultations et des engagements pris en réunion. |
| C. Réunions, consultations, documents et engagements font l'objet d'un process fiable. | 67 | Associer les représentants du personnel en amont des projets de transformation. |
| D. Le dialogue social est anticipé et utilisé comme un levier d'accompagnement des transformations. | 100 | — (point fort) |

### Q12 — Suivi des accords et engagements

**Disposez-vous d'une vision centralisée des accords, engagements et actions issus du dialogue social ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 2 — important · modere |
| Condition d'affichage | (has_cse ∈ {yes, in_progress} OU company_size ∈ {50-249, 250-999, 1000+}) |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `relations_sociales` `orkest` |
| Aide (tooltip) | Accords d'entreprise, plans d'action, engagements pris en réunion et leurs échéances. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Non, les informations sont très dispersées. | 0 | Recenser les accords en vigueur, leurs dates d'échéance et les engagements associés. |
| B. Partiellement. | 33 | Centraliser les accords et engagements dans un référentiel unique. |
| C. Oui, les documents et échéances sont centralisés. | 67 | Ajouter un suivi des actions et échéances à ce référentiel. |
| D. Oui, avec un suivi des engagements, échéances et actions associées. | 100 | — (point fort) |

### C3 — Base de données économiques, sociales et environnementales (BDESE)

**Votre BDESE est-elle en place, alimentée et accessible aux représentants du personnel ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | C · 2 — important · modere |
| Condition d'affichage | company_size ∈ {50-249, 250-999, 1000+} |
| Red flag | Oui si « Non / pas encore » ou « Je ne sais pas » |
| Legal flag · règle | Oui · `LR_BDESE` (verified) |
| Source · vérifiée le | [Entreprendre.Service-Public — BDESE (F32193)](https://entreprendre.service-public.gouv.fr/vosdroits/F32193) · 2026-09-18 |
| Tags commerciaux (internes) | `relations_sociales` `audit_rh` |
| Aide (tooltip) | La BDESE rassemble les informations économiques et sociales mises à disposition du CSE. |

| Réponse | Score | Recommandation |
|---|---|---|
| Oui, totalement | 100 | — (maîtrisé) |
| Partiellement / à vérifier | 50 | Vérifier que la BDESE contient les rubriques attendues pour votre effectif et qu'elle est mise à jour. |
| Non / pas encore | 0 | Mettre en place la BDESE et organiser son alimentation régulière. |
| Je ne sais pas | 0 + vigilance | Vérifier l'existence de la BDESE, son contenu et les modalités d'accès du CSE. |

### C4 — Négociations obligatoires

**Les négociations obligatoires applicables à votre entreprise sont-elles engagées selon le calendrier prévu ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | C · 2 — important · modere |
| Condition d'affichage | company_size ∈ {50-249, 250-999, 1000+} |
| Red flag | Oui si « Non / pas encore » ou « Je ne sais pas » |
| Legal flag · règle | Oui · `LR_NAO` (verified) |
| Source · vérifiée le | [Légifrance — Code du travail, L2242-1 et suivants](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000006189527/) · 2026-09-18 |
| Tags commerciaux (internes) | `relations_sociales` `audit_rh` |
| Aide (tooltip) | Elles concernent les entreprises où sont constituées une ou plusieurs sections syndicales représentatives. Si ce n'est pas votre cas, répondez « Non applicable ». |

| Réponse | Score | Recommandation |
|---|---|---|
| Oui, totalement | 100 | — (maîtrisé) |
| Partiellement / à vérifier | 50 | Vérifier que chaque thème de négociation obligatoire est couvert selon la périodicité applicable. |
| Non / pas encore | 0 | Établir le calendrier des négociations obligatoires et engager celles qui sont échues. |
| Je ne sais pas | 0 + vigilance | Vérifier la présence de sections syndicales représentatives et, le cas échéant, le calendrier des négociations. |
| Non applicable (pas de section syndicale représentative) | exclu | — |

## Pilier 4/8 — Recrutement & onboarding

Score CRM : `recruitment_score` · Point fort : « Vos recrutements et votre intégration suivent un cadre commun. » · À structurer : « Vos pratiques de recrutement et d'intégration varient selon les équipes. »

### Q13 — Homogénéité du processus de recrutement

**À quel point votre processus de recrutement est-il homogène entre les différentes équipes ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 2 — important · modere |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `recrutement` |
| Aide (tooltip) | Étapes, rôles des intervenants et règles de décision, d'une équipe à l'autre. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Chaque manager recrute principalement selon ses propres pratiques. | 0 | Définir un processus de recrutement commun (étapes, rôles, délais) et le partager aux managers. |
| B. Un cadre existe mais son application varie fortement. | 33 | Accompagner les managers dans l'application du processus commun. |
| C. Le process et les rôles sont clairement définis et globalement appliqués. | 67 | Mesurer le processus (délais, taux de conversion) pour l'améliorer. |
| D. Le process est homogène, mesuré et régulièrement amélioré. | 100 | — (point fort) |

### Q14 — Objectivation des décisions de recrutement

**Comment les décisions de recrutement sont-elles objectivées ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 2 — important · modere |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `recrutement` |
| Aide (tooltip) | Critères d'évaluation, grilles d'entretien, prise de décision collective. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Principalement à l'appréciation des interviewers. | 0 | Définir des critères d'évaluation par poste et une grille d'entretien commune. |
| B. Des critères existent mais ne sont pas systématiquement utilisés. | 33 | Rendre l'usage des grilles systématique et documenter les décisions. |
| C. Des critères et grilles communes structurent les décisions. | 67 | Revoir périodiquement les critères au regard de la réussite des recrues. |
| D. Les critères sont structurés, partagés, documentés et leur efficacité est régulièrement revue. | 100 | — (point fort) |

### Q15 — Onboarding

**Comment qualifieriez-vous votre onboarding ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 2 — important · modere |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `recrutement` |
| Aide (tooltip) | L'intégration des nouveaux arrivants, de l'accord du candidat à la fin de la période d'essai. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Il dépend principalement du manager. | 0 | Construire un parcours d'intégration commun (avant l'arrivée, premier jour, premiers mois). |
| B. Des étapes communes existent mais leur application varie. | 33 | Suivre l'application du parcours d'intégration par équipe. |
| C. Un parcours structuré est appliqué de manière homogène. | 67 | Mesurer l'efficacité de l'intégration (retours des recrues, départs en période d'essai). |
| D. Le parcours est structuré, suivi dans le temps et son efficacité est mesurée. | 100 | — (point fort) |

### Q16 — Pilotage des recrutements

**Dans quelle mesure pilotez-vous l'efficacité de vos recrutements ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 1 — secondaire · faible |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `recrutement` `orkest` |
| Aide (tooltip) | Délais, sources, taux de conversion, coût, réussite des recrues. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Peu ou pas d'indicateurs. | 0 | Suivre trois indicateurs simples : délai de recrutement, source des embauches, départs en période d'essai. |
| B. Quelques indicateurs opérationnels sont suivis. | 33 | Compléter les indicateurs pour identifier les étapes à améliorer. |
| C. Les principaux KPI permettent d'identifier les points d'amélioration. | 67 | Utiliser les indicateurs pour arbitrer les canaux et les ressources de recrutement. |
| D. Les données sont régulièrement utilisées pour arbitrer les ressources, canaux et process de recrutement. | 100 | — (point fort) |

## Pilier 5/8 — Compétences & développement RH

Score CRM : `development_score` · Point fort : « Le développement des compétences est relié aux besoins de l'entreprise. » · À structurer : « Le développement des compétences est peu anticipé. »

### Q17 — Entretiens de parcours professionnel

**Les entretiens de parcours professionnel applicables à vos salariés sont-ils planifiés, réalisés, documentés et suivis conformément aux obligations en vigueur ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | C · 3 — critique · eleve |
| Condition d'affichage | Toujours posée |
| Red flag | Oui si « Non / pas encore » ou « Je ne sais pas » |
| Legal flag · règle | Oui · `LR_ENTRETIEN_PARCOURS` (verified) |
| Source · vérifiée le | [Légifrance — L6315-1 (en vigueur depuis le 31/12/2025)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053279288) ; [Légifrance — Loi n° 2025-989, art. 3](https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000052430965) ; [Service-Public — Entretien professionnel (F32040)](https://www.service-public.gouv.fr/particuliers/vosdroits/F32040) · 2026-09-18 |
| Tags commerciaux (internes) | `audit_rh` |
| Aide (tooltip) | Entretiens consacrés aux perspectives d'évolution professionnelle, distincts de l'entretien annuel d'évaluation. Leur périodicité est fixée par la réglementation en vigueur. |

| Réponse | Score | Recommandation |
|---|---|---|
| Oui, totalement | 100 | — (maîtrisé) |
| Partiellement / à vérifier | 50 | Recenser, salarié par salarié, la date du dernier entretien et planifier ceux à réaliser. |
| Non / pas encore | 0 | Planifier les entretiens de parcours professionnel dus et mettre en place un suivi par salarié. |
| Je ne sais pas | 0 + vigilance | Vérifier, salarié par salarié, la date du dernier entretien de parcours professionnel et sa formalisation. |

### C6 — État des lieux du parcours professionnel

**Pour les salariés concernés, l'état des lieux récapitulatif de leur parcours professionnel est-il réalisé et formalisé ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | C · 2 — important · modere |
| Condition d'affichage | company_size ∈ {11-49, 50-249, 250-999, 1000+} |
| Red flag | Oui si « Non / pas encore » ou « Je ne sais pas » et company_size ∈ {50-249, 250-999, 1000+} |
| Legal flag · règle | Oui · `LR_ENTRETIEN_PARCOURS` (verified) |
| Source · vérifiée le | [Légifrance — L6315-1 (en vigueur depuis le 31/12/2025)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053279288) ; [Légifrance — Loi n° 2025-989, art. 3](https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000052430965) ; [Service-Public — Entretien professionnel (F32040)](https://www.service-public.gouv.fr/particuliers/vosdroits/F32040) · 2026-09-18 |
| Tags commerciaux (internes) | `audit_rh` |
| Aide (tooltip) | Bilan périodique qui vérifie que le salarié a bénéficié des entretiens et actions prévus. Si aucun salarié n'a encore l'ancienneté requise, répondez « Non applicable ». |

| Réponse | Score | Recommandation |
|---|---|---|
| Oui, totalement | 100 | — (maîtrisé) |
| Partiellement / à vérifier | 50 | Identifier les salariés arrivant à l'échéance de l'état des lieux et vérifier leur dossier. |
| Non / pas encore | 0 | Réaliser les états des lieux dus et vérifier les entretiens et actions associés. |
| Je ne sais pas | 0 + vigilance | Identifier les salariés concernés par l'état des lieux et vérifier leur situation. |
| Non applicable (aucun salarié concerné à ce jour) | exclu | — |

### Q18 — Détermination des besoins de formation

**Comment vos besoins en formation sont-ils déterminés ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 2 — important · modere |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `drh_externalise` |
| Aide (tooltip) | La façon dont le plan de développement des compétences est construit. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Principalement au fil des demandes individuelles. | 0 | Organiser une collecte annuelle des besoins de formation auprès des managers. |
| B. Les besoins sont collectés mais peu priorisés. | 33 | Prioriser les besoins selon les enjeux des équipes et le budget disponible. |
| C. Ils sont priorisés en fonction des besoins des équipes et métiers. | 67 | Relier le plan de formation aux compétences clés et évaluer son impact. |
| D. Ils découlent d'une analyse des compétences nécessaires et leur impact est ensuite évalué. | 100 | — (point fort) |

### Q19 — Cartographie des compétences

**Quelle visibilité avez-vous sur les compétences critiques dont l'entreprise aura besoin dans les 12 à 24 prochains mois ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 2 — important · modere |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `drh_externalise` |
| Aide (tooltip) | Compétences sans lesquelles l'activité ou les projets de l'entreprise seraient fragilisés. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Très faible. | 0 | Identifier avec la direction les compétences critiques pour les deux prochaines années. |
| B. Quelques besoins ont été identifiés de manière informelle. | 33 | Formaliser les compétences critiques et les rattacher aux postes concernés. |
| C. Les principales compétences critiques sont identifiées. | 67 | Utiliser la cartographie pour arbitrer recrutement, formation et mobilité. |
| D. Elles sont cartographiées et alimentent les décisions de recrutement, formation et mobilité. | 100 | — (point fort) |

### Q20 — Lisibilité des parcours d'évolution

**Vos collaborateurs et managers comprennent-ils les possibilités d'évolution au sein de l'entreprise et les compétences nécessaires pour y accéder ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 1 — secondaire · faible |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `drh_externalise` |
| Aide (tooltip) | Mobilités possibles, passerelles entre métiers et critères d'accès. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Très peu. | 0 | Décrire les principales évolutions possibles et les compétences attendues. |
| B. Cela dépend fortement des équipes ou managers. | 33 | Partager les parcours d'évolution avec l'ensemble des managers. |
| C. Les principaux parcours et critères sont identifiés. | 67 | Intégrer les parcours aux entretiens de développement. |
| D. Les parcours sont structurés, transparents et intégrés aux discussions de développement. | 100 | — (point fort) |

## Pilier 6/8 — Rémunération & équité

Score CRM : `compensation_score` · Point fort : « Vos décisions salariales reposent sur un cadre partagé et des données fiables. » · À structurer : « Les décisions salariales manquent d'un cadre commun et de données pour les objectiver. »

### Q21 — Cadre des décisions salariales

**Deux managers confrontés à une même décision salariale disposent-ils d'un cadre suffisamment clair pour prendre des décisions cohérentes ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 2 — important · modere |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `compensation` |
| Aide (tooltip) | Règles d'augmentation, de positionnement à l'embauche et de promotion. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Non, les décisions sont largement discrétionnaires. | 0 | Formaliser quelques règles communes (embauche, augmentation, promotion). |
| B. Quelques principes existent mais sont interprétés différemment. | 33 | Harmoniser l'interprétation des règles lors des revues salariales. |
| C. Une politique et des règles communes structurent les décisions. | 67 | Appuyer les règles sur des données de marché et internes fiables. |
| D. Les règles sont formalisées, documentées et appuyées sur des données fiables. | 100 | — (point fort) |

### Q22 — Architecture des emplois

**Dans quelle mesure votre architecture des emplois et niveaux permet-elle de comparer des postes de manière cohérente ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 2 — important · modere |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `compensation` |
| Aide (tooltip) | Classification des postes par famille de métiers et niveau de responsabilité. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Nous n'avons pas réellement d'architecture structurée. | 0 | Construire une première architecture des emplois (familles, niveaux). |
| B. Des classifications existent mais sont incomplètes ou obsolètes. | 33 | Mettre à jour les classifications et compléter les emplois manquants. |
| C. Les principaux emplois et niveaux sont structurés. | 67 | Utiliser l'architecture dans les décisions salariales et de mobilité. |
| D. L'architecture est maintenue à jour et utilisée pour les décisions RH et salariales. | 100 | — (point fort) |

### Q23 — Objectivation des écarts de rémunération

**Pouvez-vous expliquer et objectiver les principaux écarts de rémunération entre des salariés occupant des postes comparables ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 3 — critique · eleve |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `compensation` |
| Aide (tooltip) | Capacité à justifier un écart par des critères objectifs (expérience, performance, marché…). |

| Situation | Score | Recommandation |
|---|---|---|
| A. Difficilement. | 0 | Réaliser une première analyse des écarts de rémunération par poste comparable. |
| B. Partiellement, avec des données ou critères incomplets. | 33 | Compléter les données et définir les critères objectifs qui justifient un écart. |
| C. Oui, grâce à des données et critères identifiés. | 67 | Mettre en place une analyse régulière et un plan de correction des écarts injustifiés. |
| D. Oui, avec des analyses régulières permettant également d'identifier et corriger les écarts injustifiés. | 100 | — (point fort) |

### C5 — Index de l'égalité professionnelle

**Votre index de l'égalité professionnelle est-il calculé, publié et suivi selon les obligations applicables ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | C · 2 — important · modere |
| Condition d'affichage | company_size ∈ {50-249, 250-999, 1000+} |
| Red flag | Oui si « Non / pas encore » ou « Je ne sais pas » |
| Legal flag · règle | Oui · `LR_INDEX_EGALITE` (verified) |
| Source · vérifiée le | [Entreprendre.Service-Public — Index de l'égalité professionnelle (F35103)](https://entreprendre.service-public.gouv.fr/vosdroits/F35103) · 2026-09-18 |
| Tags commerciaux (internes) | `compensation` `audit_rh` |
| Aide (tooltip) | Indicateurs relatifs aux écarts entre les femmes et les hommes, à calculer et publier chaque année. |

| Réponse | Score | Recommandation |
|---|---|---|
| Oui, totalement | 100 | — (maîtrisé) |
| Partiellement / à vérifier | 50 | Vérifier le calcul, la publication et la transmission de l'index, ainsi que les mesures de correction éventuelles. |
| Non / pas encore | 0 | Calculer et publier l'index de l'égalité professionnelle et définir les mesures de correction si nécessaire. |
| Je ne sais pas | 0 + vigilance | Vérifier si l'index a été calculé et publié pour la dernière échéance. |

### Q24 — Préparation à la transparence salariale ⛔ INACTIVE (validation juridique requise)

**Votre organisation est-elle préparée aux obligations de transparence salariale qui lui seront applicables ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | C · 3 — critique · eleve |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Oui · `LR_TRANSPARENCE_SALARIALE` (legal_validation_required) |
| Source · vérifiée le | [Légifrance — Directive (UE) 2023/970](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047656481) ; [Entreprendre.Service-Public — actualité du 10/09/2026 (projet de loi)](https://entreprendre.service-public.gouv.fr/actualites/A19060) · 2026-09-18 |
| Tags commerciaux (internes) | `compensation` |
| Aide (tooltip) | De nouvelles obligations de transparence des rémunérations sont issues du droit européen. |

| Réponse | Score | Recommandation |
|---|---|---|
| Oui, totalement | 100 | — (maîtrisé) |
| Partiellement / à vérifier | 50 | Identifier les obligations qui vous seront applicables et les données à préparer. |
| Non / pas encore | 0 | Préparer les données et critères de rémunération nécessaires aux futures obligations de transparence. |
| Je ne sais pas | 0 + vigilance | Vérifier les obligations de transparence salariale applicables à votre effectif et leur calendrier. |

## Pilier 7/8 — Management, QVCT & prévention

Score CRM : `management_qvct_score` · Point fort : « La prévention est pilotée et vos managers sont outillés. » · À structurer : « La prévention et l'accompagnement des managers restent peu structurés. »

### Q25 — DUERP

**Votre DUERP est-il à jour et adapté aux risques réellement rencontrés dans votre entreprise ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | C · 3 — critique · eleve |
| Condition d'affichage | Toujours posée |
| Red flag | Oui si « Non / pas encore » ou « Je ne sais pas » |
| Legal flag · règle | Oui · `LR_DUERP` (verified) |
| Source · vérifiée le | [Entreprendre.Service-Public — DUERP (F35360)](https://entreprendre.service-public.gouv.fr/vosdroits/F35360) ; [Légifrance — L4121-3-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043893919) · 2026-09-18 |
| Tags commerciaux (internes) | `audit_rh` |
| Aide (tooltip) | Le document unique d'évaluation des risques professionnels recense les risques de chaque unité de travail et les actions de prévention. |

| Réponse | Score | Recommandation |
|---|---|---|
| Oui, totalement | 100 | — (maîtrisé) |
| Partiellement / à vérifier | 50 | Revoir le DUERP avec les équipes de terrain pour qu'il reflète les risques réels, et vérifier sa date de mise à jour. |
| Non / pas encore | 0 | Mettre à jour le DUERP en priorité, avec les unités de travail et les actions de prévention associées. |
| Je ne sais pas | 0 + vigilance | Vérifier l'existence du DUERP, sa date de dernière mise à jour et son accessibilité. |

### Q26 — Démarche de prévention

**Comment votre DUERP et vos démarches de prévention sont-ils utilisés dans la pratique ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 3 — critique · eleve |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `drh_externalise` |
| Aide (tooltip) | Il s'agit de l'usage réel : actions décidées, responsables, suivi. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Principalement comme une obligation documentaire. | 0 | Associer à chaque risque prioritaire une action, un responsable et une échéance. |
| B. Quelques actions en découlent mais leur suivi est irrégulier. | 33 | Mettre en place un suivi régulier des actions de prévention. |
| C. Les risques identifiés donnent lieu à des actions suivies. | 67 | Piloter la prévention avec des indicateurs et une revue périodique en comité de direction. |
| D. La prévention est pilotée dans le temps avec responsabilités, échéances et suivi des actions. | 100 | — (point fort) |

### Q27 — Analyse de l'absentéisme et du turnover

**Lorsque l'absentéisme ou le turnover évoluent anormalement dans une équipe, êtes-vous capable d'en identifier les causes et d'agir ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 2 — important · modere |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `drh_externalise` `orkest` |
| Aide (tooltip) | Capacité à repérer une dérive, en comprendre les causes et engager des actions. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Nous disposons de peu de visibilité. | 0 | Suivre l'absentéisme et le turnover par équipe, chaque mois. |
| B. Les indicateurs sont disponibles mais l'analyse reste ponctuelle. | 33 | Analyser les causes lorsqu'un indicateur dépasse un seuil défini. |
| C. Nous pouvons identifier les principales causes et mettre en place des actions. | 67 | Suivre les actions engagées et mesurer leurs effets. |
| D. Les indicateurs et signaux faibles sont régulièrement analysés et déclenchent des actions suivies. | 100 | — (point fort) |

### Q28 — Autonomie RH des managers

**Dans quelle mesure vos managers savent-ils gérer les situations RH courantes et identifier celles nécessitant l'intervention des RH ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 2 — important · modere |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `drh_externalise` |
| Aide (tooltip) | Absences, conflits, entretiens, demandes courantes des collaborateurs. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Ils sollicitent très fréquemment les RH, y compris sur les situations courantes. | 0 | Formaliser un guide du manager sur les situations RH les plus fréquentes. |
| B. Leur niveau d'autonomie varie fortement. | 33 | Former les managers et définir des règles d'escalade vers les RH. |
| C. Ils disposent d'un cadre clair et sont globalement autonomes. | 67 | Compléter le cadre par des formations ciblées et un retour d'expérience régulier. |
| D. Ils sont formés, outillés et disposent de règles d'escalade clairement définies. | 100 | — (point fort) |

## Pilier 8/8 — Organisation, SIRH & pilotage RH

Score CRM : `hr_operations_data_score` · Point fort : « Votre fonction RH est pilotée avec des priorités claires et des données fiables. » · À structurer : « La fonction RH manque encore d'outils et de données pour piloter. »

### Q29 — Feuille de route RH

**Votre roadmap RH est-elle formalisée, priorisée et reliée aux enjeux business de l'entreprise ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 3 — critique · eleve |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `drh_externalise` `orkest` |
| Aide (tooltip) | Les priorités RH de l'année et leur lien avec la stratégie de l'entreprise. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Nous fonctionnons principalement en réaction aux sujets qui arrivent. | 0 | Définir avec la direction trois à cinq priorités RH pour les douze prochains mois. |
| B. Des priorités existent mais sont peu formalisées ou régulièrement bousculées. | 33 | Formaliser la feuille de route RH et la partager avec la direction. |
| C. Une roadmap claire et priorisée existe. | 67 | Associer à chaque priorité des objectifs mesurables et une revue régulière. |
| D. La roadmap découle des enjeux business, comporte des objectifs mesurables et fait l'objet d'un suivi régulier. | 100 | — (point fort) |

### Q30 — Fiabilité des données RH

**Disposez-vous d'une source de référence permettant d'obtenir rapidement des données RH fiables ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 2 — important · modere |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `orkest` |
| Aide (tooltip) | Effectifs, mouvements, rémunérations, absences : une source qui fait foi. |

| Situation | Score | Recommandation |
|---|---|---|
| A. Les informations sont dispersées entre plusieurs sources. | 0 | Désigner une source de référence pour les données RH clés. |
| B. Une source principale existe mais nécessite régulièrement des retraitements. | 33 | Fiabiliser la source principale pour réduire les retraitements. |
| C. Les principales données sont centralisées et globalement fiables. | 67 | Définir des règles de gouvernance des données (responsables, mises à jour, contrôles). |
| D. Les données sont centralisées, gouvernées et directement exploitables pour le pilotage. | 100 | — (point fort) |

### Q31 — Outils RH et automatisation

**Dans quelle mesure vos outils RH réduisent-ils réellement les tâches administratives et doubles saisies ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 1 — secondaire · faible |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `orkest` |
| Aide (tooltip) | SIRH, logiciel de paie, outils de recrutement, de formation ou de gestion des temps. |

| Situation | Score | Recommandation |
|---|---|---|
| A. De nombreux processus reposent encore sur Excel, emails ou ressaisies. | 0 | Identifier les tâches les plus chronophages et les processus à digitaliser en priorité. |
| B. Plusieurs outils existent mais communiquent peu entre eux. | 33 | Connecter les outils existants pour supprimer les doubles saisies. |
| C. Les principaux processus sont digitalisés avec peu de doubles saisies. | 67 | Automatiser les tâches répétitives restantes. |
| D. La stack RH est intégrée et les principales tâches répétitives sont automatisées. | 100 | — (point fort) |

### Q32 — Usage des indicateurs RH

**Vos indicateurs RH influencent-ils réellement les décisions prises par la fonction RH et la direction ?**

| Champ | Valeur |
|---|---|
| Type · poids · risque | M · 2 — important · modere |
| Condition d'affichage | Toujours posée |
| Red flag | Non |
| Legal flag · règle | Non |
| Source · vérifiée le | Brief Audit RH 360° Le Club des RH (sept. 2026) · 2026-09-18 |
| Tags commerciaux (internes) | `orkest` `drh_externalise` |
| Aide (tooltip) | Au-delà du reporting : les indicateurs éclairent-ils les arbitrages ? |

| Situation | Score | Recommandation |
|---|---|---|
| A. Nous disposons de peu d'indicateurs fiables. | 0 | Définir un socle de cinq à huit indicateurs RH fiables. |
| B. Des indicateurs sont produits mais principalement à des fins de reporting. | 33 | Relier chaque indicateur à une décision ou une action possible. |
| C. Les principaux KPI sont utilisés dans le pilotage RH. | 67 | Présenter les indicateurs RH dans les arbitrages de direction et mesurer l'impact des actions. |
| D. Les données RH alimentent régulièrement les arbitrages de la direction et permettent de mesurer l'impact des actions engagées. | 100 | — (point fort) |

## Seuils de maturité

- ≥ 80 : **Bien structuré** — « Votre organisation RH apparaît bien structurée. »
- ≥ 60 : **À consolider** — « Votre organisation RH apparaît globalement structurée, avec plusieurs axes à consolider. »
- ≥ 40 : **Plusieurs sujets à structurer** — « Votre organisation RH repose sur des bases réelles, avec plusieurs sujets à structurer. »
- ≥ 0 : **Plusieurs priorités à sécuriser** — « Vos réponses font ressortir plusieurs priorités à sécuriser et à structurer. »

## Hiérarchie de restitution / roadmap

1. **Sujets à sécuriser en priorité** — Réponse déclenchant un red flag réglementaire.
2. **Points critiques à traiter** — Question de poids 3 avec réponse faible (score <= weak_max_score), hors red flag.
3. **Piliers à structurer** — Pilier dont le score est < low_pillar_below : une action de pilier, alimentée par ses réponses les plus faibles non déjà listées.
4. **Points à consolider** — Toute autre réponse de score <= 50 non déjà listée (« Partiellement », situation B, et réponses faibles de poids 1-2 hors pilier faible).
5. **Pistes d'optimisation** — Situation C (score 67) : présentée comme optimisation, jamais comme problème.

Tri interne : weight_desc → score_asc → pillar_order_asc → question_order_asc. Seuils : {"weak_max_score":0,"partial_scores":[33,50],"optimisation_scores":[67],"low_pillar_below":60,"strength_min_score":80,"strength_fallback_min":67,"max_strengths":3,"max_areas_to_structure":3,"very_good":{"min_global":80,"no_red_flag":true,"no_pillar_below":60}}

## Qualification commerciale (interne, jamais affichée)

- `audit_rh` — Plusieurs sujets de conformité / fondamentaux à sécuriser. Règle : `{"any":[{"metric":"red_flags_count","gte":2},{"metric":"pillar_score","pillar":"compliance","lt":60}]}`
- `drh_externalise` — Faible maturité transverse et fonction RH peu structurée ou portée par la direction. Règle : `{"all":[{"metric":"weak_pillars_count","gte":3},{"any":[{"field":"hr_organization","in":["leadership","external","other","small_team"]},{"field":"respondent_role","in":["ceo","daf"]}]}]}`
- `orkest` — Organisation globalement mature, fragilités de process, documentation, données, outils ou pilotage. Règle : `{"all":[{"metric":"global_score","gte":60},{"metric":"tagged_weak_count","tag":"orkest","gte":2}]}`
- `recrutement` — Recrutement & onboarding ressort nettement. Règle : `{"all":[{"metric":"pillar_score","pillar":"recruitment","lt":60},{"metric":"rank_from_bottom","pillar":"recruitment","lte":2}]}`
- `compensation` — Rémunération & équité ressort nettement. Règle : `{"all":[{"metric":"pillar_score","pillar":"compensation","lt":60},{"metric":"rank_from_bottom","pillar":"compensation","lte":2}]}`
- `relations_sociales` — Relations sociales ressort nettement (pilier évalué uniquement). Règle : `{"any":[{"all":[{"metric":"pillar_score","pillar":"employee_relations","lt":60},{"metric":"rank_from_bottom","pillar":"employee_relations","lte":2}]},{"metric":"red_flag_on","questions":["Q9","C3","C4"]}]}`

## Règles réglementaires

| Règle | Statut | Applicabilité | Périodicité | Sources | Lu le |
|---|---|---|---|---|---|
| `LR_REGISTRE_PERSONNEL` Registre unique du personnel | verified | Tout employeur, dès le premier salarié. | Tenue permanente, mise à jour à chaque entrée et sortie. | [Entreprendre.Service-Public — Registre unique du personnel (F1784)](https://entreprendre.service-public.gouv.fr/vosdroits/F1784) | 2026-09-18 |
| `LR_AFFICHAGES` Informations et affichages obligatoires | verified | Tout employeur ; contenu complémentaire à partir de 11 et de 50 salariés. | Information permanente, à actualiser à chaque changement. | [Entreprendre.Service-Public — Affichage obligatoire (F23106)](https://entreprendre.service-public.gouv.fr/vosdroits/F23106) | 2026-09-18 |
| `LR_REGLEMENT_INTERIEUR` Règlement intérieur | verified | Entreprises d'au moins 50 salariés (seuil atteint pendant 12 mois consécutifs, puis délai de 12 mois). | Aucune ; mise à jour lorsque la réglementation ou les règles internes évoluent. | [Entreprendre.Service-Public — Règlement intérieur (F1905)](https://entreprendre.service-public.gouv.fr/vosdroits/F1905)<br>[Légifrance — L1311-2](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038610176/) | 2026-09-18 |
| `LR_CSE` CSE — mise en place et élections | verified | Entreprises d'au moins 11 salariés (12 mois consécutifs) ; attributions élargies à partir de 50 salariés (12 mois consécutifs + 12 mois). | Élections tous les 4 ans par défaut (durée des mandats). | [Entreprendre.Service-Public — CSE : élections (F34474)](https://entreprendre.service-public.gouv.fr/vosdroits/F34474)<br>[Légifrance — L2314-33 (version issue de la loi n° 2025-989)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000052437191) | 2026-09-18 |
| `LR_BDESE` Base de données économiques, sociales et environnementales | verified | Entreprises d'au moins 50 salariés. | Mise à jour bimestrielle (< 300) ou mensuelle (≥ 300). | [Entreprendre.Service-Public — BDESE (F32193)](https://entreprendre.service-public.gouv.fr/vosdroits/F32193) | 2026-09-18 |
| `LR_NAO` Négociations obligatoires en entreprise | verified | Entreprises dotées d'au moins une section syndicale d'organisation représentative (en pratique, à partir de 50 salariés). Non déductible de l'effectif seul : réponse « Non applicable » proposée. | Au moins tous les 4 ans (ordre public) ; annuelle / triennale à défaut d'accord. | [Légifrance — Code du travail, L2242-1 et suivants](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000006189527/) | 2026-09-18 |
| `LR_INDEX_EGALITE` Index de l'égalité professionnelle femmes-hommes | verified | Entreprises d'au moins 50 salariés. | Annuelle (publication au plus tard le 1er mars). | [Entreprendre.Service-Public — Index de l'égalité professionnelle (F35103)](https://entreprendre.service-public.gouv.fr/vosdroits/F35103) | 2026-09-18 |
| `LR_TRANSPARENCE_SALARIALE` Transparence des rémunérations (directive (UE) 2023/970) | legal_validation_required | Inconnue en droit français à la date de vérification. | — | [Légifrance — Directive (UE) 2023/970](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047656481)<br>[Entreprendre.Service-Public — actualité du 10/09/2026 (projet de loi)](https://entreprendre.service-public.gouv.fr/actualites/A19060) | 2026-09-18 |
| `LR_ENTRETIEN_PARCOURS` Entretien de parcours professionnel et état des lieux récapitulatif | verified | Tout employeur ; abondement correctif du CPF à partir de 50 salariés. | {"first_interview":"au cours de la 1re année","interview_every_years":4,"summary_review_every_years":8} | [Légifrance — L6315-1 (en vigueur depuis le 31/12/2025)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053279288)<br>[Légifrance — Loi n° 2025-989, art. 3](https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000052430965)<br>[Service-Public — Entretien professionnel (F32040)](https://www.service-public.gouv.fr/particuliers/vosdroits/F32040) | 2026-09-18 |
| `LR_DUERP` Document unique d'évaluation des risques professionnels | verified | Tout employeur, dès le premier salarié. | Au moins annuelle à partir de 11 salariés ; à chaque changement significatif pour tous. | [Entreprendre.Service-Public — DUERP (F35360)](https://entreprendre.service-public.gouv.fr/vosdroits/F35360)<br>[Légifrance — L4121-3-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043893919) | 2026-09-18 |
| `LR_EFFECTIF` Appréciation de l'effectif pour les seuils | legal_validation_required | Transverse. | — | [Légifrance — CSS L130-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051287151) | 2026-09-18 |

## LEGAL_VALIDATION_REQUIRED

- ⛔ bloquant · `LR_TRANSPARENCE_SALARIALE` (Q24) — Directive (UE) 2023/970 non transposée au 18/09/2026 (projet de loi du 10/09/2026). Activer Q24 uniquement après publication du texte : seuils, dates d'application, conditions de red flag (obligation future ≠ manquement actuel).
- non bloquant · `LR_EFFECTIF` (Q4, Q9, C3, C4, C5, C6) — Valider l'usage de la tranche d'effectif déclarée (sans tester la durée de franchissement du seuil) et la mention correspondante dans l'aide contextuelle.
- non bloquant · `LR_NAO` (C4) — Valider le filtre « à partir de 50 salariés » + option « Non applicable » plutôt qu'une question de contexte sur la présence de délégués syndicaux.
- non bloquant · `LR_ENTRETIEN_PARCOURS` (Q17, C6) — Mesures transitoires de la loi n° 2025-989 (cycles de 6 ans en cours, application aux accords existants au 01/10/2026) à confirmer via le Q&R du Ministère du Travail (page non lisible par l'agent).

## Veille (règles vérifiées mais mouvantes)

- `LR_INDEX_EGALITE` — Évolution annoncée par le projet de loi de transposition de la directive 2023/970.
- `LR_ENTRETIEN_PARCOURS` — Réforme récente (loi n° 2025-989), entrée en application progressive.
- `LR_DUERP` — Loi n° 2026-534 du 25/06/2026 ; portail de dépôt dématérialisé.

## Disclaimer

> Cet outil constitue un pré-diagnostic réalisé à partir de vos réponses déclaratives. Il ne constitue ni un audit juridique, ni une certification de conformité. Certaines obligations peuvent varier selon votre effectif, votre convention collective, votre secteur et votre situation particulière.
