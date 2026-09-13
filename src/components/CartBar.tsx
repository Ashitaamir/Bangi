import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartBar() {
  const { count, subtotal } = useCart()
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md"
        >
          <button
            onClick={() => navigate('/checkout')}
            className="w-full flex items-center justify-between gap-4 bg-bark text-cream px-5 py-3.5 rounded-full shadow-2xl hover:bg-bark-dark transition-colors"
          >
            <span className="flex items-center gap-2 font-semibold">
              <span className="bg-gold text-bark rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {count}
              </span>
              View Order
            </span>
            <span className="font-bold">${subtotal.toFixed(2)} →</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
