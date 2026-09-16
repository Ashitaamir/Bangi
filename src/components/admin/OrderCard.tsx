import { useState } from 'react'
import type { AdminOrder } from '../../hooks/useOrders'
import { setOrderStatus } from '../../lib/orders'

function timeAgo(iso: string) {
  if (!iso) return ''
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}

export default function OrderCard({ order }: { order: AdminOrder }) {
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)
  const confirmed = order.status === 'confirmed'

  async function toggleConfirmed() {
    setUpdating(true)
    try {
      await setOrderStatus(order.firestoreId, confirmed ? 'awaiting_confirmation' : 'confirmed')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="rounded-xl bg-parchment/70 rustic-border p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="font-bold text-bark">
            #{order.id} <span className="text-clay-dark font-normal text-xs">· {timeAgo(order.createdAt)}</span>
          </p>
          <p className="text-sm text-bark/80">
            <a href={`tel:${order.customer.phone}`} className="hover:text-terracotta">
              {order.customer.name}
            </a>{' '}
            ·{' '}
            <a href={`mailto:${order.customer.email}`} className="hover:text-terracotta">
              {order.customer.email}
            </a>{' '}
            ·{' '}
            <a href={`tel:${order.customer.phone}`} className="hover:text-terracotta">
              {order.customer.phone}
            </a>
          </p>
        </div>
        <button
          onClick={toggleConfirmed}
          disabled={updating}
          className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 ${
            confirmed ? 'bg-clay-dark text-cream' : 'bg-gold/30 text-clay-dark hover:bg-gold/50'
          }`}
        >
          {confirmed ? 'Confirmed ✓' : 'Awaiting confirmation'}
        </button>
      </div>

      <p className="text-sm text-bark/80 mt-2">
        {order.fulfillment === 'delivery' ? '🛵' : '🚶'} {order.address}
      </p>
      {order.notes && <p className="text-xs text-clay-dark mt-1">Note: {order.notes}</p>}

      <div className="mt-3 grid gap-1.5 text-sm border-t border-dashed border-bark/20 pt-3">
        {order.items.map((item) => (
          <div key={item.cartItemId}>
            <p className="text-bark">
              {item.qty}× {item.emoji} {item.name}
            </p>
            {item.chosenSubs.length > 0 && (
              <p className="text-xs text-clay-dark ml-5">
                {item.chosenSubs.map((s) => `${s.itemName} — ${s.groupLabel}: ${s.optionLabel}`).join(' · ')}
              </p>
            )}
            {item.extras && item.extras.length > 0 && (
              <p className="text-xs text-clay-dark ml-5">
                Extra: {item.extras.map((e) => `${e.qty}× ${e.itemName}`).join(' · ')}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-bark/20">
        <span className="font-bold text-bark">Total: ${order.total.toFixed(2)}</span>
        {order.screenshotDataUrl && (
          <button
            onClick={() => setExpanded(true)}
            className="flex items-center gap-2 text-xs font-semibold text-clay-dark hover:text-terracotta"
          >
            <img src={order.screenshotDataUrl} alt="Payment proof thumbnail" className="w-10 h-10 object-cover rounded border border-bark/20" />
            View payment proof
          </button>
        )}
      </div>

      {expanded && order.screenshotDataUrl && (
        <div
          className="fixed inset-0 z-50 bg-bark/80 flex items-center justify-center p-6"
          onClick={() => setExpanded(false)}
        >
          <img
            src={order.screenshotDataUrl}
            alt="Payment proof"
            className="max-w-full max-h-full rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  )
}
