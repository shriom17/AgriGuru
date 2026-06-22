import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import BlockchainCheckout from '../../components/BlockchainCheckout/BlockchainCheckout';
import IndianPaymentGateway from '../../components/IndianPaymentGateway/IndianPaymentGateway';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartTotal,
    cartItemCount,
    clearCart,
    formatPrice
  } = useMarketplace();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [showBlockchainCheckout, setShowBlockchainCheckout] = useState(false);
  const [showIndianPaymentGateway, setShowIndianPaymentGateway] = useState(false);

  const [formData, setFormData] = useState({
    // Contact Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Delivery Address
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    
    // Payment Method
    paymentMethod: 'cod',
    
    // Additional Notes
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // If cart is empty, redirect to marketplace
  if (cart.length === 0 && !orderConfirmed) {
    return (
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>🛒 Checkout</h1>
          <p>Your cart is empty</p>
        </div>
        
        <div className="empty-checkout">
          <div className="empty-checkout-icon">
            🛒
          </div>
          <h2>Nothing to checkout</h2>
          <p>Add some items to your cart before proceeding to checkout.</p>
          <Link to="/marketplace" className="shop-now-btn">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form data for current step
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1: // Contact Information
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone number must be 10 digits';
        break;
        
      case 2: // Delivery Address
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Pincode must be 6 digits';
        break;
        
      case 3: // Payment Method
        if (!formData.paymentMethod) newErrors.paymentMethod = 'Please select a payment method';
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Handle order submission
  const handlePlaceOrder = async () => {
    if (!validateStep(3)) return;
    
    // If blockchain payment is selected, show blockchain checkout
    if (formData.paymentMethod === 'blockchain') {
      setShowBlockchainCheckout(true);
      return;
    }
    
    // If Indian payment gateway is selected, show payment gateway
    if (formData.paymentMethod === 'indian_gateway') {
      setShowIndianPaymentGateway(true);
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate order processing for COD
    setTimeout(() => {
      const newOrderNumber = 'AG' + Date.now().toString().slice(-8);
      setOrderNumber(newOrderNumber);
      
      // Save order to localStorage (for order history)
      const order = {
        orderNumber: newOrderNumber,
        date: new Date().toISOString(),
        items: cart,
        total: cartTotal,
        customerInfo: formData,
        status: 'confirmed'
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('KisanMitra_orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('KisanMitra_orders', JSON.stringify(existingOrders));
      
      // Clear cart and show success
      clearCart();
      setOrderConfirmed(true);
      setIsProcessing(false);
    }, 2000);
  };

  // Calculate shipping
  const shippingCost = cartTotal >= 1000 ? 0 : 50;
  const finalTotal = cartTotal + shippingCost;

  // Steps configuration
  const steps = [
    { id: 1, title: 'Contact', icon: '👤' },
    { id: 2, title: 'Delivery', icon: '📍' },
    { id: 3, title: 'Payment', icon: '💳' },
    { id: 4, title: 'Review', icon: '✓' }
  ];

  if (orderConfirmed) {
    return (
      <div className="checkout-container">
        <div className="order-success">
          <div className="success-icon">✅</div>
          <h1>Order Confirmed!</h1>
          <div className="order-details">
            <h2>Order #{orderNumber}</h2>
            <p>Thank you for your order. We'll process it shortly.</p>
            <div className="order-summary">
              <p><strong>Total Amount:</strong> {formatPrice(finalTotal)}</p>
              <p><strong>Items:</strong> {cartItemCount} item{cartItemCount !== 1 ? 's' : ''}</p>
              <p><strong>Delivery:</strong> 3-5 business days</p>
            </div>
          </div>
          <div className="success-actions">
            <Link to="/marketplace" className="continue-shopping-btn">
              Continue Shopping
            </Link>
            <button 
              onClick={() => window.print()} 
              className="print-order-btn"
            >
              📄 Print Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>🛒 Checkout</h1>
        <p>Complete your order in {4 - currentStep + 1} step{4 - currentStep !== 0 ? 's' : ''}</p>
      </div>

      <div className="checkout-content">
        <div className="checkout-main">
          {/* Progress Steps */}
          <div className="checkout-steps">
            {steps.map(step => (
              <div 
                key={step.id} 
                className={`step ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
              >
                <div className="step-icon">{step.icon}</div>
                <div className="step-title">{step.title}</div>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="step-content">
            {currentStep === 1 && (
              <div className="contact-step">
                <h3>👤 Contact Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder="10-digit mobile number"
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="delivery-step">
                <h3>📍 Delivery Address</h3>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="address">Street Address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={errors.address ? 'error' : ''}
                      placeholder="House number, street name"
                    />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={errors.state ? 'error' : ''}
                    />
                    {errors.state && <span className="error-text">{errors.state}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="pincode">Pincode *</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={errors.pincode ? 'error' : ''}
                      placeholder="6-digit pincode"
                    />
                    {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="landmark">Landmark</label>
                    <input
                      type="text"
                      id="landmark"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      placeholder="Near..."
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="payment-step">
                <h3>💳 Payment Method</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-card">
                      <div className="payment-icon">💵</div>
                      <div className="payment-details">
                        <h4>Cash on Delivery</h4>
                        <p>Pay when your order is delivered</p>
                      </div>
                    </div>
                  </label>
                  
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="indian_gateway"
                      checked={formData.paymentMethod === 'indian_gateway'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-card">
                      <div className="payment-icon">�</div>
                      <div className="payment-details">
                        <h4>Online Payment</h4>
                        <p>UPI, Cards, NetBanking, Wallets</p>
                      </div>
                    </div>
                  </label>
                  
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="blockchain"
                      checked={formData.paymentMethod === 'blockchain'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-card">
                      <div className="payment-icon">🔗</div>
                      <div className="payment-details">
                        <h4>Blockchain Payment</h4>
                        <p>Pay with cryptocurrency (ETH, MATIC, USDT)</p>
                      </div>
                    </div>
                  </label>
                </div>
                
                <div className="form-group">
                  <label htmlFor="notes">Additional Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Special delivery instructions, preferred time, etc."
                    rows="3"
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="review-step">
                <h3>✓ Review Your Order</h3>
                
                <div className="review-sections">
                  <div className="review-section">
                    <h4>Contact Information</h4>
                    <p>{formData.firstName} {formData.lastName}</p>
                    <p>{formData.email}</p>
                    <p>{formData.phone}</p>
                  </div>
                  
                  <div className="review-section">
                    <h4>Delivery Address</h4>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.state} {formData.pincode}</p>
                    {formData.landmark && <p>Near {formData.landmark}</p>}
                  </div>
                  
                  <div className="review-section">
                    <h4>Payment Method</h4>
                    <p>
                      {formData.paymentMethod === 'cod' && '💵 Cash on Delivery'}
                      {formData.paymentMethod === 'indian_gateway' && '� Online Payment'}
                      {formData.paymentMethod === 'blockchain' && '🔗 Blockchain Payment'}
                    </p>
                  </div>
                  
                  {formData.notes && (
                    <div className="review-section">
                      <h4>Additional Notes</h4>
                      <p>{formData.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="checkout-navigation">
            {currentStep > 1 && (
              <button 
                onClick={handlePreviousStep} 
                className="nav-btn prev-btn"
                disabled={isProcessing}
              >
                ← Previous
              </button>
            )}
            
            {currentStep < 4 ? (
              <button 
                onClick={handleNextStep} 
                className="nav-btn next-btn"
              >
                Next →
              </button>
            ) : (
              <button 
                onClick={handlePlaceOrder} 
                className="nav-btn place-order-btn"
                disabled={isProcessing}
              >
                {isProcessing ? '⏳ Processing...' : '🚀 Place Order'}
              </button>
            )}
          </div>
        </div>

        {/* Blockchain Checkout Modal */}
        {showBlockchainCheckout && (
          <BlockchainCheckout 
            onClose={() => setShowBlockchainCheckout(false)}
            onSuccess={() => {
              setShowBlockchainCheckout(false);
              setOrderConfirmed(true);
              setOrderNumber('BC' + Date.now().toString().slice(-8));
            }}
          />
        )}

        {/* Order Summary Sidebar */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          
          <div className="summary-items">
            {cart.map(item => (
              <div key={item.id} className="summary-item">
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>Qty: {item.quantity}</p>
                  <p className="item-price">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="summary-totals">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="total-line">
              <span>Shipping:</span>
              <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
            </div>
            <div className="total-line final-total">
              <span>Total:</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>
          
          <div className="delivery-info">
            <div className="info-item">
              🚚 Estimated delivery: 3-5 business days
            </div>
            <div className="info-item">
              🔒 Secure checkout guaranteed
            </div>
            <div className="info-item">
              🔄 Easy returns within 30 days
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Gateway Modal */}
      {showIndianPaymentGateway && (
        <IndianPaymentGateway
          onClose={() => setShowIndianPaymentGateway(false)}
          onSuccess={() => {
            const newOrderNumber = 'AG' + Date.now().toString().slice(-8);
            setOrderNumber(newOrderNumber);
            
            // Save order to localStorage
            const order = {
              orderNumber: newOrderNumber,
              date: new Date().toISOString(),
              items: cart,
              total: cartTotal,
              customerInfo: formData,
              status: 'confirmed'
            };
            
            const existingOrders = JSON.parse(localStorage.getItem('KisanMitraOrders') || '[]');
            existingOrders.unshift(order);
            localStorage.setItem('KisanMitraOrders', JSON.stringify(existingOrders));
            
            setOrderConfirmed(true);
            setShowIndianPaymentGateway(false);
          }}
        />
      )}
    </div>
  );
};

export default Checkout;