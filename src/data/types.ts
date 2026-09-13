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

export interface MenuItem {
  id: string
  name: string
  bengaliName?: string
  description: string
  price: number
  emoji: string
  spice?: 1 | 2 | 3
  substitutions?: SubstitutionGroup[]
}

export interface WeeklyMenu {
  weekLabel: string
  orderWindow: string
  items: MenuItem[]
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
