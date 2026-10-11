# Guía editorial de Buenas Noticias

Esta guía la sigue quien escriba la noticia del día (persona o Claude). Es obligatoria.

## Qué es el periódico

Un periódico digital que cuenta los relatos y enseñanzas de la Biblia como si fueran noticias de hoy, y luego explica su significado con fidelidad bíblica. El tono es cálido, claro y sencillo, para un lector dominicano común. Nada de lenguaje académico ni de jerga religiosa sin explicar.

## Línea doctrinal (sin nombrarla en el sitio)

El sitio **nunca** menciona tradiciones, teólogos, confesiones, denominaciones ni etiquetas teológicas. Solo enseña lo que dice la Biblia, citando los pasajes.

Lo que el contenido enseña y nunca contradice:

1. **La Biblia** es la Palabra de Dios, suficiente y con autoridad final.
2. **Dios es soberano** sobre todo: la creación, la historia, el sufrimiento y la salvación. Gobierna todo por su providencia para su gloria y el bien de los suyos.
3. **El ser humano está muerto en el pecado** y no puede, por sí mismo, buscar a Dios ni agradarle (Romanos 3:10-12; Efesios 2:1-3).
4. **La salvación es por gracia sola, mediante la fe sola, en Cristo solo.** Dios toma la iniciativa: él busca, llama, da el nuevo nacimiento y concede la fe y el arrepentimiento (Juan 6:44; Efesios 2:8-9). Las obras son fruto de la salvación, nunca su precio.
5. **La cruz es sustitución:** Cristo murió en lugar de los pecadores, cargando el castigo que merecían. Somos justificados porque se nos cuenta su justicia.
6. **La invitación es para todos:** todo el que viene a Cristo será recibido. Se llama con sinceridad al arrepentimiento y la fe.
7. **Seguridad del creyente:** los que Dios salva, los guarda hasta el fin (Juan 10:28-29; Filipenses 1:6).
8. **El bautismo es para creyentes.** Se bautiza a quienes han confesado personalmente su fe en Cristo (Hechos 2:41; 8:36-38), por inmersión como símbolo de la unión con Cristo en su muerte y resurrección (Romanos 6:3-4). El bautismo no salva. Nunca se presenta el bautismo de bebés como bíblico.
9. **La vida cristiana** incluye arrepentimiento continuo, santidad, iglesia local, oración, sufrimiento y esperanza en el regreso de Cristo y la resurrección.

## Lo que está prohibido

- **Evangelio de la prosperidad:** nunca presentar la riqueza, la salud o el éxito como señal de bendición o resultado de la fe, ni la pobreza o la enfermedad como señal de falta de fe o maldición. Nada de "siembra para cosechar", "pacto financiero", diezmos como inversión.
- **Palabra de fe:** nunca presentar la fe como una fuerza para "declarar", "decretar", "activar" o "confesar positivo" y así controlar circunstancias. La fe es confianza en una Persona, no un poder.
- Nunca prometer sanidad, dinero o éxito a cambio de fe, ofrendas o conducta.
- Nada de política partidista, ataques a iglesias o personas con nombre, ni temas morbosos.
- No inventar datos históricos ni citas. Ante la duda, contar con palabras propias y dar la referencia.

Cada artículo incluye un recuadro **"Lo que esta noticia no promete / no enseña"** que corrige con ternura la lectura equivocada más común del pasaje, especialmente la de prosperidad o la de "declararlo".

## Citas bíblicas

- Versión: **Reina-Valera 1909** (dominio público). Ortografía moderna (á → a, priesa → prisa).
- Solo citar textualmente un versículo si se conoce con seguridad su redacción en la RV1909. Si no, contarlo con palabras propias y dar la referencia.
- Máximo 3 citas destacadas (`<blockquote class="aquote">`) por artículo, cortas (una o dos líneas).

## Estructura de cada artículo (`body_html`)

1. `<h2>La noticia</h2>`: el relato contado como reportaje, en presente o pasado narrativo, con una cita destacada.
2. `<h2>Qué nos enseña</h2>` (o un título equivalente): 2 a 4 enseñanzas, cada una empieza con `<p><strong>Idea en una frase.</strong> Explicación…</p>`, con referencias.
3. `<div class="callout"><h2>Lo que esta noticia no promete</h2><p>…</p></div>`
4. `<h2>Para tu vida</h2>`: aplicación personal y una invitación clara a Cristo.

Largo: entre 550 y 800 palabras. Párrafos cortos.

HTML permitido: `h2, p, strong, em, blockquote class="aquote" (con p y cite dentro), div class="callout"`. Nada de scripts, estilos ni imágenes.

Plantilla de cita:
```html
<blockquote class="aquote"><p>Texto del versículo.</p><cite>Libro 1:1</cite></blockquote>
```

## Archivo de datos

Cada noticia es `content/noticias/AAAA-MM-DD-slug.json`:

```json
{
  "date": "2026-10-12",
  "slug": "la-mujer-samaritana",
  "tag": "Encuentro",
  "tag_color": "sky",
  "title": "Titular de periódico, máximo 70 caracteres",
  "short_title": "Versión corta para la cinta, máximo 45 caracteres",
  "kicker": "Lugar o momento opcional, ej: Sicar, mediodía",
  "deck": "Subtítulo de una o dos frases que resume la idea.",
  "summary": "Resumen de 1 a 2 frases para la tarjeta de la portada.",
  "why": "Lo que significa: 1 o 2 frases con la verdad bíblica central.",
  "ref": "Juan 4:1-42",
  "minutes": 6,
  "read": "Juan 4 · otro pasaje · otro pasaje",
  "body_html": "<h2>La noticia</h2><p>…</p>"
}
```

- `tag_color`: `gold`, `sky`, `olive` o `rose`. Etiquetas sugeridas: Última hora, Restauración, Sanidad, Provisión, Perdón, Esperanza, Encuentro, Promesa, Justicia, Profecía, Opinión.
- El `slug` va en minúsculas, sin acentos, con guiones, y no puede repetirse.

## Variedad

- No repetir un pasaje ya publicado (revisar `content/noticias/`).
- Alternar Antiguo y Nuevo Testamento, relatos y enseñanzas, y colores de etiqueta.
- Del Antiguo Testamento, mostrar siempre cómo apunta a Cristo, sin forzar el texto.
- Ideas en `TEMAS.md`; tachar (marcar `[x]`) el tema usado.
