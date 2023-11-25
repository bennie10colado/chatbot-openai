import React, { useState, useEffect, useRef } from "react";
//import { Link } from "react-router-dom";
import axios from "axios";
import openaiService from "../api/OpenAiService";
import "../styles/main.css";
import { BeatLoader } from "react-spinners";

function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedChatbot, setSelectedChatbot] = useState("");
  const [availableBots, setAvailableBots] = useState([]);
  const [botSelected, setBotSelected] = useState(true);
  const cancelToken = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const getSelectedBotDetails = () => {
    return availableBots.find((bot) => bot.name === selectedChatbot);
  };

  useEffect(() => {
    const fetchAvailableBots = async () => {
      try {
        const bots = await openaiService.getAvailableBots();
        setAvailableBots(bots);
      } catch (error) {
        console.error("Erro ao obter a lista de bots disponíveis:", error);
      }
    };

    fetchAvailableBots();
  }, []);

  useEffect(() => {
    setMessages([]);
    cancelToken.current && cancelToken.current.cancel();
    cancelToken.current = axios.CancelToken.source();
    setBotSelected(true);
  }, [selectedChatbot]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!selectedChatbot) {
      console.error("Selecione um bot antes de enviar uma mensagem.");
      setBotSelected(false);
      return;
    }

    if (input.trim() !== "") {
      setIsLoading(true);
      const userMessage = { id: messages.length, text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      setInput("");

      try {
        const botResponse = await openaiService.sendMessage(
          input,
          selectedChatbot
        );

        setMessages((prevMessages) => [
          ...prevMessages,
          { id: messages.length + 1, text: botResponse, sender: "bot" },
        ]);

        scrollToBottom();
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Requisição cancelada devido a mudança de bot ativo");
        } else {
          console.error("Erro ao enviar mensagem para a API da OpenAI:", error);
        }
      }
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    const messageArea = document.getElementById("message-area");
    if (messageArea) {
      messageArea.scrollTop = messageArea.scrollHeight;
    }
  };

  return (
    <div>
      <div>
        <h2>Escolha um chatbot:</h2>
        <select
          className="select-space"
          value={selectedChatbot}
          onChange={(e) => {
            setSelectedChatbot(e.target.value);
            setBotSelected(true);
          }}
        >
          <option value="" disabled>
            Selecione um chatbot
          </option>
          {availableBots.map((bot) => (
            <option key={bot._id} value={bot.name}>
              {bot.name} - {bot.version}
            </option>
          ))}
        </select>
        {!botSelected && (
          <p style={{ color: "red" }}>
            Selecione um bot antes de enviar uma mensagem.
          </p>
        )}
      </div>

      <div className="chat-screen-container">
        <div className="header-chat">
          {selectedChatbot && getSelectedBotDetails() ? (
            <React.Fragment>
              <strong>{getSelectedBotDetails().name}</strong>
            </React.Fragment>
          ) : (
            "Nenhum bot selecionado"
          )}
        </div>

        <div id="message-area" className="message-area">
          {messages.map((message) => (
            <div key={message.id}>
              
              <div className={`message-container ${message.sender}-container`}>
                <div className={`sender-identifier`}>
                  <span>{message.sender === "user" ? "Você" : "Bot"}</span>
                </div>
              </div>

              <div className={`message-container ${message.sender}-container`}>
                <div className={`sender-identifier`}>
                  <span className={`message ${message.sender}`}>
                    {message.text}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {isLoading && (
          <div className="spinner-class">
            <div className="beat-loader">
              <BeatLoader color="#007bff" />
            </div>
          </div>
        )}

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
    </div>
  );
}

export default ChatScreen;
