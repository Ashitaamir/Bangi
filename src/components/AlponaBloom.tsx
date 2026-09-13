import { motion } from 'framer-motion'

const petalAngles = [0, 45, 90, 135, 180, 225, 270, 315]

export default function AlponaBloom() {
  return (
    <svg viewBox="0 0 240 240" width="220" height="220" className="mx-auto">
      <motion.circle
        cx="120"
        cy="120"
        r="100"
        fill="none"
        stroke="#C9982B"
        strokeWidth="1.5"
        strokeDasharray="3 7"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      />

      {petalAngles.map((angle, i) => (
        <motion.path
          key={angle}
          d="M120 120 C 108 90, 108 60, 120 40 C 132 60, 132 90, 120 120 Z"
          fill="#B5451B"
          fillOpacity={0}
          stroke="#B5451B"
          strokeWidth="2"
          transform={`rotate(${angle} 120 120)`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, fillOpacity: 0.85 }}
          transition={{
            pathLength: { duration: 0.7, delay: 0.15 * i, ease: 'easeInOut' },
            fillOpacity: { duration: 0.4, delay: 0.15 * i + 0.5 },
          }}
        />
      ))}

      <motion.circle
        cx="120"
        cy="120"
        r="22"
        fill="#C9982B"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.3, type: 'spring', stiffness: 200, damping: 12 }}
        style={{ transformOrigin: '120px 120px' }}
      />
      <motion.text
        x="120"
        y="128"
        textAnchor="middle"
        fontSize="24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        🪷
      </motion.text>
    </svg>
  )
}
