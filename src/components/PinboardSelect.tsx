import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { SubstitutionGroup } from '../data/types'

interface Props {
  group: SubstitutionGroup
  selectedOptionId: string
  onChange: (optionId: string) => void
}

export default function PinboardSelect({ group, selectedOptionId, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = group.options.find((o) => o.id === selectedOptionId) ?? group.options[0]

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-cream text-xs sm:text-sm font-semibold px-3 py-2 rounded-md shadow-md hover:brightness-110 transition"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 2px, transparent 2px, transparent 10px), linear-gradient(to bottom, #B97A4E, #6B4226)',
        }}
      >
        <span aria-hidden>📌</span>
        <span className="opacity-80">{group.label}:</span>
        <span>{selected.label.replace(' (default)', '')}</span>
        {selected.priceDelta ? (
          <span className="text-gold">
            {selected.priceDelta > 0 ? `+$${selected.priceDelta}` : `-$${Math.abs(selected.priceDelta)}`}
          </span>
        ) : null}
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-cream/80">
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -8, rotate: -2 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="absolute z-30 mt-2 min-w-[220px] rounded-lg p-2 bg-clay-dark/95 rustic-border"
          >
            <div className="flex flex-col gap-1.5">
              {group.options.map((opt, idx) => (
                <motion.button
                  key={opt.id}
                  type="button"
                  initial={{ rotate: idx % 2 === 0 ? -3 : 3 }}
                  whileHover={{ rotate: 0, scale: 1.03 }}
                  onClick={() => {
                    onChange(opt.id)
                    setOpen(false)
                  }}
                  className={`relative text-left px-3 py-2 rounded bg-parchment text-bark text-xs sm:text-sm shadow-sm border border-bark/10 ${
                    opt.id === selectedOptionId ? 'ring-2 ring-gold' : ''
                  }`}
                >
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-terracotta shadow" />
                  <span className="font-semibold">{opt.label}</span>
                  {opt.priceDelta ? (
                    <span className="ml-1 text-clay-dark">
                      {opt.priceDelta > 0 ? `(+$${opt.priceDelta})` : `(-$${Math.abs(opt.priceDelta)})`}
                    </span>
                  ) : null}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
