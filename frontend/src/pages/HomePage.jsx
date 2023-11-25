import React, { useState } from "react";
//import { Link } from "react-router-dom";
import "../styles/main.css";
import Home from "../components/Home";
import ChatbotForm from "../components/ChatbotForm";
import ChatScreen from "../components/ChatScreen";

function HomePage() {
  const [activeComponent, setActiveComponent] = useState('');

  const handleComponentChange = (componentName) => {
    setActiveComponent(componentName);
  };

  return (
    <div>

      <Home />

      <nav className="container">

        <a className={`nav-button ${activeComponent === 'ChatbotForm' ? 'nav-button-active span-activate' : 'nav-button-inactive span-inactive'}`} onClick={() => handleComponentChange('ChatbotForm')}>
          <span>1</span> Base de Informações
        </a>
        
        <a className={`nav-button ${activeComponent === 'ChatScreen' ? 'nav-button-active span-activate' : 'nav-button-inactive span-inactive'}`} onClick={() => handleComponentChange('ChatScreen')}>
          <span>2</span> Chat
        </a>

      </nav>

      <div>

      {activeComponent === 'ChatbotForm' ? <ChatbotForm /> : null}
      {activeComponent === 'ChatScreen' ? <ChatScreen /> : null} 
      
      </div>
    </div>
  );
}

export default HomePage;
