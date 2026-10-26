/*!
 * Audit RH 360° — LISTE DES CONVENTIONS COLLECTIVES (sélecteur normalisé par IDCC).
 *
 * La présence d'une convention ici ne signifie PAS qu'elle a des règles spécifiques dans l'audit :
 * seules les conventions présentes dans ccn-modules.js en ont (V1 : IDCC 1486 uniquement).
 *
 * Champs : idcc (chaîne, sans zéros initiaux) · label (intitulé officiel, stocké dans
 * collective_agreement_label) · display (intitulé court affiché dans le sélecteur) ·
 * short_name (nom d'usage, stocké dans collective_agreement_short_name) · aliases (recherche).
 *
 * SOURCE (V1, liste de démarrage) : intitulés et IDCC vérifiés un par un le 2026-09-18 sur le Code du
 * travail numérique du Ministère du Travail (https://code.travail.gouv.fr, service de recherche des
 * conventions, lien vers la fiche KALI de Légifrance). Intitulés résumés par l'outil de lecture :
 * à re-contrôler au caractère près lors de l'import complet.
 * LISTE COMPLÈTE À IMPORTER : nomenclature officielle « Liste des conventions collectives et de leur
 * code IDCC » (Ministère du Travail, travail-emploi.gouv.fr › Conventions collectives : nomenclatures).
 * Le site officiel est protégé par un CAPTCHA : téléchargement manuel, procédure dans
 * docs/CCN-IMPORT.md (aucun script d'import automatique n'est fourni).
 */
