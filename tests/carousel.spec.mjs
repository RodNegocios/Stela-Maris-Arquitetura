import { test, expect } from '@playwright/test';

const titles = ['Arquitetura contemporânea', 'Interiores com personalidade', 'Formas e proporções', 'Ambientes que acolhem', 'Expressão arquitetônica', 'Espaços com identidade'];
const current = page => page.locator('.project-current h3');

test('todos os projetos são acessíveis pelas setas, com retorno ao início', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('#projetos').scrollIntoViewIfNeeded();
  for (let index = 0; index < titles.length; index++) {
    await expect(current(page)).toHaveText(titles[index]);
    await expect(page.getByRole('button', { name: /^Ampliar imagem:/ })).toHaveCount(1);
    await expect(page.locator('.card-swap-slot[data-front] img')).toHaveAttribute('alt', titles[index]);
    await page.getByRole('button', { name: 'Próximo projeto' }).click();
  }
  await expect(current(page)).toHaveText(titles[0]);
  await page.getByRole('button', { name: 'Projeto anterior' }).click();
  await expect(current(page)).toHaveText(titles[5]);
  await page.getByRole('button', { name: 'Ver projeto em detalhe' }).click();
  await expect(page.getByRole('dialog')).toContainText(titles[5]);
  await expect(page.getByRole('button', { name: 'Fechar imagem' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Fechar imagem' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Ver projeto em detalhe' })).toBeFocused();
});

test('navegação animada e teclado mantêm o título e a imagem em sincronia', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Próximo projeto' }).click();
  await expect(current(page)).toHaveText(titles[1]);
  const front = page.locator('.card-swap-slot[data-front]');
  await expect(front.locator('img')).toHaveAttribute('alt', titles[1]);
  // Wait for real pointer actionability after the card settles.
  await page.getByRole('button', { name: `Ampliar imagem: ${titles[1]}` }).click();
  await expect(page.getByRole('dialog')).toContainText(titles[1]);
  await page.keyboard.press('Escape');
  await page.getByRole('region', { name: 'Projetos selecionados' }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(current(page)).toHaveText(titles[0]);
});

test('reprodução automática, pausa e preferência de movimento reduzido', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  await page.locator('#projetos').scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.clock.runFor(6500);
  await expect(current(page)).toHaveText(titles[1]);
  await page.getByRole('button', { name: 'Pausar carrossel' }).click();
  await page.mouse.move(0, 0);
  await page.clock.runFor(7000);
  await expect(current(page)).toHaveText(titles[1]);
  await page.getByRole('button', { name: 'Reproduzir carrossel' }).click();
  await page.mouse.move(0, 0);
  await page.clock.runFor(6500);
  await expect(current(page)).toHaveText(titles[2]);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('button', { name: 'Pausar carrossel' })).toHaveCount(0);
  await page.clock.runFor(7000);
  await expect(current(page)).toHaveText(titles[2]);
  await page.getByRole('button', { name: 'Próximo projeto' }).click();
  await expect(current(page)).toHaveText(titles[3]);
});

test('arrastar o cartão troca o projeto sem abrir a ampliação', async ({ page }) => {
  await page.goto('/');
  await page.locator('#projetos').scrollIntoViewIfNeeded();
  const image = page.locator('.card-swap-slot[data-front] img');
  const box = await image.boundingBox();
  await page.mouse.move(box.x + box.width * .6, box.y + box.height * .5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .15, box.y + box.height * .5, { steps: 12 });
  await page.mouse.up();
  await expect(current(page)).toHaveText(titles[1]);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('o carrossel pausa enquanto recebe foco ou o ponteiro', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  await page.locator('#projetos').scrollIntoViewIfNeeded();
  await page.locator('.project-story').hover();
  await page.clock.runFor(7000);
  await expect(current(page)).toHaveText(titles[0]);
  await page.getByRole('region', { name: 'Projetos selecionados' }).focus();
  await page.mouse.move(0, 0);
  await page.clock.runFor(7000);
  await expect(current(page)).toHaveText(titles[0]);
  await page.getByRole('button', { name: 'Ver projeto em detalhe' }).focus();
  await page.clock.runFor(6500);
  await expect(current(page)).toHaveText(titles[1]);
});

test('gesto horizontal no celular troca o cartão e gesto vertical permite rolar', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto('/');
  await page.locator('.project-deck').scrollIntoViewIfNeeded();
  const client = await context.newCDPSession(page);
  const swipe = async (dx, dy) => {
    const box = await page.locator('.card-swap-slot[data-front] img').boundingBox();
    const x = box.x + box.width * .7;
    const y = box.y + box.height * .65;
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let i = 1; i <= 12; i++) {
      await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * i / 12, y: y + dy * i / 12 }] });
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  await swipe(-150, 0);
  await expect(current(page)).toHaveText(titles[1]);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  // A tap on the new front card also waits for the swap to settle.
  await page.getByRole('button', { name: `Ampliar imagem: ${titles[1]}` }).tap();
  await expect(page.getByRole('dialog')).toContainText(titles[1]);
  await page.getByRole('button', { name: 'Fechar imagem' }).tap();
  await page.locator('.project-deck').scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => scrollY);
  await swipe(0, -100);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 20);
  await expect(current(page)).toHaveText(titles[1]);
  await context.close();
});

test('cartões e controles cabem em telas pequenas', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (let index = 0; index < titles.length; index++) {
    await expect(current(page)).toHaveText(titles[index]);
    const image = page.locator('.card-swap-slot[data-front] img');
    await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
    const box = await image.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(320);
    await page.getByRole('button', { name: 'Próximo projeto' }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  }
});
