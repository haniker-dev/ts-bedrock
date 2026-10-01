import type { Millisecond } from "./Millisecond"

export function sleep(duration: Millisecond): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration.unwrap())
  })
}

export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: Millisecond,
): (...args: T) => void {
  let timer: NodeJS.Timeout | null = null
  return (...args: T) => {
    if (timer != null) clearTimeout(timer)

    timer = setTimeout(() => {
      fn.call(null, ...args)
    }, delay.unwrap())
  }
}

export type EveryClearFn = () => void
export function every(fn: () => void, interval: Millisecond): EveryClearFn {
  const timer = setInterval(fn, interval.unwrap())
  return () => {
    clearTimeout(timer)
  }
}
