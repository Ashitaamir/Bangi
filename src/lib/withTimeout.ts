// Wraps a promise so it rejects after `ms` if it hasn't settled yet, instead
// of potentially hanging forever on a stalled network request.
export function withTimeout<T>(promise: Promise<T>, ms = 15000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out. Check your connection and try again.')), ms),
    ),
  ])
}
