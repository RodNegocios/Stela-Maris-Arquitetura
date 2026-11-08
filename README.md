# Stela Maris Arquitetura & Engenharia

Site institucional em React + Vite, com produção estática pronta na branch **main**.

## Hostinger: conecte o repositório e publique

**Integração de Git/HTML convencional:** selecione a branch `main` e a raiz do repositório como diretório do website (`public_html`). Os arquivos `index.html`, `static/`, `assets/` e `favicon.svg` são suficientes para a publicação, **sem Node.js nem etapa de build**.

**Web App React/Vite:** branch `main`, diretório `./`, Node.js **22**, comando `npm run build`, diretório de saída **`dist`**, sem variáveis de ambiente. A Hostinger compila automaticamente.

O GitHub Actions executa a compilação, testa em navegador e atualiza `index.html` e `static/` da raiz após cada alteração do código-fonte. Verifique o workflow antes de fazer o primeiro deploy.

## Pastas

```text
├── index.html         # HTML de produção (gerado pelo GitHub Actions)
├── static/            # JS/CSS compilado (gerado pelo GitHub Actions)
├── assets/
│   ├── identidade/    # logotipo
│   ├── equipe/        # fotografia institucional
│   └── portfolio/     # projetos utilizados no site
├── favicon.svg
├── app.html           # HTML de entrada do Vite
├── src/               # React, componentes e estilos
├── docs/              # informações oficiais da empresa
├── tests/             # testes responsivos e funcionais
├── .github/workflows/ # validação e atualização da versão estática
├── package.json
├── package-lock.json  # gerado pelo workflow
├── playwright.config.mjs
└── vite.config.js
```

## Desenvolver

```bash
npm install
npm run dev
npm run build
npm run preview
npm run test:e2e
```

O ambiente de desenvolvimento abre `/app.html`. O build gera `dist/index.html` para implantação. Ao editar o conteúdo, altere os arquivos em `src/` e `app.html`, não o `index.html` compilado.

Conteúdo institucional: [docs/informacoes-da-empresa.md](docs/informacoes-da-empresa.md). O formulário envia uma mensagem pelo WhatsApp; não há backend nem segredos de ambiente.
