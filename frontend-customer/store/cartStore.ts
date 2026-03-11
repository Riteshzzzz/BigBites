import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // usually foodItemID
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  restaurantId: string;
  restaurantName: string;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null; // Cart can only have items from one restaurant
  restaurantName: string | null;
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Computed
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: null,

      addItem: (newItem) => {
        set((state) => {
          const currentItems = state.items;
          const existingItemIndex = currentItems.findIndex(i => i.id === newItem.id);

          if (existingItemIndex > -1) {
             // update quantity
             const updatedItems = [...currentItems];
             updatedItems[existingItemIndex].quantity += newItem.quantity;
             return {
               items: updatedItems,
             };
          } else {
             return {
               items: [...currentItems, newItem],
             };
          }
        });
      },

      removeItem: (id) => {
        set((state) => {
          const newItems = state.items.filter(i => i.id !== id);
          return {
            items: newItems,
            restaurantId: newItems.length === 0 ? null : state.restaurantId,
            restaurantName: newItems.length === 0 ? null : state.restaurantName
          };
        });
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map(item => 
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          )
        }));
      },

      clearCart: () => set({ items: [], restaurantId: null, restaurantName: null }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'big-bites-cart-v2', // local storage key
    }
  )
);
