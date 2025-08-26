import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
  variant?: any
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  toggleCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.id === item.id)
        if (existingItem) {
          return {
            items: state.items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          }
        }
        return { items: [...state.items, item] }
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: quantity <= 0
          ? state.items.filter(i => i.id !== id)
          : state.items.map(i =>
              i.id === id ? { ...i, quantity } : i
            )
      })),

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        const items = get().items
        return items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },

      getTotalItems: () => {
        const items = get().items
        return items.reduce((total, item) => total + item.quantity, 0)
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen }))
    }),
    {
      name: 'cart-storage'
    }
  )
)