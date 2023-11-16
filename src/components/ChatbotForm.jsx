import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/ChatbotForm.css";

function ChatbotForm() {
  const [botName, setBotName] = useState("");
  const [botVersion, setBotVersion] = useState("3.5");
  const [instructions, setInstructions] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // lidar com logica, como envio dos dados para um backend ou diretamente para a API da OpenAI? estudar melhor como fazer isso
  };

  return (
    <div className="chatbot-form-container">
      <div className="nav-back">
        <Link to="/" className="back-button">
          Voltar para a HomePage
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="chatbot-form">
        <label htmlFor="botName">Nome do Chatbot:</label>
        <input
          type="text"
          id="botName"
          value={botName}
          onChange={(e) => setBotName(e.target.value)}
        />

        <label htmlFor="botVersion">Versão do Chatbot:</label>
        <select
          id="botVersion"
          value={botVersion}
          onChange={(e) => setBotVersion(e.target.value)}
        >
          <option value="3.5">GPT-3.5</option>
        </select>

        <label htmlFor="instructions">Prompt:</label>
        <textarea
          id="instructions"
          placeholder="Digite as instruções de comportamento do chatbot aqui"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />

        <label htmlFor="file">Documento (.txt):</label>
        <input
          type="file"
          id="file"
          accept=".txt"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit">Criar Chatbot</button>
      </form>
    </div>
  );
}

export default ChatbotForm;
