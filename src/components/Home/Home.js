// src/components/Home/Home.js
import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <h2>Dashboard de Cursos</h2>

      <div className="product-carousel">
        <h3>Produtos Adquiridos</h3>
        <div className="carousel-items">
          <div className="product-item">
            <img src="https://via.placeholder.com/150" alt="Produto Adquirido 1" />
            <p>Produto 1</p>
          </div>
          <div className="product-item">
            <img src="https://via.placeholder.com/150" alt="Produto Adquirido 2" />
            <p>Produto 2</p>
          </div>
          <div className="product-item">
            <img src="https://via.placeholder.com/150" alt="Produto Adquirido 3" />
            <p>Produto 3</p>
          </div>
        </div>
      </div>

      <div className="product-carousel">
        <h3>Sugestões</h3>
        <div className="carousel-items">
          <div className="product-item">
            <img src="https://via.placeholder.com/150" alt="Sugestão 1" />
            <p>Sugestão 1</p>
          </div>
          <div className="product-item">
            <img src="https://via.placeholder.com/150" alt="Sugestão 2" />
            <p>Sugestão 2</p>
          </div>
          <div className="product-item">
            <img src="https://via.placeholder.com/150" alt="Sugestão 3" />
            <p>Sugestão 3</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
