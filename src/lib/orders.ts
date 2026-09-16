import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import type { Order } from '../data/orders'

const SUBMIT_TIMEOUT_MS = 15000

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('timed out')), ms),
    ),
  ])
}

// Writes the order to Firestore so the owner sees it in /admin. Throws on
// failure or timeout (unlike the menu reads, a failed order write is not
// something to silently swallow -- the caller needs to know the order
// didn't actually reach the kitchen, rather than hang forever on a bad
// connection).
export async function submitOrderToFirestore(order: Order): Promise<void> {
  if (!isFirebaseConfigured) return
  // order.id is our own human-readable memo code (e.g. "BANGI-913-5A8L"),
  // unrelated to the Firestore document id -- keep it as a field.
  await withTimeout(
    addDoc(collection(db, 'orders'), { ...order, createdAt: serverTimestamp() }),
    SUBMIT_TIMEOUT_MS,
  )
}

export async function setOrderStatus(firestoreId: string, status: Order['status']) {
  await updateDoc(doc(db, 'orders', firestoreId), { status })
}
