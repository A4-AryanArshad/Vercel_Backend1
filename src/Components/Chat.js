import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Footer from "./Footer";
import "../Components/chat.css";
import server from '../config';
import robotImage from '../robot.png';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await axios.post(`${server}/api/chat/ask`, {
        question: input,
      });

      const botReply = { text: response.data.answer, sender: "bot" };
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { 
        text: "Error fetching response", 
        sender: "bot" 
      }]);
    }

    setInput("");
  };

  return (
    <>
    <div className="chat-page-container">
      <h1 className="chat-title" style={{textAlign:'center',fontFamily:'inherit',fontSize:'40px',color:'black',fontStyle:'oblique',fontWeight:'bold'}}>
       Chat Assistant
      </h1>
      
      <div className="chat-layout">
        <div className="image-container">
          <img 
            src={robotImage} 
            alt="AI Assistant" 
            className="responsive-image"
          />
        </div>

        <div className="chat-container-wrapper">
          <div className="chat-container">
            <div className="chat-box">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  <div className="message-content">
                    <p>{msg.text}</p>
                    <span className="message-time">
                      {new Date().toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            
            <div className="inputt">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      
    
    </div>
      <Footer />
      </>
  );
};

export default Chat;