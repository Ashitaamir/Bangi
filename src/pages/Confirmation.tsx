import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AlponaBloom from '../components/AlponaBloom'
import { getLastOrder, type Order } from '../data/orders'

export default function Confirmation() {
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    setOrder(getLastOrder())
  }, [])

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 pt-20 text-center">
        <h1 className="font-display text-2xl font-bold text-bark">No recent order found</h1>
        <p className="text-clay-dark mt-2">Looks like there's nothing to confirm yet.</p>
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
    <div className="max-w-lg mx-auto px-4 pt-10 pb-20 text-center">
      <AlponaBloom />

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7 }}
        className="font-display text-3xl font-extrabold text-bark mt-2"
      >
        Order Confirmed!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9 }}
        className="text-clay-dark mt-2"
      >
        Dhonnobad, {order.customer.name.split(' ')[0] || 'friend'}! The Bangi kitchen will confirm
        your payment shortly.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1 }}
        className="mt-8 bg-parchment/70 rustic-border rounded-2xl p-5 text-left"
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-display font-bold text-bark">Order #{order.id}</h2>
          <span className="text-xs bg-gold/30 text-clay-dark font-bold px-2 py-1 rounded-full">
            Awaiting confirmation
          </span>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          {order.items.map((item) => (
            <div key={item.cartItemId} className="flex justify-between">
              <span>
                {item.qty}× {item.emoji} {item.name}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-dashed border-bark/20 mt-3 pt-3 flex justify-between font-bold text-bark">
          <span>Total Paid</span>
          <span>${order.subtotal.toFixed(2)}</span>
        </div>
        <p className="text-xs text-clay-dark mt-3">
          {order.fulfillment === 'delivery' ? `🛵 Delivery to: ${order.address}` : `🚶 ${order.address}`}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.3 }}
        className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Link
          to="/"
          className="bg-terracotta text-cream font-bold px-5 py-2.5 rounded-full hover:bg-alpona transition-colors"
        >
          Back to Home
        </Link>
        <Link
          to="/menu"
          className="bg-cream border-2 border-clay-dark/30 text-bark font-bold px-5 py-2.5 rounded-full hover:border-terracotta transition-colors"
        >
          Order Again
        </Link>
      </motion.div>
    </div>
  )
}
