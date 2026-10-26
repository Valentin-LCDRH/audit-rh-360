#!/usr/bin/env node
/*!
 * Audit RH 360° — BUILD.
 *
 * Produit les fichiers servis par le CDN depuis les sources de src/ :
 *
 *   dist/audit-rh.css      feuille de style (chargée dans le Head Webflow)
 *   dist/audit-rh.js       bundle lisible, commenté (débogage, relecture)
 *   dist/audit-rh.min.js   bundle minifié, chargé par le site (Footer Webflow)
 *   dist/build-info.json   version, date, empreintes et tailles
 *
 * Deux objectifs, au-delà de la taille :
 *
 * 1. UN SEUL FICHIER JS : plus aucun ordre de chargement à respecter côté Webflow, donc plus de
 *    risque qu'un script manque ou arrive trop tôt.
 *
 * 2. CONFIGURATION NETTOYÉE : les fichiers de configuration contiennent beaucoup de champs qui ne
 *    servent qu'à la maintenance (sources juridiques, articles de loi, notes « à valider par un
 *    juriste », descriptions des règles de qualification commerciale). Ils ne sont jamais lus à
 *    l'exécution. Le build recharge les modules en Node et ne sérialise que les champs réellement
 *    utilisés : rien de tout cela ne part dans le navigateur du visiteur.
 *
 * Aucune dépendance de production. terser est une dépendance de développement.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

/* ------------------------------------------------------------------
 * 1. Configuration : champs conservés pour l'exécution
 * ------------------------------------------------------------------ */

/* legal-rules.js : le moteur ne lit que le statut, la date de relecture et le champ
   d'application. Tout le référentiel documentaire (texte de la règle, articles, sources,
   notes, LEGAL_VALIDATION_REQUIRED, LEGAL_WATCH) reste dans le dépôt. */
function runtimeLegal(L) {
  const rules = {};
  for (const id of Object.keys(L.RULES)) {
    const r = L.RULES[id];
    rules[id] = {
      id: r.id,
      status: r.status,
      legal_reviewed_at: r.legal_reviewed_at || null,
      applicability_condition: r.applicability_condition === undefined ? null : r.applicability_condition
    };
  }
  return { version: L.version, RULES: rules };
}

/* questions.js / ccn-modules.js : champs de traçabilité éditoriale non lus à l'exécution. */
const QUESTION_DROP = ['source', 'verified_at', 'risk_level', 'legal_flag', 'conditional_id'];

function stripQuestion(q) {
  const out = {};
  for (const k of Object.keys(q)) if (!QUESTION_DROP.includes(k)) out[k] = q[k];
  return out;
}

function runtimeQuestions(Q) {
  return {
    version: Q.version,
    ANSWER_SCALES: Q.ANSWER_SCALES,
    PILLARS: Q.PILLARS,
    CONTEXT: Q.CONTEXT,
    QUESTIONS: Q.QUESTIONS.map(stripQuestion)
  };
}

function runtimeModules(M) {
  const modules = {};
  for (const idcc of Object.keys(M.modules)) {
    const m = M.modules[idcc];
    modules[idcc] = {
      id: m.id,
      context_questions: m.context_questions || [],
      questions: (m.questions || []).map(stripQuestion),
      roadmap_groups: m.roadmap_groups || []
    };
  }
  return { version: M.version, modules };
}

/* ccn-list.js : le bloc `source` est de la traçabilité, pas de l'exécution. */
function runtimeCcnList(C) {
  return { version: C.version, special: C.special, entries: C.entries };
}

/* scoring.js : on retire la documentation de la grammaire, les énoncés de règles en clair et les
   descriptions des règles de qualification commerciale (vocabulaire interne). */
function runtimeRules(R) {
  const out = {};
  const drop = ['conditions', 'roadmap_sort', 'roadmap_action_fields', 'forbidden_wording'];
  for (const k of Object.keys(R)) if (!drop.includes(k)) out[k] = R[k];
  out.scoring = { display_rounding: R.scoring.display_rounding, min_questions_per_pillar: R.scoring.min_questions_per_pillar };
  out.roadmap_priorities = R.roadmap_priorities.map(p => {
    const o = { priority: p.priority, id: p.id, label: p.label };
    if (p.label_by_tone) o.label_by_tone = p.label_by_tone;
    return o;
  });
  out.lead_interest = {
    weak_pillar_below: R.lead_interest.weak_pillar_below,
    rules: R.lead_interest.rules.map(r => ({ tag: r.tag, when: r.when }))
  };
  out.payload = { contact: R.payload.contact, context: R.payload.context };
  out.analytics = { timing: R.analytics.timing };
  return out;
}

/* ------------------------------------------------------------------
 * 2. Assemblage
 * ------------------------------------------------------------------ */
const CODE_FILES = [
  'engine.js',          // moteur : fonctions pures
  'report-email.js',    // gabarit de l'email de rapport
  'integrations.js',    // envois (réels ou simulés)
  'dev/profiles.js',    // profils de recette (inertes hors data-arh-env="preprod")
  'app.js'              // interface, en dernier : lit tout ce qui précède
];

