import { useState } from 'react'
import { motion } from 'framer-motion'
import PinboardSelect from './PinboardSelect'
import SpiceLevel from './SpiceLevel'
import { useCart, type ChosenSub } from '../context/CartContext'
import type { SpecialMeal } from '../data/types'

interface Props {
  item: SpecialMeal
  sourceType: 'special'
  badge?: string
}

export default function MenuItemCard({ item, sourceType, badge }: Props) {
  const { addItem } = useCart()
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    item.substitutions?.forEach((g) => (init[g.id] = g.defaultOptionId))
    return init
  })
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const chosenSubs: ChosenSub[] = (item.substitutions ?? []).map((g) => {
    const opt = g.options.find((o) => o.id === selections[g.id]) ?? g.options[0]
    return {
      itemId: item.id,
      itemName: item.name,
      groupId: g.id,
      groupLabel: g.label,
      optionId: opt.id,
      optionLabel: opt.label.replace(' (default)', ''),
      priceDelta: opt.priceDelta ?? 0,
    }
  })

  const unitPrice = item.price + chosenSubs.reduce((s, c) => s + c.priceDelta, 0)

  function handleAdd() {
    addItem({
      sourceType,
      itemId: item.id,
      name: item.name,
      bengaliName: item.bengaliName,
      emoji: item.emoji,
      basePrice: item.price,
      qty,
      chosenSubs,
    })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1600)
    setQty(1)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl bg-parchment/80 p-5 rustic-border overflow-hidden"
    >
      {badge && (
        <span className="absolute top-3 right-3 bg-terracotta text-cream text-xs font-bold px-2 py-1 rounded-full shadow">
          {badge}
        </span>
      )}
      <div className="flex items-start gap-4">
        <div className="text-5xl leading-none drop-shadow-sm">{item.emoji}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl font-bold text-bark">{item.name}</h3>
          {item.bengaliName && <p className="text-clay-dark text-sm -mt-0.5">{item.bengaliName}</p>}
          <p className="text-bark/80 text-sm mt-1.5">{item.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-bold text-terracotta">${unitPrice.toFixed(2)}</span>
            <SpiceLevel level={item.spice} />
          </div>
        </div>
      </div>

      {item.substitutions && item.substitutions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-dashed border-bark/20">
          <p className="text-xs uppercase tracking-wide text-clay-dark font-bold mb-2">
            Pin your choices
          </p>
          <div className="flex flex-wrap gap-2">
            {item.substitutions.map((g) => (
              <PinboardSelect
                key={g.id}
                group={g}
                selectedOptionId={selections[g.id]}
                onChange={(optionId) => setSelections((s) => ({ ...s, [g.id]: optionId }))}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-cream rounded-full px-2 py-1 border border-bark/15">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-6 h-6 rounded-full bg-clay-light/60 text-bark font-bold flex items-center justify-center hover:bg-clay-light"
          >
            −
          </button>
          <span className="w-5 text-center font-semibold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="w-6 h-6 rounded-full bg-clay-light/60 text-bark font-bold flex items-center justify-center hover:bg-clay-light"
          >
            +
          </button>
        </div>

        <motion.button
          type="button"
          onClick={handleAdd}
          whileTap={{ scale: 0.95 }}
          className="relative flex-1 sm:flex-none bg-terracotta hover:bg-alpona text-cream font-bold px-5 py-2 rounded-full shadow transition-colors"
        >
          {justAdded ? 'Added ✓' : `Add · $${(unitPrice * qty).toFixed(2)}`}
        </motion.button>
      </div>
    </motion.div>
  )
}
