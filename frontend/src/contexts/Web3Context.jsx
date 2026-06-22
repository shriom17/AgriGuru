import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

// Web3 Action Types
const WEB3_ACTIONS = {
  SET_PROVIDER: 'SET_PROVIDER',
  SET_ACCOUNT: 'SET_ACCOUNT',
  SET_CHAIN_ID: 'SET_CHAIN_ID',
  SET_BALANCE: 'SET_BALANCE',
  SET_CONTRACT: 'SET_CONTRACT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  RESET_STATE: 'RESET_STATE'
};

// Initial state
const initialState = {
  provider: null,
  signer: null,
  account: null,
  chainId: null,
  balance: '0',
  contract: null,
  isConnected: false,
  isLoading: false,
  error: null,
  supportedChains: {
    1: 'Ethereum Mainnet',
    137: 'Polygon Mainnet',
    80001: 'Polygon Mumbai Testnet',
    11155111: 'Sepolia Testnet'
  }
};

// Contract configurations
const CONTRACT_CONFIG = {
  137: { // Polygon Mainnet
    address: '0x...', // Deploy your contract here
    rpc: 'https://polygon-rpc.com'
  },
  80001: { // Polygon Mumbai Testnet
    address: '0x...', // Testnet contract address
    rpc: 'https://rpc-mumbai.maticvigil.com'
  }
};

// Contract ABI (abbreviated)
const CONTRACT_ABI = [
  "function listProduct(string memory _name, string memory _description, uint256 _price, uint256 _quantity, string memory _category, string memory _ipfsHash) external",
  "function createOrder(uint256 _productId, uint256 _quantity, address _paymentToken) external payable",
  "function updateOrderStatus(uint256 _orderId, uint8 _status) external",
  "function releaseEscrow(uint256 _orderId) external",
  "function addReview(uint256 _productId, uint8 _rating, string memory _comment) external",
  "function getProduct(uint256 _productId) external view returns (tuple(uint256 id, address seller, string name, string description, uint256 price, uint256 quantity, string category, string ipfsHash, bool isActive, uint256 createdAt))",
  "function getOrder(uint256 _orderId) external view returns (tuple(uint256 id, uint256 productId, address buyer, address seller, uint256 quantity, uint256 totalAmount, uint8 status, uint256 createdAt, uint256 escrowReleaseTime))",
  "function getUserProducts(address _user) external view returns (uint256[])",
  "function getUserOrders(address _user) external view returns (uint256[])",
  "function verifiedFarmers(address) external view returns (bool)",
  "event ProductListed(uint256 indexed productId, address indexed seller, uint256 price)",
  "event OrderCreated(uint256 indexed orderId, uint256 indexed productId, address indexed buyer)",
  "event OrderStatusUpdated(uint256 indexed orderId, uint8 status)"
];

// Web3 Reducer
const web3Reducer = (state, action) => {
  switch (action.type) {
    case WEB3_ACTIONS.SET_PROVIDER:
      return {
        ...state,
        provider: action.payload.provider,
        signer: action.payload.signer
      };
    
    case WEB3_ACTIONS.SET_ACCOUNT:
      return {
        ...state,
        account: action.payload,
        isConnected: !!action.payload
      };
    
    case WEB3_ACTIONS.SET_CHAIN_ID:
      return {
        ...state,
        chainId: action.payload
      };
    
    case WEB3_ACTIONS.SET_BALANCE:
      return {
        ...state,
        balance: action.payload
      };
    
    case WEB3_ACTIONS.SET_CONTRACT:
      return {
        ...state,
        contract: action.payload
      };
    
    case WEB3_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case WEB3_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case WEB3_ACTIONS.RESET_STATE:
      return {
        ...initialState,
        supportedChains: state.supportedChains
      };
    
    default:
      return state;
  }
};

// Create context
const Web3Context = createContext();

// Custom hook to use Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

