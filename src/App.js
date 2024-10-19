// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Menu from './components/Menu/Menu';
import Home from './components/Home/Home';
import DashboardCliente from './components/DashboardCliente/DashboardCliente';
import DashboardCriador from './components/DashboardCriador/DashboardCriador';
import Reader from './components/Reader/Reader';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [eBooks, setEBooks] = useState([]);
  const [selectedEbook, setSelectedEbook] = useState(null);

  useEffect(() => {
    initializeLocalStorage();
    loadProdutos();
    loadCarrinho();
    loadEBooks();

    const savedTheme = localStorage.getItem('dark-mode');
    if (savedTheme === 'enabled') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }

    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const savedUserType = localStorage.getItem('userType');
    if (loggedIn && savedUserType) {
      setIsLoggedIn(true);
      setUserType(savedUserType);
      setCurrentPage(savedUserType === 'cliente' ? 'dashboard-cliente' : 'dashboard-criador');
    }
  }, []);

  const initializeLocalStorage = () => {
    const initialData = {
      usuarios: [
        { email: 'cliente@example.com', senha: '1234', tipo: 'cliente' },
        { email: 'criador@example.com', senha: '5678', tipo: 'criador' }
      ],
      produtos: [
        { id: 1, nome: 'Curso de React', tipo: 'curso', adquiridos: ['cliente@example.com'] },
        { id: 2, nome: 'Curso de JavaScript', tipo: 'curso', adquiridos: [] }
      ],
      carrinho: [],
      eBooks: []
    };

    if (!localStorage.getItem('appData')) {
      localStorage.setItem('appData', JSON.stringify(initialData));
    }
  };

  const loadEBooks = () => {
    const appData = JSON.parse(localStorage.getItem('appData'));
    if (appData && appData.eBooks) {
      setEBooks(appData.eBooks);
    }
  };

  const salvarEbook = (novoEbook) => {
    const appData = JSON.parse(localStorage.getItem('appData')) || {};

    if (!Array.isArray(appData.eBooks)) {
      appData.eBooks = [];
    }

    novoEbook.id = appData.eBooks.length + 1;
    appData.eBooks.push(novoEbook);

    localStorage.setItem('appData', JSON.stringify(appData));
    setEBooks([...appData.eBooks]);
    toast.success('eBook salvo com sucesso!');
  };

  const loadProdutos = () => {
    const appData = JSON.parse(localStorage.getItem('appData'));
    if (appData && appData.produtos) {
      setProdutos(appData.produtos);
    }
  };

  const loadCarrinho = () => {
    const appData = JSON.parse(localStorage.getItem('appData'));
    if (appData && Array.isArray(appData.carrinho)) {
      setCarrinho(appData.carrinho);
    } else {
      setCarrinho([]);
    }
  };

  const addToCarrinho = (produtoId) => {
    const appData = JSON.parse(localStorage.getItem('appData'));
    if (!Array.isArray(appData.carrinho)) {
      appData.carrinho = [];
    }

    const produtoJaNoCarrinho = appData.carrinho.includes(produtoId);
    if (!produtoJaNoCarrinho) {
      appData.carrinho.push(produtoId);
      localStorage.setItem('appData', JSON.stringify(appData));
      setCarrinho([...appData.carrinho]);
      toast.success('Produto adicionado ao carrinho!');
    } else {
      toast.info('O produto já está no carrinho.');
    }
  };

  const adicionarEbook = (novoEbook) => {
    const appData = JSON.parse(localStorage.getItem('appData'));
    novoEbook.id = appData.eBooks.length + 1;
    appData.eBooks.push(novoEbook);
    localStorage.setItem('appData', JSON.stringify(appData));
    setEBooks([...appData.eBooks]);
    toast.success('eBook adicionado com sucesso!');
  };

  const editarEbook = (id, eBookAtualizado) => {
    const appData = JSON.parse(localStorage.getItem('appData'));
    const index = appData.eBooks.findIndex(e => e.id === id);
    if (index !== -1) {
      appData.eBooks[index] = { ...appData.eBooks[index], ...eBookAtualizado };
      localStorage.setItem('appData', JSON.stringify(appData));
      setEBooks([...appData.eBooks]);
      alert('eBook atualizado com sucesso!');
    }
  };

  const excluirEbook = (id) => {
    const appData = JSON.parse(localStorage.getItem('appData'));
    appData.eBooks = appData.eBooks.filter(e => e.id !== id);
    localStorage.setItem('appData', JSON.stringify(appData));
    setEBooks([...appData.eBooks]);
    toast.info('eBook excluído com sucesso!');
  };

  const comprarProdutos = () => {
    const appData = JSON.parse(localStorage.getItem('appData'));
    const currentUser = localStorage.getItem('userType') === 'cliente' ? 'cliente@example.com' : null;

    if (!currentUser) {
      toast.error('Você precisa estar logado como cliente para comprar produtos.');
      return;
    }

    appData.carrinho.forEach(produtoId => {
      const produto = appData.produtos.find(p => p.id === produtoId);
      if (produto && !produto.adquiridos.includes(currentUser)) {
        produto.adquiridos.push(currentUser);
      }
    });

    appData.carrinho = [];
    localStorage.setItem('appData', JSON.stringify(appData));
    setCarrinho([]);
    loadProdutos();
    toast.success('Compra realizada com sucesso!');
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('dark-mode', 'enabled');
      toast.info("Modo escuro ativado");
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('dark-mode', 'disabled');
      toast.info("Modo claro ativado");
    }
  };

  const handleLogin = (type) => {
    setIsLoggedIn(true);
    setUserType(type);
    setCurrentPage(type === 'cliente' ? 'dashboard-cliente' : 'dashboard-criador');
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userType', type);
    toast.success(`Bem-vindo, ${type === 'cliente' ? 'Cliente' : 'Criador'}!`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setCurrentPage('home');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    toast.info("Você saiu da conta");
  };

  const visualizarEbook = (ebook) => {
    setSelectedEbook(ebook);
    setCurrentPage('reader');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'login':
        return <Login handleLogin={handleLogin} />;
      case 'register':
        return <Register />;
      case 'dashboard-cliente':
        return <DashboardCliente produtos={produtos} addToCarrinho={addToCarrinho} comprarProdutos={comprarProdutos} carrinho={carrinho} />;
      case 'dashboard-criador':
        return <DashboardCriador salvarEbook={salvarEbook} eBooks={eBooks} editarEbook={editarEbook} excluirEbook={excluirEbook} visualizarEbook={visualizarEbook} />;
      case 'reader':
        return <Reader ebookData={selectedEbook} />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="App">
      <Menu
        isLoggedIn={isLoggedIn}
        userType={userType}
        handleLogout={handleLogout}
        setCurrentPage={setCurrentPage}
      />
      <div className="content">
        <button className="button theme-toggle" onClick={toggleTheme}>
          Alternar Modo Claro/Escuro
        </button>
        {renderPage()}
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
