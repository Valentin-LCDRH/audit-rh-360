# Passation designer — Audit RH 360°

Point de départ : le dernier commit de `main`. Le **contenu est figé** (questions, réponses, textes de restitution,
règles) : la passe porte sur le visuel et l'ergonomie. Pendant la passe, personne d'autre ne modifie les fichiers
de style ou d'interface.

## Voir la maquette
- **En ligne (pré-production privée)** : lien transmis par Valentin. Ajouter `#test` à la fin de l'URL pour ouvrir
  les **Outils de test** (bouton en bas à droite) et charger directement un résultat.
- **En local** : à la racine du dépôt, `python3 -m http.server 8766`, puis <http://127.0.0.1:8766/#test>.
  Après une modification, recharger en vidant le cache (Cmd+Maj+R).

## Écrans et états à couvrir
| Écran | Comment l'atteindre |
|---|---|
| Accueil (+ bandeau « Reprendre mon audit ») | Ouvrir la page ; commencer un audit puis recharger pour le bandeau |
| Contexte : choix unique (avance automatique à 300 ms) | « Démarrer mon audit RH » |
| Contexte : recherche de convention collective (suggestions, convention sélectionnée, deux alternatives) | 4ᵉ écran du contexte ; taper « Syntec » ou « 1486 » |
| Question à situations A/B/C/D, question oui/non, aide « ? » | Questionnaire |
| Formulaire : erreurs de saisie, envoi en cours, échec d'envoi | Résultat › formulaire vide puis email invalide |
| Résultat « standard » (sujets à sécuriser, axes, piliers, points forts, premières actions) | Outils de test › profil 1 ou 2 |
| Résultat « très bon » (points forts en tête, pistes d'optimisation, aucune priorité) | Profil 4 |
| Score élevé + sujet à sécuriser | Profil 5 |
| Pilier « Non évalué » | Profil 6 (TPE sans CSE) |
| Convention collective : Syntec / Métallurgie | Profils 7 et 8 |
| Après envoi du formulaire + bloc « Échanger sur mon audit RH » + aperçu de l'email | Remplir le formulaire |
| Mobile (375 px) | Tous les écrans ci-dessus |

## Ce que vous pouvez modifier
- **`src/audit.css`** : tout le visuel. Les couleurs, rayons et ombres sont des variables en tête de fichier
  (`--arh-…`) ; toutes les classes sont préfixées `arh-` (le CSS cohabite avec celui du site Webflow : ne rien
  styler hors de ce préfixe).
- **Charte** : Encode Sans, violet `#5E17EB`, orange `#F19A3E` (DA du Club des RH).
- **Gabarit de l'email du rapport** : `src/mocks.js` › `buildReportEmail` (HTML compatible messagerie : tableaux
  et styles en ligne). Garder les 9 sections et leur ordre.
- **Page de pré-production** : `preprod/page.html`.

## À ne pas modifier sans validation
- `src/config/*` et `src/data/*` : questions, textes, seuils, règles juridiques, tags internes.
- `src/engine.js` (calculs) et la structure HTML produite par `src/app.js` : si un changement de structure est
  nécessaire (ordre des blocs, nouvel élément), le décrire et il sera intégré sans toucher au contenu.
- Les libellés : ils viennent de la configuration et sont validés (vocabulaire imposé : « À vérifier »,
  « À sécuriser », « À structurer », « Maîtrisé » ; jamais « non conforme »).

## Contraintes d'ergonomie déjà validées
- Une décision à la fois ; avance automatique uniquement sur les écrans à choix unique ; « ← Précédent » toujours accessible.
- Le résultat principal est gratuit et visible avant le formulaire ; le formulaire débloque l'approfondissement.
- Un seul appel à l'action commercial (« Échanger sur mon audit RH »).
- Accessibilité : contraste, focus visible au clavier, touches 1 à 9 pour répondre, `prefers-reduced-motion` respecté.

## Points ouverts à traiter pendant la passe
1. Sur le résultat, « sujets à sécuriser » (le constat) et « Vos premières actions » (l'action) peuvent sembler
   répétitifs : la distinction doit se lire immédiatement.
2. La page de résultat est longue sur mobile : hiérarchie et rythme à travailler.
3. Le gabarit de l'email Brevo est fonctionnel, pas encore travaillé visuellement.
4. Le bouton « Outils de test » n'existe qu'en test : il peut masquer du contenu sur mobile, sans importance en production.

## Rendre la main
Commit (ou archive) des fichiers modifiés, avec la liste des changements. Les tests (`scripts/test.sh`) doivent rester
au vert ; ils ne dépendent pas du CSS.
