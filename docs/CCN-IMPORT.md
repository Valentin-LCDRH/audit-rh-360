# Conventions collectives — enrichir le sélecteur

`src/data/ccn-list.js` contient les conventions proposées dans le sélecteur. La V1 en compte 29,
choisies pour couvrir les secteurs les plus représentés, et vérifiées une par une le 18/09/2026 sur
le Code du travail numérique.

**Être dans cette liste ne veut pas dire avoir des règles.** Le sélecteur sert à qualifier le lead
et à mémoriser la convention appliquée. Seules les conventions présentes dans
`src/config/ccn-modules.js` déclenchent des questions spécifiques — en V1, Syntec (IDCC 1486) et
Métallurgie (IDCC 3248).

## Ajouter une convention au sélecteur

```js
{ idcc: '2511', display: 'Sport', short_name: null,
  label: 'Convention collective nationale du sport du 7 juillet 2005',
  aliases: ['sport', 'club sportif'] }
```

| Champ | Règle |
|---|---|
| `idcc` | chaîne, sans zéro initial (`'573'`, pas `'0573'`). C'est la clé de déclenchement des modules |
| `label` | **intitulé officiel au caractère près**, repris de Légifrance. C'est lui qui est stocké dans le CRM et affiché dans le rapport |
| `display` | intitulé court affiché dans le sélecteur |
| `short_name` | nom d'usage s'il existe et seulement s'il existe (`Syntec`, `HCR`). Un nom d'usage n'est pas un intitulé officiel |
| `aliases` | termes de recherche, sans accent et en minuscules — c'est ce qui permet de trouver la convention en tapant un mot courant |

Puis `npm run validate && npm test && npm run build`.

La recherche tolère déjà les accents, la casse, les mots vides (« convention », « nationale »,
« ccn », « idcc »), les zéros initiaux et la recherche par numéro. Inutile de les prévoir dans
`aliases` : n'y mettre que les mots que quelqu'un taperait spontanément.

## Importer la liste complète

La nomenclature officielle (plus de 400 IDCC) est publiée par le Ministère du Travail :
travail-emploi.gouv.fr › Conventions collectives : nomenclatures. **Le téléchargement est protégé
par un CAPTCHA** : il doit être fait à la main, aucun script d'import automatique n'est fourni et
il ne faut pas en écrire un.

Procédure :

1. Télécharger le fichier de nomenclature depuis le site du Ministère.
2. En extraire les colonnes IDCC et intitulé.
3. Générer les entrées `{ idcc, label }`, retirer les zéros initiaux.
4. Compléter `display` et `aliases` à la main pour les conventions les plus recherchées. Une entrée
   sans `display` ni `aliases` reste trouvable par son numéro et par les mots de son intitulé.
5. Mettre à jour `version`, `source.retrieved_at` et passer `source.complete` à `true`.
6. `npm run validate && npm test && npm run build`.

Le validateur refuse les doublons d'IDCC, les zéros initiaux et les intitulés vides.

## Ajouter un module conventionnel

Un module ajoute 1 à 2 contrôles réellement discriminants pour une convention — pas une checklist.
Dans `src/config/ccn-modules.js`, sous la clé de l'IDCC :

- `context_questions` : questions posées juste après le choix de la convention, pour déterminer si
  le contrôle s'applique. Elles ne comptent **jamais** dans le score, et leur `id` doit être déclaré
  dans `scoring.js › conditions.fields`.
- `questions` : même format que `questions.js`. Leur `applicability` **doit** imposer l'IDCC du
  module (le validateur le vérifie).
- `roadmap_groups` *(facultatif)* : fusionne plusieurs contrôles liés en une seule action de
  roadmap quand ils ressortent ensemble. Les constats restent affichés séparément.

Toute règle réglementaire citée doit exister dans `legal-rules.js`, avec sa source officielle et sa
date de lecture. Le validateur refuse une référence à une règle inexistante.

Ni le moteur, ni l'interface, ni le scoring n'ont à être modifiés pour ajouter un module.

## Avant de mettre un module en production

Le périmètre V1 est figé (Syntec, Métallurgie) et les deux modules portent des points d'interprétation
listés dans `legal-rules.js › LEGAL_VALIDATION_REQUIRED` : ils sont à faire valider par un juriste.
Une troisième convention ne s'ajoute pas sans la même démarche — lecture sur source officielle,
datation, puis relecture juridique.
