// src/components/Login/Login.js
import React, { useState } from 'react';
import './Login.css';

function Login({ handleLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulação de autenticação
    if (email === 'cliente@example.com' && password === '1234') {
      handleLogin('cliente');
    } else if (email === 'criador@example.com' && password === '5678') {
      handleLogin('criador');
    } else {
      alert('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="button" type="submit">Entrar</button>
      </form>
      <p>Não tem uma conta? <a href="#register">Registre-se</a></p>
    </div>
  );
}

export default Login;
