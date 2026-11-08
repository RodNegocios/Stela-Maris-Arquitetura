import { defineConfig } from 'vite';
import { cpSync, copyFileSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// The editable Vite entry is app.html; index.html is always a deployable production build.
export default defineConfig({
  base: '/',
  publicDir: false,
  server: { open: '/app.html' },
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    emptyOutDir: true,
    rollupOptions: { input: resolve(process.cwd(), 'app.html') }
  },
  plugins: [{
    name: 'hostinger-static-output',
    closeBundle() {
      const dir = resolve(process.cwd(), 'dist');
      const generated = resolve(dir, 'app.html');
      if (!existsSync(generated)) return;
      const assets = resolve(process.cwd(), 'assets');
      if (existsSync(assets)) cpSync(assets, resolve(dir, 'assets'), { recursive: true });
      copyFileSync(resolve(process.cwd(), 'favicon.svg'), resolve(dir, 'favicon.svg'));
      // Vite fingerprints assets referenced in HTML. Restore their canonical public
      // paths and delete only these redundant copies, never the CSS/JS bundles.
      let html = readFileSync(generated, 'utf8')
        .replace(/\/static\/fachada-contemporanea-[\w-]+\.png/g, '/assets/portfolio/fachada-contemporanea.png')
        .replace(/\/static\/favicon-[\w-]+\.svg/g, '/favicon.svg');
      writeFileSync(resolve(dir, 'index.html'), html);
      rmSync(generated);
      for (const file of readdirSync(resolve(dir, 'static'))) {
        if (/^(fachada-contemporanea-[\w-]+\.png|favicon-[\w-]+\.svg)$/.test(file)) {
          rmSync(resolve(dir, 'static', file));
        }
      }
    }
  }]
});
