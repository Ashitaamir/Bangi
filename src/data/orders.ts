import type { CartItem } from '../context/CartContext'

export type Fulfillment = 'delivery' | 'pickup'
export type DeliveryZone = 'downtown' | 'outside'

export interface BusinessSettings {
  interacEmail: string
  pickupAddress: string
  deliveryFeeDowntown: number
  deliveryFeeOutside: number
}

// Used before the owner has ever saved Business Settings in /admin (or when
// Firebase isn't configured at all).
export const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  interacEmail: 'orders@bangikitchen.ca',
  pickupAddress: '5000 Boulevard De Maisonneuve O, Montreal — 5:00pm to 7:00pm',
  deliveryFeeDowntown: 3,
  deliveryFeeOutside: 8,
}

export type OrderStatus = 'awaiting_confirmation' | 'confirmed'

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
  status: OrderStatus
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
