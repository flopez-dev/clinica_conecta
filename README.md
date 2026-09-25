# Clínica Conecta

Web estática del proyecto Clínica Conecta, construida con [Astro](https://astro.build/)
y [Tailwind CSS v4](https://tailwindcss.com/).

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

Convenciones del repo (base path, Tailwind v4, maquetación) están en
[`CLAUDE.md`](./CLAUDE.md).

## Ramas y despliegue

| Rama      | Destino                                                                 |
| :-------- | :----------------------------------------------------------------------- |
| `develop` | [GitHub Pages](https://flopez-dev.github.io/clinica_conecta/) — preview para el cliente |
| `main`    | Cloudflare Workers, en [juanriccardiconecta.com](https://juanriccardiconecta.com) — producción |
| otras / PR | Solo CI: formato, lint, tipos, build y tests e2e |

`astro.config.mjs` lee `SITE_URL` y `BASE_PATH` de variables de entorno para que el
mismo build funcione bajo `/clinica_conecta/` (Pages) o bajo `/` (Cloudflare, en el
dominio propio).

El dominio `juanriccardiconecta.com` tiene que estar dado de alta como zona en la misma
cuenta de Cloudflare que recibe el deploy. Wrangler crea el registro DNS por su cuenta
(`custom_domain` en `wrangler.jsonc`), pero la zona no la crea.

## Secretos necesarios en GitHub

Para que `deploy-cloudflare.yml` despliegue, hay que añadir en
**Settings → Secrets and variables → Actions**:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Hasta entonces, ese workflow fallará en el último paso — `deploy-pages.yml` no depende
de ellos y funciona desde el primer push a `develop`.
