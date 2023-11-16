import React, { useState } from 'react';
import "../styles/ChatbotForm.css"

function ChatbotForm() {
  const [botName, setBotName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

  };

  return (
    <form onSubmit={handleSubmit} className="chatbot-form">
      <label htmlFor="botName">Nome do Chatbot:</label>
      <input
        type="text"
        id="botName"
        value={botName}
        onChange={(e) => setBotName(e.target.value)}
      />
      <label htmlFor="instructions">Instruções:</label>
      <textarea
        id="instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
      />
      <label htmlFor="file">Documento:</label>
      <input
        type="file"
        id="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit">Criar Chatbot</button>
    </form>
  );
}

export default ChatbotForm;
