# Recette — Phase 2 (maquette cliquable)

Date : 2026-09-18 · Moteur `weighted-questions-v1` · config `0.2.0` · règles `2026-09-18`.

## Tests automatisés — `scripts/test.sh` : 27 / 27 au vert
Profils du brief §46 : 1 PME peu structurée (4 red flags) · 2 PME intermédiaire · 3 ETI data/pilotage ·
4 très mature (aucun faux problème, aucun tag forcé) · 5 nombreux N/A · 6 score élevé + red flag ·
7 tout négatif · 8 tout positif · 9 abandon/reprise (expiration, donnée corrompue) · 10 mobile (manuel, ci-dessous).
Cas transverses : sans UTM, UTM URL > session, données manquantes, retour arrière/modification,
conditionnelles, pilier non évalué, changement d'effectif, calcul posé à la main, niveau sur score
affiché, égalité de piliers, red flag = réponse + obligation, C6 indépendante de la taille,
roadmap (ordre, doublons, deux tonalités P2), tags, activation Q24/désactivation Index, payload,
vocabulaire interdit.

## Vérifications manuelles (navigateur, 2026-09-18)
| Parcours | Résultat |
|---|---|
| Accueil → contexte (5 écrans) → 30 questions (11-49, CSE) → résultat | OK, 0 erreur console |
| Aide contextuelle « ? » | OK |
| Clavier : touches 1-9, Entrée sur la convention collective | OK |
| Retour arrière : réponse conservée, « Suivant » actif | OK |
| Abandon (rechargement) → « Reprendre mon audit (10 réponses) » → reprise à 10/30 | OK |
| Lead gate : champs vides → 4 erreurs + focus ; email invalide → erreur ciblée | OK |
| Conversion simulée → « Votre rapport est en route » + CTA unique « Échanger sur mon audit RH » | OK |
| Aperçu de l'email Brevo (sections 1 à 9 + CTA) | OK |
| UTM `?utm_source=linkedin…` conservées jusqu'à `report_requested` | OK |
| Profil 4 : « Votre organisation RH apparaît bien structurée », points forts, pistes d'optimisation, aucune priorité | OK |
| Profil 5 : 95/100 + DUERP en tête des sujets à sécuriser et de la roadmap | OK |
| Profil 6 : « Relations sociales — Non évalué » discret, exclu du global | OK |
| Mobile 375 px : aucun débordement horizontal, résultat et questions lisibles | OK |
| `audit_completed` : une seule fois par audit, même après rechargement | OK (corrigé) |
| Outils de test : activation Q24/C6 et désactivation Index → 35 questions au lieu de 34 | OK |

## Limites connues
- Pas de Node sur le poste : tests exécutés avec JavaScriptCore (macOS) ; `test/engine.test.html` pour le navigateur.
- Navigateur intégré sans accès au dossier Bureau : serveur local lancé depuis le terminal.
- Pour une TPE sans CSE, la progression affiche « Pilier x/7 » (pilier non applicable sauté).
- L'email « professionnel » n'est validé que sur le format (pas de filtrage des messageries grand public).
- Mention de confidentialité ajoutée sous le bouton du formulaire (lien vers la politique existante) : à valider.

## Règles réglementaires restant à valider
Bloquantes : `LR_TRANSPARENCE_SALARIALE` (Q24) · `LR_ETAT_DES_LIEUX_PARCOURS` (C6).
Non bloquantes : `LR_EFFECTIF` (tranches déclarées) · `LR_NAO` (filtre ≥ 50 + N/A) · `LR_ENTRETIEN_PARCOURS` (mesures transitoires).
Contre-signature humaine (`validated_by`) : vide pour toutes les règles.

## Intégrations restant à brancher (Phase 5, rien de branché)
Zapier (webhook), Pipedrive (payload prêt : `ARH_ENGINE.buildPayload`), Brevo (gabarit : `ARH_MOCKS.buildReportEmail`),
GA4/GTM (8 événements poussés dans `dataLayer`), destination du CTA commercial (`commercial_cta.url`, mockée).

## Itération du 2026-09-18 (arbitrages validés)
- Aperçu gratuit : jusqu'à 3 actions de priorité 1 à 4, jamais complété ; « + N actions dans votre rapport
  détaillé ». Très bon résultat : pistes d'optimisation, jamais présentées comme priorités. Test ajouté (28/28).
  Vérifié : profil 1 → 3 actions + 18 ; profil 5 → 1 seule action (DUERP) + 3 ; profil 4 → 3 optimisations.
- Bloc de conversion : « Retrouvez : » + puces adaptées au résultat (8 piliers, points à sécuriser s'il y en a,
  axes s'il y en a, roadmap priorisée ou pistes d'optimisation).
- Résultat : les 8 piliers restent affichés, le pilier sans objet en « Non évalué ».

