import type { SubstitutionGroup } from '../../data/types'

interface Props {
  groups: SubstitutionGroup[]
  onChange: (groups: SubstitutionGroup[]) => void
}

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

export default function SubstitutionGroupsEditor({ groups, onChange }: Props) {
  function addGroup() {
    const optionId = randomId('opt')
    onChange([
      ...groups,
      {
        id: randomId('group'),
        label: '',
        defaultOptionId: optionId,
        options: [{ id: optionId, label: '' }],
      },
    ])
  }

  function updateGroup(index: number, patch: Partial<SubstitutionGroup>) {
    onChange(groups.map((g, i) => (i === index ? { ...g, ...patch } : g)))
  }

  function removeGroup(index: number) {
    onChange(groups.filter((_, i) => i !== index))
  }

  function addOption(groupIndex: number) {
    const group = groups[groupIndex]
    const newOption = { id: randomId('opt'), label: '' }
    updateGroup(groupIndex, { options: [...group.options, newOption] })
  }

  function updateOption(groupIndex: number, optionIndex: number, patch: Partial<{ label: string; priceDelta: number | undefined }>) {
    const group = groups[groupIndex]
    const options = group.options.map((o, i) => (i === optionIndex ? { ...o, ...patch } : o))
    updateGroup(groupIndex, { options })
  }

  function removeOption(groupIndex: number, optionIndex: number) {
    const group = groups[groupIndex]
    const removedId = group.options[optionIndex].id
    const options = group.options.filter((_, i) => i !== optionIndex)
    const defaultOptionId =
      group.defaultOptionId === removedId ? (options[0]?.id ?? '') : group.defaultOptionId
    updateGroup(groupIndex, { options, defaultOptionId })
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide font-bold text-clay-dark">
          Substitution Groups (optional)
        </p>
        <button
          type="button"
          onClick={addGroup}
          className="text-xs font-bold text-terracotta hover:underline"
        >
          + Add group
        </button>
      </div>

      {groups.length === 0 && (
        <p className="text-xs text-bark/50">No substitutions — this dish is fixed as described.</p>
      )}

      {groups.map((group, gi) => (
        <div key={group.id} className="rounded-lg border border-bark/15 bg-cream p-3">
          <div className="flex items-center gap-2">
            <input
              value={group.label}
              onChange={(e) => updateGroup(gi, { label: e.target.value })}
              placeholder="Group name (e.g. Protein)"
              className="flex-1 rounded border border-bark/20 px-2 py-1 text-sm bg-parchment"
            />
            <button
              type="button"
              onClick={() => removeGroup(gi)}
              className="text-bark/40 hover:text-terracotta text-xs shrink-0"
            >
              Remove group
            </button>
          </div>

          <div className="mt-2 grid gap-1.5">
            {group.options.map((opt, oi) => (
              <div key={opt.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`default-${group.id}`}
                  checked={group.defaultOptionId === opt.id}
                  onChange={() => updateGroup(gi, { defaultOptionId: opt.id })}
                  title="Default option"
                />
                <input
                  value={opt.label}
                  onChange={(e) => updateOption(gi, oi, { label: e.target.value })}
                  placeholder="Option (e.g. Mutton)"
                  className="flex-1 rounded border border-bark/20 px-2 py-1 text-sm bg-parchment"
                />
                <input
                  type="number"
                  step="0.5"
                  value={opt.priceDelta ?? ''}
                  onChange={(e) =>
                    updateOption(gi, oi, {
                      priceDelta: e.target.value === '' ? undefined : Number(e.target.value),
                    })
                  }
                  placeholder="±$"
                  className="w-20 rounded border border-bark/20 px-2 py-1 text-sm bg-parchment"
                />
                <button
                  type="button"
                  onClick={() => removeOption(gi, oi)}
                  className="text-bark/40 hover:text-terracotta text-xs shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(gi)}
              className="text-xs font-semibold text-clay-dark hover:text-terracotta text-left"
            >
              + Add option
            </button>
          </div>
          <p className="text-[11px] text-bark/40 mt-1">
            The radio button marks the default option. Leave ±$ blank for no price change.
          </p>
        </div>
      ))}
    </div>
  )
}
