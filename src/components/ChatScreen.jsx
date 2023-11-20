import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import "../styles/ChatScreen.css";

function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedChatbot, setSelectedChatbot] = useState("");
  const socket = io("http://localhost:5000/ws");

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      socket.emit("message", {
        content: input,
        role: "user",
        chatbotName: selectedChatbot,
      });

      const userMessage = { id: messages.length, text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      setInput("");

      try {
        const response = await axios.post(
          "http://localhost:5000/openai/send-message",
          { message: input }
        );

        const botResponse = {
          id: messages.length + 1,
          text: response.data.openaiResponse,
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
        scrollToBottom();
      } catch (error) {
        console.error("Erro ao enviar mensagem para a API da OpenAI:", error);
      }
    }
  };

  const scrollToBottom = () => {
    const messageArea = document.getElementById("message-area");
    if (messageArea) {
      messageArea.scrollTop = messageArea.scrollHeight;
    }
  };

  return (
    <div className="chat-screen-container">
      <div className="nav-back">
        <Link to="/" className="back-button">
          Voltar para a HomePage
        </Link>
      </div>
      <div id="message-area" className="message-area">
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
          id="user-input"
        />
        <button type="submit" className="send-button">
          Enviar
        </button>
      </form>
    </div>
  );
}

export default ChatScreen;