## Durée estimée (lecture à 200 mots/min + 4 s de décision par écran, 5 écrans de contexte)
| Profil | Questions | Mots à lire | Durée estimée |
|---|---|---|---|
| 1-10 sans CSE | 26 | 1 230 | ~8,7 min |
| 11-49 avec CSE | 30 | 1 395 | ~9,8 min |
| 50+ avec CSE | 34 | 1 515 | ~10,7 min |
Écart avec la promesse « ≈ 5 minutes » : à mesurer avec de vrais testeurs (chronomètre).
Question la plus longue : Q5 (62 mots avec ses 4 situations).

## Itération 3 (2026-09-18) — ajustements avant tests utilisateurs
- Accueil : « Moins de 10 minutes » (provisoire, avant chronométrage). Textes de l'accueil déplacés en config (`hero`).
- DUERP et BDESE explicités à leur première apparition ; « stack RH » → « outils RH » ; « reporting » → « suivi » ;
  « enjeux business » → « enjeux de l'entreprise ». Conservés : onboarding, KPI, roadmap.
- Wording adaptatif 1-10 salariés (même question, même poids, même score) : Q13 (recrutement reproductible),
  Q27 (hausse des départs ou de l'absentéisme), Q28 (encadrants + « Non applicable » si personne n'encadre
  en dehors de la direction, exclu du score). Variante tracée dans `answers_json` (`variant_id`). Test ajouté (29/29).
- Payload : `consent_scope = audit_report_and_followup` (aucune inscription marketing automatique).
- Proposition de condensation des 24 questions M : `docs/PROPOSITION-CONDENSATION.md` (−199 mots, −17 %), non appliquée.

## Protocole de chronométrage suggéré (tests utilisateurs)
Chronométrer de « Démarrer mon audit RH » à l'affichage du score ; noter les questions relues ou commentées
et les hésitations sur les situations A/B/C/D. Viser 3 à 5 testeurs de profils différents (dirigeant de TPE,
RRH de PME, DRH d'ETI), dont au moins un sur mobile.

## Itération 4 (2026-09-18) — mesure de durée et de friction (invisible pour l'utilisateur)
- `audit_completed` porte : `audit_duration_seconds`, `questionnaire_duration_seconds` (hors contexte),
  `pillar_duration_seconds` (par pilier), `audit_resumed`, `back_count`, `answer_changes`.
- `pillar_completed` porte `pillar_duration_seconds` du pilier. Nouvel événement `audit_exit` (page quittée en cours
  d'audit) : `last_question_id`, `last_pillar`, `question_index` / `questions_count`. Pas de temps par question.
- Segments plafonnés à 300 s, pause si page masquée ; mesures jointes au payload (`audit_metrics`). Test ajouté (30/30).
- Vérifié dans le navigateur : 25 s au total dont 19 s de questionnaire (contexte exclu), répartition par pilier,
  1 retour et 1 modification comptés ; `audit_exit` unique avec Q7 (7/34).
- Maquette propre par défaut : outils de test via `?test=1` ; mesures du dernier audit terminé conservées localement ;
  mention « Maquette de test : aucun email n'est envoyé » toujours affichée tant que les intégrations sont simulées.
- Note : en local, faire un rechargement forcé après une mise à jour (cache du navigateur).

## Itération 5 (2026-09-18) — convention collective et module Syntec (V1)
- Avance automatique à 300 ms (config `ui.auto_advance_ms`) avec retour visuel immédiat, sur les écrans à
  choix unique uniquement ; jamais sur la recherche de convention ni sur le formulaire.
- Convention collective : recherche avec suggestions (nom, nom d'usage, alias, IDCC) → sélection normalisée
  dans `src/data/ccn-list.js` ; alternatives explicites `unknown` / `none`. Stockage : `collective_agreement_idcc`,
  `_label`, `_short_name`, `_known`. Les règles se déclenchent uniquement sur l'IDCC.
- Modules : `src/config/ccn-modules.js` (IDCC → contexte + contrôles). V1 : 1486 → forfait jours.
  Contexte « forfait jours » hors score ; contrôle `CCN1486_FJ` (C, poids 3, pilier 1), red flag = Non / Je ne sais
  pas + règle `LR_SYNTEC_FORFAIT_JOURS` vérifiée et applicable.
- Garde-fou de production : `release.mode = 'production'` désactive toute règle sans `legal_reviewed_at`.
- Tests : 40 / 40 (10 ajoutés : CCN 1 à 9, production, payload CCN).
- Vérifié dans le navigateur (ordinateur et mobile 375 px) : recherche « Syntec », « CCN Syntec », « IDCC 1486 »,
  « 1486 », « métallurgie » ; compteur de contexte 5 → 6 après sélection de Syntec ; questionnaire annoncé à 35
  dès la première question ; contrôle en pilier 1 (5/35) ; red flag + action « Vérifier le cadre de vos forfaits jours ».
- Durée estimée (50-249, CSE) : autre convention ~10,7 min · Syntec sans forfait ~10,9 min (+1 écran) ·
  Syntec avec forfait ~11,2 min (+1 écran, +1 question).
