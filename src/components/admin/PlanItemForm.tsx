import { useState } from 'react'
import type { PlanItem, SubstitutionGroup } from '../../data/types'

interface Props {
  initial?: PlanItem
  allItems: PlanItem[]
  onSave: (item: Omit<PlanItem, 'id'>) => Promise<void>
  onCancel: () => void
}

export default function PlanItemForm({ initial, allItems, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [bengaliName, setBengaliName] = useState(initial?.bengaliName ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [emoji, setEmoji] = useState(initial?.emoji ?? '🍽️')
  const [spice, setSpice] = useState<number>(initial?.spice ?? 0)
  const [extraPrice, setExtraPrice] = useState<string>(
    initial?.extraPrice != null ? String(initial.extraPrice) : '',
  )
  // Not directly editable anymore -- preserved as-is from existing data on save.
  const substitutions: SubstitutionGroup[] = initial?.substitutions ?? []
  // swapPrices[otherItemId] = price delta as a string, or '' if not offered as a substitute
  const [swapPrices, setSwapPrices] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    for (const s of initial?.swapOptions ?? []) if (s.itemId) map[s.itemId] = String(s.priceDelta)
    return map
  })
  // Substitutes that aren't on this week's menu at all
  const [customSwaps, setCustomSwaps] = useState<{ label: string; price: string }[]>(() =>
    (initial?.swapOptions ?? [])
      .filter((s) => s.customLabel)
      .map((s) => ({ label: s.customLabel!, price: String(s.priceDelta) })),
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const otherItems = allItems.filter((i) => i.id !== initial?.id)

  function toggleSwap(itemId: string, checked: boolean) {
    setSwapPrices((prev) => {
      const next = { ...prev }
      if (checked) next[itemId] = next[itemId] ?? '0'
      else delete next[itemId]
      return next
    })
  }

  function addCustomSwap() {
    setCustomSwaps((prev) => [...prev, { label: '', price: '0' }])
  }

  function updateCustomSwap(index: number, field: 'label' | 'price', value: string) {
    setCustomSwaps((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)))
  }

  function removeCustomSwap(index: number) {
    setCustomSwaps((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !description.trim()) return
    setSaving(true)
    setError('')
    const cleanedSubs = substitutions
      .filter((g) => g.label.trim() && g.options.some((o) => o.label.trim()))
      .map((g) => ({ ...g, options: g.options.filter((o) => o.label.trim()) }))
    const swapOptions = [
      ...Object.entries(swapPrices).map(([itemId, price]) => ({
        itemId,
        priceDelta: price === '' ? 0 : Number(price),
      })),
      ...customSwaps
        .filter((c) => c.label.trim())
        .map((c) => ({ customLabel: c.label.trim(), priceDelta: c.price === '' ? 0 : Number(c.price) })),
    ]
    try {
      await onSave({
        name: name.trim(),
        bengaliName: bengaliName.trim() || undefined,
        description: description.trim(),
        emoji: emoji.trim() || '🍽️',
        spice: (spice === 0 ? undefined : (spice as 1 | 2 | 3)) ,
        extraPrice: extraPrice === '' ? undefined : Number(extraPrice),
        substitutions: cleanedSubs.length > 0 ? cleanedSubs : undefined,
        swapOptions: swapOptions.length > 0 ? swapOptions : undefined,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save. Try again.')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-lg bg-cream p-4 border border-bark/15">
      <div className="grid grid-cols-[80px_1fr] gap-3">
        <input
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          placeholder="🍛"
          className="rounded border border-bark/20 px-2 py-2 text-center text-xl bg-parchment"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dish name (e.g. Kosha Mangsho)"
          required
          className="rounded border border-bark/20 px-3 py-2 bg-parchment"
        />
      </div>
      <input
        value={bengaliName}
        onChange={(e) => setBengaliName(e.target.value)}
        placeholder="Bengali name (optional)"
        className="rounded border border-bark/20 px-3 py-2 bg-parchment"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        rows={2}
        required
        className="rounded border border-bark/20 px-3 py-2 bg-parchment"
      />
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm text-bark/70">
          Spice level
          <select
            value={spice}
            onChange={(e) => setSpice(Number(e.target.value))}
            className="mt-1 w-full rounded border border-bark/20 px-3 py-2 bg-parchment"
          >
            <option value={0}>None</option>
            <option value={1}>Mild 🌶️</option>
            <option value={2}>Medium 🌶️🌶️</option>
            <option value={3}>Hot 🌶️🌶️🌶️</option>
          </select>
        </label>
        <label className="text-sm text-bark/70">
          Extra portion price (optional)
          <input
            type="number"
            step="0.5"
            min="0"
            value={extraPrice}
            onChange={(e) => setExtraPrice(e.target.value)}
            placeholder="e.g. 6"
            className="mt-1 w-full rounded border border-bark/20 px-3 py-2 bg-parchment"
          />
        </label>
      </div>

      <div className="rounded border border-bark/15 bg-parchment/60 p-3">
        <p className="text-sm font-semibold text-bark">Substitutes</p>
        <p className="text-xs text-bark/60 mt-0.5">
          Pick which dishes customers can swap this one for, and the price difference. Leave
          every box unchecked to offer every other dish as a swap automatically, priced off each
          dish's extra portion price.
        </p>
        {otherItems.length === 0 ? (
          <p className="text-xs text-bark/50 mt-2">Add more dishes first to offer swaps.</p>
        ) : (
          <div className="mt-2 grid gap-1.5">
            {otherItems.map((other) => {
              const checked = other.id in swapPrices
              return (
                <div key={other.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`swap-${other.id}`}
                    checked={checked}
                    onChange={(e) => toggleSwap(other.id, e.target.checked)}
                  />
                  <label htmlFor={`swap-${other.id}`} className="text-sm text-bark flex-1">
                    {other.emoji} {other.name}
                  </label>
                  {checked && (
                    <input
                      type="number"
                      step="0.5"
                      value={swapPrices[other.id]}
                      onChange={(e) =>
                        setSwapPrices((prev) => ({ ...prev, [other.id]: e.target.value }))
                      }
                      placeholder="0"
                      className="w-20 rounded border border-bark/20 px-2 py-1 text-sm bg-cream"
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}

        <p className="text-sm font-semibold text-bark mt-4">
          Custom substitutes <span className="font-normal text-bark/50">(not on this week's menu)</span>
        </p>
        <div className="mt-2 grid gap-1.5">
          {customSwaps.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={c.label}
                onChange={(e) => updateCustomSwap(i, 'label', e.target.value)}
                placeholder="e.g. Plain Rice"
                className="flex-1 rounded border border-bark/20 px-2 py-1.5 text-sm bg-cream"
              />
              <input
                type="number"
                step="0.5"
                value={c.price}
                onChange={(e) => updateCustomSwap(i, 'price', e.target.value)}
                placeholder="0"
                className="w-20 rounded border border-bark/20 px-2 py-1.5 text-sm bg-cream"
              />
              <button
                type="button"
                onClick={() => removeCustomSwap(i)}
                className="text-terracotta text-sm font-bold px-1"
                aria-label="Remove custom substitute"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addCustomSwap}
          className="mt-2 text-xs font-bold text-terracotta hover:underline"
        >
          + Add custom substitute
        </button>
      </div>

      {error && <p className="text-terracotta text-sm font-semibold">{error}</p>}

      <div className="flex gap-2 justify-end mt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-full text-sm font-semibold text-bark/70 hover:text-bark"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-full text-sm font-bold bg-terracotta text-cream hover:bg-alpona disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Dish'}
        </button>
      </div>
    </form>
  )
}
