// src/components/DashboardCriador/DashboardCriador.js

import React, { useState, useEffect, useRef } from 'react';
import './DashboardCriador.css';
import EditorCapitulo from '../EditorCapítulos/EditorCapitulo';
import { processarConteudoEbook } from '../../utils/processarConteudoEbook';
import { gerarHtmlEbook } from '../../utils/gerarHtmlEbook';
import ReactQuill from 'react-quill';

function DashboardCriador({ salvarEbook, editarEbook, excluirEbook, eBooks }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [step, setStep] = useState(0);
  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [numCapitulos, setNumCapitulos] = useState(1);
  const [capitulos, setCapitulos] = useState([]);
  const [editingEbookId, setEditingEbookId] = useState(null);
const quillRef = useRef(null);
  useEffect(() => {
    if (!isModalOpen) {
      // Reseta o formulário quando o modal é fechado
      resetForm();
    }
  }, [isModalOpen]);

  const openModalForCreation = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    resetForm();
  };

 const openModalForEditing = (ebook) => {
    setIsModalOpen(true);
    setIsEditing(true);
    setEditingEbookId(ebook.id);
    setTitulo(ebook.titulo);
    setResumo(ebook.resumo);
    setNumCapitulos(ebook.capitulos.length);

    // Converter os elementos do capítulo para HTML concatenado
    const capitulosFormatados = ebook.capitulos.map((cap) => {
        const conteudoHtml = cap.elementos.map((elemento) => elemento.texto).join('');
        return {
            ...cap,
            conteudo: conteudoHtml
        };
    });

    // Atualizar os capítulos no estado
    console.log('Abrindo modal para edição, capitulos formatados:', capitulosFormatados);
    setCapitulos(capitulosFormatados);
};


  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNextStep = () => {
    if (step < capitulos.length + 1) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleAddCapitulos = () => {
    const novosCapitulos = Array.from({ length: numCapitulos }, (_, index) => ({
      nome: `Capítulo ${index + 1}`,
      conteudo: ''
    }));
    setCapitulos(novosCapitulos);
    setStep(1); // Vai para o primeiro capítulo
  };

  const handleTituloChange = (e) => {
    setTitulo(e.target.value);
  };

  const handleResumoChange = (e) => {
    setResumo(e.target.value);
  };

  const handleCapituloChange = (index, conteudo) => {
    const novosCapitulos = [...capitulos];
    novosCapitulos[index].conteudo = conteudo;
    setCapitulos(novosCapitulos);
    console.log(`Capítulo ${index + 1} atualizado com o novo conteúdo:`, conteudo);
};

  const handleNomeCapituloChange = (index, nome) => {
    const novosCapitulos = [...capitulos];
    novosCapitulos[index].nome = nome;
    setCapitulos(novosCapitulos);
  };

  const handleSaveEbook = () => {
    const eBook = {
      id: isEditing ? editingEbookId : eBooks.length + 1,
      titulo,
      resumo,
      capitulos: processarConteudoEbook(capitulos)
    };

    if (isEditing) {
      editarEbook(editingEbookId, eBook);
      alert('eBook editado com sucesso!');
    } else {
      salvarEbook(eBook);
      alert('eBook criado e salvo com sucesso!');
    }
    closeModal();
  };

  const handleExcluirEbook = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este eBook?')) {
      excluirEbook(id);
      alert('eBook excluído com sucesso!');
    }
  };

   const visualizarEbook = (ebook) => {
        const htmlContent = gerarHtmlEbook(ebook);
        const novaJanela = window.open('', '_blank');
        novaJanela.document.write(htmlContent);
        novaJanela.document.close();
    };

  const resetForm = () => {
    setTitulo('');
    setResumo('');
    setNumCapitulos(1);
    setCapitulos([]);
    setStep(0);
    setEditingEbookId(null);
  };

  return (
    <div className="dashboard-criador">
      <h2>Dashboard do Criador</h2>
      <p>Gerencie seus eBooks e crie novos conteúdos aqui.</p>
      <button className="button create-ebook-button" onClick={openModalForCreation}>
        Criar Novo eBook
      </button>

      <div className="ebooks-criados">
        <h3>Seus eBooks Criados</h3>
        {eBooks.length > 0 ? (
          <ul>
            {eBooks.map((ebook) => (
              <li key={ebook.id}>
                <strong>{ebook.titulo}</strong>
                <p>{ebook.resumo}</p>
                <button
                  className="button visualizar-ebook"
                  onClick={() => visualizarEbook(ebook)}
                >
                  Visualizar
                </button>
                <button
                  className="button editar-ebook"
                  onClick={() => openModalForEditing(ebook)}
                >
                  Editar
                </button>
                <button
                  className="button excluir-ebook"
                  onClick={() => handleExcluirEbook(ebook.id)}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Você ainda não criou nenhum eBook.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-button" onClick={closeModal}>
              X
            </button>
            <div className="navigation-indicators">
              {Array.from({ length: capitulos.length + 2 }).map((_, index) => (
                <span
                  key={index}
                  className={`indicator ${index === step ? 'active' : ''}`}
                  onClick={() => setStep(index)}
                ></span>
              ))}
            </div>

            {step === 0 && (
              <div className="tutorial-step">
                <h3>Passo 1: Definir Título e Resumo</h3>
                <label htmlFor="titulo">Título do eBook</label>
                <input
                  type="text"
                  id="titulo"
                  placeholder="Digite o título do eBook"
                  value={titulo}
                  onChange={handleTituloChange}
                  required
                />
                <label htmlFor="resumo">Resumo</label>
                <textarea
                  id="resumo"
                  placeholder="Digite um resumo para o eBook"
                  value={resumo}
                  onChange={handleResumoChange}
                  required
                ></textarea>
                <label htmlFor="numCapitulos">Número de Capítulos</label>
                <input
                  type="number"
                  id="numCapitulos"
                  placeholder="Digite o número de capítulos"
                  value={numCapitulos}
                  onChange={(e) => setNumCapitulos(parseInt(e.target.value))}
                  required
                />
                <button className="button" onClick={handleAddCapitulos}>
                  Próximo
                </button>
              </div>
            )}

             {capitulos.map((capitulo, index) => (
                            <div key={index} className="capitulo-step">
                                <h3>Capítulo {index + 1}</h3>
                                
                                <ReactQuill
                                    ref={quillRef}
                                    value={capitulo.conteudo}
                                    onChange={(conteudo) => handleCapituloChange(index, conteudo)}
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
                        ))}

            {step === capitulos.length + 1 && (
              <div className="final-step">
                <h3>Resumo do eBook</h3>
                <p>Revise as informações e clique em "Concluir" para salvar o eBook.</p>
                <button className="button" onClick={handlePreviousStep}>
                  Voltar
                </button>
                <button className="button" onClick={handleSaveEbook}>
                  Concluir
                </button>
              </div>
            )}
          </div>
        </div>  
      )}
    </div>
  );
}

export default DashboardCriador;
