import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; 

function HomePage() {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>Bem-vindo ao Sistema de Chatbot</h1>
      </header>
      <nav className="homepage-nav">
        <Link to="/create-bot" className="nav-link">Criar Novo Chatbot</Link>
        <Link to="/chat" className="nav-link">Conversar com o Chatbot</Link>
      </nav>
    </div>
  );
}

export default HomePage;
