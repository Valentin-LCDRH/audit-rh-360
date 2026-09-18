/*
 * Génère docs/PROPOSITION-CONDENSATION.md : wording actuel / condensé / mots gagnés, et durée estimée.
 * La proposition (proposals/condensation-m.js) n'est PAS appliquée à la configuration.
 */
(function () {
  'use strict';
  var Q = globalThis.ARH_QUESTIONS, P = globalThis.ARH_CONDENSATION, E = globalThis.ARH_ENGINE, C = E.defaultConfig();
  function words(t) { return String(t || '').split(/\s+/).filter(Boolean).length; }
  function qWords(q) { return words(q.question) + ['A', 'B', 'C', 'D'].reduce(function (s, k) { return s + words(q.answers[k]); }, 0); }
  var L = [], totalBefore = 0, totalAfter = 0, gains = {};
  function w(s) { L.push(s === undefined ? '' : s); }

  var ms = Q.QUESTIONS.filter(function (q) { return q.type === 'M'; });
  ms.forEach(function (q) {
    var p = P[q.id];
    if (!p) throw new Error('Proposition manquante pour ' + q.id);
    var b = qWords(q), a = words(p.question) + ['A', 'B', 'C', 'D'].reduce(function (s, k) { return s + words(p.answers[k]); }, 0);
    totalBefore += b; totalAfter += a; gains[q.id] = b - a;
  });

  /* Durée estimée : lecture 200 mots/min + 4 s de décision par écran + 5 écrans de contexte. */
  var ctxW = C.Q.CONTEXT.reduce(function (s, c) { return s + words(c.label) + (c.options || []).reduce(function (x, o) { return x + words(o.label); }, 0); }, 0);
  function duration(ctx, condensed) {
    var qs = E.questionsFor(ctx, C), n = 0;
    qs.forEach(function (q) {
      var ww = words(q.question) + E.answerOptions(q, C).reduce(function (s, o) { return s + words(o.label); }, 0);
      if (condensed && q.type === 'M' && !q.variant_id) ww -= gains[q.id];
      n += ww;
    });
    return { q: qs.length, words: n, min: Math.round(((n + ctxW) / 200 * 60 + (qs.length + 5) * 4) / 6) / 10 };
  }

  w('# Proposition — condensation des 24 questions de maturité (NON APPLIQUÉE)');
  w();
  w('> Généré par `scripts/build-condensation.sh` depuis `proposals/condensation-m.js`. Aucune question supprimée, sens des situations conservé, pas de réponses génériques.');
  w();
  w('**Total : ' + totalBefore + ' → ' + totalAfter + ' mots (−' + (totalBefore - totalAfter) + ', soit −' + Math.round((totalBefore - totalAfter) / totalBefore * 100) + ' %) sur les questions de maturité.**');
  w();
  w('| Profil | Questions | Actuel | Condensé |');
  w('|---|---|---|---|');
  [['1-10', 'no', '1-10 sans CSE'], ['11-49', 'yes', '11-49 avec CSE'], ['50-249', 'yes', '50+ avec CSE']].forEach(function (p) {
    var ctx = { company_size: p[0], has_cse: p[1] }, b = duration(ctx, false), a = duration(ctx, true);
    w('| ' + p[2] + ' | ' + b.q + ' | ' + b.words + ' mots · ~' + String(b.min).replace('.', ',') + ' min | ' + a.words + ' mots · ~' + String(a.min).replace('.', ',') + ' min |');
  });
  w();
  w('Estimation théorique (lecture 200 mots/min + 4 s de décision par écran) : à confirmer par chronométrage. Pour les TPE, les variantes adaptées ne sont pas condensées ici.');
  w();
  ms.forEach(function (q) {
    var p = P[q.id];
    w('## ' + q.id + ' — ' + q.short_label + ' · −' + gains[q.id] + ' mots');
    w();
    w('| | Actuel | Condensé |');
    w('|---|---|---|');
    w('| Question | ' + q.question + ' | ' + p.question + ' |');
    ['A', 'B', 'C', 'D'].forEach(function (k) { w('| ' + k + ' | ' + q.answers[k] + ' | ' + p.answers[k] + ' |'); });
    w('| Mots | ' + qWords(q) + ' | ' + (qWords(q) - gains[q.id]) + ' |');
    if (p.help_note || p.note) w('| Note | | ' + (p.help_note || p.note) + ' |');
    w();
  });
  print(L.join('\n'));
})();
