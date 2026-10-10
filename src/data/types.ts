export interface SubstitutionOption {
  id: string
  label: string
  priceDelta?: number
}

export interface SubstitutionGroup {
  id: string
  label: string
  options: SubstitutionOption[]
  defaultOptionId: string
}

// A dish included in the flat-rate weekly plan. It has no price of its own —
// the plan is priced as a whole — but can optionally offer substitutions
// (free or priced) and/or an extra portion at its own add-on price.
export interface SwapOption {
  // Exactly one of these is set: itemId for a swap tied to another dish on
  // this week's menu, customLabel for a one-off substitute that isn't on
  // the menu at all.
  itemId?: string
  customLabel?: string
  priceDelta: number
}

export interface PlanItem {
  id: string
  name: string
  bengaliName?: string
  description: string
  emoji: string
  spice?: 1 | 2 | 3
  substitutions?: SubstitutionGroup[]
  extraPrice?: number
  // Which other weekly items this dish can be swapped for, and the price
  // difference for each. When unset, the Weekly Menu page falls back to
  // offering every other item as a swap, priced off their extraPrice.
  swapOptions?: SwapOption[]
}

export interface WeeklyMenu {
  weekLabel: string
  orderWindow: string
  planPrice: number
  items: PlanItem[]
}

export interface SpecialMeal {
  id: string
  name: string
  bengaliName?: string
  description: string
  price: number
  emoji: string
  availability: string
  spice?: 1 | 2 | 3
  substitutions?: SubstitutionGroup[]
}
