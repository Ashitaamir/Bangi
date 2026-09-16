import { useMemo, useState } from 'react'
import type { AdminOrder } from '../../hooks/useOrders'
import OrderCard from './OrderCard'

type Filter = 'pending' | 'confirmed' | 'all'

function dayLabel(iso: string) {
  if (!iso) return 'Unknown date'
  const date = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  if (sameDay(date, today)) return 'Today'
  if (sameDay(date, yesterday)) return 'Yesterday'
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}

function matchesSearch(order: AdminOrder, query: string) {
  if (!query.trim()) return true
  const q = query.trim().toLowerCase()
  return (
    order.customer.name.toLowerCase().includes(q) ||
    order.customer.phone.toLowerCase().includes(q) ||
    order.customer.email.toLowerCase().includes(q) ||
    order.id.toLowerCase().includes(q)
  )
}

export default function OrdersPanel({ orders, loading }: { orders: AdminOrder[]; loading: boolean }) {
  const [filter, setFilter] = useState<Filter>('pending')
  const [search, setSearch] = useState('')

  const pendingCount = orders.filter((o) => o.status !== 'confirmed').length
  const confirmedCount = orders.length - pendingCount

  const filtered = useMemo(() => {
    return orders
      .filter((o) => filter === 'all' || (filter === 'pending' ? o.status !== 'confirmed' : o.status === 'confirmed'))
      .filter((o) => matchesSearch(o, search))
  }, [orders, filter, search])

  const groups = useMemo(() => {
    const map = new Map<string, AdminOrder[]>()
    for (const order of filtered) {
      const label = dayLabel(order.createdAt)
      if (!map.has(label)) map.set(label, [])
      map.get(label)!.push(order)
    }
    return Array.from(map.entries())
  }, [filtered])

  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-bold text-bark mb-3">Orders</h2>

      <div className="flex flex-wrap gap-2 mb-3">
        {(
          [
            ['pending', `Awaiting Confirmation (${pendingCount})`],
            ['confirmed', `Confirmed (${confirmedCount})`],
            ['all', `All (${orders.length})`],
          ] as [Filter, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
              filter === key ? 'bg-terracotta text-cream' : 'bg-parchment text-clay-dark hover:bg-parchment/70'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, phone, email, or order #"
        className="w-full rounded-lg border border-bark/20 px-4 py-2 mb-4 bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-gold"
      />

      {loading ? (
        <p className="text-sm text-bark/50">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-bark/50">No orders yet — they'll show up here as customers check out.</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-bark/50">No orders match.</p>
      ) : (
        <div className="grid gap-5">
          {groups.map(([label, group]) => (
            <div key={label}>
              <p className="text-xs uppercase tracking-wide font-bold text-clay-dark mb-2">{label}</p>
              <div className="grid gap-3">
                {group.map((order) => (
                  <OrderCard key={order.firestoreId} order={order} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
