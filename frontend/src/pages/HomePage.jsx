import React, { useState } from "react";
//import { Link } from "react-router-dom";
import "../styles/main.css";
import Home from "../components/Home";
import ChatbotForm from "../components/ChatbotForm";
import ChatScreen from "../components/ChatScreen";

function HomePage() {
  const [activeComponent, setActiveComponent] = useState(null);

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="homepage">
      <Home />
      <nav className="homepage-nav">
        <button
          className="nav-button"
          onClick={() => handleComponentChange(<ChatbotForm />)}
        >
          Criar Novo Chatbot
        </button>
        <button
          className="nav-button"
          onClick={() => handleComponentChange(<ChatScreen />)}
        >
          Conversar com o Chatbot
        </button>
      </nav>
      <div style={{ backgroundColor: "pink" }}>{activeComponent}</div>
    </div>
  );
}

export default HomePage;
