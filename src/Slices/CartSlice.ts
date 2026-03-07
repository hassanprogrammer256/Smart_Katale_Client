import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, CartState } from '../interfaces/cart.interfaces';


// Helper function to ensure whole number (no decimals)
const toWholeNumber = (value: number): number => {
  return Math.round(value); // Rounds to nearest integer
};

// Calculate total amount with whole numbers only
const calculateTotalAmount = (items: CartItem[]): number => {
  const total = items.reduce((sum, item) => {
    const itemPrice = item.price * item.quantity;
    const discountAmount = itemPrice * (item.discount / 100);
    return sum + (itemPrice - discountAmount);
  }, 0);
  return toWholeNumber(total);
};

const loadInitialState = (): CartState => {
  try {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsed = JSON.parse(storedCart);
      if (parsed && Array.isArray(parsed.items)) {
        // Ensure prices are whole numbers when loading from storage
        return {
          items: parsed.items.map((item: CartItem) => ({
            ...item,
            price: toWholeNumber(item.price)
          })),
          totalAmount: toWholeNumber(parsed.totalAmount || 0),
          totalItems: parsed.totalItems || 0
        };
      }
    }
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
  }
  
  return {
    items: [],
    totalAmount: 0,
    totalItems: 0
  };
};

const initialState: CartState = loadInitialState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      // Ensure price is a whole number
      const formattedItem = {
        ...action.payload,
        price: toWholeNumber(action.payload.price)
      };
      
      if (existingItemIndex !== -1) {
        // Item exists, increase quantity
        state.items[existingItemIndex].quantity += formattedItem.quantity;
      } else {
        // Add new item
        state.items.push(formattedItem);
      }
      
      // Recalculate totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = calculateTotalAmount(state.items);
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const itemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (itemIndex !== -1) {
        if (action.payload.quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.items.splice(itemIndex, 1);
        } else {
          // Update quantity
          state.items[itemIndex].quantity = action.payload.quantity;
        }
        
        // Recalculate totals
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalAmount = calculateTotalAmount(state.items);
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      // Recalculate totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = calculateTotalAmount(state.items);
      
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    // Sync cart from localStorage
    syncCartFromStorage: (state) => {
      const stored = loadInitialState();
      state.items = stored.items;
      state.totalAmount = stored.totalAmount;
      state.totalItems = stored.totalItems;
    },

    // Update item price
    updateItemPrice: (state, action: PayloadAction<{ id: string; price: number }>) => {
      const itemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (itemIndex !== -1) {
        state.items[itemIndex].price = toWholeNumber(action.payload.price);
        
        // Recalculate totals
        state.totalAmount = calculateTotalAmount(state.items);
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },

    // Update item discount
    updateItemDiscount: (state, action: PayloadAction<{ id: string; discount: number }>) => {
      const itemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (itemIndex !== -1) {
        state.items[itemIndex].discount = action.payload.discount;
        
        // Recalculate totals
        state.totalAmount = calculateTotalAmount(state.items);
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(state));
      }
    }
  }
});

export const { 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  clearCart,
  syncCartFromStorage,
  updateItemPrice,
  updateItemDiscount
} = cartSlice.actions;

export default cartSlice.reducer;