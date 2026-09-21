# Branchements — GA4/GTM, Zapier → Pipedrive + Brevo, CTA de rendez-vous

État : **préparés, non branchés**. Tant que `src/config/integrations.js` est vide, l'envoi du rapport et le CTA
sont simulés (l'interface l'indique). La pré-production privée (claude.ai) bloque tout appel externe : la
validation réelle des branchements se fait sur le staging Webflow (gate 3).

## 1. GA4 via GTM (conteneur déjà présent sur le site)
Les événements sont poussés dans `window.dataLayer` (aucune donnée personnelle, aucun tag commercial interne).

| Événement | Quand | Paramètres |
|---|---|---|
| `audit_view` | Audit visible à 25 % (1×) | `source`, `campaign` |
| `audit_started` | Clic « Démarrer mon audit RH » | idem |
| `context_completed` | Fin de la contextualisation | + `company_size`, `hr_organization`, `respondent_role` |
| `pillar_completed` | Fin de chaque pilier | + `pillar`, `pillar_duration_seconds` |
| `audit_completed` | Premier affichage du résultat (1× par audit) | + `global_score`, `lowest_pillar`, `red_flags_count`, `audit_duration_seconds`, `questionnaire_duration_seconds`, `pillar_duration_seconds` (objet par pilier), `audit_resumed`, `back_count`, `answer_changes` |
| `results_viewed` | Affichage du résultat (1× par visite) | `global_score`, `lowest_pillar`, `red_flags_count` |
| `report_requested` | Rapport demandé | idem |
| `meeting_cta_clicked` | Clic « Échanger sur mon audit RH » | idem |
| `audit_exit` | Page quittée en cours d'audit | `step`, `last_question_id`, `last_pillar`, `question_index`, `questions_count`, `questionnaire_duration_seconds` |

Dans GTM (action manuelle) :
1. Déclencheur *Événement personnalisé*, regex :
   `^(audit_view|audit_started|context_completed|pillar_completed|audit_completed|results_viewed|report_requested|meeting_cta_clicked|audit_exit)$`
2. Variables *Couche de données* pour chaque paramètre ; pour la durée par pilier, notation pointée
   (`pillar_duration_seconds.compliance`, `…payroll_admin`, etc.).
3. Balise *GA4 – Événement*, nom `{{Event}}`, paramètres mappés.
4. GA4 : déclarer `company_size`, `lowest_pillar`, `pillar`, `last_pillar`, `source` en dimensions ;
   `global_score`, `red_flags_count`, les durées, `back_count`, `answer_changes` en métriques.
5. Entonnoir : `audit_view` → `audit_started` → `audit_completed` → `results_viewed` → `report_requested` → `meeting_cta_clicked`.

## 2. Zapier (déclencheur commun)
- **Trigger** : *Webhooks by Zapier → Catch Hook*. Coller l'URL dans `report_webhook_url` (integrations.js).
- **Payload** (POST form-encoded, une seule requête après « Recevoir mon rapport ») :
  - tous les champs à plat (liste exacte : `ARH_RULES.payload`), les objets en JSON ;
  - `payload_json` : le payload complet ; `answers_json` : toutes les réponses ;
  - `report_subject` + `report_html` : l'email du rapport, prêt pour Brevo.
- Champs principaux : `firstname`, `lastname`, `email`, `company` · `respondent_role`, `company_size`, `has_cse`,
  `hr_organization`, `hr_organization_other`, `collective_agreement_idcc`, `collective_agreement_label`, `collective_agreement_short_name`,
  `collective_agreement_known`, `forfait_jours` · `global_score` + 8 scores de pilier · `red_flags_count`,
  `red_flags`, `critical_issues_count` · `top_priorities`, `areas_to_structure`, `strengths` · `lead_interest`,
  `lead_signals` · `utm_*` · `audit_id`, `completed_at`, `page_url`, `config_version`, `legal_rules_version`,
  `method_version`, `consent_scope`, `audit_metrics`.

## 3. Pipedrive (action Zapier)
1. *Find or Create Organization* : nom = `company`.
2. *Find or Create Person* : `firstname` + `lastname`, email = `email`, organisation liée.
3. *Create Lead* (ou *Deal* selon votre pipeline) : titre `Audit RH 360° — {{company}}`.
   Champs personnalisés à créer une fois dans Pipedrive : score global, 8 scores de pilier, nb de sujets à
   sécuriser, `lead_interest` (texte ou multi-options), IDCC, effectif, organisation RH, UTM source/campagne,
   `audit_id`.
4. *Create Note* sur le lead :
   ```
   Audit RH 360° ({{audit_id}}) — {{global_score}}/100 — {{company_size}} — IDCC {{collective_agreement_idcc}}
   Sujets à sécuriser ({{red_flags_count}}) : {{red_flags}}
   Priorités : {{top_priorities}}
   Axes à structurer : {{areas_to_structure}}
   Points forts : {{strengths}}
   Signaux internes : {{lead_interest}}
   Source : {{utm_source}} / {{utm_medium}} / {{utm_campaign}}
   ```

## 4. Brevo (action Zapier)
- *Brevo → Send Transactional Email* : destinataire `email` (nom `firstname lastname`), sujet `report_subject`,
  contenu HTML `report_html`, expéditeur Le Club des RH.
- **Ne pas** ajouter le contact à une liste newsletter / prospection (`consent_scope = audit_report_and_followup`) :
  l'opt-in marketing sera traité séparément.

## 5. CTA « Échanger sur mon audit RH »
Renseigner `meeting_path` (ex. `/client-contact`) dans integrations.js : l'URL est reconstruite sur le domaine visité
(staging ou production), comme pour le simulateur RPO. Vide = CTA simulé. Le même lien est utilisé dans l'email.

## Limite connue
Le payload (dont `lead_interest`) transite par le navigateur de l'utilisateur vers Zapier : il n'est pas affiché,
mais reste techniquement inspectable. Pour le masquer totalement, calculer les tags côté serveur (Zapier Code),
à décider avant l'ouverture publique.
