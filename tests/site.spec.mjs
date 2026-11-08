import { test, expect } from '@playwright/test';
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'mobile-small', width: 320, height: 700 },
];
for (const viewport of viewports) {
  test(`${viewport.name}: apresentação, imagens, navegação e contato`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Seu jeito de viver');
    await expect(page.locator('.project-card')).toHaveCount(6);
    await expect(page.locator('.hero-portrait')).toBeVisible();
    await page.locator('#contato').scrollIntoViewIfNeeded();
    await expect(page.locator('#contato')).toBeVisible();
    await page.locator('#name').fill('Teste de qualidade');
    await page.locator('#service').selectOption({ label: 'Arquitetura' });
    await page.locator('#message').fill('Gostaria de conversar sobre um projeto arquitetônico.');
    await expect(page.getByRole('button', { name: /Enviar pelo WhatsApp/ })).toBeEnabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width + 1);
    await page.screenshot({ path: `test-results/${viewport.name}.png`, fullPage: true, animations: 'disabled' });
    expect(errors).toEqual([]);
  });
}
test('menu móvel, ampliação e fechamento de projetos', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Abrir menu' });
  await toggle.click();
  await expect(page.locator('#navigation')).toHaveClass(/nav-open/);
  await page.locator('#navigation').getByRole('link', { name: 'Projetos' }).click();
  await expect(page.locator('#navigation')).not.toHaveClass(/nav-open/);
  await page.getByRole('button', { name: /Ampliar imagem/ }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('preferência por movimento reduzido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.hero-title')).toBeVisible();
  expect(await page.locator('.hero-title').evaluate(el => getComputedStyle(el).opacity)).toBe('1');
});

test('imagens da publicação disponíveis e sem links quebrados', async ({ request }) => {
  const paths = [
    '/assets/identidade/logo-stela-maris.png',
    '/assets/equipe/stela-maris.png',
    '/assets/portfolio/fachada-contemporanea.png',
    '/assets/portfolio/quarto-moderno.png',
    '/assets/portfolio/fachada-moderna.png',
    '/assets/portfolio/suite-clara.png',
    '/assets/portfolio/residencia-contemporanea.png',
    '/assets/portfolio/espaco-essence.png',
    '/assets/portfolio/sala-de-estar.png',
    '/favicon.svg',
  ];
  for (const path of paths) {
    const response = await request.get(path);
    expect(response.ok(), `Recurso indisponível: ${path}`).toBeTruthy();
    expect(response.headers()['content-type']).toMatch(/image\//);
  }
});

test('retrato editorial da arquiteta carrega corretamente', async ({ page }) => {
  await page.goto('/');
  const retrato = page.locator('#inicio .portrait-composition');
  await retrato.scrollIntoViewIfNeeded();
  await expect(retrato).toBeVisible();
  await expect(retrato.locator('figcaption')).toContainText('Stela Maris');
  const foto = retrato.locator('.hero-portrait');
  await expect(foto).toHaveAttribute('src', '/assets/equipe/stela-maris.png');
  await expect.poll(() => foto.evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
});

test('retrato permanece acessível com movimento reduzido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const retrato = page.locator('#inicio .hero-portrait');
  await expect(retrato).toBeVisible();
  await expect(retrato).toHaveAttribute('alt', /Stela Maris/);
});

test('segundo bloco apresenta um projeto, sem repetir o retrato', async ({ page }) => {
  await page.goto('/');
  const image = page.locator('#sobre .intro-project-image');
  await image.scrollIntoViewIfNeeded();
  await expect(image).toHaveAttribute('src', '/assets/portfolio/suite-clara.png');
  await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
  await expect(page.locator('img[src="/assets/equipe/stela-maris.png"]')).toHaveCount(1);
});

test('capa respeita movimento reduzido e leva aos projetos', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const selector of ['.hero-title', '.portrait-frame']) {
    const element = page.locator(selector);
    await expect(element).toBeVisible();
    expect(await element.evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  }
  await page.getByRole('link', { name: 'Conheça os projetos' }).click();
  await expect(page).toHaveURL(/#projetos$/);
  await expect(page.locator('#projetos h2')).toBeInViewport();
});

test('formulário prepara a conversa com os dados preenchidos', async ({ page }) => {
  await page.addInitScript(() => { window.open = (url) => { window.__contactURL = url; }; });
  await page.goto('/');
  await page.locator('#name').fill('Maria Silva');
  await page.locator('#service').selectOption('Arquitetura');
  await page.locator('#message').fill('Quero planejar minha casa.');
  await page.getByRole('button', { name: 'Enviar pelo WhatsApp' }).click();
  const destination = new URL(await page.evaluate(() => window.__contactURL));
  expect(destination.origin).toBe('https://wa.me');
  expect(destination.searchParams.get('text')).toContain('Nome: Maria Silva');
  expect(destination.searchParams.get('text')).toContain('Interesse: Arquitetura');
  expect(destination.searchParams.get('text')).toContain('Quero planejar minha casa.');
});

test('tipografia editorial carrega sem depender do Google Fonts', async ({ page }) => {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, route => route.abort());
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('400 32px Cormorant'))).toBe(true);
  expect(await page.locator('.hero-title').evaluate(el => getComputedStyle(el).fontFamily)).toContain('Cormorant');
});
