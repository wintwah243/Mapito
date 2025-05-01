import React, { useEffect, useRef, useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { MdModeComment, MdClose } from "react-icons/md";
import ChatbotIcon from './ChatbotIcon';
import ChatMessage from './ChatMessage';
import ChatForm from './ChatForm';
import { projectInfo } from '../utils/projectInfo';

const Bot = () => {
  const [chatHistory, setChatHistory] = useState([{
    hideInChat: true,
    role: "model",
    text: projectInfo
  }]);
  const [showChatBot, setShowChatBot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Typing..."), { 
        role: "model", 
        text: typeof text === 'string' ? text : JSON.stringify(text),
        isError 
      }]);
    };

    if (!Array.isArray(history)) {
      updateHistory("Invalid chat history format", true);
      return;
    }

    try {
      setIsLoading(true);
      // Add temporary "Typing..." message
      setChatHistory(prev => [...prev, { role: "model", text: "Typing..." }]);
      
      const safeHistory = history.map(({ role, text }) => ({
        role,
        parts: [{ text: typeof text === 'string' ? text : JSON.stringify(text) }]
      }));

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: safeHistory })
      };

      if (!import.meta.env.VITE_API_URL) {
        throw new Error("API endpoint is not configured");
      }

      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error("Received invalid JSON from server");
      }

      if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Unexpected API response structure");
      }

      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      
      updateHistory(apiResponseText);
    } catch (error) {
      let errorMessage = error.message;
      if (typeof errorMessage !== 'string') {
        try {
          errorMessage = JSON.stringify(errorMessage);
        } catch (e) {
          errorMessage = "An unknown error occurred";
        }
      }
      updateHistory(errorMessage, true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [chatHistory]);

  return (
    <div className={`container ${showChatBot ? "show-chatbot" : ""}`}>
      <button 
        onClick={() => setShowChatBot(prev => !prev)} 
        id="chatbot-toggler"
        aria-label={showChatBot ? "Close chatbot" : "Open chatbot"}
      >
        <span><MdModeComment /></span>
        <span><MdClose /></span>
      </button>

      <div className='chatbot-popup'>
        <div className='chat-header'>
          <div className='header-info'>
            <ChatbotIcon />
            <h2 className='logo-text'>Mapito Chatbot</h2>
          </div>
          <button 
            onClick={() => setShowChatBot(prev => !prev)}
            aria-label="Minimize chatbot"
          >
            <HiChevronDown />
          </button>
        </div>

        <div ref={chatBodyRef} className='chat-body'>
          <div className='message bot-message'>
            <ChatbotIcon />
            <p className='message-text'>
              Hey there 👋 <br /> How can I help you today?
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className='chat-footer'>
          <ChatForm 
            chatHistory={chatHistory} 
            setChatHistory={setChatHistory} 
            generateBotResponse={generateBotResponse}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Bot;
