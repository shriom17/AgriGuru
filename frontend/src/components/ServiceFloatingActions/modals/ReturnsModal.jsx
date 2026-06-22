import React, { useState } from 'react';
import './ModalStyles.css';

const ReturnsModal = ({ onClose, cart }) => {
  const [returnData, setReturnData] = useState({
    orderId: '',
    reason: '',
    items: [],
    returnMethod: 'pickup',
    refundMethod: 'original'
  });
  const [step, setStep] = useState(1); // 1: Select Order, 2: Return Details, 3: Confirmation

  // Sample order data (would come from orderHistory in real app)
  const sampleOrders = [
    {
      id: 'AGR001',
      date: '2025-09-15',
      items: [
        { id: 1, name: 'Mahindra 275 DI ECO Tractor', price: 750000, quantity: 1, image: '/images/products/Mahindra tractor.jpg' },
        { id: 2, name: 'Premium DAP Fertilizer', price: 1200, quantity: 2, image: '/images/products/DAP.jpg' }
      ],
      total: 752400,
      status: 'Delivered',
      deliveryDate: '2025-09-18'
    },
    {
      id: 'AGR002',
      date: '2025-09-10',
      items: [
        { id: 3, name: 'Drip Irrigation Kit', price: 15000, quantity: 1, image: '/images/products/Drip irrigation kit.jpg' }
      ],
      total: 15000,
      status: 'Delivered',
      deliveryDate: '2025-09-13'
    }
  ];

  const returnReasons = [
    'Product damaged during delivery',
    'Wrong product received',
    'Product not as described',
    'Size/specification mismatch',
    'Performance issues',
    'Change of mind',
    'Better price found elsewhere',
    'Other'
  ];

  const handleOrderSelect = (orderId) => {
    const order = sampleOrders.find(o => o.id === orderId);
    setReturnData({
      ...returnData,
      orderId,
      items: order.items.map(item => ({ ...item, selected: false, returnQuantity: 0 }))
    });
    setStep(2);
  };

  const handleItemSelection = (itemId, selected, quantity = 0) => {
    setReturnData({
      ...returnData,
      items: returnData.items.map(item => 
        item.id === itemId 
          ? { ...item, selected, returnQuantity: selected ? (quantity || item.quantity) : 0 }
          : item
      )
    });
  };

  const initiateReturn = () => {
    setStep(3);
  };

  const selectedItems = returnData.items.filter(item => item.selected);
  const returnTotal = selectedItems.reduce((total, item) => total + (item.price * item.returnQuantity), 0);

  const isEligibleForReturn = (orderDate) => {
    const orderDateTime = new Date(orderDate);
    const now = new Date();
    const daysDiff = Math.floor((now - orderDateTime) / (1000 * 60 * 60 * 24));
    return daysDiff <= 30; // 30-day return policy
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content returns-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>↩️ Easy Returns & Refunds</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {step === 1 && (
            <div className="return-step-1">
              <h3>📋 Select Order to Return</h3>
              <div className="orders-list">
                {sampleOrders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <span className="order-id">Order #{order.id}</span>
                        <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                        {isEligibleForReturn(order.date) && (
                          <span className="return-eligible">✅ Return Eligible</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="order-items">
                      {order.items.map(item => (
                        <div key={item.id} className="order-item">
                          <img src={item.image} alt={item.name} className="item-image" />
                          <div className="item-details">
                            <span className="item-name">{item.name}</span>
                            <span className="item-price">₹{item.price.toLocaleString()} x {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="order-actions">
                      <span className="order-total">Total: ₹{order.total.toLocaleString()}</span>
                      {isEligibleForReturn(order.date) ? (
                        <button 
                          onClick={() => handleOrderSelect(order.id)}
                          className="return-btn"
                        >
                          Return Items
                        </button>
                      ) : (
                        <span className="return-expired">Return period expired</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="return-step-2">
              <h3>🔄 Return Details</h3>
              
              {/* Item Selection */}
              <div className="return-items">
                <h4>Select Items to Return</h4>
                {returnData.items.map(item => (
                  <div key={item.id} className="return-item">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={(e) => handleItemSelection(item.id, e.target.checked, item.quantity)}
                    />
                    <img src={item.image} alt={item.name} className="item-image" />
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">₹{item.price.toLocaleString()}</span>
                    </div>
                    {item.selected && (
                      <div className="quantity-selector">
                        <label>Quantity:</label>
                        <select
                          value={item.returnQuantity}
                          onChange={(e) => handleItemSelection(item.id, true, parseInt(e.target.value))}
                        >
                          {[...Array(item.quantity)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Return Reason */}
              <div className="return-reason">
                <h4>Reason for Return</h4>
                <select
                  value={returnData.reason}
                  onChange={(e) => setReturnData({...returnData, reason: e.target.value})}
                >
                  <option value="">Select reason...</option>
                  {returnReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              {/* Return Method */}
              <div className="return-method">
                <h4>Return Method</h4>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="pickup"
                      checked={returnData.returnMethod === 'pickup'}
                      onChange={(e) => setReturnData({...returnData, returnMethod: e.target.value})}
                    />
                    <span>🚚 Free Pickup (Recommended)</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="drop"
                      checked={returnData.returnMethod === 'drop'}
                      onChange={(e) => setReturnData({...returnData, returnMethod: e.target.value})}
                    />
                    <span>📍 Drop at nearest hub</span>
                  </label>
                </div>
              </div>

              {/* Refund Method */}
              <div className="refund-method">
                <h4>Refund Method</h4>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="original"
                      checked={returnData.refundMethod === 'original'}
                      onChange={(e) => setReturnData({...returnData, refundMethod: e.target.value})}
                    />
                    <span>💳 Original payment method</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="wallet"
                      checked={returnData.refundMethod === 'wallet'}
                      onChange={(e) => setReturnData({...returnData, refundMethod: e.target.value})}
                    />
                    <span>👛 KisanMitra Wallet</span>
                  </label>
                </div>
              </div>

              {selectedItems.length > 0 && (
                <div className="return-summary">
                  <div className="summary-row">
                    <span>Return Amount:</span>
                    <span className="amount">₹{returnTotal.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={initiateReturn}
                    className="initiate-return-btn"
                    disabled={!returnData.reason}
                  >
                    Initiate Return
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="return-step-3">
              <div className="success-animation">✅</div>
              <h3>🎉 Return Request Initiated</h3>
              
              <div className="return-confirmation">
                <div className="confirmation-details">
                  <p><strong>Return ID:</strong> RET{Date.now()}</p>
                  <p><strong>Order ID:</strong> {returnData.orderId}</p>
                  <p><strong>Items:</strong> {selectedItems.length} item(s)</p>
                  <p><strong>Refund Amount:</strong> ₹{returnTotal.toLocaleString()}</p>
                </div>

                <div className="next-steps">
                  <h4>📋 What's Next?</h4>
                  <div className="steps-timeline">
                    <div className="timeline-step">
                      <span className="step-number">1</span>
                      <span className="step-text">Return approved (within 2 hours)</span>
                    </div>
                    <div className="timeline-step">
                      <span className="step-number">2</span>
                      <span className="step-text">
                        {returnData.returnMethod === 'pickup' 
                          ? 'Pickup scheduled (next day)'
                          : 'Drop-off details sent via SMS'
                        }
                      </span>
                    </div>
                    <div className="timeline-step">
                      <span className="step-number">3</span>
                      <span className="step-text">Items received & inspected</span>
                    </div>
                    <div className="timeline-step">
                      <span className="step-number">4</span>
                      <span className="step-text">Refund processed (2-7 business days)</span>
                    </div>
                  </div>
                </div>

                <div className="contact-support">
                  <p>Need help? Contact our support team:</p>
                  <div className="support-options">
                    <button className="support-btn">📞 Call Support</button>
                    <button className="support-btn">💬 Live Chat</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnsModal;