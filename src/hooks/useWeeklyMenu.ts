import { useEffect, useState } from 'react'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../lib/firebase'
import type { PlanItem, WeeklyMenu } from '../data/types'
import { weeklyMenu as fallbackWeeklyMenu } from '../data/menu'

interface UseWeeklyMenuResult {
  weeklyMenu: WeeklyMenu
  loading: boolean
  configured: boolean
}

export function useWeeklyMenu(): UseWeeklyMenuResult {
  const [settings, setSettings] = useState<Omit<WeeklyMenu, 'items'> | null>(null)
  const [items, setItems] = useState<PlanItem[] | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured) return

    const unsubSettings = onSnapshot(doc(db, 'weeklyPlan', 'settings'), (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        setSettings({
          weekLabel: data.weekLabel ?? fallbackWeeklyMenu.weekLabel,
          orderWindow: data.orderWindow ?? fallbackWeeklyMenu.orderWindow,
          planPrice: data.planPrice ?? fallbackWeeklyMenu.planPrice,
        })
      } else {
        setSettings({
          weekLabel: fallbackWeeklyMenu.weekLabel,
          orderWindow: fallbackWeeklyMenu.orderWindow,
          planPrice: fallbackWeeklyMenu.planPrice,
        })
      }
    })

    const unsubItems = onSnapshot(
      query(collection(db, 'weeklyPlanItems'), orderBy('createdAt', 'asc')),
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PlanItem))
      },
    )

    return () => {
      unsubSettings()
      unsubItems()
    }
  }, [])

  if (!isFirebaseConfigured) {
    return { weeklyMenu: fallbackWeeklyMenu, loading: false, configured: false }
  }

  const loading = settings === null || items === null

  return {
    weeklyMenu: {
      weekLabel: settings?.weekLabel ?? fallbackWeeklyMenu.weekLabel,
      orderWindow: settings?.orderWindow ?? fallbackWeeklyMenu.orderWindow,
      planPrice: settings?.planPrice ?? fallbackWeeklyMenu.planPrice,
      items: items ?? [],
    },
    loading,
    configured: true,
  }
}
