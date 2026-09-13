import { motion } from 'framer-motion'

const sizzles = [
  { top: '10%', left: '20%', delay: 0 },
  { top: '15%', left: '75%', delay: 0.3 },
  { top: '75%', left: '15%', delay: 0.6 },
  { top: '80%', left: '70%', delay: 0.9 },
  { top: '45%', left: '5%', delay: 0.45 },
  { top: '40%', left: '90%', delay: 0.75 },
]

export default function SizzlingPan({ size = 176 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* pan handle */}
      <div
        className="absolute bg-gradient-to-r from-bark-dark to-bark rounded-full"
        style={{ width: size * 0.5, height: size * 0.13, right: '-38%', top: '46%' }}
      />

      {/* pan body */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-bark-dark to-black/80 shadow-2xl" />
      <div className="absolute inset-[10%] rounded-full bg-gradient-to-br from-clay-dark to-bark-dark shadow-inner" />
      <div className="absolute inset-[16%] rounded-full bg-black/30" />

      {/* sizzle marks around the fish */}
      {sizzles.map((s, i) => (
        <motion.span
          key={i}
          className="absolute text-terracotta text-base select-none"
          style={{ top: s.top, left: s.left }}
          animate={{ opacity: [0, 1, 0], scale: [0.6, 1.1, 0.6] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        >
          ✦
        </motion.span>
      ))}

      {/* oil pop droplets */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={`drop-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-gold"
          style={{ bottom: '20%', left: `${32 + i * 16}%` }}
          animate={{ y: [0, -18, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.35, ease: 'easeOut' }}
        />
      ))}

      {/* the fish, flipping in the pan */}
      <motion.div
        className="relative text-6xl drop-shadow-lg"
        animate={{
          rotate: [0, 0, 360, 360],
          y: [0, -26, -26, 0],
          scaleX: [1, 1, -1, -1],
        }}
        transition={{
          duration: 2.2,
          times: [0, 0.35, 0.55, 1],
          repeat: Infinity,
          repeatDelay: 0.5,
          ease: 'easeInOut',
        }}
      >
        🐟
      </motion.div>

      {/* rising steam */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={`steam-${i}`}
          className="absolute text-cream/70 text-lg"
          style={{ top: '2%', left: `${40 + i * 10}%` }}
          animate={{ y: [-2, -30, -2], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
        >
          ~
        </motion.span>
      ))}
    </div>
  )
}
