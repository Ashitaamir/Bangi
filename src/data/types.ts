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
export interface PlanItem {
  id: string
  name: string
  bengaliName?: string
  description: string
  emoji: string
  spice?: 1 | 2 | 3
  substitutions?: SubstitutionGroup[]
  extraPrice?: number
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
