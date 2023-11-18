import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../styles/ChatbotForm.css";

function ChatbotForm() {
  const [botName, setBotName] = useState("");
  const [botVersion, setBotVersion] = useState("GPT-3.5-turbo");
  const [instructions, setInstructions] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({
    botName: "",
    instructions: "",
    file: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({
      botName: "",
      instructions: "",
      file: "",
    });

    let hasError = false;

    if (!botName) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        botName: "Nome do Chatbot é obrigatório",
      }));
      hasError = true;
    }

    if (!instructions) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        instructions: "Instruções são obrigatórias",
      }));
      hasError = true;
    }

    if (!file) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        file: "Arquivo é obrigatório",
      }));
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const formData = new FormData();
    formData.append("name", botName);
    formData.append("version", botVersion);
    formData.append("instructions", instructions);
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/openai",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Resposta da API da OpenAI", response.data, response.config);

      if (response.status === 200) {
        console.log("Chatbot criado com sucesso!");
        setErrors({
          botName: "",
          instructions: "",
          file: "",
        });
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
        {errors.allFields && (
          <div className="error-message show-message">{errors.allFields}</div>
        )}

        <label htmlFor="botName">Nome do Chatbot:</label>
        <input
          type="text"
          id="botName"
          value={botName}
          onChange={(e) => setBotName(e.target.value)}
        />
        {errors.botName && (
          <div className="error-message show-message">{errors.botName}</div>
        )}

        <label htmlFor="botVersion">Versão do Chatbot:</label>
        <select
          id="botVersion"
          value={botVersion}
          onChange={(e) => setBotVersion(e.target.value)}
        >
          <option value="GPT-3.5-turbo">GPT-3.5-turbo</option>
        </select>

        <label htmlFor="instructions">Prompt:</label>
        <textarea
          id="instructions"
          placeholder="Digite as instruções de comportamento do chatbot aqui"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
        {errors.instructions && (
          <div className="error-message show-message">
            {errors.instructions}
          </div>
        )}

        <label htmlFor="file">Documento (.txt):</label>
        <input
          type="file"
          id="file"
          accept=".txt"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {errors.file && (
          <div className="error-message show-message">{errors.file}</div>
        )}

        <button type="submit">Criar Chatbot</button>
      </form>
    </div>
  );
}

export default ChatbotForm;
