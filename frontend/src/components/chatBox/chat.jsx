



import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './chat.css';
import { useNavigate } from 'react-router-dom';

const SOCKET_URL = 'http://127.0.0.1:5001';
const ROOM = 'KisanMitra-group';



function ChatBoxInner({ currentUser, users, onLoginRequest }) {
  const name = currentUser?.name;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [typingStatus, setTypingStatus] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Only show the chat icon if logged in
  const handleOpenChat = () => {
    setOpen(true);
  };
  const handleCloseChat = () => setOpen(false);

  // Only connect socket if logged in and chat is open
  useEffect(() => {
    if (!open || !currentUser) return;
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true
    });
    socketRef.current.on('connect', () => {
      console.log('[SOCKET] Connected to server:', socketRef.current.id);
      socketRef.current.emit('join', { room: ROOM, username: name });
    });
    socketRef.current.on('disconnect', () => {
      console.log('[SOCKET] Disconnected from server');
    });
    socketRef.current.on('chat_message', (msg) => {
      console.log('[SOCKET] Received chat_message:', msg);
      setMessages((prev) => [...prev, msg]);
    });
    socketRef.current.on('typing', (data) => {
      setTypingStatus(data.username);
      setTimeout(() => setTypingStatus(null), 2000);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave', { room: ROOM, username: name });
        socketRef.current.disconnect();
      }
    };
  }, [name, open, currentUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!socketRef.current) return;
    if (input.trim() === '' && !imagePreview) return;
    const msg = {
      room: ROOM,
      username: name,
      message: input,
      image: imagePreview || null,
      timestamp: new Date().toISOString()
    };
    console.log('[SOCKET] Sending chat_message:', msg);
    setMessages((prev) => [...prev, msg]); // Show sent message instantly
    socketRef.current.emit('chat_message', msg);
    setInput('');
    setImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (socketRef.current) {
      socketRef.current.emit('typing', { room: ROOM, username: name });
    }
  };

  return (
    <>
      {/* Floating Chat Icon (bottom right) - only if logged in */}
      {!open && currentUser && (
        <div className="chat-icon" onClick={handleOpenChat} title="Farmer Chat">
          <span role="img" aria-label="chat">💬</span>
        </div>
      )}
      {/* Modern Group Chat Bar - only if logged in */}
      {open && currentUser && (
        <div className="chat-bar modern-chat">
          <div className="chat-header modern-chat-header">
            <div className="chat-avatar">
              <span role="img" aria-label="avatar">👨‍🌾</span>
            </div>
            <div className="chat-title">
              <span>KisanMitra Group Chat</span>
              <span className="chat-status online">Collaborative Platform</span>
            </div>
            <button className="close-btn" onClick={handleCloseChat}>×</button>
          </div>
          <div className="chat-messages modern-chat-messages">
            {messages.length === 0 ? (
              <div className="chat-empty">No messages yet. Start the conversation!</div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`chat-message modern-message-bubble ${msg.username === name ? 'user' : 'other'}`}>
                  <div className="bubble-content">
                    <span className="bubble-sender">{msg.username === name ? 'You' : msg.username}</span>
                    {msg.message && <span className="bubble-text">{msg.message}</span>}
                    {msg.image && (
                      <img src={msg.image} alt="Sent" className="bubble-image" />
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-area modern-input-area">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="modern-input"
              autoFocus
            />
            <label className="attach-image-btn" title="Attach Image">
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
              <span role="img" aria-label="attach">📷</span>
            </label>
            <button onClick={handleSend} className="send-btn modern-send-btn">
              <span role="img" aria-label="send">📤</span>
            </button>
          </div>
          {imagePreview && (
            <div className="image-preview-area">
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <button className="remove-image-btn" onClick={handleRemoveImage} title="Remove Image">✖</button>
            </div>
          )}
          {typingStatus && typingStatus !== name && (
            <div className="typing-indicator">{typingStatus} is typing...</div>
          )}
        </div>
      )}
    </>
  );
}


// Wrapper to handle login prompt
function ChatBox(props) {
  // Debug: log currentUser value
  console.log('ChatBox currentUser:', props.currentUser);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  // Show login prompt automatically if not logged in
  useEffect(() => {
    if (!props.currentUser) {
      setShowLoginPrompt(true);
    } else {
      setShowLoginPrompt(false);
    }
  }, [props.currentUser]);

  // When user logs in, close the login prompt and open the chat icon
  useEffect(() => {
    if (props.currentUser) {
      setShowLoginPrompt(false);
    }
  }, [props.currentUser]);

  const handleLoginRequest = () => {
    setShowLoginPrompt(true);
  };
  const handleClosePrompt = () => {
    setShowLoginPrompt(false);
  };

  const handleGoToLogin = () => {
    navigate('/login');
    setShowLoginPrompt(false);
  };

  return (
    <>
      <ChatBoxInner {...props} onLoginRequest={handleLoginRequest} />
      {showLoginPrompt && (
        <div
          className="chat-login-prompt-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            className="chat-login-prompt-modal"
            style={{
              background: '#fff',
              padding: '2rem',
              borderRadius: '10px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
              minWidth: '300px',
              textAlign: 'center',
            }}
          >
            <h3>Please log in to use the chat</h3>
            <div className="chat-login-prompt-buttons" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={handleGoToLogin} className="login-btn" style={{ padding: '0.5rem 1.5rem', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Login</button>
              <button onClick={handleClosePrompt} className="close-btn" style={{ padding: '0.5rem 1.5rem', background: '#aaa', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBox;
