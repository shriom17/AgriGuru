import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { useWeb3 } from '../../contexts/Web3Context';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import './BlockchainCheckout.css';

const BlockchainCheckout = ({ onClose, onSuccess }) => {
  const { cart, cartTotal, formatPrice, clearCart } = useMarketplace();
  const {
    isConnected,
    account,
    chainId,
    contract,
    connectWallet,
    createOrder,
    switchNetwork,
    isNetworkSupported,
    getNetworkName,
    formatPrice: formatCryptoPrice
  } = useWeb3();

  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [selectedToken, setSelectedToken] = useState('native'); // native, usdt, usdc
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionRates, setConversionRates] = useState({
    ETH: 0,
    MATIC: 0,
    USDT: 1 / 83 // Approximate USD to INR
  });
  const [orderCreated, setOrderCreated] = useState(false);
  const [txHash, setTxHash] = useState('');

  // Token configurations
  const TOKENS = {
    native: {
      symbol: chainId === 137 ? 'MATIC' : 'ETH',
      name: chainId === 137 ? 'Polygon' : 'Ethereum',
      address: ethers.ZeroAddress,
      decimals: 18
    },
    usdt: {
      symbol: 'USDT',
      name: 'Tether USD',
      address: chainId === 137 ? '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' : '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6
    },
    usdc: {
      symbol: 'USDC',
      name: 'USD Coin',
      address: chainId === 137 ? '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' : '0xA0b86a33E6A2f87d853a14BB0Fc5e64e6eCB8E3E',
      decimals: 6
    }
  };

  // Fetch conversion rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,matic-network&vs_currencies=inr');
        const data = await response.json();
        
        setConversionRates({
          ETH: data.ethereum?.inr || 0,
          MATIC: data['matic-network']?.inr || 0,
          USDT: 83 // Approximate USD to INR
        });
      } catch (error) {
        console.error('Error fetching conversion rates:', error);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Calculate crypto amounts
  const calculateCryptoAmount = () => {
    const token = TOKENS[selectedToken];
    const inrAmount = cartTotal;
    
    if (selectedToken === 'native') {
      const rate = chainId === 137 ? conversionRates.MATIC : conversionRates.ETH;
      return rate > 0 ? (inrAmount / rate).toFixed(6) : 0;
    } else {
      // For stablecoins (USDT/USDC)
      return (inrAmount / conversionRates.USDT).toFixed(2);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      toast.error('Failed to connect wallet');
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork(137); // Switch to Polygon
    } catch (error) {
      toast.error('Failed to switch network');
    }
  };

  const handleCryptoPayment = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!isNetworkSupported()) {
      toast.error('Please switch to a supported network');
      return;
    }

    try {
      setIsProcessing(true);

      const token = TOKENS[selectedToken];
      const cryptoAmount = calculateCryptoAmount();

      // For each item in cart, create an order
      for (let item of cart) {
        const productId = item.id;
        const quantity = item.quantity;
        const paymentToken = token.address;
        const itemTotal = (item.price * quantity) / cartTotal * parseFloat(cryptoAmount);

        const receipt = await createOrder(productId, quantity, paymentToken, itemTotal);
        
        if (receipt.hash) {
          setTxHash(receipt.hash);
        }
      }

      setOrderCreated(true);
      clearCart();
      
      if (onSuccess) {
        onSuccess();
      }

      toast.success('Payment successful! Your order has been created.');

    } catch (error) {
      console.error('Crypto payment error:', error);
      toast.error('Payment failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTraditionalPayment = async () => {
    try {
      setIsProcessing(true);

      // Integrate with traditional payment gateways
      // Example: Razorpay integration
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: cartTotal * 100, // Amount in paise
        currency: 'INR',
        name: 'KisanMitra',
        description: 'Agricultural Equipment Purchase',
        order_id: 'order_' + Date.now(),
        handler: function(response) {
          console.log('Payment successful:', response);
          toast.success('Payment successful!');
          clearCart();
          setOrderCreated(true);
          if (onSuccess) onSuccess();
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#4caf50'
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback to UPI/other methods
        toast.info('Redirecting to payment gateway...');
      }

    } catch (error) {
      console.error('Traditional payment error:', error);
      toast.error('Payment failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderCreated) {
    return (
      <div className="blockchain-checkout-overlay">
        <div className="blockchain-checkout-modal success">
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h2>Payment Successful!</h2>
            <p>Your order has been created successfully.</p>
            
            {txHash && (
              <div className="tx-details">
                <p><strong>Transaction Hash:</strong></p>
                <p className="tx-hash">{txHash}</p>
                <a 
                  href={`https://${chainId === 137 ? 'polygonscan.com' : 'etherscan.io'}/tx/${txHash}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-tx-btn"
                >
                  View on Explorer
                </a>
              </div>
            )}
            
            <button onClick={onClose} className="close-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blockchain-checkout-overlay">
      <div className="blockchain-checkout-modal">
        <div className="modal-header">
          <h2>🔗 Blockchain Payment</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="modal-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="items-list">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                    <p className="item-price">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="total-amount">
              <strong>Total: {formatPrice(cartTotal)}</strong>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="payment-methods">
            <h3>Select Payment Method</h3>
            
            <div className="method-options">
              <label className={`method-option ${paymentMethod === 'crypto' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="crypto"
                  checked={paymentMethod === 'crypto'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="method-card">
                  <div className="method-icon">🔗</div>
                  <div className="method-details">
                    <h4>Cryptocurrency</h4>
                    <p>Pay with ETH, MATIC, or stablecoins</p>
                  </div>
                </div>
              </label>

              <label className={`method-option ${paymentMethod === 'traditional' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="traditional"
                  checked={paymentMethod === 'traditional'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="method-card">
                  <div className="method-icon">💳</div>
                  <div className="method-details">
                    <h4>Traditional Payment</h4>
                    <p>UPI, Cards, Net Banking</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Crypto Payment Options */}
          {paymentMethod === 'crypto' && (
            <div className="crypto-options">
              <h4>Select Token</h4>
              <div className="token-selection">
                {Object.entries(TOKENS).map(([key, token]) => (
                  <label key={key} className={`token-option ${selectedToken === key ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      value={key}
                      checked={selectedToken === key}
                      onChange={(e) => setSelectedToken(e.target.value)}
                    />
                    <div className="token-card">
                      <div className="token-symbol">{token.symbol}</div>
                      <div className="token-details">
                        <h5>{token.name}</h5>
                        <p>{calculateCryptoAmount()} {token.symbol}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Wallet Connection Status */}
              <div className="wallet-status">
                {!isConnected ? (
                  <button onClick={handleConnectWallet} className="connect-wallet-btn">
                    🔗 Connect Wallet
                  </button>
                ) : (
                  <div className="wallet-connected">
                    <div className="wallet-info">
                      <span className="connected-indicator">🟢</span>
                      <div>
                        <p><strong>Connected:</strong> {account?.slice(0, 6)}...{account?.slice(-4)}</p>
                        <p><strong>Network:</strong> {getNetworkName()}</p>
                      </div>
                    </div>
                    
                    {!isNetworkSupported() && (
                      <button onClick={handleSwitchNetwork} className="switch-network-btn">
                        Switch to Polygon
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Button */}
          <div className="payment-actions">
            {paymentMethod === 'crypto' ? (
              <button
                onClick={handleCryptoPayment}
                disabled={!isConnected || !isNetworkSupported() || isProcessing}
                className="pay-crypto-btn"
              >
                {isProcessing ? (
                  <>⏳ Processing...</>
                ) : (
                  <>🔗 Pay with {TOKENS[selectedToken]?.symbol}</>
                )}
              </button>
            ) : (
              <button
                onClick={handleTraditionalPayment}
                disabled={isProcessing}
                className="pay-traditional-btn"
              >
                {isProcessing ? '⏳ Processing...' : '💳 Pay with Traditional Methods'}
              </button>
            )}
          </div>

          {/* Security Info */}
          <div className="security-info">
            <div className="security-item">
              🔒 Secure escrow-based payments
            </div>
            <div className="security-item">
              ⛓️ Transparent blockchain transactions
            </div>
            <div className="security-item">
              🛡️ Smart contract protection
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainCheckout;