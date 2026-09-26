import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../lib/firebase'
import { DEFAULT_BUSINESS_SETTINGS, type BusinessSettings } from '../data/orders'

export function useBusinessSettings(): { settings: BusinessSettings; loading: boolean } {
  const [settings, setSettings] = useState<BusinessSettings | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured) return
    const unsub = onSnapshot(doc(db, 'settings', 'business'), (snap) => {
      setSettings(snap.exists() ? { ...DEFAULT_BUSINESS_SETTINGS, ...snap.data() } : DEFAULT_BUSINESS_SETTINGS)
    })
    return unsub
  }, [])

  if (!isFirebaseConfigured) {
    return { settings: DEFAULT_BUSINESS_SETTINGS, loading: false }
  }

  return { settings: settings ?? DEFAULT_BUSINESS_SETTINGS, loading: settings === null }
}
