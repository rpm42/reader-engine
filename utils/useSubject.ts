import { useState, useEffect } from 'react'
import { Subject } from 'rxjs'

export function useSubject<T>(
  sb$: Subject<T>,
  initialValue?: T
): [T, (value: T) => void] {
  const [value, set] = useState<T>(initialValue)
  useEffect(() => {
    const sub = sb$.subscribe(set)
    return () => sub?.unsubscribe()
  })
  return [value, sb$.next.bind(sb$)]
}

export default useSubject
