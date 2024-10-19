import React, { useState } from 'react';
import './Menu.css';
import homeIcon from "../../assets/home-icon.svg"
import cartIcon from "../../assets/cart-icon.svg"
import historyIcon from "../../assets/history-icon.svg"
import editIcon from "../../assets/edit-icon.svg"

function Menu({ isLoggedIn, userType, handleLogout, setCurrentPage }) {
  return (
    <div className="menu">
      <nav>
        <ul>
          <li>
            <button onClick={() => setCurrentPage('home')}>
              <img src={homeIcon} alt="Home" className="icon" />
              <span>Home</span>
            </button>
          </li>
          <li>
            <button onClick={() => setCurrentPage('')}>
              <img src={cartIcon} alt="Carrinho" className="icon" />
              <span>Carrinho</span>
            </button>
          </li>
          <li>
            <button onClick={() => setCurrentPage('')}>
              <img src={historyIcon} alt="Histórico" className="icon" />
              <span>Histórico</span>
            </button>
          </li>
          <li>
            <button onClick={() => setCurrentPage('')}>
              <img src={editIcon} alt="Criar eBook" className="icon" />
              <span>Criar eBook</span>
            </button>
          </li>
        </ul>
      </nav>
      <div className="bottom-section">
        {isLoggedIn ? (
          <button className="button" onClick={() => setCurrentPage(userType === 'cliente' ? 'dashboard-cliente' : 'dashboard-criador')}>
            Perfil
          </button>
        ) : (
          <>
            <button className="button" onClick={() => setCurrentPage('login')}>Login</button>
            <button className="button" onClick={() => setCurrentPage('register')}>Registrar</button>
          </>
        )}
        {isLoggedIn && (
          <button className="button" onClick={handleLogout}>Sair</button>
        )}
      </div>
    </div>
  );
}

export default Menu;