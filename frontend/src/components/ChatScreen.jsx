import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import openaiService from "../api/OpenAiService";
import "../styles/main.css";
import { BeatLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedChatbot, setSelectedChatbot] = useState("");
  const [availableBots, setAvailableBots] = useState([]);
  const [botSelected, setBotSelected] = useState(false);
  const cancelToken = useRef(axios.CancelToken.source());
  const [isLoading, setIsLoading] = useState(false);
  const isSelectDisabled = botSelected && isLoading;

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

  const getSelectedBotDetails = () => {
    return availableBots.find((bot) => bot.name === selectedChatbot);
  };

  useEffect(() => {
    const handleBotChange = () => {
      setMessages([]);
      cancelToken.current.cancel("Troca de bot foi iniciada.");
      cancelToken.current = axios.CancelToken.source();
      setBotSelected(true);
    };

    handleBotChange();
    return () => {
      if (cancelToken.current) {
        cancelToken.current.cancel(
          "Componente ChatScreen está sendo desmontado."
        );
      }
    };
  }, [selectedChatbot]);

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

      cancelToken.current.cancel("Nova mensagem está sendo enviada.");
      cancelToken.current = axios.CancelToken.source();

      const userMessage = { id: messages.length, text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      setInput("");

      try {
        const botResponse = await openaiService.sendMessage(
          input,
          selectedChatbot,
          { cancelToken: cancelToken.current.token }
        );

        setMessages((prevMessages) => [
          ...prevMessages,
          { id: messages.length + 1, text: botResponse, sender: "bot" },
        ]);

        scrollToBottom();
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Requisição cancelada: ", error.message);
        } else {
          console.error("Erro ao enviar mensagem para a API da OpenAI:", error);
        }
      } finally {
        setIsLoading(false);
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
    <div>
      <div>
        <h2>Escolha um chatbot:</h2>
        <select
          className="select-space"
          value={selectedChatbot}
          onChange={(e) => {
            setSelectedChatbot(e.target.value);
            setBotSelected(false);
          }}
          disabled={isSelectDisabled}
        >
          <option value="" disabled>
            Selecione um chatbot
          </option>
          {availableBots.map((bot) => (
            <option className="select-option" key={bot._id} value={bot.name}>
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
              <strong>
                <>
                  <FontAwesomeIcon icon={faRobot} />{" "}
                  {getSelectedBotDetails().name}
                </>
              </strong>
            </React.Fragment>
          ) : (
            <strong>
              <>
                <FontAwesomeIcon icon={faRobot} /> {" Nenhum bot selecionado"}
              </>
            </strong>
          )}
        </div>

        <div id="message-area" className="message-area">
          {messages.map((message) => (
            <div key={message.id}>
              <div className={`message-container ${message.sender}-container`}>
                <div className={`sender-identifier`}>
                  <span>
                    {message.sender === "user" ? (
                      <>
                        {" "}
                        <FontAwesomeIcon icon={faWhatsapp} /> Você{" "}
                      </>
                    ) : (
                      <>
                        {" "}
                        <FontAwesomeIcon icon={faWhatsapp} /> Bot{" "}
                      </>
                    )}
                  </span>
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
              <BeatLoader color={"var(--primary)"} />
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
            disabled={isLoading}
          />
          <button type="submit" className="send-button" disabled={isLoading}>
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatScreen;
