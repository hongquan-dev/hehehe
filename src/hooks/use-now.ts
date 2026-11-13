import { useEffect, useState } from 'react'

/** `Date.now()` cập nhật mỗi `intervalMs`, cho đồng hồ đếm ngược. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}
