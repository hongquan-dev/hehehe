import type { Promotion } from '@/features/catalog/types'

export const promotions: Promotion[] = [
  {
    id: 'p1',
    code: 'TRUAVUI',
    title: 'Giảm 25k',
    description: 'Đơn trưa từ 10:00 đến 14:00',
    minOrder: 99000,
    expiresAt: '2026-12-31',
  },
  {
    id: 'p2',
    code: 'FREESHIP',
    title: 'Miễn phí giao',
    description: 'Cho đơn trong bán kính 3 km',
    minOrder: 60000,
    expiresAt: '2026-11-30',
  },
  {
    id: 'p3',
    code: 'BANMOI50',
    title: 'Giảm 50%',
    description: 'Đơn đầu tiên, tối đa 40k',
    minOrder: 0,
    expiresAt: '2026-12-31',
  },
]
