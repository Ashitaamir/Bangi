import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export interface ChosenSub {
  itemId: string
  itemName: string
  groupId: string
  groupLabel: string
  optionId: string
  optionLabel: string
  priceDelta: number
}

export interface ExtraLine {
  itemId: string
  itemName: string
  emoji: string
  qty: number
  unitPrice: number
}

export interface CartItem {
  cartItemId: string
  sourceType: 'weekly' | 'special'
  itemId: string
  name: string
  bengaliName?: string
  emoji: string
  basePrice: number
  qty: number
  chosenSubs: ChosenSub[]
  extras?: ExtraLine[]
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void
  removeItem: (cartItemId: string) => void
  updateQty: (cartItemId: string, qty: number) => void
  clearCart: () => void
  itemTotal: (item: CartItem) => number
  subtotal: number
  count: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)
const STORAGE_KEY = 'bangi-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as CartItem[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // storage unavailable, ignore
    }
  }, [items])

  function addItem(item: Omit<CartItem, 'cartItemId'>) {
    const cartItemId = `${item.itemId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setItems((prev) => [...prev, { ...item, cartItemId }])
  }

  function removeItem(cartItemId: string) {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId))
  }

  function updateQty(cartItemId: string, qty: number) {
    setItems((prev) =>
      prev.map((i) => (i.cartItemId === cartItemId ? { ...i, qty: Math.max(1, qty) } : i)),
    )
  }

  function clearCart() {
    setItems([])
  }

  function itemTotal(item: CartItem) {
    const subDelta = item.chosenSubs.reduce((sum, s) => sum + s.priceDelta, 0)
    const extrasTotal = (item.extras ?? []).reduce((sum, e) => sum + e.qty * e.unitPrice, 0)
    return (item.basePrice + subDelta) * item.qty + extrasTotal
  }

  const subtotal = items.reduce((sum, i) => sum + itemTotal(i), 0)
  const count = items.reduce(
    (sum, i) => sum + i.qty + (i.extras ?? []).reduce((s, e) => s + e.qty, 0),
    0,
  )

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, itemTotal, subtotal, count }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
