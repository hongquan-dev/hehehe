const vnd = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

export const formatCurrency = (value: number) => vnd.format(value)

/** 1200 -> "1,2 km", 850 -> "850 m" */
export const formatDistance = (meters: number) =>
  meters < 1000
    ? `${Math.round(meters)} m`
    : `${(meters / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} km`

const clock = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

/** Giờ địa phương có giây: "2026-11-13T03:18:08Z" -> "10:18:08" */
export const formatClock = (value: string | number | Date) => clock.format(new Date(value))

/** Thời gian còn lại: 125_000 -> "02:05", 3_725_000 -> "1:02:05", số âm -> "00:00" */
export const formatCountdown = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const mmss = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return h > 0 ? `${h}:${mmss}` : mmss
}

/** 12400 -> "12,4k", 530 -> "530" (kiểu viết quen thuộc trên app đồ ăn) */
export const formatCompact = (value: number) =>
  value < 1000
    ? String(value)
    : `${(value / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}k`
