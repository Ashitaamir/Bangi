import { useMemo, useState } from 'react'
import type { AdminOrder } from '../../hooks/useOrders'
import OrderCard from './OrderCard'

type Filter = 'pending' | 'confirmed' | 'all'

// Ordering weeks run Friday -> Thursday. Given an order's timestamp, finds
// the Friday that starts its week and returns a stable sort key alongside
// the "Week of ..." label used as the group header.
function weekStart(iso: string): Date {
  const d = iso ? new Date(iso) : new Date(0)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() // 0=Sun .. 5=Fri .. 6=Sat
  const daysSinceFriday = (day - 5 + 7) % 7
  d.setDate(d.getDate() - daysSinceFriday)
  return d
}

function weekLabel(iso: string) {
  if (!iso) return 'Unknown week'
  const start = weekStart(iso)
  const now = new Date()
  const sameYear = start.getFullYear() === now.getFullYear()
  return `Week of ${start.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: sameYear ? undefined : 'numeric',
  })}`
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
    const map = new Map<number, { label: string; orders: AdminOrder[] }>()
    for (const order of filtered) {
      const key = weekStart(order.createdAt).getTime()
      if (!map.has(key)) map.set(key, { label: weekLabel(order.createdAt), orders: [] })
      map.get(key)!.orders.push(order)
    }
    // `orders` arrives newest-first from Firestore, so insertion order above
    // already puts the most recent week first -- no extra sort needed.
    return Array.from(map.values())
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
        <div className="grid gap-6">
          {groups.map(({ label, orders: group }) => (
            <div key={label}>
              <div className="flex items-center gap-3 mb-3">
                <p className="font-display text-lg font-bold text-bark whitespace-nowrap">{label}</p>
                <span className="h-px flex-1 bg-bark/15" />
                <span className="text-xs font-bold text-clay-dark shrink-0">
                  {group.length} order{group.length === 1 ? '' : 's'}
                </span>
              </div>
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
