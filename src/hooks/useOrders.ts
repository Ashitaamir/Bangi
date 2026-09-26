import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../lib/firebase'
import type { Order } from '../data/orders'

export interface AdminOrder extends Order {
  firestoreId: string
}

// Admin-only: live list of incoming orders, newest first. Only called from
// the authenticated admin dashboard, matching the Firestore rule that
// restricts order reads to signed-in owners.
export function useOrders(): { orders: AdminOrder[]; loading: boolean; error: string } {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isFirebaseConfigured) return
    const unsub = onSnapshot(
      query(collection(db, 'orders'), orderBy('createdAt', 'desc')),
      (snap) => {
        setError('')
        setOrders(
          snap.docs.map((d) => {
            const data = d.data()
            return {
              ...data,
              id: data.id ?? d.id,
              firestoreId: d.id,
              createdAt: data.createdAt?.toDate?.().toISOString() ?? data.createdAt ?? '',
            } as AdminOrder
          }),
        )
      },
      (err) => {
        setError(err.message)
        setOrders([])
      },
    )
    return unsub
  }, [])

  return { orders: orders ?? [], loading: orders === null, error }
}
