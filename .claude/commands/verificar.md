---
description: Reproduce el CI en local — tipos y build con el base path de GitHub Pages
allowed-tools: Bash(npm run check), Bash(npm run build)
---

Ejecuta, en este orden, exactamente lo que hace `.github/workflows/ci.yml`:

1. `npm run check` — comprueba tipos con `astro check`.
2. Build con el base path de GitHub Pages, que es el que de verdad ejercita `withBase()`
   en los enlaces internos:

   ```
   SITE_URL=https://flopez-dev.github.io BASE_PATH=/clinica_conecta/ npm run build
   ```

Si cualquiera de los dos pasos falla, muestra el error literal (no lo resumas) y para —
no continúes al siguiente paso ni intentes arreglarlo sin que se te pida. Si ambos pasan,
dilo brevemente y no hagas nada más.
