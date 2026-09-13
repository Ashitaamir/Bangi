import { motion } from 'framer-motion'

interface Props {
  className?: string
}

export default function Logo({ className = 'h-10' }: Props) {
  return (
    <motion.img
      src="/logo.jpg"
      alt="Bangi — Flavors of Bengal, Savored with Love!"
      className={`object-contain select-none w-auto ${className}`}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      draggable={false}
    />
  )
}
