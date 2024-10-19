// src/components/DashboardCriador/DashboardCriador.js
import React, { useState } from 'react';
import './DashboardCriador.css';

function DashboardCriador({ salvarEbook, eBooks }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [capitulos, setCapitulos] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!titulo || !descricao || !capitulos) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    // Salva o eBook
    salvarEbook({ titulo, descricao, capitulos });

    // Limpa os campos do formulário
    setTitulo('');
    setDescricao('');
    setCapitulos('');
  };

  return (
    <div className="dashboard-criador">
      <h2>Dashboard do Criador</h2>
      <div className="ebook-form">
        <h3>Criar Novo eBook</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <textarea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          ></textarea>
          <textarea
            placeholder="Capítulos (separados por vírgula)"
            value={capitulos}
            onChange={(e) => setCapitulos(e.target.value)}
            required
          ></textarea>
          <button type="submit" className="button">
            Salvar eBook
          </button>
        </form>
      </div>

      <div className="ebook-list">
        <h3>Seus eBooks</h3>
        {eBooks.length > 0 ? (
          <ul>
            {eBooks.map((ebook, index) => (
              <li key={index}>
                <strong>{ebook.titulo}</strong>
                <p>{ebook.descricao}</p>
                <small>Capítulos: {ebook.capitulos.split(',').length}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>Você ainda não criou nenhum eBook.</p>
        )}
      </div>
    </div>
  );
}

export default DashboardCriador;
