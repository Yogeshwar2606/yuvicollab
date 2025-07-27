import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minus, Bot } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hi! I'm UV's Store Assistant. How can I help you today?",
      options: [
        "Find products",
        "Track order",
        "Return policy",
        "Payment issues"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: inputMessage }]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot processing
    try {
      const response = await processMessage(inputMessage);
      setTimeout(() => {
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Error processing message:', error);
      setIsTyping(false);
    }
  };

  const processMessage = async (message) => {
    const lowerMsg = message.toLowerCase();
    
    // Basic intent recognition
    if (lowerMsg.includes('track') && lowerMsg.includes('order')) {
      return {
        type: 'bot',
        content: user 
          ? "You can track your orders in the Orders section. Would you like me to take you there?"
          : "Please login to track your orders. Would you like to login?",
        options: user ? ["Go to Orders", "No, thanks"] : ["Login", "No, thanks"]
      };
    }
    
    if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
      return {
        type: 'bot',
        content: "Our return policy allows returns within 7 days of delivery. Would you like to know more?",
        options: ["Return Process", "Return Policy", "Contact Support"]
      };
    }
    
    if (lowerMsg.includes('payment') || lowerMsg.includes('pay')) {
      return {
        type: 'bot',
        content: "We accept various payment methods including credit cards and Razorpay. What specific information do you need?",
        options: ["Payment Methods", "Payment Issues", "Contact Support"]
      };
    }

    if (lowerMsg.includes('find') || lowerMsg.includes('search') || lowerMsg.includes('looking')) {
      return {
        type: 'bot',
        content: "I can help you find products. What type of product are you looking for?",
        options: ["Furniture", "Electronics", "Real Estate"]
      };
    }

    // Default response
    return {
      type: 'bot',
      content: "I'm not sure I understand. Can I help you with any of these?",
      options: [
        "Find products",
        "Track order",
        "Return policy",
        "Payment issues"
      ]
    };
  };

  const handleOptionClick = (option) => {
    switch (option) {
      case "Go to Orders":
        navigate('/orders');
        break;
      case "Login":
        navigate('/login');
        break;
      case "Furniture":
      case "Electronics":
      case "Real Estate":
        navigate('/home', { state: { category: option } });
        break;
      default:
        setMessages(prev => [...prev, 
          { type: 'user', content: option },
          { 
            type: 'bot', 
            content: `Let me help you with ${option.toLowerCase()}. What specific information do you need?`,
            options: ["Talk to Support", "Read FAQ", "Go Back"]
          }
        ]);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat Toggle Button */}
      <button 
        className={`chat-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={24} strokeWidth={2.5} /> : <MessageSquare size={24} strokeWidth={2.5} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <Bot size={24} />
            <span>UV's Store Assistant</span>
            <button 
              className="minimize-btn"
              onClick={() => setIsOpen(false)}
            >
              <Minus size={20} strokeWidth={2.5} />
            </button>
          </div>

          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-content">{msg.content}</div>
                {msg.options && (
                  <div className="message-options">
                    {msg.options.map((option, optIndex) => (
                      <button 
                        key={optIndex}
                        onClick={() => handleOptionClick(option)}
                        className="option-btn"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
            />
            <button 
              onClick={handleSend}
              disabled={!inputMessage.trim()}
              className="send-btn"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .chatbot-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }

        .chat-toggle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          padding: 0;
        }

        .chat-toggle:hover {
          transform: scale(1.1);
          background: linear-gradient(135deg, #5a67d8, #6b46c1);
        }

        .chat-toggle.open {
          background: #ff6b6b;
        }

        .chat-toggle.open:hover {
          background: #ff5252;
        }

        .chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 350px;
          height: 500px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chat-header {
          padding: 1rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }

        .minimize-btn {
          margin-left: auto;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          border-radius: 50%;
        }

        .minimize-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message {
          max-width: 80%;
          padding: 0.8rem 1rem;
          border-radius: 15px;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.bot {
          background: #f3f4f6;
          border-top-left-radius: 5px;
          align-self: flex-start;
        }

        .message.user {
          background: #667eea;
          color: white;
          border-top-right-radius: 5px;
          align-self: flex-end;
        }

        .message-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.8rem;
        }

        .option-btn {
          background: white;
          border: 2px solid #667eea;
          color: #667eea;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .option-btn:hover {
          background: #667eea;
          color: white;
        }

        .chat-input {
          padding: 1rem;
          background: white;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 0.5rem;
        }

        .chat-input input {
          flex: 1;
          padding: 0.8rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 25px;
          outline: none;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .chat-input input:focus {
          border-color: #667eea;
        }

        .send-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.1);
        }

        .send-btn:disabled {
          background: #e5e7eb;
          cursor: not-allowed;
        }

        .typing-indicator {
          display: flex;
          gap: 0.3rem;
          padding: 0.5rem;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #667eea;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        /* Scrollbar Styling */
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default ChatBot; 