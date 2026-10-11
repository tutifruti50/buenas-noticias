#!/usr/bin/env python3
"""
Construye el sitio de Buenas Noticias.

  Lee:     content/noticias/*.json   (una noticia por archivo)
           templates/*.html, assets/
  Escribe: public/                   (lo que Netlify publica)

Uso:  python3 build.py
"""
import glob, html, json, os, shutil, sys, time

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'public')
MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
         'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
COLORES = {'gold': '', 'sky': 'tag--sky', 'olive': 'tag--olive', 'rose': 'tag--rose'}
REQUIRED = ['date', 'slug', 'tag', 'tag_color', 'title', 'short_title', 'deck',
            'summary', 'why', 'ref', 'minutes', 'read', 'body_html']


def esc(s):
    return html.escape(str(s), quote=True)


def fecha(iso):
    y, m, d = iso.split('-')
    return f'{int(d)} de {MESES[int(m) - 1]} de {y}'


def fill(tpl, **kw):
    for k, v in kw.items():
        tpl = tpl.replace('{{' + k + '}}', str(v))
    return tpl


def load():
    items, errors = [], []
    for path in sorted(glob.glob(os.path.join(ROOT, 'content', 'noticias', '*.json'))):
        name = os.path.basename(path)
        try:
            a = json.load(open(path, encoding='utf-8'))
        except Exception as e:
            errors.append(f'{name}: JSON inválido ({e})'); continue
        missing = [k for k in REQUIRED if not str(a.get(k, '')).strip()]
        if missing:
            errors.append(f'{name}: faltan campos {missing}')
        if a.get('tag_color') not in COLORES:
            errors.append(f'{name}: tag_color debe ser uno de {list(COLORES)}')
        if not name.startswith(str(a.get('date', ''))) or not name.endswith(f"{a.get('slug')}.json"):
            errors.append(f'{name}: el nombre debe ser AAAA-MM-DD-slug.json')
        items.append(a)
    slugs = [a['slug'] for a in items]
    dup = {s for s in slugs if slugs.count(s) > 1}
    if dup:
        errors.append(f'slugs repetidos: {dup}')
    if errors:
        print('ERRORES:\n  ' + '\n  '.join(errors)); sys.exit(1)
    items.sort(key=lambda a: (a['date'], a['slug']), reverse=True)
    return items


def card(a, kind, delay=''):
    cls = {'lead': 'story story--lead reveal', 'wide': 'story story--wide reveal',
           'normal': f'story reveal {delay}'.strip()}[kind]
    tag = f'<span class="tag {COLORES[a["tag_color"]]}">{esc(a["tag"])}</span>'
    inner = (f'<h3><a href="noticias/{a["slug"]}.html">{esc(a["title"])}</a></h3>\n'
             f'            <p>{esc(a["summary"])}</p>\n'
             f'            <p class="why"><b>Lo que significa:</b> {esc(a["why"])}</p>')
    ref = f'<span class="ref">{esc(a["ref"])}<span class="more">Leer a fondo →</span></span>'
    if kind == 'wide':
        return f'''<article class="{cls}">
            {tag}
            <div>
              {inner}
            </div>
            {ref}
          </article>'''
    return f'''<article class="{cls}">
            {tag}
            {inner}
            {ref}
          </article>'''


def build():
    items = load()
    version = str(int(time.time()))
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(os.path.join(OUT, 'noticias'))
    shutil.copytree(os.path.join(ROOT, 'assets', 'css'), os.path.join(OUT, 'css'))
    shutil.copytree(os.path.join(ROOT, 'assets', 'js'), os.path.join(OUT, 'js'))

    # ---------- Portada ----------
    top = items[0]
    hero = f'''<p class="hero__kicker load l2">Última hora{(' · ' + esc(top['kicker'])) if top.get('kicker') else ''} · {fecha(top['date'])}</p>
        <h1 class="hero__title load l3">{esc(top['title'])}</h1>
        <p class="hero__lead load l4" style="margin-bottom:20px">{esc(top['summary'])}</p>
        <p class="why hero__why load l4"><b>Lo que significa:</b> {esc(top['why'])}</p>
        <div class="hero__ctas load l4" style="margin-top:32px">
          <a class="btn btn--gold" href="noticias/{top['slug']}.html">Leer la noticia completa</a>
          <a class="btn btn--line" href="#titulares">Ver todos los titulares</a>
        </div>
        <p class="hero__ref load l4">Fuente: {esc(top['ref'])}</p>
      </div>'''

    ticker_items = ''.join(f'<span>{esc(a["short_title"])}</span><i>✦</i>' for a in items[:8])
    ticker = ticker_items * 2

    rest = items[1:7]
    cards = []
    for i, a in enumerate(rest):
        if i == 0:
            cards.append(card(a, 'lead'))
        elif i == 5:
            cards.append(card(a, 'wide'))
        else:
            cards.append(card(a, 'normal', 'd1' if i % 2 else 'd2'))
    grid = '<div class="grid">\n          ' + '\n          '.join(cards) + '\n        </div>'

    older = items[7:]
    archive = ''
    if older:
        li = '\n'.join(
            f'<li><a href="noticias/{a["slug"]}.html"><span class="arch__date">{fecha(a["date"])}</span>'
            f'<span class="arch__title">{esc(a["title"])}</span><span class="arch__ref">{esc(a["ref"])}</span></a></li>'
            for a in older)
        archive = f'''<div class="arch reveal">
          <h3>Ediciones anteriores</h3>
          <ul>
{li}
          </ul>
        </div>'''

    idx = fill(open(os.path.join(ROOT, 'templates', 'index.html'), encoding='utf-8').read(),
               HERO=hero, TICKER=ticker, GRID=grid, ARCHIVE=archive, VERSION=version)
    open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(idx)

    # ---------- Artículos ----------
    tpl = open(os.path.join(ROOT, 'templates', 'article.html'), encoding='utf-8').read()
    for i, a in enumerate(items):
        nxt = items[(i + 1) % len(items)]
        page = fill(tpl, TITLE=esc(a['title']), DECK=esc(a['deck']), TAG=esc(a['tag']),
                    TAGC=COLORES[a['tag_color']], REF=esc(a['ref']), MINS=a['minutes'],
                    DATE=fecha(a['date']), BODY=a['body_html'], READ=esc(a['read']),
                    NSLUG=nxt['slug'], NTITLE=esc(nxt['title']), VERSION=version)
        open(os.path.join(OUT, 'noticias', a['slug'] + '.html'), 'w', encoding='utf-8').write(page)

    print(f'OK: {len(items)} noticias. Portada: "{top["title"]}" ({top["date"]})')


if __name__ == '__main__':
    build()
