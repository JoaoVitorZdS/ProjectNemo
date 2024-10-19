// src/components/EbookViewer/EbookViewer.js

import React, { useState, useEffect } from 'react';
import './EbookViewer.css';

const EbookViewer = ({ ebookData }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [darkMode, setDarkMode] = useState(false);

    // Função para processar o conteúdo do eBook em capítulos e páginas
    const processarConteudo = (ebook) => {
        const capitulos = ebook.capitulos.map((capitulo, index) => {
            const paginas = capitulo.elementos.map((elemento, i) => (
                <section key={`${index}-${i}`} className="pagina">
                    <h2>{capitulo.nome}</h2>
                    <div dangerouslySetInnerHTML={{ __html: elemento.texto }} />
                </section>
            ));
            return paginas;
        });
        return capitulos.flat();
    };

    const [sections, setSections] = useState([]);

    useEffect(() => {
        if (ebookData) {
            // Processa o conteúdo do eBook para obter as seções
            const processedSections = processarConteudo(ebookData);
            setSections(processedSections);
        }
    }, [ebookData]);

    const showPage = (index) => {
        if (index >= 0 && index < sections.length) {
            setCurrentPage(index);
        }
    };

    const nextPage = () => showPage(currentPage + 1);
    const previousPage = () => showPage(currentPage - 1);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    return (
        <div className={`ebook-viewer ${darkMode ? 'dark-mode' : ''}`}>
            <div className="floating-buttons">
                <button onClick={toggleDarkMode}>
                    {darkMode ? '☀️' : '🌙'}
                </button>
            </div>
            <main>
                {sections.length > 0 && sections.map((section, index) => (
                    <div
                        key={index}
                        className={`pagina ${index === currentPage ? 'active' : ''}`}
                    >
                        {section}
                    </div>
                ))}
            </main>
            <div className="pagination-controls">
                <button onClick={previousPage}>&larrlp;</button>
                <span id="page-info">{`${currentPage + 1} de ${sections.length}`}</span>
                <button onClick={nextPage}>&rarrlp;</button>
            </div>
        </div>
    );
};

export default EbookViewer;
