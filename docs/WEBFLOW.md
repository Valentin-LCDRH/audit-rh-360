# Intégration Webflow

Tout ce qu'il faut pour poser l'Audit RH 360° sur une page Webflow. Trois blocs à copier, aucune
autre manipulation.

> **URLs jsDelivr** — elles pointent vers le tag `v1.0.0` du dépôt
> `github.com/Valentin-LCDRH/audit-rh-360`. Elles ne répondent qu'une fois le dépôt **public** et
> le tag poussé. Vérification : ouvrir une URL dans un navigateur, elle doit afficher du code et
> non une page d'erreur jsDelivr.

---

## A. Head de la page

**Page settings → Custom Code → Inside `<head>` tag**

```html
<!-- Audit RH 360° — Le Club des RH · v1.0.0 -->
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Valentin-LCDRH/audit-rh-360@v1.0.0/dist/audit-rh.css">
<style>
  /* Hauteur de la navbar fixe du site : décale la sous-navigation collante du résultat et les
     ancres de section, pour qu'elles ne passent pas sous la barre. Ajuster à la valeur réelle.
     Mettre 0px si la navbar n'est pas fixe. */
  #arh-audit { --arh-sticky-offset: 80px; }
</style>
```

**Si la police Encode Sans n'est pas déjà chargée sur le site**, ajouter avant la feuille de style :

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Encode+Sans:wght@400;500;600;700&display=swap">
```

Si le site utilise déjà Encode Sans (Webflow → Project settings → Fonts), **ne pas l'ajouter** :
la police serait téléchargée deux fois.

### Pourquoi le CSS dans le Head

Chargé dans le Footer, la page afficherait le bloc non stylé pendant une fraction de seconde avant
de le réafficher mis en forme. Le CSS fait 21 Ko (5 Ko compressés) : le coût est négligeable, le
gain visuel immédiat.

---

## B. Footer de la page

**Page settings → Custom Code → Before `</body>` tag**

```html
<!-- Audit RH 360° — Le Club des RH · v1.0.0 -->
<script>
  /* Branchements de cette page. À renseigner, voir docs/INTEGRATIONS.md.
     Doit impérativement être déclaré AVANT le script ci-dessous. */
  window.ARH_INTEGRATIONS_CONFIG = {
    report_webhook_url: '',        /* ← Catch Hook Zapier. Vide = aucun formulaire affiché. */
    report_webhook_mode: 'auto',
    meeting_path: '',              /* ← chemin de la page de rendez-vous, ex. '/prendre-rendez-vous' */
    analytics: 'dataLayer'
  };
</script>
<script src="https://cdn.jsdelivr.net/gh/Valentin-LCDRH/audit-rh-360@v1.0.0/dist/audit-rh.min.js"></script>
```

### Pourquoi le Footer, et pas `defer` dans le Head

Le script lit le `<div id="arh-audit">` au moment où il s'exécute. Dans le Footer, le `<div>` existe
déjà : aucune condition de course possible. `defer` dans le Head fonctionnerait aussi, mais Webflow
place son propre runtime (`webflow.js`) en fin de page : rester dans le Footer, après lui, évite
toute question d'ordre.

**Un seul fichier JavaScript, volontairement.** La version d'origine chargeait 11 scripts dont
l'ordre devait être respecté au script près. Un seul fichier supprime cette classe d'erreur :
il n'y a plus d'ordre à respecter, et rien à oublier.

### Ordre de chargement, en une ligne

1. `window.ARH_INTEGRATIONS_CONFIG` (inline, Footer)
2. `audit-rh.min.js` (Footer)

C'est tout. Le CSS du Head n'a aucune dépendance d'ordre.

---

## C. HTML à poser dans la page

**Un seul élément**, à l'emplacement exact où l'audit doit apparaître.

Deux façons de le créer, au choix de l'intégrateur :

**Option 1 — Embed (le plus simple)**
Ajouter un élément *Embed* et y coller :

```html
<div id="arh-audit"></div>
```

**Option 2 — Div Block du Designer (recommandé si le bloc doit vivre dans la grille du site)**
Créer un *Div Block*, puis dans le panneau Settings (icône engrenage) :

| Réglage | Valeur |
|---|---|
| ID | `arh-audit` |
| Classe | aucune — le composant pose lui-même sa classe `arh` |

### Contraintes de structure

- **Un seul `#arh-audit` par page.** Un identifiant est unique ; deux blocs ne fonctionneraient pas.
- **Aucun style Webflow sur ce `<div>`** : ni largeur, ni padding, ni `overflow: hidden`, ni
  `display: flex`. Le composant gère sa propre largeur (760 px maximum, centré) et sa propre
  respiration. Un `overflow: hidden` sur un parent casserait la sous-navigation collante du résultat.
