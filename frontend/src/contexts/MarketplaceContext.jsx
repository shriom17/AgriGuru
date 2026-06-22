import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Action types for the marketplace reducer
const ACTIONS = {
  // Cart actions
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  
  // Favorites actions
  ADD_TO_FAVORITES: 'ADD_TO_FAVORITES',
  REMOVE_FROM_FAVORITES: 'REMOVE_FROM_FAVORITES',
  CLEAR_FAVORITES: 'CLEAR_FAVORITES',
  
  // Data loading
  LOAD_DATA: 'LOAD_DATA'
};

// Initial state
const initialState = {
  cart: [],
  favorites: [],
  isLoading: false
};

// Marketplace reducer function
const marketplaceReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TO_CART: {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // If item exists, increase quantity
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        // If new item, add to cart with quantity 1
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }]
        };
      }
    }

    case ACTIONS.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };

    case ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return {
          ...state,
          cart: state.cart.filter(item => item.id !== id)
        };
      }
      
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      };
    }

    case ACTIONS.CLEAR_CART:
      return {
        ...state,
        cart: []
      };

    case ACTIONS.ADD_TO_FAVORITES: {
      const isAlreadyFavorite = state.favorites.some(item => item.id === action.payload.id);
      
      if (!isAlreadyFavorite) {
        return {
          ...state,
          favorites: [...state.favorites, action.payload]
        };
      }
      return state;
    }

    case ACTIONS.REMOVE_FROM_FAVORITES:
      return {
        ...state,
        favorites: state.favorites.filter(item => item.id !== action.payload)
      };

    case ACTIONS.CLEAR_FAVORITES:
      return {
        ...state,
        favorites: []
      };

    case ACTIONS.LOAD_DATA:
      return {
        ...state,
        cart: action.payload.cart || [],
        favorites: action.payload.favorites || []
      };

    default:
      return state;
  }
};

// Create context
const MarketplaceContext = createContext();

// Custom hook to use marketplace context
export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within MarketplaceProvider');
  }
  return context;
};

// Marketplace provider component
export const MarketplaceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(marketplaceReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('KisanMitra_cart');
      const savedFavorites = localStorage.getItem('KisanMitra_favorites');
      
      dispatch({
        type: ACTIONS.LOAD_DATA,
        payload: {
          cart: savedCart ? JSON.parse(savedCart) : [],
          favorites: savedFavorites ? JSON.parse(savedFavorites) : []
        }
      });
    } catch (error) {
      console.error('Error loading marketplace data from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('KisanMitra_cart', JSON.stringify(state.cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.cart]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('KisanMitra_favorites', JSON.stringify(state.favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [state.favorites]);

  // Helper functions
  const addToCart = (product) => {
    dispatch({ type: ACTIONS.ADD_TO_CART, payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: ACTIONS.CLEAR_CART });
  };

  const addToFavorites = (product) => {
    dispatch({ type: ACTIONS.ADD_TO_FAVORITES, payload: product });
  };

  const removeFromFavorites = (productId) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_FAVORITES, payload: productId });
  };

  const toggleFavorite = (product) => {
    const isFavorite = state.favorites.some(item => item.id === product.id);
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const clearFavorites = () => {
    dispatch({ type: ACTIONS.CLEAR_FAVORITES });
  };

  // Computed values
  const cartItemCount = state.cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const favoritesCount = state.favorites.length;
  
  const isInCart = (productId) => state.cart.some(item => item.id === productId);
  const isInFavorites = (productId) => state.favorites.some(item => item.id === productId);
  
  const getCartItemQuantity = (productId) => {
    const item = state.cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Context value
  const value = {
    // State
    cart: state.cart,
    favorites: state.favorites,
    isLoading: state.isLoading,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    
    // Computed values
    cartItemCount,
    cartTotal,
    favoritesCount,
    isInCart,
    isInFavorites,
    getCartItemQuantity,
    
    // Helper functions
    formatPrice: (price) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(price);
    },
    
    getDiscount: (original, current) => {
      return Math.round(((original - current) / original) * 100);
    }
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export default MarketplaceContext;