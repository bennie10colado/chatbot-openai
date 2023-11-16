import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatbotForm from "./components/ChatbotForm";
import ChatScreen from "./components/ChatScreen";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-bot" element={<ChatbotForm />} />
        <Route path="/chat" element={<ChatScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
