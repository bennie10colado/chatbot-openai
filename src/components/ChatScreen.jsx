import React, { useState } from 'react';
import '../styles/ChatScreen.css'; 

function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      const newMessage = {
        id: messages.length,
        text: input,
        sender: 'user'
      };
      setMessages([...messages, newMessage]);
      setInput('');
      // lógica para enviar a mensagem ao backend ou API
    }
  };

  return (
    <div className="chat-screen-container">
      <div className="message-area">
        {messages.map(message => (
          <p key={message.id} className={`message ${message.sender}`}>
            {message.text}
          </p>
        ))}
      </div>
      <form className="message-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="message-input"
        />
        <button type="submit" className="send-button">Enviar</button>
      </form>
    </div>
  );
}

export default ChatScreen;
