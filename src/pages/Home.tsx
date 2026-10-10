import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import CartBar from '../components/CartBar'
import SizzlingPan from '../components/SizzlingPan'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center px-4 pt-1 sm:pt-2 text-center relative overflow-hidden">
        <FloatingSpices />

        <h1 className="sr-only">Bangi — Flavors of Bengal, Savored with Love!</h1>
        <Logo className="h-32 sm:h-40" />

        <div className="flex-1 flex items-center justify-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 140, damping: 12 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/menu')}
            className="group relative flex flex-col items-center"
          >
            <SizzlingPan size={220} />
            <span className="mt-4 bg-terracotta group-hover:bg-alpona transition-colors text-cream font-bold text-lg px-8 py-3.5 rounded-full shadow-lg">
              This Week's Menu
            </span>
            <span className="text-xs text-clay-dark mt-2">Ordering open Fri–Sun midnight</span>
          </motion.button>
        </div>
      </section>

      <CartBar />
    </div>
  )
}

function FloatingSpices() {
  const spices = ['🌶️', '🍃', '🫘', '🌾']
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {spices.map((s, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl opacity-30"
          style={{ top: `${10 + i * 20}%`, left: i % 2 === 0 ? '8%' : '85%' }}
          animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
        >
          {s}
        </motion.span>
      ))}
    </div>
  )
}
