import { AnimatePresence, motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { MerchantHeader } from '@/features/merchant/components/merchant-header'
import { RestaurantOnboarding } from '@/features/merchant/components/restaurant-onboarding'
import { RestaurantOverview } from '@/features/merchant/components/restaurant-overview'
import { useMyRestaurant } from '@/features/merchant/hooks/use-restaurant'

/** Trang chủ của chủ quán (`/merchant`): chưa có quán thì tạo quán, có rồi thì xem tổng quan quán. */
export default function MerchantHomePage() {
  const restaurant = useMyRestaurant()

  return (
    <div className="min-h-dvh">
      <MerchantHeader />
      <main className="container pb-16 pt-4">
        {restaurant.isPending ? (
          <MerchantSkeleton />
        ) : restaurant.isError ? (
          <div className="rounded-3xl border border-dashed px-6 py-14 text-center">
            <h1 className="font-display text-lg font-bold">Chưa tải được thông tin quán</h1>
            <p className="mt-1 text-sm text-muted-foreground">Kiểm tra kết nối mạng rồi thử lại.</p>
            <Button
              variant="outline"
              className="mt-5"
              onClick={() => void restaurant.refetch()}
              disabled={restaurant.isFetching}
            >
              Thử lại
            </Button>
          </div>
        ) : (
          // Tạo quán xong thì form nhường chỗ cho phần tổng quan, có chuyển cảnh để thấy điều vừa thay đổi
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={restaurant.data ? 'overview' : 'onboarding'}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {restaurant.data ? (
                <RestaurantOverview restaurant={restaurant.data} />
              ) : (
                <RestaurantOnboarding />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  )
}

// Cùng hình dạng với phần tổng quan: banner lớn rồi hai cột
function MerchantSkeleton() {
  return (
    <div role="status" aria-label="Đang tải thông tin quán">
      <Skeleton className="h-64 rounded-3xl" />
      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </div>
    </div>
  )
}
