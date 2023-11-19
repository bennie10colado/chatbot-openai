import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import "../styles/ChatScreen.css";
import axios from "axios";

function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedChatbot, setSelectedChatbot] = useState("");
  const socket = io("http://localhost:5000/ws");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      socket.emit("message", {
        content: input,
        role: "user",
        chatbotName: selectedChatbot,
      });

      const newMessage = { id: messages.length, text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      setInput("");

      try {
        const response = await axios.post(
          "http://localhost:5000/api/send-message",
          {
            message: input,
          }
        );

        const botResponse = {
          id: messages.length + 1,
          text: response.data.openaiResponse,
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      } catch (error) {
        console.error("Erro ao enviar mensagem para a API da OpenAI:", error);
      }
    }
  };

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="chat-screen-container">
      <div className="nav-back">
        <Link to="/" className="back-button">
          Voltar para a HomePage
        </Link>
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
