import {
  CakeSlice,
  Coffee,
  CookingPot,
  CupSoda,
  Drumstick,
  Flame,
  Pizza,
  Popcorn,
  Salad,
  Soup,
  type LucideProps,
} from 'lucide-react'
import type { CategoryIcon as CategoryIconName } from '@/features/catalog/types'

const ICONS: Record<CategoryIconName, React.ComponentType<LucideProps>> = {
  rice: CookingPot,
  noodle: Soup,
  'milk-tea': CupSoda,
  snack: Popcorn,
  coffee: Coffee,
  pizza: Pizza,
  chicken: Drumstick,
  healthy: Salad,
  hotpot: Flame,
  dessert: CakeSlice,
}

export function CategoryIcon({ name, ...props }: { name: CategoryIconName } & LucideProps) {
  const Icon = ICONS[name]
  return <Icon aria-hidden {...props} />
}