- Le conteneur parent doit laisser au moins **~360 px** de largeur utile sur mobile.
- Ne rien mettre dans le `<div>` : son contenu est remplacé au chargement.

### Page de recette (facultatif mais recommandé)

Dupliquer la page, la passer en **noindex**, et y utiliser à la place :

```html
<div id="arh-audit" data-arh-env="preprod"></div>
```

Cette page donne accès aux outils de recette (`?test=1`) : 8 profils préconfigurés qui ouvrent
directement un résultat, l'aperçu de l'email, le payload envoyé au CRM et les signaux commerciaux
internes. **Ces outils sont inertes sur une page de production**, même en ajoutant `?test=1` à l'URL :
c'est volontaire, ils exposent du vocabulaire commercial interne.

---

## D. Récapitulatif des ressources

| Fichier | Rôle | URL | Emplacement | Dépend de | Ordre |
|---|---|---|---|---|---|
| `audit-rh.css` | styles du bloc, entièrement préfixés `.arh` | `https://cdn.jsdelivr.net/gh/Valentin-LCDRH/audit-rh-360@v1.0.0/dist/audit-rh.css` | Head | — | indifférent |
| Encode Sans | police de la charte | `https://fonts.googleapis.com/css2?family=Encode+Sans:wght@400;500;600;700&display=swap` | Head | — | indifférent · **omettre si déjà sur le site** |
| `ARH_INTEGRATIONS_CONFIG` | branchements de la page | inline | Footer | — | **avant le script** |
| `audit-rh.min.js` | moteur + interface + configuration métier | `https://cdn.jsdelivr.net/gh/Valentin-LCDRH/audit-rh-360@v1.0.0/dist/audit-rh.min.js` | Footer | la config ci-dessus | **après elle** |
| `<div id="arh-audit">` | point de montage | — | corps de la page | — | — |

Poids : **130 Ko de JavaScript** (37 Ko compressés) et **21 Ko de CSS** (5 Ko compressés), servis
par jsDelivr avec compression et cache long. L'essentiel du poids est le contenu métier lui-même :
39 questions, leurs aides contextuelles, leurs recommandations et 29 conventions collectives.

Aucune autre dépendance externe : pas de jQuery, pas de framework, aucun appel réseau avant que le
visiteur ne demande son rapport.

---

## E. Paramètres à personnaliser

Seulement trois valeurs, toutes dans le code de la page Webflow. Rien à modifier dans le dépôt.

| Paramètre | Où | Valeur | Effet si laissé vide |
|---|---|---|---|
| `report_webhook_url` | Footer | URL du Catch Hook Zapier, ex. `https://hooks.zapier.com/hooks/catch/1234567/abcdefg/` | **Aucun formulaire affiché** : message neutre, aucune coordonnée collectée |
| `meeting_path` | Footer | chemin interne, ex. `/prendre-rendez-vous` | Le bouton « Échanger sur mon audit RH » n'est pas affiché |
| `--arh-sticky-offset` | Head | hauteur de la navbar fixe, ex. `80px` | `0px` : la sous-navigation du résultat peut passer sous la navbar |

`meeting_path` est un **chemin**, jamais une URL complète : l'URL est reconstruite sur le domaine
visité, donc la même configuration fonctionne sur le domaine de staging Webflow et en production.
Un domaine tiers est refusé par le composant.

