# Ecos Perdidos
Museo digital de los sonidos que desaparecen en Puebla.

## Estructura
- `index.html` inicio; `pages/` demás secciones
- `css/` base, navbar, components, responsive
- `js/` data (los sonidos), audio-player, navbar, filtros, main
- `assets/` img, video, audio, icons

## Cómo agregar contenido
1. Imagen: `assets/img/<id>.jpg` (ej. camotero.jpg). También portada.jpg y equipo.jpg.
2. Audio: `assets/audio/<id>.mp3`. Si no existe, se reproduce un sonido sintetizado.
3. Video: `assets/video/historia-camotero.mp4` (y afilador, organillero).
4. Nuevos sonidos: agrega un objeto en `js/data.js`.

Los textos y fechas son de ejemplo: verifícalos y cítalos con tu propia investigación.
