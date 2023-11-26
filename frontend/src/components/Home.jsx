import React from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";

function Home() {
  return (
    <div>
      <h1 className="home-title">
        Bem-vindo às configurações de chatbot WhatsApp
      </h1>

      <div>
        <p>Aqui você pode criar e editar seu chatbot</p>{" "}
      </div>

      <div>
        <Link to="/" className="back-link">
          Voltar para a listagem
        </Link>
      </div>
    </div>
  );
}

export default Home;
