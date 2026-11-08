import { defineConfig } from 'vite';
import { cpSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

// app.html is the editable Vite entry; index.html is the generated deployable site.
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
      const entry = resolve(dir, 'app.html');
      if (!existsSync(entry)) return;
      copyFileSync(entry, resolve(dir, 'index.html'));
      rmSync(entry);
      const assets = resolve(process.cwd(), 'assets');
      if (existsSync(assets)) cpSync(assets, resolve(dir, 'assets'), { recursive: true });
      copyFileSync(resolve(process.cwd(), 'favicon.svg'), resolve(dir, 'favicon.svg'));
    }
  }]
});
