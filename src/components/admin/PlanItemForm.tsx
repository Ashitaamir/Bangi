import { useState } from 'react'
import SubstitutionGroupsEditor from './SubstitutionGroupsEditor'
import type { PlanItem, SubstitutionGroup } from '../../data/types'

interface Props {
  initial?: PlanItem
  onSave: (item: Omit<PlanItem, 'id'>) => Promise<void>
  onCancel: () => void
}

export default function PlanItemForm({ initial, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [bengaliName, setBengaliName] = useState(initial?.bengaliName ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [emoji, setEmoji] = useState(initial?.emoji ?? '🍽️')
  const [spice, setSpice] = useState<number>(initial?.spice ?? 0)
  const [extraPrice, setExtraPrice] = useState<string>(
    initial?.extraPrice != null ? String(initial.extraPrice) : '',
  )
  const [substitutions, setSubstitutions] = useState<SubstitutionGroup[]>(
    initial?.substitutions ?? [],
  )
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !description.trim()) return
    setSaving(true)
    const cleanedSubs = substitutions
      .filter((g) => g.label.trim() && g.options.some((o) => o.label.trim()))
      .map((g) => ({ ...g, options: g.options.filter((o) => o.label.trim()) }))
    await onSave({
      name: name.trim(),
      bengaliName: bengaliName.trim() || undefined,
      description: description.trim(),
      emoji: emoji.trim() || '🍽️',
      spice: (spice === 0 ? undefined : (spice as 1 | 2 | 3)) ,
      extraPrice: extraPrice === '' ? undefined : Number(extraPrice),
      substitutions: cleanedSubs.length > 0 ? cleanedSubs : undefined,
    })
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

      <SubstitutionGroupsEditor groups={substitutions} onChange={setSubstitutions} />

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
