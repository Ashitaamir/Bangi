import type { WeeklyMenu, SpecialMeal } from './types'

export const weeklyMenu: WeeklyMenu = {
  weekLabel: 'Week of September 12',
  orderWindow: 'Ordering open Friday — Sunday, midnight',
  planPrice: 55,
  items: [
    {
      id: 'kosha-mangsho',
      name: 'Kosha Mangsho',
      bengaliName: 'কষা মাংস',
      description: 'Slow-roasted in a dark, tangy masala. Sunday-lunch royalty. Choose your protein.',
      emoji: '🍖',
      spice: 3,
      substitutions: [
        {
          id: 'protein',
          label: 'Protein',
          defaultOptionId: 'beef',
          options: [
            { id: 'beef', label: 'Beef (default)' },
            { id: 'mutton', label: 'Mutton' },
          ],
        },
      ],
      extraPrice: 8,
    },
    {
      id: 'macher-jhol',
      name: "Macher Jhol",
      bengaliName: 'মাছের ঝোল',
      description: 'A light, everyday Bengali fish curry with potatoes and turmeric, the way Dida makes it.',
      emoji: '🐟',
      spice: 2,
      substitutions: [
        {
          id: 'fish',
          label: 'Fish',
          defaultOptionId: 'rui',
          options: [
            { id: 'rui', label: 'Rui (default)' },
            { id: 'katla', label: 'Katla' },
            { id: 'tilapia', label: 'Tilapia' },
          ],
        },
        {
          id: 'spice',
          label: 'Spice Level',
          defaultOptionId: 'medium',
          options: [
            { id: 'mild', label: 'Mild' },
            { id: 'medium', label: 'Medium (default)' },
            { id: 'hot', label: 'Jhal — Extra Hot' },
          ],
        },
      ],
      extraPrice: 7,
    },
    {
      id: 'chingri-malai',
      name: 'Chingri Malai Curry',
      bengaliName: 'চিংড়ি মালাইকারি',
      description: 'Prawns simmered in coconut milk with slow-cooked onions and a whisper of garam masala.',
      emoji: '🍤',
      spice: 1,
      substitutions: [
        {
          id: 'protein',
          label: 'Protein',
          defaultOptionId: 'prawn',
          options: [
            { id: 'prawn', label: 'Prawn (default)' },
            { id: 'jumbo-prawn', label: 'Jumbo Prawn', priceDelta: 2 },
          ],
        },
      ],
      extraPrice: 6,
    },
    {
      id: 'dimer-jhol',
      name: "Dim'er Jhol",
      bengaliName: 'ডিমের ঝোল',
      description: 'Simple, comforting egg curry simmered in a light onion-tomato gravy.',
      emoji: '🥚',
      spice: 1,
      extraPrice: 5,
    },
    {
      id: 'dhonepata-vegetable',
      name: 'Dhonepata Mixed Vegetable',
      bengaliName: 'ধনেপাতা দিয়ে সবজি',
      description: 'Seasonal vegetables tossed in a five-spice panch phoron tempering, finished with coriander.',
      emoji: '🥘',
      spice: 1,
      extraPrice: 5,
    },
    {
      id: 'mishti-doi',
      name: 'Mishti Doi',
      bengaliName: 'মিষ্টি দই',
      description: 'Caramelised sweet yogurt, set the traditional way in a clay pot.',
      emoji: '🍮',
      extraPrice: 3,
    },
  ],
}

export const specialMeals: SpecialMeal[] = [
  {
    id: 'ilish-bhapa',
    name: 'Bhapa Ilish',
    bengaliName: 'ভাপা ইলিশ',
    description: 'Hilsa fish steamed in mustard paste and green chili, wrapped banana-leaf style. Limited portions — today only.',
    price: 22,
    emoji: '🐠',
    availability: 'Today Only',
    spice: 2,
    substitutions: [
      {
        id: 'rice',
        label: 'Served With',
        defaultOptionId: 'rice',
        options: [
          { id: 'rice', label: 'Steamed Rice (default)' },
          { id: 'khichuri', label: 'Bhoger Khichuri', priceDelta: 2 },
        ],
      },
    ],
  },
  {
    id: 'fuchka-box',
    name: 'Fuchka Party Box',
    bengaliName: 'ফুচকা',
    description: '12-piece fuchka with tamarind water, aloo masala and a spicy tetul twist. Tomorrow, pre-order only.',
    price: 14,
    emoji: '🥟',
    availability: 'Tomorrow',
    spice: 2,
  },
]
