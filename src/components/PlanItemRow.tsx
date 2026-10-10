import PinboardSelect from './PinboardSelect'
import SpiceLevel from './SpiceLevel'
import type { PlanItem } from '../data/types'

interface Props {
  item: PlanItem
  weeklyItems: PlanItem[]
  selections: Record<string, string>
  onSelectionChange: (groupId: string, optionId: string) => void
  extraQty: number
  onExtraQtyChange: (qty: number) => void
  swapItemId: string | null
  onSwapChange: (otherItemId: string | null) => void
}

export default function PlanItemRow({
  item,
  weeklyItems,
  selections,
  onSelectionChange,
  extraQty,
  onExtraQtyChange,
  swapItemId,
  onSwapChange,
}: Props) {
  const swapOptions =
    item.swapOptions && item.swapOptions.length > 0
      ? item.swapOptions
          .map((s) => {
            const other = weeklyItems.find((i) => i.id === s.itemId)
            return other ? { ...other, delta: s.priceDelta } : null
          })
          .filter((o): o is PlanItem & { delta: number } => o !== null)
      : weeklyItems
          .filter((i) => i.id !== item.id)
          .map((other) => ({ ...other, delta: (other.extraPrice ?? 0) - (item.extraPrice ?? 0) }))
  return (
    <div className="py-4 border-b border-dashed border-bark/15 last:border-b-0">
      <div className="flex items-start gap-3">
        <div className="text-4xl leading-none">{item.emoji}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-bold text-bark">{item.name}</h3>
          {item.bengaliName && <p className="text-clay-dark text-xs -mt-0.5">{item.bengaliName}</p>}
          <p className="text-bark/80 text-sm mt-1">{item.description}</p>
          <SpiceLevel level={item.spice} />
        </div>
      </div>

      {item.substitutions && item.substitutions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.substitutions.map((g) => (
            <PinboardSelect
              key={g.id}
              group={g}
              selectedOptionId={selections[g.id] ?? g.defaultOptionId}
              onChange={(optionId) => onSelectionChange(g.id, optionId)}
            />
          ))}
        </div>
      )}

      {swapOptions.length > 0 && (
        <div className="mt-3 flex items-center justify-between gap-3 bg-cream rounded-lg px-3 py-2 border border-bark/10">
          <span className="text-sm text-clay-dark shrink-0">
            Want to substitute <strong className="text-bark">{item.name}</strong>?
          </span>
          <select
            value={swapItemId ?? ''}
            onChange={(e) => onSwapChange(e.target.value || null)}
            className="text-xs sm:text-sm font-semibold text-bark bg-parchment rounded-full px-3 py-1.5 border border-bark/15"
          >
            <option value="">No substitution</option>
            {swapOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
                {opt.delta !== 0 ? ` (${opt.delta > 0 ? '+' : '-'}$${Math.abs(opt.delta).toFixed(2)})` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {item.extraPrice != null && (
        <div className="mt-3 flex items-center justify-between bg-cream rounded-lg px-3 py-2 border border-bark/10">
          <span className="text-sm text-clay-dark">
            Want extra <strong className="text-bark">{item.name}</strong>?{' '}
            <span className="text-terracotta font-bold">+${item.extraPrice.toFixed(2)} each</span>
          </span>
          <div className="flex items-center gap-2 bg-parchment rounded-full px-2 py-1 border border-bark/15 shrink-0">
            <button
              type="button"
              onClick={() => onExtraQtyChange(Math.max(0, extraQty - 1))}
              className="w-6 h-6 rounded-full bg-clay-light/60 text-bark font-bold flex items-center justify-center hover:bg-clay-light"
              aria-label={`Remove extra ${item.name}`}
            >
              −
            </button>
            <span className="w-5 text-center font-semibold text-sm">{extraQty}</span>
            <button
              type="button"
              onClick={() => onExtraQtyChange(extraQty + 1)}
              className="w-6 h-6 rounded-full bg-clay-light/60 text-bark font-bold flex items-center justify-center hover:bg-clay-light"
              aria-label={`Add extra ${item.name}`}
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
