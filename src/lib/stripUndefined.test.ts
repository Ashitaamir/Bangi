import { describe, expect, it } from 'vitest'
import { stripUndefinedDeep } from './stripUndefined'

describe('stripUndefinedDeep', () => {
  it('removes top-level undefined fields', () => {
    const input = { name: 'Kosha Mangsho', bengaliName: undefined, spice: 3 }
    expect(stripUndefinedDeep(input)).toEqual({ name: 'Kosha Mangsho', spice: 3 })
  })

  it('removes undefined fields nested inside objects and arrays', () => {
    const input = {
      items: [
        { id: 'a', substitutions: [{ id: 'protein', options: [{ id: 'beef', priceDelta: undefined }] }] },
      ],
      deliveryZone: undefined,
    }
    expect(stripUndefinedDeep(input)).toEqual({
      items: [{ id: 'a', substitutions: [{ id: 'protein', options: [{ id: 'beef' }] }] }],
    })
  })

  it('preserves empty strings, zero, false, and null', () => {
    const input = { notes: '', qty: 0, confirmed: false, screenshot: null }
    expect(stripUndefinedDeep(input)).toEqual({ notes: '', qty: 0, confirmed: false, screenshot: null })
  })

  it('leaves primitives and Date instances untouched', () => {
    expect(stripUndefinedDeep('hello')).toBe('hello')
    expect(stripUndefinedDeep(42)).toBe(42)
    const date = new Date('2026-01-01')
    expect(stripUndefinedDeep(date)).toBe(date)
  })

  it('handles arrays of primitives', () => {
    expect(stripUndefinedDeep([1, undefined, 2] as (number | undefined)[])).toEqual([1, undefined, 2])
  })
})
