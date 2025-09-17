// 📌 src/context/ChatbotContext.jsx
import React, { createContext, useContext, useState } from "react";
import { chatbotAPI } from "../services/api"; // we will add this in api.js
import { toast } from "react-toastify";

const ChatbotContext = createContext();

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within ChatbotProvider");
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ send message function
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text }]);

    try {
      setLoading(true);
      const res = await chatbotAPI.sendMessage(text); // call backend
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      toast.error("⚠️ Failed to connect to chatbot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatbotContext.Provider value={{ messages, loading, sendMessage }}>
      {children}
    </ChatbotContext.Provider>
  );
};
