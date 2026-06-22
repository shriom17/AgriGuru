import React, { useState } from 'react';
import './ModalStyles.css';

const SupportModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('contact');
  const [chatStarted, setChatStarted] = useState(false);
  const [ticketData, setTicketData] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'medium'
  });

  const supportCategories = [
    'Order Related',
    'Payment Issues',
    'Delivery Problems',
    'Returns & Refunds',
    'Product Information',
    'Account Issues',
    'Technical Support',
    'Other'
  ];

  const faqData = [
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 2-7 business days depending on your location. Express delivery is available for 1-2 days.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer 30-day returns on most items. Products must be in original condition with tags and packaging.'
    },
    {
      question: 'How can I track my order?',
      answer: 'You can track your order using the tracking number sent via SMS/email, or check in your account under "My Orders".'
    },
    {
      question: 'Are EMI options available?',
      answer: 'Yes, EMI is available on orders above ₹1,000 with various banking partners. Check EMI options at checkout.'
    },
    {
      question: 'How do I cancel my order?',
      answer: 'Orders can be cancelled within 1 hour of placement. Go to "My Orders" and click "Cancel Order".'
    }
  ];

  const handleTicketSubmit = () => {
    // Handle ticket submission
    alert('Support ticket submitted successfully! Ticket ID: #' + Date.now());
    setTicketData({ category: '', subject: '', description: '', priority: 'medium' });
  };

  const startLiveChat = () => {
    setChatStarted(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content support-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📞 24/7 Customer Support</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Support Status */}
          <div className="support-status">
            <div className="status-indicator online">
              <span className="status-dot"></span>
              <span>Our support team is online</span>
            </div>
            <div className="response-time">
              <span>⚡ Average response time: 2 minutes</span>
            </div>
          </div>

          {/* Support Tabs */}
          <div className="support-tabs">
            <button 
              className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              📞 Contact Us
            </button>
            <button 
              className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              💬 Live Chat
            </button>
            <button 
              className={`tab-btn ${activeTab === 'ticket' ? 'active' : ''}`}
              onClick={() => setActiveTab('ticket')}
            >
              🎫 Create Ticket
            </button>
            <button 
              className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              ❓ FAQ
            </button>
          </div>

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="support-contact">
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">📞</div>
                  <div className="method-info">
                    <h4>Phone Support</h4>
                    <p>1800-123-4567 (Toll Free)</p>
                    <span>Available 24/7</span>
                  </div>
                  <button className="contact-btn">Call Now</button>
                </div>

                <div className="contact-method">
                  <div className="method-icon">📧</div>
                  <div className="method-info">
                    <h4>Email Support</h4>
                    <p>support@KisanMitra.com</p>
                    <span>Response within 2 hours</span>
                  </div>
                  <button className="contact-btn">Send Email</button>
                </div>

                <div className="contact-method">
                  <div className="method-icon">📱</div>
                  <div className="method-info">
                    <h4>WhatsApp Support</h4>
                    <p>+91 98765 43210</p>
                    <span>Quick responses</span>
                  </div>
                  <button className="contact-btn">Chat on WhatsApp</button>
                </div>

                <div className="contact-method">
                  <div className="method-icon">🌐</div>
                  <div className="method-info">
                    <h4>Social Media</h4>
                    <p>@KisanMitraOfficial</p>
                    <span>Follow us for updates</span>
                  </div>
                  <button className="contact-btn">Follow Us</button>
                </div>
              </div>
            </div>
          )}

          {/* Live Chat Tab */}
          {activeTab === 'chat' && (
            <div className="support-chat">
              {!chatStarted ? (
                <div className="chat-start">
                  <div className="chat-intro">
                    <h3>💬 Start Live Chat</h3>
                    <p>Connect with our support team instantly</p>
                    <div className="chat-features">
                      <div className="feature">✅ Instant responses</div>
                      <div className="feature">✅ Screen sharing available</div>
                      <div className="feature">✅ File sharing support</div>
                    </div>
                  </div>
                  <button onClick={startLiveChat} className="start-chat-btn">
                    🚀 Start Chat Now
                  </button>
                </div>
              ) : (
                <div className="chat-window">
                  <div className="chat-header">
                    <div className="agent-info">
                      <div className="agent-avatar">👨‍💼</div>
                      <div className="agent-details">
                        <span className="agent-name">Rahul Kumar</span>
                        <span className="agent-status">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="chat-messages">
                    <div className="message agent-message">
                      <span>Hi! I'm Rahul from KisanMitra support. How can I help you today?</span>
                      <span className="message-time">Just now</span>
                    </div>
                  </div>
                  <div className="chat-input">
                    <input type="text" placeholder="Type your message..." />
                    <button className="send-btn">Send</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Create Ticket Tab */}
          {activeTab === 'ticket' && (
            <div className="support-ticket">
              <h3>🎫 Create Support Ticket</h3>
              <div className="ticket-form">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={ticketData.category}
                    onChange={(e) => setTicketData({...ticketData, category: e.target.value})}
                  >
                    <option value="">Select category...</option>
                    {supportCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <div className="priority-options">
                    {['low', 'medium', 'high', 'urgent'].map(priority => (
                      <label key={priority} className="priority-label">
                        <input
                          type="radio"
                          value={priority}
                          checked={ticketData.priority === priority}
                          onChange={(e) => setTicketData({...ticketData, priority: e.target.value})}
                        />
                        <span className={`priority-text ${priority}`}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    placeholder="Brief description of your issue"
                    value={ticketData.subject}
                    onChange={(e) => setTicketData({...ticketData, subject: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="4"
                    placeholder="Please provide detailed information about your issue..."
                    value={ticketData.description}
                    onChange={(e) => setTicketData({...ticketData, description: e.target.value})}
                  />
                </div>

                <button 
                  onClick={handleTicketSubmit}
                  className="submit-ticket-btn"
                  disabled={!ticketData.category || !ticketData.subject || !ticketData.description}
                >
                  Submit Ticket
                </button>
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="support-faq">
              <h3>❓ Frequently Asked Questions</h3>
              <div className="faq-list">
                {faqData.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <h4 className="faq-question">{faq.question}</h4>
                    <p className="faq-answer">{faq.answer}</p>
                  </div>
                ))}
              </div>
              
              <div className="faq-search">
                <h4>🔍 Can't find what you're looking for?</h4>
                <div className="search-options">
                  <button onClick={() => setActiveTab('chat')} className="faq-action-btn">
                    💬 Ask Live Chat
                  </button>
                  <button onClick={() => setActiveTab('ticket')} className="faq-action-btn">
                    🎫 Create Ticket
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportModal;