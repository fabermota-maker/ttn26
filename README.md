# Nataleluia — Landing Page

Landing page do espetáculo **Nataleluia** (PIB Curitiba). Projeto React com preview local via HTML estático e build opcional com Vite.

## Estrutura do projeto

```
/
├── .cursor/rules/lp-master.mdc   # Regra mestre da LP
├── .vscode/settings.json
├── assets/
│   ├── images/                   # Logos, timeline e imagens locais
│   ├── icons/                    # Monogramas e ícones
│   └── fonts/                    # Fontes locais (quando houver)
├── css/
│   ├── style.css                 # Estilos globais (Vite)
│   └── preview.css               # Estilos do loader preview/index
├── js/
│   ├── app.js                    # Placeholder para JS vanilla
│   ├── preview-loader.js         # Loader do preview.html
│   └── landing-loader.js         # Loader do index.html
├── public/assets/                # Espelho servido estaticamente
├── src/
│   ├── lp_nataleluia_landing_page.jsx  # Componente principal da LP
│   ├── App.jsx
│   └── main.jsx
├── index.html                    # Entrada principal (preview Babel)
├── preview.html                  # Preview alternativo no Cursor
├── robots.txt
└── sitemap.xml
```

## Como abrir localmente

### Preview rápido (sem npm)

1. Sirva a pasta do projeto com um servidor HTTP local (Live Server, `npx serve`, Vite, etc.).
2. Abra `preview.html` ou `index.html` no navegador.
3. Os assets locais são servidos de `public/assets/` (`./assets/images/...`, `./assets/icons/...`).

### Com Vite (opcional)

```bash
npm install
npm run dev
```

> **Nota:** `npm install` pode falhar em pastas do Google Drive compartilhado. Prefira clonar/copiar para disco local se necessário.

## Onde alterar

| Conteúdo | Arquivo / pasta |
|----------|-----------------|
| Textos e layout | `src/lp_nataleluia_landing_page.jsx` |
| Imagens locais | `assets/images/` e `assets/icons/` (espelhar em `public/assets/`) |
| Estilos globais Vite | `css/style.css` |
| Estilos do loader | `css/preview.css` |
| SEO / robots | `index.html`, `robots.txt`, `sitemap.xml` |

## Tecnologias

- React 19 + Vite 8
- Tailwind CSS (CDN no preview; PostCSS no build Vite)
- Preview local com Babel Standalone (sem build)

## Publicação

Antes de publicar:

1. Atualizar `YOUR_DOMAIN` em `sitemap.xml`.
2. Confirmar que `public/assets/` contém todos os arquivos de `assets/`.
3. Testar `index.html` e responsividade (360px–1440px).
4. Verificar console do navegador (sem erros 404 de assets).

## Observações

### Widget de acessibilidade

- `src/AccessibilityWidget.jsx` contém o painel, preferências React, leitura via Web Speech API e tradução. `src/accessibility.css` isola os estilos do widget e os recursos visuais opcionais.
- O botão ao lado de Meu ingresso abre um diálogo nativo com foco contido, Escape, X e fechamento ao clicar fora. Fechar não remove as preferências. Restaurar padrão também interrompe a leitura e restaura português.
- Preferências são salvas em `nataleluia-accessibility-v1`; traduções são armazenadas em `nataleluia-translations-v1`. Falhas de armazenamento privado não impedem o uso.
- Os rótulos do painel têm traduções locais revisadas em português, inglês, alemão, espanhol, italiano e japonês. O conteúdo da LP é traduzido pelo serviço público MyMemory, sem chave ou credenciais, mantendo os nós de texto, links e eventos React. Novos textos da timeline e páginas internas também são detectados.
- A tradução automática envia somente os textos da página ao MyMemory, depende da internet e da cota diária do serviço. Valores digitados em formulários não são enviados. Ao falhar, o painel informa o erro e preserva o conteúdo disponível; português sempre pode ser restaurado. Imagens contendo texto não são traduzidas.
- Vozes e qualidade de pausa/retomada dependem do navegador e do sistema operacional. A leitura usa o idioma selecionado, prioriza pt-BR e exclui menus, rodapé, controles, diálogos e conteúdo oculto. Trocar rota, voz, idioma ou velocidade interrompe a leitura atual.
- A inversão preserva imagens e vídeos HTML com um filtro inverso; imagens aplicadas por CSS podem também ser invertidas. Alto contraste prevalece sobre o modo escuro quando ambos estão ativos.
- O build preserva o carregador Babel usado na prévia, seus componentes JSX e os assets locais. `npm run build` gera `dist/`; não existem scripts de lint ou TypeScript neste projeto.

- Caminhos de assets locais usam `./assets/images/` e `./assets/icons/`.
- Imagens externas (hero, logos de parceiros, timeline recente) permanecem em URLs remotas.
- Duas cópias do projeto podem existir no drive (`2026 WEB DESIGN` e `2026_WEB DESIGN`); manter sincronizadas via Git.
