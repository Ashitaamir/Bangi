import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import AlponaDivider from '../components/AlponaDivider'
import CartBar from '../components/CartBar'
import { specialMeals } from '../data/menu'

export default function Home() {
  const navigate = useNavigate()
  const hasSpecials = specialMeals.length > 0

  return (
    <div>
      {/* Hero */}
      <section className="min-h-[92vh] flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
        <FloatingSpices />

        <Logo size={110} />
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-display text-5xl sm:text-6xl font-extrabold text-bark mt-4 tracking-tight"
        >
          Bangi
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-clay-dark font-medium mt-2 max-w-sm"
        >
          Home-style Bengali meals, cooked weekly &amp; shared with love — order online, pay by Interac.
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
          <ThaliAnimation />
          <span className="mt-3 bg-terracotta group-hover:bg-alpona transition-colors text-cream font-bold px-6 py-2.5 rounded-full shadow-lg">
            This Week's Menu
          </span>
          <span className="text-xs text-clay-dark mt-1.5">Ordering open Fri–Sun midnight</span>
        </motion.button>

        <motion.div
          className="absolute bottom-6 text-clay-dark/70 text-2xl"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          aria-hidden
        >
          ⌄
        </motion.div>
      </section>

      {hasSpecials && (
        <section className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-clay-dark/5 py-16">
          <AlponaDivider />
          <h2 className="font-display text-3xl font-extrabold text-bark mt-4">
            Something special is cooking
          </h2>
          <p className="text-clay-dark font-medium mt-2 max-w-sm">
            Tap the pan — the owners have posted a today/tomorrow special.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/special')}
            className="mt-10"
            aria-label="View special meals"
          >
            <FishFlipAnimation />
          </motion.button>

          <AlponaDivider flip />
        </section>
      )}

      <CartBar />
    </div>
  )
}

function ThaliAnimation() {
  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-skin-light to-clay shadow-xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage:
            'repeating-conic-gradient(from 0deg, #C9982B 0deg 6deg, transparent 6deg 24deg)',
        }}
      />
      <div className="absolute inset-3 rounded-full bg-clay shadow-inner" />
      <div className="absolute inset-6 rounded-full bg-gradient-to-br from-skin to-clay-dark flex items-center justify-center text-5xl">
        🍛
      </div>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute text-cream/80 text-lg"
          style={{ top: -6, left: `${38 + i * 10}%` }}
          animate={{ y: [-2, -26, -2], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
        >
          ~
        </motion.span>
      ))}
    </div>
  )
}

function FishFlipAnimation() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-bark to-bark-dark shadow-2xl" />
      <div className="absolute inset-4 rounded-full bg-clay-dark/80" />
      <motion.div
        className="absolute text-6xl"
        animate={{ rotate: [0, -18, 0, 18, 0], y: [0, -14, 0, -14, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        🐟
      </motion.div>
      <motion.div
        className="absolute text-4xl -bottom-2 -right-2"
        animate={{ rotate: [-25, 10, -25] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: 'bottom right' }}
      >
        🍳
      </motion.div>
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
