# Clínica Conecta

Web estática del proyecto Clínica Conecta, construida con [Astro](https://astro.build/)
y [Tailwind CSS v4](https://tailwindcss.com/).

La home (`/`) es la landing real; `/v2/` y `/v3/` son propuestas de diseño alternativas
(`noindex`, fuera del sitemap) para que el cliente compare y elija — ver la sección
["Propuestas de diseño"](./CLAUDE.md#propuestas-de-diseño-v2-v3) de `CLAUDE.md`.

## Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando               | Acción                                                    |
| :--------------------- | :--------------------------------------------------------- |
| `npm install`           | Instala las dependencias                                   |
| `npm run dev`           | Arranca el servidor de desarrollo en `localhost:4321`      |
| `npm run build`         | Genera el sitio de producción en `./dist/`                 |
| `npm run preview`       | Sirve localmente el build de producción                    |
| `npm run check`         | Comprueba tipos con `astro check`                           |
| `npm run format`        | Formatea el repo con Prettier                               |
| `npm run lint`          | ESLint sobre `.astro`/`.ts`                                 |
| `npm run test:e2e`      | Smoke tests de Playwright                                   |

Convenciones del repo (base path, Tailwind v4, maquetación, propuestas de diseño) están en
[`CLAUDE.md`](./CLAUDE.md).

## Ramas y despliegue

| Rama      | Destino                                                                 |
| :-------- | :----------------------------------------------------------------------- |
| `develop` | [GitHub Pages](https://flopez-dev.github.io/clinica_conecta/) — preview para el cliente |
| `main`    | Cloudflare Workers (`workers.dev`) — producción                          |
| otras / PR | Solo CI: tipos + build                                                   |

`astro.config.mjs` lee `SITE_URL` y `BASE_PATH` de variables de entorno para que el
mismo build funcione bajo `/clinica_conecta/` (Pages) o bajo `/` (Cloudflare, dominio
propio cuando exista).

## Secretos necesarios en GitHub

Para que `deploy-cloudflare.yml` despliegue, hay que añadir en
**Settings → Secrets and variables → Actions**:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Hasta entonces, ese workflow fallará en el último paso — `deploy-pages.yml` no depende
de ellos y funciona desde el primer push a `develop`.
