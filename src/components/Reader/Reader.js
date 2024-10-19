// src/components/Reader/Reader.js

import React, { useEffect, useState } from 'react';
import './Reader.css';
import { useParams } from 'react-router-dom';

const Reader = ({ eBooks }) => {
    const { id } = useParams();
    const [ebook, setEbook] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const foundEbook = eBooks.find((e) => e.id === parseInt(id));
        if (foundEbook) {
            setEbook(foundEbook);
        }
    }, [id, eBooks]);

    const showPage = (index) => {
        if (index >= 0 && index < ebook.capitulos.length) {
            setCurrentPage(index);
        }
    };

    const nextPage = () => showPage(currentPage + 1);
    const previousPage = () => showPage(currentPage - 1);

    if (!ebook) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="reader">
            <h1>{ebook.titulo}</h1>
            <div className="content">
                <div dangerouslySetInnerHTML={{ __html: ebook.capitulos[currentPage].conteudo }} />
            </div>
            <div className="pagination-controls">
                <button onClick={previousPage}>&larr;</button>
                <span>{currentPage + 1} de {ebook.capitulos.length}</span>
                <button onClick={nextPage}>&rarr;</button>
            </div>
        </div>
    );
};

export default Reader;
