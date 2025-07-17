import React, { useState, useRef, useEffect } from 'react';
import './AIChat.css';
import enhancedAIService from '../../services/enhancedAIService';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🌾 Welcome to AgriGuru! I'm your enhanced AI farming expert. I can help you with:\n\n• 🌱 Crop planting & cultivation\n• 🧪 Fertilizer recommendations\n• 🐛 Pest & disease management\n• 💧 Irrigation guidance\n• 📅 Seasonal farming calendar\n• 📈 Market insights\n• 🌍 Weather-based advice\n• 🌿 Sustainable farming practices\n\nAsk me anything about farming - I'll give you fresh, expert advice every time!",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognition = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if (window.webkitSpeechRecognition) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onstart = () => {
        setIsListening(true);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleVoiceInput = () => {
    if (isListening) {
      recognition.current?.stop();
    } else {
      recognition.current?.start();
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Extract crop and season from user query for better responses
      const { crop, season } = enhancedAIService.extractCropAndSeason(currentQuery);
      
      // Get expert advice from enhanced AI
      const response = await enhancedAIService.getExpertAdvice(currentQuery, crop, season);
      
      if (response.success) {
        const aiMessage = {
          id: messages.length + 2,
          text: response.advice,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage = {
          id: messages.length + 2,
          text: `❌ ${response.error || 'Sorry, I couldn\'t process your request. Please make sure the farming expert backend is running on port 5000.'}`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: `❌ Connection error: ${error.message}. Please ensure the AgriGuru backend server is running on port 5000.`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (query) => {
    setInputMessage(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="ai-chat-container">
      <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>🤖</button>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="ai-avatar">🌾</span>
              <div>
                <h4>AgriGuru AI</h4>
                <p>Online Farmer Assistant</p>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}>
                <div className="message-content">
                  <p>{msg.text}</p>
                  <span className="message-time">{msg.timestamp}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message ai-message">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="quick-actions">
            <button onClick={() => handleQuickAction('How to plant rice?')} className="quick-action-btn">
              🌱 Rice Planting
            </button>
            <button onClick={() => handleQuickAction('What fertilizers for wheat?')} className="quick-action-btn">
              🧪 Wheat Fertilizers
            </button>
            <button onClick={() => handleQuickAction('Cotton pest management')} className="quick-action-btn">
              🐛 Pest Control
            </button>
            <button onClick={() => handleQuickAction('Kharif season activities')} className="quick-action-btn">
              📅 Seasonal Calendar
            </button>
            <button onClick={() => handleQuickAction('Market prices for crops')} className="quick-action-btn">
              📈 Market Insights
            </button>
            <button onClick={() => handleQuickAction('Sustainable farming practices')} className="quick-action-btn">
              🌿 Sustainable Farming
            </button>
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about crops, weather, schemes..."
              className="message-input"
            />
            <button 
              className={`voice-input-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop recording' : 'Start recording'}
            >
              {isListening ? '🎤' : '🎙️'}
            </button>
            <button onClick={handleSendMessage} className="send-btn">📤</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;