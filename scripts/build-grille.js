/*
 * Génère docs/GRILLE.md à partir de la configuration (la config reste la seule source de vérité).
 * Exécution : scripts/build-grille.sh
 */
(function () {
  'use strict';
  var Q = globalThis.ARH_QUESTIONS, R = globalThis.ARH_RULES, L = globalThis.ARH_LEGAL, V = globalThis.ARH_VALIDATE;
  var MODS = (globalThis.ARH_CCN_MODULES || { modules: {} }).modules, CCN = globalThis.ARH_CCN_LIST || { entries: [], special: [] };
  var MODQ = []; Object.keys(MODS).forEach(function (k) { (MODS[k].questions || []).forEach(function (q) { MODQ.push(q); }); });
  var lines = [];
  function w(s) { lines.push(s === undefined ? '' : s); }

  function cond(c) {
    if (c === null || c === undefined) return 'Toujours posée';
    if (c.all) return c.all.map(cond).join(' ET ');
    if (c.any) return '(' + c.any.map(cond).join(' OU ') + ')';
    if (c.not) return 'NON ' + cond(c.not);
    return c.field + (c.in ? ' ∈ {' + c.in.join(', ') + '}' : ' ∉ {' + c.not_in.join(', ') + '}');
  }
  function redFlag(q) {
    if (!q.red_flag_conditions.length) return 'Non';
    return q.red_flag_conditions.map(function (r) {
      return 'Oui si « ' + r.answers.map(function (a) { return scaleLabel('C', a); }).join(' » ou « ') + ' »' + (r.when ? ' et ' + cond(r.when) : '');
    }).join(' ; ');
  }
  function scaleLabel(t, id) { var s = Q.ANSWER_SCALES[t].filter(function (x) { return x.id === id; })[0]; return s ? s.label : id; }
  var WEIGHT = { 1: '1 — secondaire', 2: '2 — important', 3: '3 — critique' };

  w('# Audit RH 360° — Grille métier (Phase 1)');
  w();
  w('> Document généré depuis `src/config/*.js` par `scripts/build-grille.sh`. Ne pas éditer à la main : modifier la configuration puis régénérer.');
  w('> Version config : `' + Q.version + '` · référentiel réglementaire : `' + L.version + '`.');
  w();
  w('## Échelles de réponse');
  w();
  w('**Type C — Compliance** : ' + Q.ANSWER_SCALES.C.map(function (a) { return a.label + ' = ' + (a.score === null ? 'exclu du score' : a.score) + (a.vigilance ? ' + vigilance' : ''); }).join(' · ') + '. « Non applicable » n\'est proposé que lorsque la question l\'autorise (`allow_na`).');
  w();
  w('**Type M — Maturity** : quatre situations concrètes affichées sans lettre ni « niveau » ; scores A = 0 · B = 33 · C = 67 · D = 100.');
  w();
  w('## Contextualisation');
  w();
  Q.CONTEXT.forEach(function (c) {
    w('- **' + c.label + '** (`' + c.id + '`' + (c.required ? '' : ', facultatif') + ') : ' + (c.options ? c.options.map(function (o) { return o.label + ' `' + o.id + '`'; }).join(' · ') : 'texte libre'));
  });
  w();

  Q.PILLARS.forEach(function (p) {
    var qs = Q.QUESTIONS.concat(MODQ).filter(function (q) { return q.pillar === p.id; });
    w('## Pilier ' + p.order + '/8 — ' + p.label);
    w();
    w('Score CRM : `' + p.score_field + '` · Point fort : « ' + p.strength_text + ' » · À structurer : « ' + p.weak_text + ' »');
    w();
    qs.forEach(function (q) {
      var active = V.isActive(q);
      w('### ' + q.id + (q.conditional_id ? ' (' + q.conditional_id + ')' : '') + ' — ' + q.short_label + (active ? '' : ' ⛔ INACTIVE (validation juridique requise)'));
      w();
      w('**' + q.question + '**');
      w();
      w('| Champ | Valeur |');
      w('|---|---|');
      w('| Type · poids · risque | ' + q.type + ' · ' + WEIGHT[q.weight] + ' · ' + q.risk_level + ' |');
      w('| Condition d\'affichage | ' + cond(q.applicability) + ' |');
      w('| Red flag | ' + redFlag(q) + ' |');
      w('| Legal flag · règle | ' + (q.legal_flag ? 'Oui · ' + q.legal_rule.map(function (id) { return '`' + id + '` (' + L.RULES[id].status + ')'; }).join(', ') : 'Non') + ' |');
      w('| Source · vérifiée le | ' + (q.legal_rule ? q.legal_rule.map(function (id) { return L.RULES[id].source.map(function (s) { return '[' + s.label + '](' + s.url + ')'; }).join(' ; ') + ' · ' + L.RULES[id].verified_at; }).join(' ; ') : q.source + ' · ' + q.verified_at) + ' |');
      w('| Tags commerciaux (internes) | ' + q.commercial_tags.map(function (t) { return '`' + t + '`'; }).join(' ') + ' |');
      w('| Aide (tooltip) | ' + q.help_text + ' |');
      (q.variants || []).forEach(function (v) {
        w('| Wording adaptatif « ' + v.id + ' » (' + cond(v.when) + ') | **' + (v.question || q.question) + '**' +
          (v.answers ? '<br>' + ['A', 'B', 'C', 'D'].map(function (k) { return k + '. ' + v.answers[k]; }).join('<br>') : '') +
          (v.allow_na ? '<br>+ « ' + v.na_label + ' » (exclu du score)' : '') + ' |');
      });
      w();
      if (q.type === 'M') {
        w('| Situation | Score | Recommandation |');
        w('|---|---|---|');
        ['A', 'B', 'C', 'D'].forEach(function (k) {
          var sc = Q.ANSWER_SCALES.M.filter(function (x) { return x.id === k; })[0].score;
          w('| ' + k + '. ' + q.answers[k] + ' | ' + sc + ' | ' + (q.recommendation_by_answer[k] || '— (point fort)') + ' |');
        });
      } else {
        w('| Réponse | Score | Recommandation |');
        w('|---|---|---|');
        Q.ANSWER_SCALES.C.forEach(function (a) {
          if (a.id === 'na' && !q.allow_na) return;
          var label = a.id === 'na' && q.na_label ? q.na_label : a.label;
          w('| ' + label + ' | ' + (a.score === null ? 'exclu' : a.score + (a.vigilance ? ' + vigilance' : '')) + ' | ' + (q.recommendation_by_answer[a.id] || (a.id === 'yes' ? '— (maîtrisé)' : '—')) + ' |');
        });
      }
      w();
    });
  });

  w('## Convention collective et modules conventionnels');
  w();
  w('Sélection normalisée par IDCC (' + CCN.entries.length + ' conventions dans la liste de démarrage · source : ' + CCN.source.label + ', ' + CCN.source.retrieved_at + (CCN.source.complete ? '' : ' · liste officielle complète à importer') + '). Alternatives : ' + CCN.special.map(function (x) { return '« ' + x.label + ' » (`' + x.id + '`)'; }).join(' · ') + '.');
  w();
  Object.keys(MODS).forEach(function (idcc) {
    var m = MODS[idcc];
    w('- **IDCC ' + idcc + ' → module `' + m.id + '`** : contexte ' + (m.context_questions || []).map(function (c) { return '« ' + c.label + ' » (' + c.options.map(function (o) { return o.label; }).join(' / ') + ', hors score)'; }).join(' ; ') +
      ' · contrôles : ' + (m.questions || []).map(function (q) { return '`' + q.id + '` (' + cond(q.applicability) + ')'; }).join(', '));
  });
  w();
  w('## Seuils de maturité');
  w();
  R.maturity_levels.forEach(function (m) { w('- ≥ ' + m.min + ' : **' + m.label + '** — « ' + R.result_texts.global_by_level[m.id] + ' »'); });
  w();
  w('## Hiérarchie de restitution / roadmap');
  w();
  R.roadmap_priorities.forEach(function (p) { w(p.priority + '. **' + p.label + '** — ' + p.rule); });
  w();
  w('Tri interne : ' + R.roadmap_sort.join(' → ') + '. Seuils : ' + JSON.stringify(R.thresholds));
  w();
  w('## Qualification commerciale (interne, jamais affichée)');
  w();
  R.lead_interest.rules.forEach(function (r) { w('- `' + r.tag + '` — ' + r.description + ' Règle : `' + JSON.stringify(r.when) + '`'); });
  w();
  w('## Règles réglementaires');
  w();
  w('| Règle | Statut | Applicabilité | Périodicité | Sources | Lu le |');
  w('|---|---|---|---|---|---|');
  Object.keys(L.RULES).forEach(function (id) {
    var r = L.RULES[id];
    w('| `' + id + '` ' + r.title + ' | ' + r.status + ' | ' + r.applicability + ' | ' + (typeof r.periodicity === 'object' && r.periodicity ? JSON.stringify(r.periodicity) : (r.periodicity || '—')) + ' | ' + r.source.map(function (s) { return '[' + s.label + '](' + s.url + ')'; }).join('<br>') + ' | ' + r.verified_at + ' |');
  });
  w();
  w('## LEGAL_VALIDATION_REQUIRED');
  w();
  L.LEGAL_VALIDATION_REQUIRED.forEach(function (x) { w('- ' + (x.blocking ? '⛔ bloquant' : 'non bloquant') + ' · `' + x.rule + '` (' + x.questions.join(', ') + ') — ' + x.point); });
  w();
  w('## Veille (règles vérifiées mais mouvantes)');
  w();
  L.LEGAL_WATCH.forEach(function (x) { w('- `' + x.rule + '` — ' + x.reason); });
  w();
  w('## Disclaimer');
  w();
  w('> ' + R.disclaimer);

  print(lines.join('\n'));
})();
