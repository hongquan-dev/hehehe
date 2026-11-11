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

/** 12400 -> "12,4k", 530 -> "530" (kiểu viết quen thuộc trên app đồ ăn) */
export const formatCompact = (value: number) =>
  value < 1000
    ? String(value)
    : `${(value / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}k`
