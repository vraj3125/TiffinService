import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [checkoutItem, setCheckoutItem] = useState(null)
  // checkoutItem shape: { provider, plan, meal }

  const startCheckout = (provider, plan, meal = 'lunch') => {
    setCheckoutItem({ provider, plan, meal })
  }

  const clearCheckout = () => setCheckoutItem(null)

  return (
    <CartContext.Provider value={{ checkoutItem, startCheckout, clearCheckout }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
