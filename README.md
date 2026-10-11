# Buenas Noticias

Periódico digital del Evangelio. Cada mañana se publica una noticia nueva.

## Cómo funciona

1. Cada noticia es un archivo en `content/noticias/` (ver `GUIA-EDITORIAL.md`).
2. `python3 build.py` construye el sitio completo en `public/`.
3. Al guardar los cambios en GitHub, Netlify publica `public/` automáticamente.

La noticia más reciente sale en la portada, las seis siguientes en "Titulares", y las demás en "Ediciones anteriores".

## Cambiar a mano

- Número de WhatsApp de suscripciones: `assets/js/main.js`, variable `WHATSAPP`.
- Diseño: `assets/css/styles.css`. Estructura: `templates/`.
- Después de cualquier cambio: `python3 build.py`, y guardar en GitHub.

Última revisión de la conexión con Netlify: 11 de octubre de 2026.
