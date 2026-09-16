import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import { withTimeout } from './withTimeout'
import { stripUndefinedDeep } from './stripUndefined'
import type { Order } from '../data/orders'

// Writes the order to Firestore so the owner sees it in /admin. Throws on
// failure or timeout (unlike the menu reads, a failed order write is not
// something to silently swallow -- the caller needs to know the order
// didn't actually reach the kitchen, rather than hang forever on a bad
// connection).
export async function submitOrderToFirestore(order: Order): Promise<void> {
  if (!isFirebaseConfigured) return
  // order.id is our own human-readable memo code (e.g. "BANGI-913-5A8L"),
  // unrelated to the Firestore document id -- keep it as a field. Pickup
  // orders leave deliveryZone unset, which stripUndefinedDeep needs to
  // strip -- Firestore rejects an explicit `undefined` field outright.
  await withTimeout(
    addDoc(collection(db, 'orders'), { ...stripUndefinedDeep(order), createdAt: serverTimestamp() }),
  )
}

export async function setOrderStatus(firestoreId: string, status: Order['status']) {
  await withTimeout(updateDoc(doc(db, 'orders', firestoreId), { status }))
}