function loadConfig() {
  for (const f of ['config/questions.js', 'config/scoring.js', 'config/legal-rules.js',
    'config/ccn-modules.js', 'data/ccn-list.js']) {
    require(path.join(SRC, f));
  }
  return {
    ARH_QUESTIONS: runtimeQuestions(globalThis.ARH_QUESTIONS),
    ARH_RULES: runtimeRules(globalThis.ARH_RULES),
    ARH_LEGAL: runtimeLegal(globalThis.ARH_LEGAL),
    ARH_CCN_MODULES: runtimeModules(globalThis.ARH_CCN_MODULES),
    ARH_CCN_LIST: runtimeCcnList(globalThis.ARH_CCN_LIST)
  };
}

function configSource(cfg, pretty) {
  const space = pretty ? 2 : 0;
  const lines = Object.keys(cfg).map(k => '  w.' + k + ' = ' + JSON.stringify(cfg[k], null, space) + ';');
  return '/* Configuration métier, sérialisée depuis src/config et src/data par scripts/build.js.\n' +
    '   Les champs de traçabilité (sources juridiques, articles, notes de validation, descriptions\n' +
    '   des règles de qualification) ne sont pas repris : ils ne sont pas lus à l\'exécution. */\n' +
    '(function (w) {\n  \'use strict\';\n' + lines.join('\n') + '\n})(typeof window !== \'undefined\' ? window : globalThis);\n';
}

/* Pas de date dans la bannière : le contenu de dist/ doit dépendre uniquement des sources, pour
   que la CI puisse vérifier qu'il est à jour (`git diff --exit-code`). La date du build est dans
   dist/build-info.json, qui est exclu de cette comparaison. */
function banner(version, extra) {
  return '/*! Audit RH 360° — Le Club des RH · ' + version + (extra ? ' · ' + extra : '') +
    '\n *  Généré par scripts/build.js. Ne pas modifier à la main : voir le dépôt pour les sources. */\n';
}

function sha(buf) { return crypto.createHash('sha256').update(buf).digest('hex').slice(0, 16); }
function kb(n) { return (n / 1024).toFixed(1) + ' Ko'; }

async function main() {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const version = 'v' + pkg.version;
  fs.mkdirSync(DIST, { recursive: true });

  const cfg = loadConfig();
  const code = CODE_FILES.map(f => fs.readFileSync(path.join(SRC, f), 'utf8'));

  /* --- CSS --- */
  const css = fs.readFileSync(path.join(SRC, 'audit.css'), 'utf8');
  const cssOut = banner(version) + css;
  fs.writeFileSync(path.join(DIST, 'audit-rh.css'), cssOut);

  /* --- JS lisible --- */
  const readable = banner(version, 'bundle lisible') + '\n' + configSource(cfg, true) + '\n' + code.join('\n');
  fs.writeFileSync(path.join(DIST, 'audit-rh.js'), readable);

  /* --- JS minifié --- */
  let terser;
  try { terser = require('terser'); }
  catch (e) {
    console.error('\n  terser est absent. Lancez `npm install` avant `npm run build`.\n');
    process.exit(1);
  }
  const min = await terser.minify(
    { 'config.js': configSource(cfg, false), ...Object.fromEntries(CODE_FILES.map((f, i) => [f, code[i]])) },
    {
      ecma: 2017,
      compress: { passes: 2 },
      mangle: { toplevel: false },   // les globales ARH_* doivent rester lisibles
      format: { comments: false, preamble: banner(version, 'bundle minifié').trim() }
    }
  );
  if (min.error) throw min.error;
  fs.writeFileSync(path.join(DIST, 'audit-rh.min.js'), min.code + '\n');

  /* --- Empreintes --- */
  const files = {};
  for (const f of ['audit-rh.css', 'audit-rh.js', 'audit-rh.min.js']) {
    const buf = fs.readFileSync(path.join(DIST, f));
    files[f] = { bytes: buf.length, sha256_short: sha(buf) };
  }
  const info = {
    version: pkg.version,
    built_at: new Date().toISOString(),
    config_version: cfg.ARH_QUESTIONS.version,
    legal_rules_version: cfg.ARH_LEGAL.version,
    questions_count: cfg.ARH_QUESTIONS.QUESTIONS.length +
      Object.values(cfg.ARH_CCN_MODULES.modules).reduce((n, m) => n + m.questions.length, 0),
    files
  };
  fs.writeFileSync(path.join(DIST, 'build-info.json'), JSON.stringify(info, null, 2) + '\n');

  const srcBytes = code.reduce((n, c) => n + Buffer.byteLength(c), 0) +
    ['config/questions.js', 'config/scoring.js', 'config/legal-rules.js', 'config/ccn-modules.js', 'data/ccn-list.js']
      .reduce((n, f) => n + fs.statSync(path.join(SRC, f)).size, 0);

  console.log('Audit RH 360° ' + version + ' — build');
  console.log('  sources JS           ' + kb(srcBytes));
  console.log('  audit-rh.js          ' + kb(files['audit-rh.js'].bytes));
  console.log('  audit-rh.min.js      ' + kb(files['audit-rh.min.js'].bytes) +
    '  (-' + Math.round((1 - files['audit-rh.min.js'].bytes / srcBytes) * 100) + ' %)');
  console.log('  audit-rh.css         ' + kb(files['audit-rh.css'].bytes));
  console.log('  questions            ' + info.questions_count);
}

main().catch(e => { console.error(e); process.exit(1); });
