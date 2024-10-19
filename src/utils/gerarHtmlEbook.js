// src/utils/gerarHtmlEbook.js
export function gerarHtmlEbook(eBook) {
  let html = `
    <html>
    <head>
      <title>${eBook.titulo}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .titulo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .subtitulo { font-size: 18px; font-weight: bold; margin-top: 20px; }
        .paragrafo { margin: 15px 0; }
        .imagem { text-align: center; margin: 20px 0; }
        .imagem img { max-width: 100%; }
        .legenda { font-size: 12px; color: #555; }
        .lista { margin-left: 20px; }
      </style>
    </head>
    <body>
      <h1>${eBook.titulo}</h1>
      <p><strong>Resumo:</strong> ${eBook.resumo}</p>
  `;

  eBook.capitulos.forEach(capitulo => {
    html += `<h2>${capitulo.nome}</h2>`;
    capitulo.elementos.forEach(elemento => {
      switch (elemento.tipo) {
        case 'titulo':
          html += `<div class="titulo">${elemento.texto}</div>`;
          break;
        case 'subtitulo':
          html += `<div class="subtitulo">${elemento.texto}</div>`;
          break;
        case 'paragrafo':
          html += `<div class="paragrafo">${elemento.texto}</div>`;
          break;
        case 'imagem':
          html += `<div class="imagem"><img src="${elemento.url}" alt="${elemento.legenda}"><div class="legenda">${elemento.legenda}</div></div>`;
          break;
        case 'lista':
          html += `<ul class="lista">${elemento.itens.map(item => `<li>${item}</li>`).join('')}</ul>`;
          break;
        default:
          break;
      }
    });
  });

  html += `
    </body>
    </html>
  `;

  return html;
}
