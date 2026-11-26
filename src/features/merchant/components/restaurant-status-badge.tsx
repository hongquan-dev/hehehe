import { Badge, type BadgeProps } from '@/components/ui/badge'
import type { RestaurantStatus } from '@/features/merchant/types'

const STATUS: Record<RestaurantStatus, { label: string; variant: BadgeProps['variant'] }> = {
  PENDING: { label: 'Đang chờ duyệt', variant: 'promo' },
  ACTIVE: { label: 'Đang mở bán', variant: 'freeship' },
  SUSPENDED: { label: 'Tạm ẩn', variant: 'secondary' },
}

export function RestaurantStatusBadge({
  status,
  className,
}: {
  status: RestaurantStatus
  className?: string
}) {
  const { label, variant } = STATUS[status]
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  )
}