Trois variables CSS supplémentaires sont disponibles si besoin, à surcharger sur `#arh-audit` :
`--arh-font` (police du bloc), `--arh-z` (plan de la modale, 10000 par défaut, à augmenter si la
navbar du site passe au-dessus), `--arh-sticky-offset` (ci-dessus).

---

## F. Recette après intégration

Sur la page publiée, dans l'ordre :

1. **Le bloc s'affiche**, titre « Faites le point sur votre organisation RH en quelques minutes ».
   Sinon : ouvrir la console. `[ARH] Point de montage #arh-audit absent` → l'ID du `<div>` est faux.
   Rien du tout → le script ne s'est pas chargé, vérifier l'URL jsDelivr.
2. **Parcourir l'audit en entier** (environ 5 minutes). Le compteur doit avancer et le bouton
   « Précédent » ramener à l'écran précédent sans perdre les réponses.
3. **Écran de résultat** : un score sur 100, les 8 piliers, au moins un bloc de restitution.
4. **Scroller** : la barre de navigation du résultat doit rester visible **sous** la navbar du site,
   jamais dessous. Sinon, ajuster `--arh-sticky-offset`.
5. **Cliquer une pastille** (« sujets à sécuriser », « axes à structurer ») : la section visée ne
   doit pas être masquée par la navbar.
6. **Formulaire** : envoyer avec un email invalide → message d'erreur. Puis avec un email valide →
   « Votre rapport est en route », et le Zap correspondant doit apparaître dans l'historique Zapier.
7. **Mobile (≤ 390 px)** : aucun défilement horizontal, tous les boutons atteignables au pouce.
8. **Console du navigateur** : aucune erreur.
9. **Recharger la page en cours d'audit** → « Vous avez un audit en cours · Reprendre mon audit ».
10. **Sur la page de production**, ajouter `?test=1` à l'URL → **aucun** panneau d'outils ne doit
    apparaître. S'il apparaît, l'attribut `data-arh-env="preprod"` a été laissé par erreur.

### Ce qui a déjà été vérifié automatiquement

Avant livraison, sur Chromium : parcours complet en 1280 px et en 390 px, formulaire et validation,
envoi réel vers un webhook simulé (POST de 62 Ko, champs à plat + `payload_json` + `report_html`),
comportement en cas d'erreur HTTP du webhook, double chargement du script, point de montage absent,
progression corrompue, étanchéité des styles face à une page qui a ses propres polices et boutons,
raccourcis clavier, cibles tactiles. 76 contrôles, reproductibles avec `node scripts/browser-check.js`.

Ce qui **n'a pas** pu être vérifié et reste à faire sur place : le rendu dans le gabarit Webflow
réel (navbar, grille, polices du site), le trajet Zapier → Pipedrive → Brevo de bout en bout, et le
comportement sur Safari iOS et Firefox.

---

## G. Dépannage

| Symptôme | Cause la plus probable |
|---|---|
| Bloc vide, rien dans la console | Script non chargé : URL jsDelivr fausse, tag inexistant ou dépôt privé |
| `[ARH] Point de montage #arh-audit absent` | ID du `<div>` erroné, ou Embed placé après le script |
| `[ARH] Modules manquants : …` | Fichier `audit-rh.min.js` tronqué ou partiellement chargé |
| `[ARH] Déjà initialisé sur cette page` | Le script est inséré deux fois (code de page **et** code du site). Le second est ignoré, mais il faut en retirer un |
| Le formulaire n'apparaît pas | `report_webhook_url` est vide — c'est le comportement prévu |
| La barre du résultat passe sous la navbar | `--arh-sticky-offset` absent ou trop petit |
| Le bloc n'a pas la bonne police | Encode Sans non chargée sur la page ; ajouter le lien Google Fonts du Head |
| Le bloc déborde ou est écrasé | Un parent Webflow impose une largeur, un `overflow` ou un `display: flex` |
| Les outils de test apparaissent en production | `data-arh-env="preprod"` oublié sur le `<div>` |

En cas de doute, la page `index.html` du dépôt reproduit l'intégration complète en local
(`npm run build && npm run serve`) : comparer son comportement à celui de la page Webflow isole
immédiatement ce qui vient du site.