// Web3 Provider Component
export const Web3Provider = ({ children }) => {
  const [state, dispatch] = useReducer(web3Reducer, initialState);

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      dispatch({ type: WEB3_ACTIONS.SET_LOADING, payload: true });

      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.');
      }

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      dispatch({
        type: WEB3_ACTIONS.SET_PROVIDER,
        payload: { provider, signer }
      });

      dispatch({
        type: WEB3_ACTIONS.SET_ACCOUNT,
        payload: accounts[0]
      });

      dispatch({
        type: WEB3_ACTIONS.SET_CHAIN_ID,
        payload: Number(network.chainId)
      });

      // Get balance
      const balance = await provider.getBalance(accounts[0]);
      dispatch({
        type: WEB3_ACTIONS.SET_BALANCE,
        payload: ethers.formatEther(balance)
      });

      // Initialize contract if on supported network
      if (CONTRACT_CONFIG[Number(network.chainId)]) {
        const contractAddress = CONTRACT_CONFIG[Number(network.chainId)].address;
        const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
        
        dispatch({
          type: WEB3_ACTIONS.SET_CONTRACT,
          payload: contract
        });
      }

      dispatch({ type: WEB3_ACTIONS.SET_LOADING, payload: false });
      toast.success('Wallet connected successfully!');

    } catch (error) {
      console.error('Error connecting wallet:', error);
      dispatch({
        type: WEB3_ACTIONS.SET_ERROR,
        payload: error.message
      });
      toast.error(error.message);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    dispatch({ type: WEB3_ACTIONS.RESET_STATE });
    toast.info('Wallet disconnected');
  };

  // Switch to supported network
  const switchNetwork = async (chainId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        await addNetwork(chainId);
      } else {
        throw error;
      }
    }
  };

  // Add network to MetaMask
  const addNetwork = async (chainId) => {
    const networkConfig = {
      137: {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://polygonscan.com']
      },
      80001: {
        chainId: '0x13881',
        chainName: 'Polygon Mumbai Testnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com']
      }
    };

    if (networkConfig[chainId]) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig[chainId]]
      });
    }
  };

  // Smart contract interaction functions
  const listProduct = async (productData) => {
    try {
      if (!state.contract) throw new Error('Contract not initialized');
      
      const tx = await state.contract.listProduct(
        productData.name,
        productData.description,
        ethers.parseEther(productData.price.toString()),
        productData.quantity,
        productData.category,
        productData.ipfsHash
      );
      
      const receipt = await tx.wait();
      toast.success('Product listed successfully!');
      return receipt;
    } catch (error) {
      console.error('Error listing product:', error);
      toast.error('Failed to list product: ' + error.message);
      throw error;
    }
  };

  const createOrder = async (productId, quantity, paymentToken, totalAmount) => {
    try {
      if (!state.contract) throw new Error('Contract not initialized');
      
      const value = paymentToken === ethers.ZeroAddress ? 
        ethers.parseEther(totalAmount.toString()) : 0;
      
      const tx = await state.contract.createOrder(
        productId,
        quantity,
        paymentToken,
        { value }
      );
      
      const receipt = await tx.wait();
      toast.success('Order created successfully!');
      return receipt;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order: ' + error.message);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      if (!state.contract) throw new Error('Contract not initialized');
      
      const tx = await state.contract.updateOrderStatus(orderId, status);
      const receipt = await tx.wait();
      toast.success('Order status updated!');
      return receipt;
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status: ' + error.message);
      throw error;
    }
  };

  const releaseEscrow = async (orderId) => {
    try {
      if (!state.contract) throw new Error('Contract not initialized');
      
      const tx = await state.contract.releaseEscrow(orderId);
      const receipt = await tx.wait();
      toast.success('Escrow released successfully!');
      return receipt;
    } catch (error) {
      console.error('Error releasing escrow:', error);
      toast.error('Failed to release escrow: ' + error.message);
      throw error;
    }
  };

  const addReview = async (productId, rating, comment) => {
    try {
      if (!state.contract) throw new Error('Contract not initialized');
      
      const tx = await state.contract.addReview(productId, rating, comment);
      const receipt = await tx.wait();
      toast.success('Review added successfully!');
      return receipt;
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review: ' + error.message);
      throw error;
    }
  };

  // Get contract data
  const getProduct = async (productId) => {
    try {
      if (!state.contract) throw new Error('Contract not initialized');
      return await state.contract.getProduct(productId);
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  };

  const getUserProducts = async (userAddress) => {
    try {
      if (!state.contract) throw new Error('Contract not initialized');
      return await state.contract.getUserProducts(userAddress);
    } catch (error) {
      console.error('Error getting user products:', error);
      throw error;
    }
  };

  const getUserOrders = async (userAddress) => {
    try {
      if (!state.contract) throw new Error('Contract not initialized');
      return await state.contract.getUserOrders(userAddress);
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  };

  // Format utilities
  const formatPrice = (price) => {
    return ethers.formatEther(price);
  };

  const parsePrice = (price) => {
    return ethers.parseEther(price.toString());
  };

  // Event listeners for account/network changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== state.account) {
          dispatch({ type: WEB3_ACTIONS.SET_ACCOUNT, payload: accounts[0] });
        }
      };

      const handleChainChanged = (chainId) => {
        window.location.reload(); // Recommended by MetaMask
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [state.account]);

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum && localStorage.getItem('KisanMitra_wallet_connected') === 'true') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (error) {
          console.error('Auto-connect failed:', error);
        }
      }
    };

    autoConnect();
  }, []);

  // Save connection state
  useEffect(() => {
    if (state.isConnected) {
      localStorage.setItem('KisanMitra_wallet_connected', 'true');
    } else {
      localStorage.removeItem('KisanMitra_wallet_connected');
    }
  }, [state.isConnected]);

  const value = {
    // State
    ...state,
    
    // Connection functions
    connectWallet,
    disconnectWallet,
    switchNetwork,
    
    // Contract functions
    listProduct,
    createOrder,
    updateOrderStatus,
    releaseEscrow,
    addReview,
    getProduct,
    getUserProducts,
    getUserOrders,
    
    // Utilities
    formatPrice,
    parsePrice,
    
    // Helpers
    isNetworkSupported: () => CONTRACT_CONFIG[state.chainId] !== undefined,
    getNetworkName: () => state.supportedChains[state.chainId] || 'Unknown Network',
    getContractAddress: () => CONTRACT_CONFIG[state.chainId]?.address || null
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};