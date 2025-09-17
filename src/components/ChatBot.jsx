import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { MessageCircle, X } from "lucide-react";
import { toast } from "react-toastify"; // optional if you're using react-toastify

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    // ✅ Load saved messages from localStorage (if available)
    const saved = localStorage.getItem("chatbotMessages");
    return saved
      ? JSON.parse(saved)
      : [{ from: "bot", text: "Hello 👋 I'm your assistant. How can I help you?" }];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // ✅ Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatbotMessages", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Send message to backend chatbot API
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chatbot", { message: input });
      const reply = res.data.reply;

      setMessages([...newMessages, { from: "bot", text: reply }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      toast?.error("⚠️ Failed to connect to chatbot"); // optional toast
      setMessages([
        ...newMessages,
        { from: "bot", text: "⚠️ Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 w-80 bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
            <span className="font-semibold">Chatbot</span>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-80">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[75%] break-words ${
                  msg.from === "user"
                    ? "bg-blue-100 text-right ml-auto"
                    : "bg-gray-200 mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="text-gray-500 italic text-sm">Bot is typing...</div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-3 py-2 outline-none"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className={`px-4 py-2 ${
                !input.trim() || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
