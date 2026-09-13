import type { CartItem } from '../context/CartContext'

export type Fulfillment = 'delivery' | 'pickup'
export type DeliveryZone = 'downtown' | 'outside'

export const DELIVERY_FEES: Record<DeliveryZone, number> = {
  downtown: 3,
  outside: 8,
}

export interface Order {
  id: string
  createdAt: string
  customer: {
    name: string
    email: string
    phone: string
  }
  fulfillment: Fulfillment
  deliveryZone?: DeliveryZone
  deliveryFee: number
  address?: string
  notes?: string
  items: CartItem[]
  subtotal: number
  total: number
  screenshotDataUrl?: string
}

const LAST_ORDER_KEY = 'bangi-last-order'

export function saveLastOrder(order: Order) {
  try {
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order))
  } catch {
    // storage unavailable, ignore
  }
}

export function getLastOrder(): Order | null {
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY)
    return raw ? (JSON.parse(raw) as Order) : null
  } catch {
    return null
  }
}

export function generateOrderId() {
  const now = new Date()
  const stamp = `${now.getMonth() + 1}${now.getDate()}`
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `BANGI-${stamp}-${rand}`
}
