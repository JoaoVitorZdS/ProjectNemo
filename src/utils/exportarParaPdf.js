// src/utils/exportarParaPdf.js
import jsPDF from 'jspdf';
import { gerarHtmlEbook } from './gerarHtmlEbook';

export function exportarParaPdf(eBook) {
  const doc = new jsPDF();
  const htmlContent = gerarHtmlEbook(eBook);
  
  doc.html(htmlContent, {
    callback: function (doc) {
      doc.save(`${eBook.titulo}.pdf`);
    },
    x: 10,
    y: 10
  });
}
