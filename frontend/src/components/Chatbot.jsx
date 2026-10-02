import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "I am a demo AI. In the future, I can help you with inventory checks, POS tasks, and analytics!", isBot: true }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        className="chatbot-toggle"
        onClick={() => setIsOpen(true)}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window glass-card ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bot size={24} color="var(--primary-color)" />
            <span style={{ fontWeight: 600 }}>AI Assistant</span>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble ${msg.isBot ? 'bot' : 'user'}`}>
              <div className="chat-avatar">
                {msg.isBot ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className="chat-text">{msg.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbot-input-area" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Ask me anything..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={!input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
};

export default Chatbot;
