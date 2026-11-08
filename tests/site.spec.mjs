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
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Projetamos');
    await expect(page.locator('.project-card')).toHaveCount(6);
    await expect(page.locator('.hero-image')).toBeVisible();
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
