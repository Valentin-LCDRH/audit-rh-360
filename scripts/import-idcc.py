#!/usr/bin/env python3
"""
Importe la nomenclature officielle des conventions collectives (IDCC) dans src/data/ccn-list.js.

Source : Ministère du Travail, « Liste des conventions collectives et de leur code IDCC »
(travail-emploi.gouv.fr › Conventions collectives : nomenclatures). Le site est protégé par un CAPTCHA :
télécharger le fichier à la main, l'ouvrir dans Excel/Numbers et l'exporter en CSV (UTF-8).

Usage :
    python3 scripts/import-idcc.py chemin/vers/liste-idcc.csv --date AAAA-MM-JJ

Le CSV doit contenir une colonne IDCC et une colonne d'intitulé (détectées par leur en-tête).
Les entrées déjà présentes gardent leur intitulé court, leur nom d'usage et leurs alias ;
l'intitulé officiel est mis à jour depuis le fichier. Aucun téléchargement n'est fait par ce script.
"""
import csv, json, re, sys, argparse, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
TARGET = ROOT / 'src' / 'data' / 'ccn-list.js'


def read_existing():
    text = TARGET.read_text(encoding='utf-8')
    entries = {}
    for m in re.finditer(r"\{ idcc: '(\d+)'(.*?)\}(?=,\n|\n)", text):
        entries[m.group(1)] = m.group(0)
    return text, entries


def js(s):
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('csv')
    ap.add_argument('--date', required=True)
    a = ap.parse_args()
    with open(a.csv, encoding='utf-8-sig', newline='') as f:
        sample = f.read(4096); f.seek(0)
        rows = list(csv.reader(f, csv.Sniffer().sniff(sample, delimiters=';,\t')))
    head = [h.strip().lower() for h in rows[0]]
    ci = next(i for i, h in enumerate(head) if 'idcc' in h)
    ti = next(i for i, h in enumerate(head) if i != ci and ('titre' in h or 'intitul' in h or 'libell' in h))
    text, existing = read_existing()
    lines = []
    for r in rows[1:]:
        if len(r) <= max(ci, ti):
            continue
        idcc = re.sub(r'\D', '', r[ci]).lstrip('0')
        title = ' '.join(r[ti].split())
        if not idcc or not title:
            continue
        if idcc in existing:
            entry = re.sub(r"label: '(?:[^'\\]|\\.)*'", 'label: ' + js(title), existing[idcc], count=1)
        else:
            entry = '{ idcc: %s, label: %s }' % (js(idcc), js(title))
        lines.append((int(idcc), '      ' + entry.strip()))
    lines.sort()
    body = ',\n'.join(l for _, l in lines)
    text = re.sub(r"entries: \[\n.*?\n    \]", 'entries: [\n' + body + '\n    ]', text, flags=re.S)
    text = re.sub(r"retrieved_at: '[^']*'", "retrieved_at: '%s'" % a.date, text)
    text = text.replace('complete: false', 'complete: true')
    text = re.sub(r"version: '[^']*'", "version: '%s-officiel'" % a.date, text)
    TARGET.write_text(text, encoding='utf-8')
    print('%d conventions importées dans %s' % (len(lines), TARGET.relative_to(ROOT)))


if __name__ == '__main__':
    main()