(function (root) {
  'use strict';

  /* IDCC 1486 : intitulé repris de Légifrance (KALICONT000005635173). « Syntec » est un nom d'usage
     (signataire), absent des titres officiels ; « Cinov » est seulement un alias de recherche. */
  root.ARH_CCN_LIST = {
    version: '2026-09-18-seed',
    source: {
      label: 'Code du travail numérique (Ministère du Travail) — vérification IDCC par IDCC',
      url: 'https://code.travail.gouv.fr/outils/convention-collective',
      reference: 'https://travail-emploi.gouv.fr/dialogue-social/negociation-collective/article/conventions-collectives-nomenclatures',
      retrieved_at: '2026-09-18',
      complete: false
    },

    /* Alternatives explicites : valeurs distinctes, jamais converties en « pas de donnée ». */
    special: [
      { id: 'unknown', label: 'Je ne connais pas ma convention collective' },
      { id: 'none', label: 'Mon entreprise n\'applique pas de convention collective' }
    ],

    entries: [
      { idcc: '16', display: 'Transports routiers et activités auxiliaires du transport', label: 'Convention collective nationale des transports routiers et activités auxiliaires du transport du 21 décembre 1950', aliases: ['transport', 'logistique'] },
      { idcc: '44', display: 'Industries chimiques et connexes', label: 'Convention collective nationale des industries chimiques et connexes du 30 décembre 1952', aliases: ['chimie'] },
      { idcc: '86', display: 'Entreprises de la publicité et assimilées', label: 'Convention collective nationale de travail des cadres, techniciens et employés de la publicité française du 22 avril 1955', aliases: ['publicite', 'agence'] },
      { idcc: '573', display: 'Commerces de gros', label: 'Convention collective nationale des commerces de gros', aliases: ['grossiste', 'negoce'] },
      { idcc: '787', display: 'Cabinets d\'experts-comptables et de commissaires aux comptes', label: 'Convention collective nationale des cabinets d\'experts-comptables et de commissaires aux comptes', aliases: ['expertise comptable', 'comptable', 'cac'] },
      { idcc: '1090', display: 'Services de l\'automobile', label: 'Convention collective nationale du commerce et de la réparation de l\'automobile, du cycle et du motocycle et des activités connexes, ainsi que du contrôle technique automobile du 15 janvier 1981', aliases: ['automobile', 'garage', 'concession'] },
      { idcc: '1351', display: 'Entreprises de prévention et de sécurité', label: 'Convention collective nationale des entreprises de prévention et de sécurité du 15 février 1985', aliases: ['securite privee', 'gardiennage'] },
      { idcc: '1413', display: 'Travail temporaire — salariés permanents', label: 'Accord national du 23 janvier 1986 relatif aux salariés permanents des entreprises de travail temporaire', aliases: ['interim', 'ett'] },
      { idcc: '1483', display: 'Commerce de détail de l\'habillement et des articles textiles', label: 'Convention collective nationale du commerce de détail de l\'habillement et des articles textiles du 25 novembre 1987', aliases: ['habillement', 'pret a porter', 'textile'] },
      { idcc: '1486', display: 'Bureaux d\'études techniques, cabinets d\'ingénieurs-conseils et sociétés de conseils', short_name: 'Syntec', label: 'Convention collective nationale des bureaux d\'études techniques, des cabinets d\'ingénieurs-conseils et des sociétés de conseils du 15 décembre 1987 mise à jour par avenant n° 46 du 16 juillet 2021', aliases: ['syntec', 'cinov', 'bet', 'esn', 'ssii', 'conseil', 'ingenierie'] },
      { idcc: '1501', display: 'Restauration rapide', label: 'Convention collective nationale de la restauration rapide du 18 mars 1988', aliases: ['fast food'] },
      { idcc: '1516', display: 'Organismes de formation', label: 'Convention collective nationale des organismes de formation du 10 juin 1988', aliases: ['formation professionnelle'] },
      { idcc: '1527', display: 'Immobilier', label: 'Convention collective nationale de l\'immobilier, administrateurs de biens, sociétés immobilières, agents immobiliers du 9 septembre 1988', aliases: ['agence immobiliere', 'syndic'] },
      { idcc: '1596', display: 'Bâtiment — ouvriers (entreprises jusqu\'à 10 salariés)', label: 'Convention collective nationale concernant les ouvriers employés par les entreprises du bâtiment visées par le décret du 1er mars 1962 (c\'est-à-dire occupant jusqu\'à 10 salariés)', aliases: ['batiment', 'btp'] },
      { idcc: '1597', display: 'Bâtiment — ouvriers (entreprises de plus de 10 salariés)', label: 'Convention collective nationale des ouvriers employés par les entreprises du bâtiment non visées par le décret du 1er mars 1962 (c\'est-à-dire occupant plus de 10 salariés) du 7 mars 2018', aliases: ['batiment', 'btp'] },
      { idcc: '1672', display: 'Sociétés d\'assurances', label: 'Convention collective nationale des sociétés d\'assurances du 27 mai 1992', aliases: ['assurance'] },
      { idcc: '1979', display: 'Hôtels, cafés, restaurants (HCR)', short_name: 'HCR', label: 'Convention collective nationale des hôtels, cafés, restaurants (HCR) du 30 avril 1997', aliases: ['hcr', 'hotellerie', 'restauration', 'restaurant'] },
      { idcc: '1996', display: 'Pharmacie d\'officine', label: 'Convention collective nationale de la pharmacie d\'officine du 3 décembre 1997', aliases: ['pharmacie'] },
      { idcc: '2098', display: 'Prestataires de services dans le domaine du secteur tertiaire', label: 'Convention collective nationale du personnel des prestataires de services dans le domaine du secteur tertiaire du 13 août 1999', aliases: ['centre d\'appels', 'tertiaire'] },
      { idcc: '2120', display: 'Banque', label: 'Convention collective nationale de la banque du 10 janvier 2000', aliases: ['banque', 'bancaire'] },
      { idcc: '2148', display: 'Télécommunications', label: 'Convention collective nationale des télécommunications du 26 avril 2000', aliases: ['telecom'] },
      { idcc: '2156', display: 'Grands magasins et magasins populaires', label: 'Convention collective nationale des grands magasins et des magasins populaires du 30 juin 2000', aliases: ['grand magasin'] },
      { idcc: '2216', display: 'Commerce de détail et de gros à prédominance alimentaire', label: 'Convention collective nationale du commerce de détail et de gros à prédominance alimentaire du 12 juillet 2001', aliases: ['grande distribution', 'supermarche', 'alimentaire'] },
      { idcc: '2264', display: 'Hospitalisation privée', label: 'Convention collective nationale de l\'hospitalisation privée', aliases: ['clinique', 'ehpad prive'] },
      { idcc: '2332', display: 'Entreprises d\'architecture', label: 'Convention collective nationale des entreprises d\'architecture du 27 février 2003', aliases: ['architecte'] },
      { idcc: '2941', display: 'Aide, accompagnement, soins et services à domicile (BAD)', label: 'Convention collective nationale de la branche de l\'aide, de l\'accompagnement, des soins et des services à domicile du 21 mai 2010', aliases: ['aide a domicile', 'bad', 'services a la personne'] },
      { idcc: '3043', display: 'Entreprises de propreté et services associés', label: 'Convention collective nationale des entreprises de propreté et services associés du 26 juillet 2011', aliases: ['proprete', 'nettoyage'] },
      { idcc: '3248', display: 'Métallurgie', label: 'Convention collective nationale de la métallurgie', aliases: ['metallurgie', 'uimm', 'industrie'] },
      { idcc: '3253', display: 'Salariés des cabinets d\'avocats', label: 'Convention collective nationale des salariés des cabinets d\'avocats du 21 juin 2024', aliases: ['avocat', 'cabinet d\'avocats'] }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
