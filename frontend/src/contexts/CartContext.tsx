import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type CartItem = {
  id: string
  name: string
  sku: string
  size: string
  color: string
  qty: number
  price: string
  image: string
}

/** Minimal product shape for adding to cart (from Products page or Frequent Reorders) */
export type ProductForCart = {
  id: string
  name: string
  sku: string
  yourPrice: string
  image: string
}

function parsePrice(s: string): number {
  const n = parseInt(s.replace(/[^0-9]/g, ''), 10)
  return Number.isNaN(n) ? 0 : n
}

export type CartContextValue = {
  items: CartItem[]
  addItem: (product: ProductForCart, qty: number) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

const DEFAULT_SIZE = 'Large'
const DEFAULT_COLOR = 'White'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback((product: ProductForCart, qty: number) => {
    if (qty < 1) return
    const unit = parsePrice(product.yourPrice)
    const total = unit * qty
    const priceStr = `$${total}`
    const newItem: CartItem = {
      id: `cart-${product.id}-${Date.now()}`,
      name: product.name,
      sku: product.sku,
      size: DEFAULT_SIZE,
      color: DEFAULT_COLOR,
      qty,
      price: priceStr,
      image: product.image,
    }
    setItems((prev) => [...prev, newItem])
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(0, qty) } : i))
        .filter((i) => i.qty > 0)
    )
  }, [])

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQty,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }),
    [items, addItem, removeItem, updateQty, isOpen],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export { CartContext }
