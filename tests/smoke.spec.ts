import { test, expect } from '@playwright/test';

// Batería mínima y reproducible de lo que se ha comprobado a mano varias
// veces en el desarrollo de este sitio: un único h1, sin errores de consola,
// sin overflow horizontal, y el menú móvil abre/cierra.
// '' (no '/') para la home: con baseURL terminando en `/clinica_conecta/`,
// un path que empiece por '/' resuelve contra el origen y se sale del base
// path (bug real que se detectó escribiendo este mismo test).
const PAGES = ['', 'aviso-legal/', 'privacidad/'];

for (const path of PAGES) {
  test.describe(`${path || '/'}`, () => {
    test('carga sin errores, con un único h1 y sin overflow horizontal', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (err) => errors.push(String(err)));

      const response = await page.goto(path);
      expect(response?.ok()).toBeTruthy();

      await expect(page.locator('h1')).toHaveCount(1);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);

      expect(errors).toEqual([]);
    });

    test('el menú móvil abre y cierra', async ({ page, isMobile }) => {
      test.skip(!isMobile, 'El botón de menú solo es visible en viewports móviles');

      await page.goto(path);

      const toggle = page.locator('#menu-toggle');
      const menu = page.locator('#menu-mobile');

      await expect(menu).not.toHaveAttribute('data-open');
      await toggle.click();
      await expect(menu).toHaveAttribute('data-open');
      await toggle.click();
      await expect(menu).not.toHaveAttribute('data-open');
    });
  });
}

// Las páginas legales comparten header y cierre con la home: su «Volver al
// inicio» y el logo llevan a la home.
for (const path of ['aviso-legal/', 'privacidad/']) {
  test(`${path} enlaza a la home`, async ({ page }) => {
    await page.goto(path);

    const base = new URL(page.url()).pathname.replace(path, '');
    const hrefs = await page
      .locator('a[href]')
      .evaluateAll((enlaces) => enlaces.map((a) => a.getAttribute('href') ?? ''));

    expect(hrefs).toContain(base);
  });
}

// Una ruta que no existe sirve la 404 (con su estado HTTP) y ofrece volver al
// inicio. Sin comprobar la consola: el propio 404 se registra como error.
test('una ruta inexistente muestra la página 404', async ({ page }) => {
  const response = await page.goto('ruta-que-no-existe/');
  expect(response?.status()).toBe(404);

  await expect(page.locator('h1')).toHaveText('Página no encontrada');
  await expect(page.getByRole('link', { name: 'Volver al inicio' })).toBeVisible();
});
