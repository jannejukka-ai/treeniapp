#!/usr/bin/env python3
"""
make_changelog_doc.py
Lukee CHANGELOG.md:n ja tekee siitä muotoillun Word-dokumentin
(Treeniapp-Versiohistoria.docx).

Muotoilu:
- Sininen versio-otsikko (## v3.1 ...)
- Tummat alaotsikot (### ...)
- Bulletit (- ...)
- Normaali leipäteksti muille riveille

Käyttö:
    python3 make_changelog_doc.py
    python3 make_changelog_doc.py CHANGELOG.md Treeniapp-Versiohistoria.docx
"""

import sys
import re
from docx import Document
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

BLUE = RGBColor(0x1E, 0x66, 0xE0)   # versio-otsikon sininen
DARK = RGBColor(0x1F, 0x2A, 0x37)   # alaotsikon tumma

def add_version_heading(doc, text):
    p = doc.add_paragraph()
    p.space_before = Pt(14)
    run = p.add_run(text)
    run.bold = True
    run.font.size = Pt(18)
    run.font.color.rgb = BLUE
    return p

def add_sub_heading(doc, text):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.bold = True
    run.font.size = Pt(13)
    run.font.color.rgb = DARK
    return p

def add_bullet(doc, text):
    p = doc.add_paragraph(style='List Bullet')
    _add_inline(p, text)
    return p

def add_body(doc, text):
    p = doc.add_paragraph()
    _add_inline(p, text)
    return p

def _add_inline(paragraph, text):
    """Tukee **lihavointia** tekstissä."""
    parts = re.split(r'(\*\*.+?\*\*)', text)
    for part in parts:
        if part.startswith('**') and part.endswith('**'):
            run = paragraph.add_run(part[2:-2])
            run.bold = True
        else:
            paragraph.add_run(part)

def main():
    src = sys.argv[1] if len(sys.argv) > 1 else 'CHANGELOG.md'
    out = sys.argv[2] if len(sys.argv) > 2 else 'Treeniapp-Versiohistoria.docx'

    with open(src, encoding='utf-8') as f:
        lines = f.read().splitlines()

    doc = Document()

    # Dokumentin pääotsikko
    title = doc.add_paragraph()
    trun = title.add_run('Treeniapp — Versiohistoria')
    trun.bold = True
    trun.font.size = Pt(24)
    trun.font.color.rgb = BLUE

    for raw in lines:
        line = raw.rstrip()

        # ohita tiedoston oma pääotsikko ja erottimet
        if line.startswith('# '):
            continue
        if line.strip() in ('', '---'):
            if line.strip() == '':
                continue
            else:
                continue

        if line.startswith('## '):
            add_version_heading(doc, line[3:].strip())
        elif line.startswith('### '):
            add_sub_heading(doc, line[4:].strip())
        elif line.startswith('- '):
            add_bullet(doc, line[2:].strip())
        elif line.startswith('  - '):
            p = add_bullet(doc, line[4:].strip())
            p.paragraph_format.left_indent = Pt(36)
        else:
            add_body(doc, line.strip())

    doc.save(out)
    print(f'Valmis: {out}')

if __name__ == '__main__':
    main()
