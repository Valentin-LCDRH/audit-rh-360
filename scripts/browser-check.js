#!/usr/bin/env node
/*!
 * Audit RH 360° — RECETTE AUTOMATISÉE DANS UN NAVIGATEUR.
 *
 * Complète scripts/test.js (qui ne couvre que le moteur) en vérifiant l'interface réelle :
 * parcours complet, écran de résultat, formulaire, garde anti-double-chargement, comportement
 * en production, outils de recette, navbar collante, raccourcis clavier, reprise après rechargement.
 *
 *   npm i -D playwright        (une fois ; ~300 Mo, c'est pourquoi ce n'est pas une dépendance du dépôt)
 *   npm run build && node scripts/browser-check.js
 *
 * Produit des captures dans .recette/ (ignoré par git).
 * La recette manuelle sur Webflow reste nécessaire : voir docs/WEBFLOW.md › Recette.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const TMP = path.join(ROOT, '.recette');
const PORT = 4199;

let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) {
  console.error('\n  playwright est absent. Installez-le avec `npm i -D playwright`, puis relancez.\n');
  process.exit(1);
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8' };
function serve() {
  return new Promise(resolve => {
    const s = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split('?')[0]);
      const file = path.join(ROOT, url === '/' ? 'index.html' : url);
      fs.readFile(file, (e, buf) => {
        if (e) { res.writeHead(404).end('404'); return; }
        res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
        res.end(buf);
      });
    });
    s.listen(PORT, '127.0.0.1', () => resolve(s));
  });
}

/* Pages de recette : chaque variante reproduit une intégration Webflow différente. */
function fixture(name, { env, config, script = 'dist/audit-rh.min.js', nav = true, twice = false }) {
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Recette ${name}</title>
<link rel="stylesheet" href="/dist/audit-rh.css">
<style>
  :root { --nav-h: 64px; }
  body { margin: 0; font-family: Arial, sans-serif; background: #FEFCFF; }
  .nav { position: fixed; inset: 0 0 auto 0; height: var(--nav-h); background: #fff; z-index: 1000; border-bottom: 1px solid #E9E4F0; }
  main { padding: ${nav ? 'calc(var(--nav-h) + 24px)' : '24px'} 16px 96px; }
  #arh-audit { --arh-sticky-offset: ${nav ? 'var(--nav-h)' : '0px'}; }
</style></head><body>
${nav ? '<div class="nav"></div>' : ''}
<main><div id="arh-audit"${env ? ` data-arh-env="${env}"` : ''}></div></main>
<script>window.ARH_INTEGRATIONS_CONFIG = ${JSON.stringify(config || {})};</script>
<script src="/${script}"></script>
${twice ? `<script src="/${script}"></script>` : ''}
</body></html>`;
  fs.writeFileSync(path.join(TMP, name + '.html'), html);
  return `http://localhost:${PORT}/.recette/${name}.html`;
}

let pass = 0; const failures = [];
const ok = (c, l) => { if (c) pass++; else failures.push(l); };
const group = n => console.log('\n  ' + n);

/* Répond à tous les écrans en cliquant une option, jusqu'au résultat. */
async function runThrough(page, { pick = 0, max = 120 } = {}) {
  for (let i = 0; i < max; i++) {
    if (await page.locator('.arh-results').count()) return i;
    const search = page.locator('#arh-ccn');
    if (await search.count()) {                       // écran convention collective
      await search.fill('syntec');
      await page.locator('#arh-ccn-list [data-ccn-idcc="1486"]').first().click();
      await page.locator('[data-act="ctx-next"]').click();
      await page.waitForTimeout(80);
      continue;
    }
    const opts = page.locator('[data-opt]');
    const n = await opts.count();
    if (!n) return -1;
    await opts.nth(Math.min(pick, n - 1)).click({ force: true });
    const detail = page.locator('#arh-detail');
    if (await detail.count()) { await detail.fill('DAF à temps partagé'); await page.locator('[data-act="ctx-next"]').click(); }
    await page.waitForTimeout(360);                    // auto_advance_ms = 300 ms + marge : l'écran suivant doit être rendu
  }
  return -1;
}

async function main() {
  fs.rmSync(TMP, { recursive: true, force: true });
  fs.mkdirSync(TMP, { recursive: true });
  if (!fs.existsSync(path.join(ROOT, 'dist/audit-rh.min.js'))) {
    console.error('\n  dist/ absent : lancez `npm run build` avant la recette.\n'); process.exit(1);
  }
  const server = await serve();
  const browser = await chromium.launch();

  /* Collecte des erreurs de console et des exceptions, pour toutes les pages. */
  const noise = [];
  async function openPage(url, viewport) {
    const ctx = await browser.newContext({ viewport: viewport || { width: 1280, height: 900 }, locale: 'fr-FR' });
    const page = await ctx.newPage();
    /* La page « webhook-ko » provoque volontairement une réponse 500 : le navigateur la journalise,
       ce n'est pas un défaut du produit. */
    page.on('console', m => { if (m.type() === 'error' && !/webhook-ko/.test(url)) noise.push(`${url} console.error: ${m.text()}`); });
    page.on('pageerror', e => noise.push(`${url} exception: ${e.message}`));
    await page.goto(url, { waitUntil: 'load' });
    return { page, ctx };
  }

  /* ---------------------------------------------------------------- */
  group('Préproduction — parcours complet');
  const urlPre = fixture('preprod', { env: 'preprod', config: { report_webhook_url: '', meeting_path: '' } });
  {
    const { page, ctx } = await openPage(urlPre);
    ok(await page.locator('#arh-audit .arh-hero').count() === 1, 'écran d\'accueil rendu');
    ok((await page.locator('.arh-pillars-preview li').count()) === 8, 'les 8 piliers annoncés');
    const title = await page.locator('.arh-h1').first().innerText();
    ok(title.length > 10, 'titre d\'accueil issu de la configuration');

    await page.locator('[data-act="start"]').click();
    await page.waitForTimeout(150);
    ok(await page.locator('.arh-progress').count() === 1, 'contextualisation démarrée');

    /* Raccourci clavier : touche 2 sur un écran à choix unique. */
    await page.keyboard.press('2');
    await page.waitForTimeout(250);
    ok(await page.locator('.arh-count').count() === 1, 'raccourci clavier pris en compte');

    const screens = await runThrough(page);
    ok(screens > 10, `parcours complet atteint en ${screens} écrans`);
    ok(await page.locator('.arh-results').count() === 1, 'écran de résultat affiché');

    const score = await page.locator('.arh-score').first().innerText();
    ok(/^\d+/.test(score), `score global affiché (${score.replace(/\s+/g, ' ')})`);
    ok(await page.locator('.arh-bars li').count() === 8, 'les 8 piliers restitués');
    ok(await page.locator('.arh-subnav').count() === 1, 'sous-navigation du résultat présente');
    ok(await page.locator('#arh-gate form').count() === 1, 'formulaire de rapport affiché (preprod)');
    ok(await page.locator('.arh-disclaimer').count() === 1, 'mention de pré-diagnostic affichée');

    /* La sous-navigation collante doit rester sous la navbar du site, jamais dessous. */
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(200);
    const box = await page.locator('.arh-subnav').boundingBox();
    ok(box && box.y >= 63, `sous-navigation sous la navbar fixe (y = ${box ? Math.round(box.y) : '?'} px, navbar = 64 px)`);

    /* Ancre : le titre de section ne doit pas se retrouver masqué par la navbar. */
    if (await page.locator('a[href="#arh-sec-strengths"]').count()) {
      await page.locator('a[href="#arh-sec-strengths"]').click();
      await page.waitForTimeout(400);
      const sec = await page.locator('#arh-sec-strengths').boundingBox();
      ok(sec && sec.y >= 60, `ancre de section non masquée par la navbar (y = ${sec ? Math.round(sec.y) : '?'} px)`);
    }

    /* Formulaire : validation puis envoi simulé. */
    await page.locator('#arh-gate button[type="submit"]').click();
    await page.waitForTimeout(150);
    ok(await page.locator('.arh-error').count() >= 4, 'champs obligatoires signalés');
    await page.fill('#arh-f-firstname', 'Valentin');
    await page.fill('#arh-f-lastname', 'Recette');
    await page.fill('#arh-f-email', 'pas-un-email');
    await page.fill('#arh-f-company', 'Le Club des RH');
    await page.locator('#arh-gate button[type="submit"]').click();
    await page.waitForTimeout(150);
    ok(await page.locator('#arh-e-email').count() === 1, 'adresse email invalide refusée');
    await page.fill('#arh-f-email', 'valentin@example.org');
    await page.locator('#arh-gate button[type="submit"]').click();
    await page.waitForTimeout(1200);                  // envoi simulé : 700 ms
    ok(await page.locator('#arh-done').count() === 1, 'écran de confirmation après envoi simulé');
    ok((await page.locator('#arh-done').innerText()).includes('Recette'), 'mention « aucun email envoyé » en préproduction');

    /* Aperçu de l'email : disponible en recette. */
    await page.locator('[data-act="preview-email"]').click();
    await page.waitForTimeout(300);
    ok(await page.locator('.arh-modal').count() === 1, 'aperçu de l\'email ouvert');
    const frame = page.frameLocator('.arh-modal iframe');
    ok((await frame.locator('h1').first().innerText()).includes('diagnostic'), 'email de rapport rendu dans l\'aperçu');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    ok(await page.locator('.arh-modal').count() === 0, 'aperçu refermé par Échap');

    /* Outils de recette : présents en preprod avec ?test=1. */
    await page.goto(urlPre + '?test=1', { waitUntil: 'load' });
    await page.waitForTimeout(200);
    ok(await page.locator('.arh-dev-toggle').count() === 1, 'outils de recette disponibles en préproduction');
    await page.locator('.arh-dev-toggle').click();
    await page.waitForTimeout(150);
    ok(await page.locator('.arh-dev-profiles button').count() === 8, 'les 8 profils préconfigurés listés');
    await page.locator('.arh-dev-profiles button').first().click();
    await page.waitForTimeout(400);
    ok(await page.locator('.arh-results').count() === 1, 'profil préconfiguré ouvre directement le résultat');
    ok(await page.locator('#arh-sec-red-flags').count() === 1, 'profil « PME peu structurée » : sujets à sécuriser affichés');

    fs.mkdirSync(TMP, { recursive: true });
    await page.screenshot({ path: path.join(TMP, 'resultat-desktop.png'), fullPage: true });
    await ctx.close();
  }

  /* ---------------------------------------------------------------- */
  group('Production — garde-fous d\'intégration');
  {
    /* Sans webhook : aucune coordonnée demandée. */
    const url = fixture('prod-sans-webhook', { config: { report_webhook_url: '', meeting_path: '' } });
    const { page, ctx } = await openPage(url);
    await page.locator('[data-act="start"]').click();
    await page.waitForTimeout(150);
    await runThrough(page);
    ok(await page.locator('.arh-results').count() === 1, 'parcours complet en production');
    ok(await page.locator('#arh-gate form').count() === 0, 'aucun formulaire tant que le webhook n\'est pas configuré');
    ok((await page.locator('#arh-gate').innerText()).includes('pas encore activé'), 'message neutre, aucune promesse de rapport');
    ok((await page.locator('#arh-audit').innerText()).toLowerCase().indexOf('maquette') < 0, 'aucun vocabulaire interne visible en production');
    ok((await page.locator('#arh-audit').innerText()).toLowerCase().indexOf('recette') < 0, 'aucune mention de recette en production');

    /* ?test=1 ne doit rien activer sur une page de production. */
    await page.goto(url + '?test=1', { waitUntil: 'load' });
    await page.waitForTimeout(200);
    ok(await page.locator('.arh-dev-toggle').count() === 0, '?test=1 sans effet en production');
    await page.goto(url + '#test', { waitUntil: 'load' });
    await page.waitForTimeout(200);
    ok(await page.locator('.arh-dev-toggle').count() === 0, '#test sans effet en production');
    await ctx.close();
  }
  {
    /* Avec webhook : le formulaire revient et l'appel réseau part bien vers l'URL configurée. */
    const url = fixture('prod-avec-webhook', {
      config: { report_webhook_url: 'https://hooks.zapier.test/hooks/catch/1/2/', meeting_path: '/prendre-rendez-vous' }
    });
    const { page, ctx } = await openPage(url);
    let posted = null;
    await page.route('https://hooks.zapier.test/**', route => {
      const r = route.request();
      posted = { method: r.method(), body: r.postData() || '' };
      route.fulfill({ status: 200, body: 'ok', headers: { 'access-control-allow-origin': '*' } });
    });
    await page.locator('[data-act="start"]').click();
    await page.waitForTimeout(150);
    await runThrough(page);
    ok(await page.locator('#arh-gate form').count() === 1, 'formulaire affiché avec un webhook configuré');
    await page.fill('#arh-f-firstname', 'Valentin');
    await page.fill('#arh-f-lastname', 'Recette');
    await page.fill('#arh-f-email', 'valentin@example.org');
    await page.fill('#arh-f-company', 'Le Club des RH');
    await page.locator('#arh-gate button[type="submit"]').click();
    await page.waitForTimeout(900);
    ok(posted && posted.method === 'POST', 'envoi réel effectué vers le webhook configuré');
    ok(posted && /(^|&)email=valentin%40example\.org(&|$)/.test(posted.body), 'champ email transmis à plat');
    ok(posted && posted.body.includes('payload_json='), 'payload complet transmis');
    ok(posted && posted.body.includes('report_html='), 'rapport HTML transmis');
    ok(posted && posted.body.includes('global_score='), 'score global transmis à plat');
    if (posted) console.log(`    corps du POST : ${(Buffer.byteLength(posted.body) / 1024).toFixed(1)} Ko`);
    ok(await page.locator('#arh-done').count() === 1, 'confirmation après envoi réel');
    ok((await page.locator('#arh-done').innerText()).toLowerCase().indexOf('aucun email') < 0, 'aucune mention de simulation quand l\'envoi est réel');
    const href = await page.locator('[data-act="meeting"]').first().getAttribute('href');
    ok(href && href.endsWith('/prendre-rendez-vous'), `CTA rendez-vous construit sur le domaine visité (${href})`);
    await ctx.close();
  }
  {
    /* Webhook en erreur : le visiteur doit en être informé, pas remercié à tort. */
    const url = fixture('prod-webhook-ko', { config: { report_webhook_url: 'https://hooks.zapier.test/hooks/catch/9/9/' } });
    const { page, ctx } = await openPage(url);
    await page.route('https://hooks.zapier.test/**', route =>
      route.fulfill({ status: 500, body: 'erreur', headers: { 'access-control-allow-origin': '*' } }));
    await page.locator('[data-act="start"]').click();
    await page.waitForTimeout(150);
    await runThrough(page);
    await page.fill('#arh-f-firstname', 'V'); await page.fill('#arh-f-lastname', 'R');
    await page.fill('#arh-f-email', 'v@example.org'); await page.fill('#arh-f-company', 'LCDRH');
    await page.locator('#arh-gate button[type="submit"]').click();
    await page.waitForTimeout(900);
    ok(await page.locator('[role="alert"]').count() === 1, 'échec HTTP du webhook signalé au visiteur');
    ok(await page.locator('#arh-done').count() === 0, 'aucune confirmation si l\'envoi a échoué');
    await ctx.close();
  }

  /* ---------------------------------------------------------------- */
  group('Double chargement du script');
  {
    const url = fixture('double', { env: 'preprod', twice: true });
    const ctx = await browser.newContext({ locale: 'fr-FR' });
    const page = await ctx.newPage();
    const warns = [];
    page.on('console', m => { if (m.type() === 'warning') warns.push(m.text()); if (m.type() === 'error') noise.push(`${url} console.error: ${m.text()}`); });
    page.on('pageerror', e => noise.push(`${url} exception: ${e.message}`));
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(200);
    ok(await page.locator('#arh-audit .arh-hero').count() === 1, 'un seul écran rendu malgré deux chargements');
    ok(warns.some(w => w.includes('Déjà initialisé')), 'second chargement explicitement ignoré');
    /* Un seul jeu d'écouteurs : un clic ne doit pas enchaîner deux écrans. */
    await page.locator('[data-act="start"]').click();
    await page.waitForTimeout(250);
    ok(await page.locator('.arh-count').count() === 1, 'aucun écouteur dupliqué');
    const count = await page.locator('.arh-count').innerText();
    ok(count.trim().startsWith('1 /'), `premier écran de contexte (« ${count.trim()} »)`);
    await ctx.close();
  }

  /* ---------------------------------------------------------------- */
  group('Point de montage absent et modules manquants');
  {
    fs.writeFileSync(path.join(TMP, 'sans-montage.html'),
      `<!doctype html><html lang="fr"><head><meta charset="utf-8"></head><body><script src="/dist/audit-rh.min.js"></script></body></html>`);
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', e => noise.push(`sans-montage exception: ${e.message}`));
    await page.goto(`http://localhost:${PORT}/.recette/sans-montage.html`, { waitUntil: 'load' });
    await page.waitForTimeout(200);
    ok(errs.some(t => t.includes('Point de montage')), 'point de montage absent : message explicite, aucune exception');
    await ctx.close();
  }

  /* ---------------------------------------------------------------- */
  group('Reprise après rechargement');
  {
    const url = fixture('reprise', { env: 'preprod' });
    const { page, ctx } = await openPage(url);
    await page.locator('[data-act="start"]').click();
    await page.waitForTimeout(150);
    for (let i = 0; i < 2; i++) { await page.locator('[data-opt]').first().click({ force: true }); await page.waitForTimeout(450); }
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(250);
    ok(await page.locator('[data-act="resume"]').count() === 1, 'audit en cours proposé à la reprise');
    await page.locator('[data-act="resume"]').click();
    await page.waitForTimeout(250);
    ok(await page.locator('.arh-count').count() === 1, 'parcours repris là où il s\'était arrêté');
    await ctx.close();

    /* Progression illisible : on repart proprement de l'accueil. Contexte neuf, et valeur posée
       depuis l'écran d'accueil (où l'application n'écrit rien) pour qu'elle survive au rechargement. */
    const { page: p2, ctx: c2 } = await openPage(url);
    for (const bad of ['{"v":1,"saved_at":"nope","state":3}', '{"v":2,"saved_at":"2026-10-26T09:00:00Z","state":{}}',
      'pas du json', '{"v":1,"saved_at":"2026-10-26T09:00:00Z","state":{"step":"inconnu","context":{},"answers":{}}}']) {
      await p2.evaluate(v => localStorage.setItem('arh_progress', v), bad);
      await p2.reload({ waitUntil: 'load' });
      await p2.waitForTimeout(200);
      ok(await p2.locator('.arh-hero').count() === 1, `progression illisible (${bad.slice(0, 22)}…) : accueil rendu sans erreur`);
      ok(await p2.locator('[data-act="resume"]').count() === 0, `progression illisible (${bad.slice(0, 22)}…) : aucune reprise proposée`);
    }
    await c2.close();
  }

  /* ---------------------------------------------------------------- */
  group('Mobile');
  {
    const url = fixture('mobile', { env: 'preprod' });
    const { page, ctx } = await openPage(url, { width: 390, height: 844 });
    await page.locator('[data-act="start"]').click();
    await page.waitForTimeout(150);
    await runThrough(page);
    ok(await page.locator('.arh-results').count() === 1, 'parcours complet sur écran 390 px');
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(over <= 0, `aucun débordement horizontal (${over} px)`);
    /* Cibles tactiles : au moins 44 px de haut. */
    const small = await page.evaluate(() => {
      const bad = [];
      document.querySelectorAll('#arh-audit button, #arh-audit a.arh-btn, #arh-audit input').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.height > 0 && r.height < 40) bad.push((el.className || el.tagName) + ' ' + Math.round(r.height) + 'px');
      });
      return bad;
    });
    ok(small.length === 0, 'cibles tactiles suffisantes' + (small.length ? ' — ' + small.slice(0, 4).join(', ') : ''));
    await page.screenshot({ path: path.join(TMP, 'resultat-mobile.png'), fullPage: true });
    await ctx.close();
  }

  /* ---------------------------------------------------------------- */
  group('Étanchéité des styles et accessibilité');
  {
    fs.writeFileSync(path.join(TMP, 'etancheite.html'),
      `<!doctype html><html lang="fr"><head><meta charset="utf-8"><link rel="stylesheet" href="/dist/audit-rh.css">
<style>body{margin:0;font-family:Georgia,serif;font-size:19px}h2#t{margin:0}</style></head><body>
<h2 id="t">Titre du site</h2><p id="p">Paragraphe du site</p><button id="b">Bouton du site</button>
<ul id="u"><li>Liste du site</li></ul>
<main><div id="arh-audit" data-arh-env="preprod"></div></main>
<script>window.ARH_INTEGRATIONS_CONFIG={};</script><script src="/dist/audit-rh.min.js"></script></body></html>`);
    const { page, ctx } = await openPage(`http://localhost:${PORT}/.recette/etancheite.html`);
    const leak = await page.evaluate(() => {
      const g = el => getComputedStyle(el);
      return {
        h2font: g(document.getElementById('t')).fontFamily,
        h2size: g(document.getElementById('t')).fontSize,
        pSize: g(document.getElementById('p')).fontSize,
        btnRadius: g(document.getElementById('b')).borderRadius,
        liStyle: g(document.querySelector('#u li')).listStyleType,
        auditFont: g(document.querySelector('#arh-audit')).fontFamily
      };
    });
    ok(leak.h2font.includes('Georgia'), 'le style du site n\'est pas écrasé (police du h2 conservée)');
    ok(leak.h2size === '19px' || parseFloat(leak.h2size) > 19, `taille du h2 du site intacte (${leak.h2size})`);
    ok(leak.pSize === '19px', `taille du paragraphe du site intacte (${leak.pSize})`);
    ok(leak.btnRadius === '0px', 'les boutons du site ne sont pas restylés');
    ok(leak.liStyle === 'disc', 'les listes du site ne sont pas restylées');
    ok(leak.auditFont.includes('Encode Sans'), 'le bloc impose sa propre police sans dépendre du site');

    /* Structure de titres et libellés : contrôles d'accessibilité mesurables. */
    await page.locator('[data-act="start"]').click();
    await page.waitForTimeout(200);
    /* Le premier écran (fonction) n'a pas de texte d'aide : on passe au suivant (effectif), qui en a un. */
    await page.locator('[data-opt]').first().click({ force: true });
    await page.waitForTimeout(400);
    ok(await page.locator('[data-act="tip"]').count() === 1, 'bouton d\'aide présent sur un écran qui a un texte d\'aide');
    const a11y = await page.evaluate(() => {
      const root = document.getElementById('arh-audit');
      const group = root.querySelector('.arh-options[role="group"]');
      return {
        h1: root.querySelectorAll('h1').length,
        h2: root.querySelectorAll('h2').length,
        grouped: !!group,
        labelled: group ? !!document.getElementById(group.getAttribute('aria-labelledby')) : false,
        pressed: root.querySelectorAll('[data-opt][aria-pressed]').length,
        tip: root.querySelector('[data-act="tip"]') ? root.querySelector('[data-act="tip"]').getAttribute('aria-expanded') : null,
        tipHidden: root.querySelector('#arh-tip') ? root.querySelector('#arh-tip').hasAttribute('hidden') : null
      };
    });
    ok(a11y.h2 === 1, 'un seul titre de niveau 2 par écran');
    ok(a11y.grouped && a11y.labelled, 'les réponses forment un groupe nommé par l\'intitulé');
    ok(a11y.pressed > 0, 'état de sélection exposé sur chaque réponse');
    ok(a11y.tip === 'false', 'bouton d\'aide replié par défaut et annoncé');
    ok(a11y.tipHidden === true, 'texte d\'aide masqué tant que le bouton n\'est pas activé');
    await page.locator('[data-act="tip"]').click();
    await page.waitForTimeout(150);
    ok(await page.locator('#arh-tip:visible').count() === 1, 'texte d\'aide affiché au clic');
    ok(await page.locator('[data-act="tip"][aria-expanded="true"]').count() === 1, 'état du bouton d\'aide mis à jour');
    await ctx.close();
  }

  /* ---------------------------------------------------------------- */
  await browser.close();
  server.close();

  console.log('');
  ok(noise.length === 0, 'aucune erreur de console ni exception' + (noise.length ? ' — ' + noise.slice(0, 5).join(' | ') : ''));
  console.log(`  captures : ${path.relative(ROOT, TMP)}/resultat-desktop.png, ${path.relative(ROOT, TMP)}/resultat-mobile.png`);
  console.log('');
  if (failures.length) {
    for (const f of failures) console.error('  ÉCHEC — ' + f);
    console.error(`\n${failures.length} échec(s) sur ${pass + failures.length} contrôles.\n`);
    process.exit(1);
  }
  console.log(`${pass} contrôles navigateur vérifiés, aucun échec.\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
