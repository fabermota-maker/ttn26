# Assets da LP Nataleluia

As imagens da página estão, por padrão, referenciadas pelas URLs temporárias da API MCP do Figma (válidas cerca de 7 dias).

Para produção:

1. Exporte PNG/WebP/SVG a partir do arquivo [LP-Nataleluia](https://www.figma.com/design/2UNvWMUJHKf16Irx96pw8T/LP-Nataleluia) (nós principais: `293:746`, `293:842`, `293:847`, `358:1143`, `258:360`, `293:835`, `293:763`, `399:958`, `394:986`).
2. Salve os arquivos nesta pasta com nomes estáveis (ex.: `hero-fundo.png`, `logo-nataleluia.svg`).
3. No `index.html`, troque cada `src="https://www.figma.com/api/mcp/asset/..."` pelo caminho relativo (ex.: `assets/hero-fundo.png`).

Opcional: use `download-sample.ps1` nesta pasta como modelo para baixar URLs MCP via `Invoke-WebRequest` (confira o tipo MIME / extensão ao renomear arquivos).
