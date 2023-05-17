import { useCallback, useEffect, RefObject } from 'react'

export interface ScrollEvent {
  /** The amount moved in the X direction since the last event. */
  deltaX: number
  /** The amount moved in the Y direction since the last event. */
  deltaY: number
}

export interface ScrollWheelProps {
  onScroll?: (e: ScrollEvent) => void
  isDisabled?: boolean
}

export function useScrollWheel(props: ScrollWheelProps, ref: RefObject<HTMLElement>): void {
  let { onScroll, isDisabled } = props
  let onScrollHandler = useCallback(
    e => {
      // If the ctrlKey is pressed, this is a zoom event, do nothing.
      if (e.ctrlKey) {
        return
      }

      // stop scrolling the page
      e.preventDefault()
      e.stopPropagation()

      if (onScroll) {
        onScroll({ deltaX: e.deltaX, deltaY: e.deltaY })
      }
    },
    [onScroll]
  )

  useEffect(() => {
    let elem = ref.current
    if (isDisabled) {
      return
    }
    elem.addEventListener('wheel', onScrollHandler)

    return () => {
      elem.removeEventListener('wheel', onScrollHandler)
    }
  }, [onScrollHandler, ref, isDisabled])
}

export default useScrollWheel
