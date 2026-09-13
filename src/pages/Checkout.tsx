import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import {
  saveLastOrder,
  generateOrderId,
  DELIVERY_FEES,
  type Fulfillment,
  type DeliveryZone,
} from '../data/orders'
import AlponaDivider from '../components/AlponaDivider'

const INTERAC_EMAIL = 'orders@bangikitchen.ca'
const PICKUP_ADDRESS = '5000 Boulevard De Maisonneuve O, Montreal — 5:00pm to 7:00pm'

export default function Checkout() {
  const { items, subtotal, itemTotal, removeItem, clearCart } = useCart()
  const navigate = useNavigate()
  const orderId = useMemo(() => generateOrderId(), [])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [fulfillment, setFulfillment] = useState<Fulfillment>('delivery')
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>('downtown')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [screenshot, setScreenshot] = useState<string | undefined>()
  const [screenshotName, setScreenshotName] = useState<string>('')
  const [copied, setCopied] = useState<'email' | 'memo' | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const deliveryFee = fulfillment === 'delivery' ? DELIVERY_FEES[deliveryZone] : 0
  const total = subtotal + deliveryFee

  const canSubmit =
    items.length > 0 &&
    name.trim() &&
    email.trim() &&
    phone.trim() &&
    (fulfillment === 'pickup' || address.trim()) &&
    screenshot

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setScreenshotName(file.name)
    const reader = new FileReader()
    reader.onload = () => setScreenshot(reader.result as string)
    reader.readAsDataURL(file)
  }

  function copy(text: string, which: 'email' | 'memo') {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(which)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  function handleSubmit() {
    if (!canSubmit) return
    setSubmitting(true)
    saveLastOrder({
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: { name, email, phone },
      fulfillment,
      deliveryZone: fulfillment === 'delivery' ? deliveryZone : undefined,
      deliveryFee,
      address: fulfillment === 'delivery' ? address : PICKUP_ADDRESS,
      notes,
      items,
      subtotal,
      total,
      screenshotDataUrl: screenshot,
    })
    clearCart()
    setTimeout(() => navigate('/confirmation'), 400)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 pt-16 text-center">
        <p className="text-4xl mb-3">🍽️</p>
        <h1 className="font-display text-2xl font-bold text-bark">Your order is empty</h1>
        <p className="text-clay-dark mt-2">Head back to the menu to add something delicious.</p>
        <Link
          to="/menu"
          className="inline-block mt-6 bg-terracotta text-cream font-bold px-5 py-2.5 rounded-full hover:bg-alpona transition-colors"
        >
          Browse Weekly Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-20">
      <Link to="/menu" className="text-clay-dark text-sm font-semibold hover:text-terracotta">
        ← Add more items
      </Link>

      <h1 className="font-display text-3xl font-extrabold text-bark text-center mt-3">
        Complete Your Order
      </h1>
      <AlponaDivider />

      {/* Order summary */}
      <section className="mt-6 bg-parchment/70 rounded-2xl p-5 rustic-border">
        <h2 className="font-display text-lg font-bold text-bark mb-3">Order Summary</h2>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.cartItemId} className="flex items-start justify-between gap-3 text-sm">
              <div className="flex gap-2">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <p className="font-semibold text-bark">
                    {item.qty}× {item.name}
                  </p>
                  {item.chosenSubs.length > 0 && (
                    <p className="text-clay-dark text-xs">
                      {item.chosenSubs
                        .map(
                          (s) =>
                            `${s.itemName} — ${s.groupLabel}: ${s.optionLabel}${
                              s.priceDelta ? ` (${s.priceDelta > 0 ? '+' : ''}$${s.priceDelta.toFixed(2)})` : ''
                            }`,
                        )
                        .join(' · ')}
                    </p>
                  )}
                  {item.extras && item.extras.length > 0 && (
                    <p className="text-clay-dark text-xs mt-0.5">
                      Extra:{' '}
                      {item.extras
                        .map((e) => `${e.qty}× ${e.itemName} (+$${(e.qty * e.unitPrice).toFixed(2)})`)
                        .join(' · ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-terracotta">${itemTotal(item).toFixed(2)}</span>
                <button
                  onClick={() => removeItem(item.cartItemId)}
                  aria-label={`Remove ${item.name}`}
                  className="text-bark/40 hover:text-terracotta text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
        {deliveryFee > 0 && (
          <div className="flex justify-between text-sm text-clay-dark mt-3 pt-3 border-t border-dashed border-bark/20">
            <span>Delivery fee ({deliveryZone === 'downtown' ? 'Downtown Montreal' : 'Outside Downtown'})</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
        )}
        <div className="border-t border-dashed border-bark/20 mt-4 pt-3 flex justify-between font-bold text-bark">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </section>

      {/* Personal details */}
      <section className="mt-6 grid gap-3">
        <h2 className="font-display text-lg font-bold text-bark">Your Details</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="rounded-lg border border-bark/20 px-4 py-2.5 bg-cream focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="rounded-lg border border-bark/20 px-4 py-2.5 bg-cream focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            placeholder="Phone number"
            className="rounded-lg border border-bark/20 px-4 py-2.5 bg-cream focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
      </section>

      {/* Fulfillment */}
      <section className="mt-6">
        <h2 className="font-display text-lg font-bold text-bark mb-2">Delivery or Pickup?</h2>
        <div className="flex gap-3">
          {(['delivery', 'pickup'] as Fulfillment[]).map((option) => (
            <button
              key={option}
              onClick={() => setFulfillment(option)}
              className={`flex-1 capitalize font-semibold py-2.5 rounded-full border-2 transition-colors ${
                fulfillment === option
                  ? 'bg-terracotta text-cream border-terracotta'
                  : 'bg-cream text-bark border-bark/20 hover:border-terracotta'
              }`}
            >
              {option === 'delivery' ? '🛵 Delivery' : '🚶 Pickup'}
            </button>
          ))}
        </div>

        {fulfillment === 'delivery' ? (
          <>
            <div className="mt-3 flex gap-2">
              {(['downtown', 'outside'] as DeliveryZone[]).map((zone) => (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setDeliveryZone(zone)}
                  className={`flex-1 text-sm font-semibold py-2 rounded-full border-2 transition-colors ${
                    deliveryZone === zone
                      ? 'bg-clay-dark text-cream border-clay-dark'
                      : 'bg-cream text-bark border-bark/20 hover:border-clay-dark'
                  }`}
                >
                  {zone === 'downtown' ? `Downtown Montreal +$${DELIVERY_FEES.downtown}` : `Outside Downtown +$${DELIVERY_FEES.outside}`}
                </button>
              ))}
            </div>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Delivery address"
              rows={2}
              className="mt-3 w-full rounded-lg border border-bark/20 px-4 py-2.5 bg-cream focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </>
        ) : (
          <p className="mt-3 text-sm text-clay-dark bg-cream rounded-lg px-4 py-2.5 border border-bark/10">
            📍 Pickup at: <strong>{PICKUP_ADDRESS}</strong>
          </p>
        )}

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes for the kitchen (optional)"
          rows={2}
          className="mt-3 w-full rounded-lg border border-bark/20 px-4 py-2.5 bg-cream focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </section>

      {/* Interac payment */}
      <section className="mt-6 bg-bark text-cream rounded-2xl p-5">
        <h2 className="font-display text-lg font-bold flex items-center gap-2">
          💸 Pay by Interac e-Transfer
        </h2>
        <div className="mt-3 grid gap-2 text-sm">
          <div className="flex items-center justify-between bg-cream/10 rounded-lg px-3 py-2">
            <span>
              Send to: <strong>{INTERAC_EMAIL}</strong>
            </span>
            <button
              onClick={() => copy(INTERAC_EMAIL, 'email')}
              className="text-gold text-xs font-bold hover:underline"
            >
              {copied === 'email' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="flex items-center justify-between bg-cream/10 rounded-lg px-3 py-2">
            <span>
              Memo / Reference: <strong>{orderId}</strong>
            </span>
            <button
              onClick={() => copy(orderId, 'memo')}
              className="text-gold text-xs font-bold hover:underline"
            >
              {copied === 'memo' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="flex items-center justify-between bg-cream/10 rounded-lg px-3 py-2">
            <span>Amount</span>
            <strong className="text-gold text-base">${total.toFixed(2)}</strong>
          </div>
        </div>
        <p className="text-xs text-cream/70 mt-3">
          Please include the memo above so we can match your payment. Autodeposit is enabled — no
          security question needed.
        </p>
      </section>

      {/* Screenshot upload */}
      <section className="mt-6">
        <h2 className="font-display text-lg font-bold text-bark mb-2">
          Upload Payment Screenshot
        </h2>
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-clay-dark/40 rounded-2xl py-8 cursor-pointer hover:border-terracotta transition-colors bg-parchment/50">
          {screenshot ? (
            <img src={screenshot} alt="Payment screenshot preview" className="max-h-48 rounded-lg shadow" />
          ) : (
            <>
              <span className="text-3xl">📎</span>
              <span className="text-sm text-clay-dark font-semibold">
                Tap to upload a screenshot of your Interac transfer
              </span>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
        {screenshotName && <p className="text-xs text-clay-dark mt-1 text-center">{screenshotName}</p>}
      </section>

      <motion.button
        whileTap={{ scale: 0.97 }}
        disabled={!canSubmit || submitting}
        onClick={handleSubmit}
        className="mt-8 w-full bg-terracotta disabled:bg-clay-light disabled:cursor-not-allowed hover:bg-alpona text-cream font-bold text-lg py-3.5 rounded-full shadow-lg transition-colors"
      >
        {submitting ? 'Placing your order…' : `Confirm Order · $${total.toFixed(2)}`}
      </motion.button>
      {!canSubmit && (
        <p className="text-xs text-center text-clay-dark mt-2">
          Fill in your details and upload a payment screenshot to confirm.
        </p>
      )}
    </div>
  )
}
