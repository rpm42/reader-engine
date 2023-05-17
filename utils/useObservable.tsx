import { useState, useEffect } from 'react'
import { Observable } from 'rxjs'

export function useObservable<T>(
  ob$: Observable<T>,
  initialValue?: T
): [T] {
  const [value, set] = useState<T>(initialValue)
  useEffect(() => {
    const sub = ob$.subscribe(set)
    return () => sub?.unsubscribe()
  })
  return [value]
}

export default useObservable
