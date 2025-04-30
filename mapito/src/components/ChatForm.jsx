import React, { useRef } from 'react'
import { FaArrowUp } from 'react-icons/fa';

const ChatForm = ({setChatHistory, chatHistory, generateBotResponse}) => {

    const inputRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if(!userMessage) return;
        inputRef.current.value = "";

        setChatHistory((history) => [...history, { role:"user", text: userMessage}]);

        setTimeout(() => {
            setChatHistory((history) => [...history, { role:"model", text:"Typing..."}]);
            generateBotResponse([...chatHistory, {role:"user", text:`Using the details provided above, please address this query: ${userMessage}`}]);
        }, 600);
    }

    return (
        <form action="#" className='chat-form' onSubmit={handleSubmit}>
            <input ref={inputRef} type='text' placeholder='Message' className='message-input' required />
            <button className=''><FaArrowUp /></button>
        </form>
    )
}

export default ChatForm