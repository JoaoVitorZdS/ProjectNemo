// src/utils/processarConteudoEbook.js
export function processarConteudoEbook(capitulos) {
  return capitulos.map(capitulo => {
    // Regex para identificar diferentes tipos de elementos
    const regexTitulo = /^(Capítulo\s\d+[:]?.*)$/gm;
    const regexSubtitulo = /^##\s*(.*)$/gm;
    const regexLista = /^-\s+(.*)$/gm;
    const regexImagem = /!\[(.*?)\]\((.*?)\)/g;

    let elementos = [];

    // Processar o conteúdo do capítulo para identificar os elementos
    let match;
    let conteudo = capitulo.conteudo;

    // Títulos
    while ((match = regexTitulo.exec(conteudo)) !== null) {
      elementos.push({ tipo: 'titulo', texto: match[1] });
    }

    // Subtítulos
    while ((match = regexSubtitulo.exec(conteudo)) !== null) {
      elementos.push({ tipo: 'subtitulo', texto: match[1] });
    }

    // Listas
    while ((match = regexLista.exec(conteudo)) !== null) {
      elementos.push({ tipo: 'lista', itens: match[1].split(',') });
    }

    // Imagens
    while ((match = regexImagem.exec(conteudo)) !== null) {
      elementos.push({ tipo: 'imagem', url: match[2], legenda: match[1] });
    }

    // Parágrafos padrão
    const paragrafos = conteudo.split(/\n\n+/).filter(p => !regexTitulo.test(p) && !regexSubtitulo.test(p) && !regexLista.test(p) && !regexImagem.test(p));
    paragrafos.forEach(p => elementos.push({ tipo: 'paragrafo', texto: p }));

    return {
      nome: capitulo.nome,
      elementos
    };
  });
}
