import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import type { PlanItem, SpecialMeal } from '../data/types'
import { weeklyMenu as defaultWeeklyMenu, specialMeals as defaultSpecialMeals } from '../data/menu'

export interface PlanSettings {
  weekLabel: string
  orderWindow: string
  planPrice: number
}

export async function savePlanSettings(settings: PlanSettings) {
  await setDoc(doc(db, 'weeklyPlan', 'settings'), settings)
}

export async function addPlanItem(item: Omit<PlanItem, 'id'>) {
  await addDoc(collection(db, 'weeklyPlanItems'), { ...item, createdAt: serverTimestamp() })
}

export async function updatePlanItem(id: string, item: Omit<PlanItem, 'id'>) {
  await updateDoc(doc(db, 'weeklyPlanItems', id), { ...item })
}

export async function deletePlanItem(id: string) {
  await deleteDoc(doc(db, 'weeklyPlanItems', id))
}

export async function addSpecialMeal(item: Omit<SpecialMeal, 'id'>) {
  await addDoc(collection(db, 'specialMeals'), { ...item, createdAt: serverTimestamp() })
}

export async function updateSpecialMeal(id: string, item: Omit<SpecialMeal, 'id'>) {
  await updateDoc(doc(db, 'specialMeals', id), { ...item })
}

export async function deleteSpecialMeal(id: string) {
  await deleteDoc(doc(db, 'specialMeals', id))
}

// One-time helper for first-time setup: copies the built-in sample menu into
// Firestore so the admin page (and the site) isn't empty on day one.
export async function seedDefaultMenu() {
  await savePlanSettings({
    weekLabel: defaultWeeklyMenu.weekLabel,
    orderWindow: defaultWeeklyMenu.orderWindow,
    planPrice: defaultWeeklyMenu.planPrice,
  })
  for (const { id: _id, ...item } of defaultWeeklyMenu.items) {
    await addPlanItem(item)
  }
  for (const { id: _id, ...item } of defaultSpecialMeals) {
    await addSpecialMeal(item)
  }
}

export async function collectionIsEmpty(name: string) {
  const snap = await getDocs(collection(db, name))
  return snap.empty
}
