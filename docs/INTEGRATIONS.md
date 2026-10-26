# Branchements — Zapier, Pipedrive, Brevo, GA4

L'audit ne parle à rien tout seul. Il envoie **une seule requête**, au moment où le visiteur demande
son rapport, vers un Catch Hook Zapier. Tout le reste (CRM, email) se décide dans le Zap.

```
Audit (navigateur)  ──POST──>  Catch Hook Zapier  ──>  Pipedrive (lead/deal)
                                                   └─>  Brevo (envoi du rapport)
```

Deux valeurs à renseigner, dans le code Footer de la page Webflow, jamais dans le dépôt :

```js
window.ARH_INTEGRATIONS_CONFIG = {
  report_webhook_url: 'https://hooks.zapier.com/hooks/catch/XXXXXXX/YYYYYYY/',
  report_webhook_mode: 'auto',
  meeting_path: '/prendre-rendez-vous',
  analytics: 'dataLayer'
};
```

Pourquoi pas dans le dépôt : ces valeurs diffèrent entre la page de recette et la production, et les
changer ne doit pas imposer un commit, une nouvelle version et une purge de cache CDN. Un Catch Hook
Zapier n'est pas un secret (URL publique en écriture seule), mais il n'a rien à faire dans un
fichier versionné et mis en cache mondialement.

**Tant que `report_webhook_url` est vide, la page de production n'affiche aucun formulaire** et ne
collecte aucune coordonnée : l'envoi n'aboutirait pas, et demander des données personnelles pour une
finalité qu'on ne peut pas honorer n'est pas défendable. La page de recette, elle, déroule le
parcours complet avec un envoi simulé.

---

## 1. Créer le Catch Hook

1. Zapier → **Create Zap** → déclencheur **Webhooks by Zapier** → **Catch Hook**.
2. Copier l'URL proposée dans `report_webhook_url`.
3. Publier la page Webflow, faire un audit complet de bout en bout, demander le rapport.
4. Revenir dans Zapier → **Test trigger** : la requête doit apparaître avec tous les champs.

C'est cette requête de test qui sert de modèle de champs pour toutes les étapes suivantes. Il faut
donc qu'elle soit **complète et représentative** : faire le test avec un contexte qui déclenche au
moins un sujet à sécuriser, sinon les champs correspondants seront vides et Zapier ne les proposera
pas dans le mappage.

### Forme de la requête

`POST`, corps `application/x-www-form-urlencoded`, environ **60 Ko**. Trois couches, volontairement
redondantes :

| Clé | Contenu | Usage |
|---|---|---|
| un champ par donnée | `email`, `global_score`, `compliance_score`… | **mappage direct dans Zapier**, sans aucune étape de code |
| `payload_json` | l'intégralité du payload en JSON | reconstruire ce que Zapier aplatit mal (listes, objets) |
| `report_subject` / `report_html` | l'email de rapport, déjà mis en forme | à passer tel quel à Brevo |

Les listes et les objets sont aussi sérialisés en JSON dans leur champ à plat : `red_flags` arrive
sous la forme `["Minima conventionnels"]`.

---

## 2. Champs reçus

Exemple réel, profil « PME industrielle Métallurgie » :

