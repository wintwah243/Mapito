import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FiSend, FiMessageSquare, FiLoader } from "react-icons/fi";
import Navbar from "./Navbar";

export default function AIMentorChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Get user ID from JWT token
    const getUserId = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id || payload.userId || payload.sub;
        } catch {
            return null;
        }
    };

    // Load saved messages from localStorage
    useEffect(() => {
        const userId = getUserId();
        if (userId) {
            const savedChat = localStorage.getItem(`aiChat_${userId}`);
            if (savedChat) {
                try {
                    setMessages(JSON.parse(savedChat));
                } catch (err) {
                    console.error("Failed to parse saved chat:", err);
                }
            }
        }
    }, []);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        const userId = getUserId();
        if (userId && messages.length > 0) {
            localStorage.setItem(`aiChat_${userId}`, JSON.stringify(messages));
        }
    }, [messages]);

    // const scrollToBottom = () => {
    //     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // };

    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                "https://mapito.onrender.com/api/ai-mentor",
                { message: input },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const aiMessage = { role: "ai", content: res.data.reply };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: "Please connect VPN and try again for better experience.🧐" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Clear chat history for current user
    const clearChat = () => {
        const userId = getUserId();
        if (userId) {
            localStorage.removeItem(`aiChat_${userId}`);
        }
        setMessages([]);
    };

    return (
        <div className="flex flex-col h-screen bg-white mt-17">
            <Navbar />

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 && (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center max-w-md px-4">
                            <div className="mx-auto bg-blue-100 p-3 rounded-full w-max mb-3">
                                <FiMessageSquare className="text-blue-600 text-2xl" />
                            </div>
                            <h3 className="font-medium text-gray-700">How can I help you today?</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Ask me anything about programming concepts, debugging, or coding related questions.
                            </p>
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        {msg.role === "ai" ? (
                            <div className="flex items-start gap-2">
                                <div className="bg-blue-100 p-2 rounded-full mt-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-blue-600"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 8V4H8" />
                                        <rect width="16" height="12" x="4" y="8" rx="2" />
                                        <path d="M2 14h2" />
                                        <path d="M20 14h2" />
                                        <path d="M15 13v2" />
                                        <path d="M9 13v2" />
                                    </svg>
                                </div>
                                <div className="px-4 py-3 rounded-xl bg-white text-gray-800 rounded-bl-none shadow-sm max-w-[90%] md:max-w-[80%] lg:max-w-[70%] whitespace-pre-wrap">
                                    {msg.content}
                                </div>
                            </div>
                        ) : (
                            <div className="px-4 py-3 rounded-xl bg-blue-600 text-white rounded-br-none max-w-[90%] md:max-w-[80%] lg:max-w-[70%] whitespace-pre-wrap">
                                {msg.content}
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="flex items-start gap-2">
                            <div className="bg-blue-100 p-2 rounded-full mt-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-blue-600"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 8V4H8" />
                                    <rect width="16" height="12" x="4" y="8" rx="2" />
                                    <path d="M2 14h2" />
                                    <path d="M20 14h2" />
                                    <path d="M15 13v2" />
                                    <path d="M9 13v2" />
                                </svg>
                            </div>
                            <div className="px-4 py-3 rounded-xl bg-white text-gray-800 rounded-bl-none shadow-sm max-w-[70%]">
                                <div className="flex items-center space-x-2">
                                    <FiLoader className="animate-spin" />
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>


            {messages.length > 0 && (
                <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-10">
                    <button
                        onClick={clearChat}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 rounded-full px-4 py-2 shadow-md transition-all duration-200 mb-15"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New chat
                    </button>
                </div>
            )}

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
                <div className="flex gap-2 max-w-4xl mx-auto">
                    <input
                        type="text"
                        className="flex-1 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ask programming questions..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                    >
                        <FiSend className="text-lg" />
                    </button>
                </div>
                <div className="flex justify-center mt-2">
                    <p className="text-xs text-gray-500 text-center">
                        AI responses may not always be accurate. Please verify critical information.
                        <span className="text-red-500"> You must connect vpn to get response from AI.</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
