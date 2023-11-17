import React, { useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { useEffect } from "react";
import "../styles/ChatScreen.css";

function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socket = io("http://localhost:5000");

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      const newMessage = {
        id: messages.length,
        text: input,
        sender: "user",
      };
      setMessages([...messages, newMessage]);
      setInput("");
      socket.emit("message", { content: input, role: "user" });
    }
  };

  useEffect(() => {
    socket.on("message", (message) => {
      console.log("Mensagem recebida:", message);
      setMessages([...messages, message]); 
    });

    return () => {
      socket.disconnect();
    };
  }, [messages, socket]);

  return (
    <div className="chat-screen-container">
      <div className="nav-back">
        <Link to="/" className="back-button">
          Voltar para a HomePage
        </Link>{" "}
      </div>
      <div className="message-area">
        {messages.map((message) => (
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
        <button type="submit" className="send-button">
          Enviar
        </button>
      </form>
    </div>
  );
}

export default ChatScreen;
