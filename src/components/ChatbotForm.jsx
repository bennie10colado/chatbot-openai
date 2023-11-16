import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../styles/ChatbotForm.css";

function ChatbotForm() {
  const [botName, setBotName] = useState("");
  const [botVersion, setBotVersion] = useState("3.5");
  const [instructions, setInstructions] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", botName);
    formData.append("version", botVersion);
    formData.append("instructions", instructions);
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/openai",
        formData
      );

      if (response.status === 200) {
        console.log("Chatbot criado com sucesso!");
      } else {
        console.error("Erro ao criar o chatbot");
      }
    } catch (error) {
      console.error("Erro ao enviar a solicitação para o backend", error);
    }
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
