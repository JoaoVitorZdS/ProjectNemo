// src/components/Register/Register.js
import React, { useState } from 'react';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não correspondem. Tente novamente.');
      return;
    }
    // Simulação de registro (pode ser expandida para integração com um backend no futuro)
    alert('Conta registrada com sucesso!');
    window.location.href = '#login';
  };

  return (
    <div className="register">
      <h2>Registrar</h2>
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
        <input
          type="password"
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className="button" type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default Register;