| Champ | Type | Exemple |
|---|---|---|
| `firstname` | texte | Camille |
| `lastname` | texte | Durand |
| `email` | texte | camille.durand@example.com |
| `company` | texte | Fonderies Durand |
| `respondent_role` | texte | `ceo` · `drh` · `daf` · `other` |
| `company_size` | texte | `1-10` · `11-49` · `50-249` · `250-999` · `1000+` |
| `has_cse` | texte | `yes` · `no` · `in_progress` · vide sous 11 salariés |
| `hr_organization` | texte | `hr_team` · `finance` · `leadership` · `external` · `other` |
| `hr_organization_other` | texte | texte libre si `hr_organization = other`, sinon vide |
| `collective_agreement_idcc` | texte | `3248`, ou vide |
| `collective_agreement_label` | texte | Convention collective nationale de la métallurgie |
| `collective_agreement_short_name` | texte | `Syntec`, `HCR`, ou vide |
| `collective_agreement_known` | texte | `known` · `unknown` · `none` |
| `forfait_jours` | texte | `yes` · `no` · `unknown`, uniquement en Syntec (IDCC 1486) |
| `global_score` | nombre | 70 |
| `compliance_score` | nombre | 74 |
| `payroll_admin_score` | nombre | 57 |
| `employee_relations_score` | nombre | 82 — vide si le pilier n'est pas évalué |
| `recruitment_score` | nombre | 67 |
| `development_score` | nombre | 71 |
| `compensation_score` | nombre | 55 |
| `management_qvct_score` | nombre | 77 |
| `hr_operations_data_score` | nombre | 67 |
| `red_flags_count` | nombre | 1 |
| `red_flags` | liste | `["Minima conventionnels"]` |
| `critical_issues_count` | nombre | 2 |
| `top_priorities` | liste | les 3 premières actions de la roadmap |
| `areas_to_structure` | liste | axes à structurer |
| `strengths` | liste | `["Relations sociales"]` |
| `lead_interest` | liste | **usage interne**, voir plus bas |
| `utm_source` · `utm_medium` · `utm_campaign` · `utm_content` | texte | `linkedin` · `post` · `audit_rh_q4` · `carrousel` |
| `audit_id` | texte | `arh_m2k1x_7f3a9` — identifiant unique de l'audit |
| `config_version` | texte | `0.2.0` — version du questionnaire |
| `legal_rules_version` | texte | `2026-09-18` — version du référentiel réglementaire |
| `completed_at` | texte | `2026-10-26T09:14:22.511Z` |
| `page_url` | texte | page d'où vient l'audit |
| `consent_scope` | texte | `audit_report_and_followup` |
| `method_version` | texte | `weighted-questions-v1` |
| `pillar_details` | liste | détail par pilier : score exact, nombre de questions posées et notées |
| `lead_signals` | liste | **usage interne** : chaque tag avec les mesures qui l'ont déclenché |
| `audit_metrics` | objet | durées, retours en arrière, changements de réponse |
| `answers_json` | texte (JSON) | **toutes** les réponses : question, réponse, score, poids, red flag |

`config_version` et `legal_rules_version` servent à relire un ancien lead : un score de mars ne se
compare pas à un score d'octobre si le questionnaire a changé entre-temps. Les conserver dans le CRM.

### `lead_interest` et `lead_signals` — internes, jamais exposés

`lead_interest` est une liste d'orientations commerciales calculées à partir des réponses :
`audit_rh`, `drh_externalise`, `orkest`, `recrutement`, `compensation`, `relations_sociales`,
`metallurgie_classification`, `metallurgie_minima`. Les règles sont dans
`src/config/scoring.js › lead_interest.rules`.

Ces valeurs **ne sont jamais affichées au visiteur ni envoyées dans l'email**. Elles ne doivent pas
non plus remonter dans GA4 : les événements analytics n'en transportent aucune.
`lead_signals` donne, pour chaque tag, les mesures qui l'ont déclenché — utile pour comprendre un
lead avant un appel, à garder dans une note interne Pipedrive.

> Ces tags sont calculés dans le navigateur : le vocabulaire est donc lisible dans le code servi au
> visiteur. Si cette exposition devient gênante, le calcul peut être déplacé dans le Zap : le payload
> contient déjà tout le nécessaire (`pillar_details`, `answers_json`, `red_flags`). C'est une
> évolution possible, pas un correctif urgent.

---

## 3. Zap recommandé

**Déclencheur** — Webhooks by Zapier · Catch Hook

**Étape 1 — Filtre anti-test**
Ne rien créer quand `email` contient `example.com`, `example.org` ou votre domaine de test. Sans ce
filtre, chaque recette crée un lead dans Pipedrive.

**Étape 2 — Pipedrive · Find or Create Person**
Recherche sur `email`. Création avec `firstname` + `lastname`, `company`.

**Étape 3 — Pipedrive · Create Lead** (ou Deal, selon le pipeline retenu)

| Champ Pipedrive | Valeur |
|---|---|
| Titre | `Audit RH 360° — {{company}} ({{global_score}}/100)` |
| Personne | résultat de l'étape 2 |
| Source | `utm_source`, ou « Audit RH 360° » si vide |

Champs personnalisés à créer dans Pipedrive (une fois) :
`global_score`, les 8 scores de pilier, `red_flags_count`, `company_size`, `respondent_role`,
`hr_organization`, `collective_agreement_label`, `audit_id`, `config_version`.

**Étape 4 — Pipedrive · Create Note**
Le détail lisible par le commercial avant son appel :

```
Audit RH 360° du {{completed_at}} — score {{global_score}}/100
Contexte : {{company_size}} salariés · {{hr_organization}} · {{collective_agreement_label}}
Sujets à sécuriser ({{red_flags_count}}) : {{red_flags}}
Priorités : {{top_priorities}}
Points forts : {{strengths}}
Orientation : {{lead_interest}}
Signaux : {{lead_signals}}
Audit : {{audit_id}} · questionnaire {{config_version}} · règles {{legal_rules_version}}
```

