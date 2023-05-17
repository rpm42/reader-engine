import { useState, useEffect } from 'react'
import { BehaviorSubject } from 'rxjs'

export function useBehaviorSubject<T>(
  bs$: BehaviorSubject<T>
): [T, (value: T) => void] {
  const [value, set] = useState<T>(bs$.value)
  useEffect(() => {
    const sub = bs$.subscribe(set)
    return () => sub?.unsubscribe()
  })
  return [value, bs$.next.bind(bs$)]
}

export default useBehaviorSubject
