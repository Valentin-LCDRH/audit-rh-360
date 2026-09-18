# Guide — tests utilisateurs de la maquette (Phase 2)

Version testée : 32 questions actuelles, **sans condensation**. Objectif : mesurer l'expérience telle qu'elle a été
pensée, puis arbitrer (1. conserver · 2. condenser · 3. rendre conditionnel · 4. supprimer en dernier recours).
Cible : un audit réellement utile en 7-8 minutes.

## Profils à recruter (3 à 5 tests)
- Dirigeant de PME avec peu de ressources RH
- RRH / DRH de PME
- DRH / Head of People d'une organisation structurée
- Au moins un test sur mobile

## Déroulé
1. Ouvrir `http://127.0.0.1:8766/` (maquette propre, sans outils de test) dans une fenêtre de navigation privée,
   ou vider les données du site pour repartir de zéro.
2. Consigne : « Faites l'audit comme si c'était pour votre entreprise. Pensez à voix haute. » Ne pas aider.
3. Laisser aller jusqu'au formulaire. Le tester peut le remplir : aucun email n'est envoyé (mention affichée).
4. Après le test, ouvrir `http://127.0.0.1:8766/?test=1` → **Outils de test** → « Mesures — dernier audit terminé ».
   Recopier les mesures dans la grille ci-dessous (elles restent uniquement dans ce navigateur).
5. Entretien de 5 minutes (questions ci-dessous).

## Mesures automatiques (invisibles pour le testeur)
| Mesure | Sens |
|---|---|
| `audit_duration_seconds` | Clic « Démarrer mon audit RH » → premier affichage du résultat (horloge murale) |
| `questionnaire_duration_seconds` | Temps passé sur les questions, hors contextualisation |
| `pillar_duration_seconds` | Même mesure, par pilier : repère les blocs qui ralentissent |
| `back_count` · `answer_changes` | Retours en arrière · réponses modifiées : signaux d'hésitation |
| `audit_resumed` | `true` si l'audit a été interrompu puis repris : durée totale à interpréter avec prudence |
| `last_question_id` · `last_pillar` | Dernier point atteint (envoyé aussi dans l'événement `audit_exit` si la page est quittée) |

Temps d'écran plafonné à 5 minutes par question et chronomètre en pause quand la page est masquée : une pause ne
fausse pas le temps de questionnaire.

## Grille d'observation (une par testeur)
| Rubrique | Notes |
|---|---|
| Profil (fonction, effectif, organisation RH, mobile/ordinateur) | |
| Durée totale / questionnaire / piliers les plus longs | |
| Questions qui demandent trop de lecture | |
| Réponses entre lesquelles il hésite (question + situations) | |
| Questions jugées trop évidentes | |
| Questions peu pertinentes pour sa situation | |
| Termes nécessitant une explication | |
| Perception du résultat (juste ? utile ? surprenant ?) | |
| Envie de laisser son email pour le rapport (oui/non, pourquoi) | |
| Verbatims marquants | |

## Questions d'entretien
1. Le résultat correspond-il à la réalité de votre organisation ? Qu'est-ce qui vous a surpris ?
2. Qu'avez-vous appris que vous ne saviez pas déjà ?
3. Quelles questions vous ont fait hésiter, et pourquoi ?
4. La durée vous a-t-elle paru raisonnable pour ce que vous avez obtenu ?
5. Qu'attendez-vous du rapport détaillé ? Auriez-vous laissé votre email pour le recevoir ?
6. Qu'est-ce qui vous donnerait envie d'échanger avec un consultant sur ces résultats ?