**Étape 5 — Brevo · Send Transactional Email**

| Champ | Valeur |
|---|---|
| Destinataire | `email` |
| Nom | `firstname` + `lastname` |
| Sujet | `report_subject` |
| Corps HTML | `report_html` ← **tel quel, sans gabarit Brevo autour** |
| Expéditeur | adresse d'expédition du Club des RH |

`report_html` est un document complet, déjà mis en forme, compatible messagerie (tableaux et styles
en ligne). L'envelopper dans un template Brevo produirait un double en-tête.

> **Le HTML est construit dans le navigateur du visiteur.** C'est ce qui permet au rapport de
> refléter exactement l'écran qu'il vient de voir, mais cela signifie qu'un visiteur techniquement
> averti pourrait en modifier le contenu avant l'envoi. Le risque est limité (il ne peut se l'envoyer
> qu'à lui-même), mais si vous envoyez un jour ce rapport à un tiers, reconstruisez-le dans Brevo à
> partir de `payload_json` plutôt que d'utiliser `report_html`.

**Étape 6 — Alerte interne** (facultatif)
Slack ou email vers l'équipe commerciale quand `red_flags_count` ≥ 2 ou `global_score` ≤ 40.

### Consentement

`consent_scope = audit_report_and_followup` : le visiteur a accepté de recevoir **son rapport** et
d'échanger sur **ses résultats**. Ce n'est pas un opt-in marketing. **Ne pas inscrire l'adresse à une
liste de newsletter ou de prospection depuis ce Zap** : cela demande un consentement distinct, à
recueillir séparément. La mention affichée sous le formulaire est dans
`src/config/scoring.js › lead_form.privacy_note`.

---

## 4. Détection des échecs d'envoi

`report_webhook_mode` règle ce que le visiteur voit quand l'envoi échoue :

| Valeur | Comportement |
|---|---|
| `auto` *(défaut)* | lit le statut HTTP. Erreur serveur → message d'erreur et possibilité de réessayer. Réponse illisible (proxy d'entreprise, extension) → nouvelle tentative en aveugle, message de succès : le lead n'est jamais perdu pour une raison technique côté visiteur |
| `cors` | strict : tout ce qui n'est pas un succès franc est signalé. Pratique en recette |
| `no-cors` | jamais de lecture du statut, toujours optimiste |

Sans ce réglage (comportement d'origine), un Zap en panne produisait un « Votre rapport est en
route » parfaitement rassurant pendant que le lead partait à la poubelle. Garder `auto`.

Surveillance recommandée : dans Zapier, activer les alertes d'erreur du Zap, et comparer
périodiquement le nombre d'événements GA4 `report_requested` au nombre d'exécutions du Zap. Un écart
durable signale un problème d'acheminement.

---

## 5. Analytics (GA4 via GTM)

Les événements partent dans `window.dataLayer` ; le conteneur GTM du site les récupère. **Aucun
identifiant à configurer côté audit.**

| Événement | Quand |
|---|---|
| `audit_view` | le bloc entre dans l'écran (une fois) |
| `audit_started` | clic sur « Démarrer mon audit RH » |
| `context_completed` | fin de la contextualisation |
| `pillar_completed` | fin de chaque pilier (+ durée du pilier) |
| `audit_completed` | premier affichage du résultat (+ durées, retours en arrière, changements de réponse) |
| `results_viewed` | affichage du résultat, une fois par visite |
| `report_requested` | rapport envoyé avec succès |
| `meeting_cta_clicked` | clic sur le bouton de rendez-vous |
| `audit_exit` | départ de la page en cours d'audit (dernière question atteinte) |

Propriétés transmises : `audit`, `source`, `campaign`, `company_size`, `global_score`,
`lowest_pillar`, `red_flags_count`, et les durées. **Aucune donnée personnelle, aucun tag
commercial interne.**

À déclarer dans GTM : un déclencheur « Custom Event » par nom d'événement, et une balise GA4 Event
par déclencheur. `audit_exit` et `pillar_completed` sont les deux plus utiles pour repérer où les
visiteurs abandonnent.

---

## 6. Page de rendez-vous

`meeting_path` est un **chemin**, jamais une URL complète :

```js
meeting_path: '/prendre-rendez-vous'
```

L'URL est reconstruite sur le domaine visité, donc la même configuration fonctionne sur le domaine
de staging Webflow et en production. Un domaine tiers est refusé par le composant. Pour une page
Calendly externe, créer une page Webflow de redirection et pointer sur elle.

Laissé vide, le bouton « Échanger sur mon audit RH » n'est pas affiché.
