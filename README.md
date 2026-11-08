# Stela Maris — Arquitetura & Engenharia

Site institucional criado com **React + Vite**. Os conteúdos oficiais estão em [docs/informacoes-da-empresa.md](docs/informacoes-da-empresa.md).

## Publicação na Hostinger pelo GitHub

Conecte este repositório usando **Sites → Criar site → Aplicativo Web / Web App → Importar repositório GitHub**, selecionando a branch `main`. Para a publicação automática, utilize as configurações que a Hostinger detecta para Vite:

| Configuração | Valor |
| --- | --- |
| Branch | `main` |
| Diretório do aplicativo | `./` (raiz) |
| Versão Node.js | 22 |
| Instalação de dependências | Automática |
| Comando de build | `npm run build` |
| Diretório publicado | `dist` |
| Variáveis de ambiente | Nenhuma |

**Importante:** escolha o fluxo de **Aplicativo Web (React/Vite)**, não a integração **Avançado → Git** destinada a sites PHP/HTML sem compilação. A Hostinger gera `dist/` e publica o resultado; **não é necessário editar o código, instalar bibliotecas manualmente ou enviar `dist/` ao GitHub**. Esse fluxo requer plano Hostinger com suporte a Web Apps (Business ou Cloud).

## Estrutura

```text
.
├── .github/workflows/quality.yml  # build e testes em navegador
├── docs/informacoes-da-empresa.md  # dados oficiais preservados
├── public/
│   ├── assets/
│   │   ├── identidade/              # logotipo
│   │   ├── equipe/                  # fotografia institucional
│   │   └── portfolio/              # imagens utilizadas no site
│   └── favicon.svg
├── src/
│   ├── components/                 # efeito de texto React Bits
│   ├── main.jsx                    # seções e interações
│   └── styles.css                  # design e responsividade
├── tests/site.spec.mjs             # testes de navegador
├── index.html
├── package.json
├── playwright.config.mjs
└── vite.config.js
```

## Desenvolvimento e qualidade

```bash
npm install
npm run dev
npm run build
npm run preview
npm run test:e2e
```

O GitHub Actions compila o site e executa testes com Playwright após cada alteração na `main`.

- Todos os arquivos em `public/` são copiados automaticamente para `dist/` pelo Vite.
- Todas as fotografias publicadas estão dentro de `public/assets/`; não há arquivos de mídia duplicados na raiz.
- O formulário abre uma mensagem pronta no WhatsApp; não armazena informações nem exige backend.
- Contato, endereço, horário e serviços seguem o documento institucional original.
- Nenhum dado sensível ou variável de ambiente é necessário para construir o site.
