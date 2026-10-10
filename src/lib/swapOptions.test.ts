import { describe, expect, it } from 'vitest'
import { getSwapChoices } from './swapOptions'
import type { PlanItem } from '../data/types'

function makeItem(overrides: Partial<PlanItem> & { id: string; name: string }): PlanItem {
  return { description: '', emoji: '🍽️', ...overrides }
}

describe('getSwapChoices', () => {
  it('falls back to every other weekly item, priced off extraPrice difference, when no swapOptions are set', () => {
    const khichuri = makeItem({ id: 'khichuri', name: 'Khichuri', extraPrice: 4 })
    const curry = makeItem({ id: 'curry', name: 'Chicken Curry', extraPrice: 8 })
    const dessert = makeItem({ id: 'dessert', name: 'Mishti Doi' }) // no extraPrice

    const choices = getSwapChoices(khichuri, [khichuri, curry, dessert])

    expect(choices).toEqual([
      { id: 'curry', name: 'Chicken Curry', delta: 4 },
      { id: 'dessert', name: 'Mishti Doi', delta: -4 },
    ])
  })

  it('never offers the item as a substitute for itself in the fallback case', () => {
    const a = makeItem({ id: 'a', name: 'A' })
    const choices = getSwapChoices(a, [a])
    expect(choices).toEqual([])
  })

  it('uses admin-curated swapOptions over the automatic fallback when set', () => {
    const a = makeItem({
      id: 'a',
      name: 'A',
      extraPrice: 5,
      swapOptions: [{ itemId: 'b', priceDelta: 2 }],
    })
    const b = makeItem({ id: 'b', name: 'B', extraPrice: 99 }) // would be +94 automatically

    const choices = getSwapChoices(a, [a, b])

    expect(choices).toEqual([{ id: 'b', name: 'B', delta: 2 }])
  })

  it('includes custom substitutes that are not on the weekly menu at all', () => {
    const a = makeItem({
      id: 'a',
      name: 'A',
      swapOptions: [{ customLabel: 'Egg Korma', priceDelta: -3 }],
    })

    const choices = getSwapChoices(a, [a])

    expect(choices).toHaveLength(1)
    expect(choices[0].name).toBe('Egg Korma')
    expect(choices[0].delta).toBe(-3)
    expect(choices[0].id).toContain('Egg Korma')
  })

  it('mixes curated menu-item swaps and custom entries together', () => {
    const a = makeItem({
      id: 'a',
      name: 'A',
      swapOptions: [
        { itemId: 'b', priceDelta: 1 },
        { customLabel: 'Plain Rice', priceDelta: -5 },
      ],
    })
    const b = makeItem({ id: 'b', name: 'B' })

    const choices = getSwapChoices(a, [a, b])

    expect(choices.map((c) => c.name)).toEqual(['B', 'Plain Rice'])
  })

  it('drops a curated swapOption whose referenced item is no longer on the menu', () => {
    const a = makeItem({
      id: 'a',
      name: 'A',
      swapOptions: [{ itemId: 'gone', priceDelta: 2 }],
    })

    expect(getSwapChoices(a, [a])).toEqual([])
  })
})
