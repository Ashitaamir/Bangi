import { motion } from 'framer-motion'

export default function Logo({ size = 72 }: { size?: number }) {
  return (
    <motion.div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
      initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 12 }}
    >
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <circle cx="60" cy="60" r="56" fill="#6B4226" />
        <circle cx="60" cy="60" r="48" fill="#E3B685" />
        <circle cx="60" cy="60" r="48" fill="none" stroke="#C9982B" strokeWidth="2" strokeDasharray="4 6" />
        <text
          x="60"
          y="75"
          textAnchor="middle"
          fontFamily="'Tiro Bangla', serif"
          fontSize="52"
          fontWeight={700}
          fill="#4A2E1E"
        >
          B
        </text>
      </svg>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white/70"
          style={{ width: 5 + i, height: 5 + i, top: -2, left: `${44 + i * 8}%` }}
          animate={{ y: [-2, -18, -2], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  )
}
