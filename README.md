# Stela Maris Arquitetura & Engenharia

Website oficial, em React + Vite. Conteúdo institucional e imagens originados dos próprios materiais fornecidos neste repositório.

## Execução

- `npm install`
- `npm run dev` — ambiente local
- `npm run build` — site estático de produção em `dist/`
- `npm run preview` — pré-visualização da compilação

## Publicação na Hostinger

Na hospedagem de sites estáticos, publique **o conteúdo da pasta `dist/`** dentro de `public_html/` (não os arquivos-fonte do repositório). Em hospedagem compatível com Node, execute `npm install && npm run build` como etapa de build e use `dist` como diretório publicado. Todas as imagens necessárias estão em `public/assets/` e são incluídas automaticamente na compilação; não há variáveis de ambiente nem serviços de backend necessários.

A navegação é realizada por âncoras na página inicial. O formulário de orçamento abre uma conversa no WhatsApp com as informações preenchidas; não coleta dados em servidor. O botão de localização abre Google Maps e a página também possui mapa incorporado.

## Fontes de informação

O arquivo `informações para o site` contém dados institucionais, endereço, horários e contatos. Não foram criados depoimentos, preços ou informações de serviços além das categorias ali documentadas.

O efeito interativo de lettering é baseado no componente `TechText` fornecido, do React Bits, com fallback estático para preferência por movimento reduzido.
