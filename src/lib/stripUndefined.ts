// Firestore rejects any field explicitly set to `undefined` (it needs the
// key omitted entirely) -- but plenty of our optional fields (bengaliName,
// spice, extraPrice, deliveryZone, priceDelta, ...) naturally end up
// `undefined` when left blank. Rather than carefully avoid that at every
// call site, this strips `undefined` values recursively (including inside
// nested objects and arrays) right before a write, so any optional field
// anywhere is safe to leave unset.
export function stripUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => stripUndefinedDeep(v)) as unknown as T
  }
  if (value instanceof Date) {
    return value
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) result[key] = stripUndefinedDeep(v)
    }
    return result as T
  }
  return value
}
