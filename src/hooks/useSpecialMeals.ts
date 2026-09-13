import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../lib/firebase'
import type { SpecialMeal } from '../data/types'
import { specialMeals as fallbackSpecialMeals } from '../data/menu'

interface UseSpecialMealsResult {
  specialMeals: SpecialMeal[]
  loading: boolean
  configured: boolean
}

export function useSpecialMeals(): UseSpecialMealsResult {
  const [items, setItems] = useState<SpecialMeal[] | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured) return
    const unsub = onSnapshot(
      query(collection(db, 'specialMeals'), orderBy('createdAt', 'asc')),
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as SpecialMeal))
      },
    )
    return unsub
  }, [])

  if (!isFirebaseConfigured) {
    return { specialMeals: fallbackSpecialMeals, loading: false, configured: false }
  }

  return { specialMeals: items ?? [], loading: items === null, configured: true }
}
