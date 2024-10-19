// src/components/EditorCapítulos/EditorCapitulo.js

import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './EditorCapitulo.css';

function EditorCapitulo({ conteudoInicial, onChange }) {
    const [conteudo, setConteudo] = useState('');
    const quillRef = useRef(null);

    useEffect(() => {
        console.log('useEffect - Conteúdo Inicial:', conteudoInicial);
        console.log('useEffect - Conteúdo Atual:', conteudo);

        // Atualiza o conteúdo do editor se o conteúdo inicial não for vazio
        if (conteudoInicial && conteudoInicial !== conteudo) {
            console.log('useEffect - Atualizando conteúdo');
            setConteudo(conteudoInicial);
            if (quillRef.current && quillRef.current.getEditor) {
                const editor = quillRef.current.getEditor();
                editor.setContents(editor.clipboard.convert(conteudoInicial));
                console.log('useEffect - Conteúdo definido no Quill:', conteudoInicial);
            }
        }
    }, [conteudoInicial]);

    const handleChange = (value, delta, source) => {
        console.log('handleChange - Novo Valor:', value);
        console.log('handleChange - Fonte:', source);

        // Apenas atualiza se a alteração vier do usuário
        if (source === 'user') {
            console.log('handleChange - Atualizando estado do conteúdo');
            setConteudo(value);
            onChange(value);
        }
    };

    return (
        <div className="editor-container">
            <ReactQuill
                ref={quillRef}
                value={conteudo}
                onChange={handleChange}
                modules={{
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link', 'image'],
                        [{ 'align': [] }],
                        ['clean'],
                    ],
                }}
                formats={[
                    'header',
                    'bold',
                    'italic',
                    'underline',
                    'list',
                    'bullet',
                    'link',
                    'image',
                    'align',
                ]}
                theme="snow"
            />
        </div>
    );
}

export default EditorCapitulo;
