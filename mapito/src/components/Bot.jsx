import React, { useEffect, useRef, useState } from 'react'
import { HiChevronDown } from 'react-icons/hi';
import { MdModeComment, MdClose } from "react-icons/md";
import ChatbotIcon from './ChatbotIcon';
import ChatMessage from './ChatMessage';
import ChatForm from './ChatForm';
import { projectInfo } from '../utils/projectInfo';

const Bot = () => {

  const [chatHistory, setChatHistory] = useState([{
    hideInChat:true,
    role:"model",
    text: projectInfo
  }]);
  const [showChatBot, setShowChatBot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async(history) => {

    const updateHistory = (text, isError = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Typing..."), { role:"model", text, isError }]);
    }

    history = history.map(({role,text}) => ({role, parts: [{text}]}));

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: history })
      }

      try{
        console.log(import.meta.env.VITE_API_URL);
        const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message || "Something went wrong.");

        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        updateHistory(apiResponseText);
        
      }catch(error){
        updateHistory(error.message, true);
      }
  };

  useEffect(() => {
      chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior:"smooth"});
  }, [chatHistory]);

  return (
    <div className={`container ${showChatBot ? "show-chatbot" : ""}`}>

      <button onClick={() => setShowChatBot(prev => !prev)} id="chatbot-toggler">
        <span><MdModeComment /></span>
        <span><MdClose /></span>
      </button>

      <div className='chatbot-popup'>
        <div className='chat-header'>
          <div className='header-info'>
            <ChatbotIcon />
            <h2 className='logo-text'>Mapito Chatbot</h2>
          </div>
          <button onClick={() => setShowChatBot(prev => !prev)}><HiChevronDown /></button>
        </div>

        <div ref={chatBodyRef} className='chat-body'>
          <div className='message bot-message'>
            <ChatbotIcon />
            <p className='message-text'>
              Hey there 👋 <br /> How can I help you today?
            </p>
          </div>

          {chatHistory.map((chat,index) => (
            <ChatMessage key={index} chat={chat} />
          ))}

        </div>

        <div className='chat-footer'>
            <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  )
}

export default Bot
