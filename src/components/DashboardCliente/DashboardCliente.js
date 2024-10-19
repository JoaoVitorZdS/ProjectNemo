// src/components/DashboardCliente/DashboardCliente.js
import React from 'react';
import './DashboardCliente.css';

function DashboardCliente({ produtos, addToCarrinho, comprarProdutos, carrinho }) {
  // Obtém o usuário logado a partir do localStorage
  const currentUser = localStorage.getItem('userType') === 'cliente' ? 'cliente@example.com' : null;

  // Filtra os produtos adquiridos e sugestões
  const produtosAdquiridos = produtos.filter(produto => produto.adquiridos.includes(currentUser));
  const sugestoes = produtos.filter(produto => !produto.adquiridos.includes(currentUser));

  return (
    <div className="dashboard-cliente">
      <h2>Dashboard do Cliente</h2>

      <div className="product-carousel">
        <h3>Produtos Adquiridos</h3>
        <div className="carousel-items">
          {produtosAdquiridos.length > 0 ? produtosAdquiridos.map(produto => (
            <div key={produto.id} className="product-item">
              <img src="https://via.placeholder.com/150" alt={produto.nome} />
              <p>{produto.nome}</p>
            </div>
          )) : <p>Nenhum produto adquirido.</p>}
        </div>
      </div>

      <div className="product-carousel">
        <h3>Sugestões</h3>
        <div className="carousel-items">
          {sugestoes.length > 0 ? sugestoes.map(produto => (
            <div key={produto.id} className="product-item">
              <img src="https://via.placeholder.com/150" alt={produto.nome} />
              <p>{produto.nome}</p>
              <button className="button" onClick={() => addToCarrinho(produto.id)}>
                Adicionar ao Carrinho
              </button>
            </div>
          )) : <p>Nenhuma sugestão disponível.</p>}
        </div>
      </div>

      <div className="cart-section">
        <h3>Carrinho de Compras</h3>
        <div className="cart-items">
          {carrinho.length > 0 ? carrinho.map(produtoId => {
            const produto = produtos.find(p => p.id === produtoId);
            return (
              <div key={produto.id} className="cart-item">
                <p>{produto.nome}</p>
              </div>
            );
          }) : <p>O carrinho está vazio.</p>}
        </div>
        {carrinho.length > 0 && (
          <button className="button" onClick={comprarProdutos}>
            Comprar Produtos
          </button>
        )}
      </div>
    </div>
  );
}

export default DashboardCliente;
