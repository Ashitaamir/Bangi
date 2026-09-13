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
      <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
        <FloatingSpices />

        <h1 className="sr-only">Bangi — Flavors of Bengal, Savored with Love!</h1>
        <Logo className="h-32 sm:h-40" />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-clay-dark font-medium mt-4 max-w-sm"
        >
          Home cooked meals with love.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, type: 'spring', stiffness: 140, damping: 12 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/menu')}
          className="group relative mt-10 flex flex-col items-center"
        >
          <SizzlingPan />
          <span className="mt-3 bg-terracotta group-hover:bg-alpona transition-colors text-cream font-bold px-6 py-2.5 rounded-full shadow-lg">
            This Week's Menu
          </span>
          <span className="text-xs text-clay-dark mt-1.5">Ordering open Fri–Sun midnight</span>
        </motion.button>
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
