import React, { useState } from "react";
//import { Link } from "react-router-dom";
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
      <form onSubmit={handleSubmit} className="chatbot-form">
        {successMessage && (
          <div className="success-message show-message">{successMessage}</div>
        )}
        {errors.allFields && (
          <div className="error-message show-message">{errors.allFields}</div>
        )}

        <div className="row">
          <div>
            <label htmlFor="botName">Nome do Chatbot:</label>
            <input
              type="text"
              id="botName"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="box-text"
            />
            {errors.botName && (
              <div className="error-message show-message">{errors.botName}</div>
            )}
          </div>

          <div>
            <label htmlFor="botVersion">Versão do Chatbot:</label>
            <select
              id="botVersion"
              value={botVersion}
              onChange={(e) => setBotVersion(e.target.value)}
              className="box-text"
            >
              <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
            </select>
          </div>
        </div>

        <label htmlFor="instructions">Prompt:</label>
        <input
          id="instructions"
          placeholder="Digite as instruções de comportamento do chatbot aqui"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows="4"
          className="text-area box-text"
        />
        {errors.instructions && (
          <div className="error-message show-message">
            {errors.instructions}
          </div>
        )}

        <label htmlFor="file">Documento (.txt):</label>
        <div className="file-upload-wrapper">
          <input
            type="file"
            id="file"
            accept=".txt"
            className="file-input"
            onChange={(e) => {
              setFile(e.target.files[0]);
              document.querySelector(".file-name-display").textContent =
                e.target.files[0].name;
            }}
          />
          <label htmlFor="file" className="file-label">
            <span className="file-name-display">
              Nenhum arquivo selecionado...
              <img
                src="../assets/images/file2.png"
                alt="file-icon"
                className="file-icon"
              />
            </span>
          </label>
        </div>

        {errors.file && (
          <div className="error-message show-message">{errors.file}</div>
        )}

        <button className="button-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Criando Chatbot... Aguarde!" : "Criar Chatbot"}
        </button>
      </form>
    </div>
  );
}

export default ChatbotForm;
