# Publicação da LP Nataleluia

## Pacote para o servidor

Execute `npm ci` na primeira preparação e `npm run build:release` sempre que a LP mudar.
O comando gera `dist/` e verifica caminhos locais, nomes de arquivos compatíveis com Linux e ausência de pastas de desenvolvimento.

`nataleluia-publicacao.zip` é uma cópia pronta da versão conferida nesta preparação: extraia seu conteúdo diretamente na pasta pública. Depois de alterações futuras, gere novamente `dist/` e atualize o ZIP antes de enviá-lo. No PowerShell: `Compress-Archive -Path .\dist\* -DestinationPath .\nataleluia-publicacao.zip -Force`.

Envie **o conteúdo de `dist/`** para a raiz pública do domínio (normalmente `public_html/`, `www/` ou `htdocs/`) ou para a subpasta desejada. O `index.html` deve ficar diretamente nessa pasta.

```text
public_html/
  index.html
  robots.txt
  assets/     imagens, vídeos, fontes e CSS gerado
  js/         carregamento e tela inicial
  src/        três componentes JSX carregados pela LP
```

Não envie o repositório completo: `.git/`, `node_modules/`, `restore/`, `public/`, arquivos `.env`, scripts de desenvolvimento e configurações não fazem parte do upload. As cópias antigas em `public/public/` permanecem no projeto, mas são excluídas do build.

## Requisitos do servidor

- Hospedagem estática com HTTPS. Não é necessário Node.js ou PHP no servidor.
- Servir `index.html` como página inicial e permitir leitura dos arquivos em `assets/`, `js/` e `src/`. Os `.jsx` são buscados como texto pelo carregador Babel; não devem retornar uma página de erro nem ser bloqueados por extensão.
- As rotas usam fragmentos (`#n2026`, `#checkout`, `#evento` etc.). Não é necessário reescrever URLs para implementar essas rotas.
- Os caminhos do build são relativos e funcionam na raiz ou em uma subpasta. Mantenha as três pastas ao lado do `index.html`.
- Preserve os tipos MIME adequados para HTML, JS, CSS, imagens, fontes e vídeos. O servidor precisa disponibilizar o vídeo `hero.mp4` (preferencialmente com suporte a requisições parciais).
- A LP mantém as dependências externas atuais: React, Babel, Tailwind CDN, Google Fonts, Bootstrap Icons e mídias externas. A tradução utiliza MyMemory e a leitura depende das vozes do navegador. A configuração do servidor deve permitir essas origens; uma política CSP restritiva precisa ser adaptada ao carregador atual, que usa compilação no navegador.

## Conferência após upload

1. Abrir a página por HTTPS e conferir o carregamento completo.
2. Testar 2026, Meu ingresso, links de compra, pop-up do Centro de Formação, acessibilidade e timeline.
3. Conferir no navegador a ausência de erros 404 e de arquivos bloqueados.
4. Após substituir arquivos de uma publicação existente, limpar o cache da hospedagem/CDN e atualizar o navegador.

O sitemap da raiz do projeto ainda contém `YOUR_DOMAIN`. Ele não é incluído no pacote para evitar publicar um endereço fictício. Quando o domínio definitivo for informado, atualizar o sitemap com a URL real, incluí-lo na publicação e adicionar a referência correspondente em `robots.txt`. Isso não impede o funcionamento da LP.

Os componentes, textos, imagens escolhidas, estilos e interações da LP não foram reestruturados para esta preparação. O único asset adicionado foi um alias para o monograma SVG já existente, atendendo ao caminho usado nos ingressos.
