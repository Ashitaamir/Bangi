import type { PlanItem } from '../data/types'

export interface SwapChoice {
  id: string
  name: string
  delta: number
}

// The dropdown options a dish's "want to substitute?" picker should offer:
// admin-curated swapOptions (dishes on the menu and/or custom entries) when
// set, otherwise every other dish on the week's menu, priced off each
// dish's extra-portion price.
export function getSwapChoices(item: PlanItem, weeklyItems: PlanItem[]): SwapChoice[] {
  if (item.swapOptions && item.swapOptions.length > 0) {
    return item.swapOptions
      .map((s, i): SwapChoice | null => {
        if (s.itemId) {
          const other = weeklyItems.find((it) => it.id === s.itemId)
          return other ? { id: other.id, name: other.name, delta: s.priceDelta } : null
        }
        if (s.customLabel) {
          return { id: `custom:${i}:${s.customLabel}`, name: s.customLabel, delta: s.priceDelta }
        }
        return null
      })
      .filter((o): o is SwapChoice => o !== null)
  }
  return weeklyItems
    .filter((i) => i.id !== item.id)
    .map((other) => ({
      id: other.id,
      name: other.name,
      delta: (other.extraPrice ?? 0) - (item.extraPrice ?? 0),
    }))
}
