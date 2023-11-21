import React, { useState } from "react";
import { Link } from "react-router-dom";
import openaiService from "../api/OpenAiService";
import "../styles/main.css";

function ChatbotForm() {
  const [botName, setBotName] = useState("");
  const [botVersion, setBotVersion] = useState("gpt-3.5-turbo");
  const [instructions, setInstructions] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({
    botName: "",
    instructions: "",
    file: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const clearErrors = () => {
    setErrors({
      botName: "",
      instructions: "",
      file: "",
    });
  };

  const clearMessages = () => {
    setSuccessMessage("");
  };

  const validateForm = () => {
    clearErrors();

    let hasError = false;

    if (!botName) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        botName: "Nome do Chatbot é obrigatório.",
      }));
      hasError = true;
    }

    if (!instructions) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        instructions: "Instruções são obrigatórias.",
      }));
      hasError = true;
    }

    if (!file) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        file: "Arquivo é obrigatório.",
      }));
      hasError = true;
    }

    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    clearMessages();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await openaiService.createChatbot({
        name: botName,
        version: botVersion,
        instructions: instructions,
        file: file,
      });

      console.log("Chatbot criado com sucesso!", response);

      setSuccessMessage("Chatbot criado com sucesso!");

      // pode-se atualizar o estado ou redirecionar o usuario para outra página
    } catch (error) {
      console.error("Erro ao criar o chatbot", error);

      // feedback de erro ao usuário?
    } finally {
      setIsSubmitting(false);
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
        {successMessage && (
          <div className="success-message show-message">{successMessage}</div>
        )}
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
          <option value="gpt-3.5-turbo">GPT-3.5-turbo</option>
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
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        {errors.file && (
          <div className="error-message show-message">{errors.file}</div>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Criando Chatbot... Aguarde!" : "Criar Chatbot"}
        </button>
      </form>
    </div>
  );
}

export default ChatbotForm;
