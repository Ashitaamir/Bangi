import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PlanItemRow from '../components/PlanItemRow'
import CartBar from '../components/CartBar'
import AlponaDivider from '../components/AlponaDivider'
import { weeklyMenu } from '../data/menu'
import { useCart, type ChosenSub, type ExtraLine } from '../context/CartContext'

export default function WeeklyMenu() {
  const { addItem } = useCart()

  // selections[itemId][groupId] = optionId
  const [selections, setSelections] = useState<Record<string, Record<string, string>>>({})
  // extraQty[itemId] = number of extra portions
  const [extraQty, setExtraQty] = useState<Record<string, number>>({})
  const [justAdded, setJustAdded] = useState(false)

  function setSelection(itemId: string, groupId: string, optionId: string) {
    setSelections((prev) => ({ ...prev, [itemId]: { ...prev[itemId], [groupId]: optionId } }))
  }

  function setExtra(itemId: string, qty: number) {
    setExtraQty((prev) => ({ ...prev, [itemId]: qty }))
  }

  const chosenSubs: ChosenSub[] = weeklyMenu.items.flatMap((item) =>
    (item.substitutions ?? []).map((g) => {
      const optionId = selections[item.id]?.[g.id] ?? g.defaultOptionId
      const opt = g.options.find((o) => o.id === optionId) ?? g.options[0]
      return {
        itemId: item.id,
        itemName: item.name,
        groupId: g.id,
        groupLabel: g.label,
        optionId: opt.id,
        optionLabel: opt.label.replace(' (default)', ''),
        priceDelta: opt.priceDelta ?? 0,
      }
    }),
  )

  const extras: ExtraLine[] = weeklyMenu.items
    .filter((item) => item.extraPrice != null && (extraQty[item.id] ?? 0) > 0)
    .map((item) => ({
      itemId: item.id,
      itemName: item.name,
      emoji: item.emoji,
      qty: extraQty[item.id],
      unitPrice: item.extraPrice!,
    }))

  const subsDelta = chosenSubs.reduce((s, c) => s + c.priceDelta, 0)
  const extrasTotal = extras.reduce((s, e) => s + e.qty * e.unitPrice, 0)
  const grandTotal = weeklyMenu.planPrice + subsDelta + extrasTotal

  function handleAddPlan() {
    addItem({
      sourceType: 'weekly',
      itemId: 'weekly-plan',
      name: 'Weekly Meal Plan',
      emoji: '🍱',
      basePrice: weeklyMenu.planPrice,
      qty: 1,
      chosenSubs,
      extras,
    })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1800)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-8 pb-32">
      <Link to="/" className="text-clay-dark text-sm font-semibold hover:text-terracotta">
        ← Back home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-4"
      >
        <h1 className="font-display text-4xl font-extrabold text-bark">This Week's Menu</h1>
        <p className="text-clay-dark font-semibold mt-1">{weeklyMenu.weekLabel}</p>
        <p className="text-terracotta text-sm font-bold mt-1">{weeklyMenu.orderWindow}</p>
        <AlponaDivider />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 rounded-2xl bg-parchment/80 p-5 rustic-border"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-bark">The Weekly Plan</h2>
          <span className="bg-terracotta text-cream font-bold px-3 py-1 rounded-full text-sm">
            ${weeklyMenu.planPrice.toFixed(2)}
          </span>
        </div>
        <p className="text-bark/70 text-sm mt-1">
          One flat price for everything below. Swap a dish where a substitution is offered, or
          add extra portions of any dish for a bit more.
        </p>

        <div className="mt-2">
          {weeklyMenu.items.map((item) => (
            <PlanItemRow
              key={item.id}
              item={item}
              selections={selections[item.id] ?? {}}
              onSelectionChange={(groupId, optionId) => setSelection(item.id, groupId, optionId)}
              extraQty={extraQty[item.id] ?? 0}
              onExtraQtyChange={(qty) => setExtra(item.id, qty)}
            />
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-bark/20 flex items-center justify-between gap-3">
          <div className="text-sm text-bark/80">
            <div>
              Plan <span className="font-semibold">${weeklyMenu.planPrice.toFixed(2)}</span>
            </div>
            {subsDelta !== 0 && (
              <div>
                Substitutions{' '}
                <span className="font-semibold">
                  {subsDelta > 0 ? '+' : ''}${subsDelta.toFixed(2)}
                </span>
              </div>
            )}
            {extrasTotal > 0 && (
              <div>
                Extras <span className="font-semibold">+${extrasTotal.toFixed(2)}</span>
              </div>
            )}
          </div>
          <motion.button
            type="button"
            onClick={handleAddPlan}
            whileTap={{ scale: 0.96 }}
            className="bg-terracotta hover:bg-alpona text-cream font-bold px-6 py-3 rounded-full shadow-lg transition-colors"
          >
            {justAdded ? 'Added ✓' : `Add Plan · $${grandTotal.toFixed(2)}`}
          </motion.button>
        </div>
      </motion.div>

      <CartBar />
    </div>
  )
}
