import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Bike, Check, ChefHat, House, Store } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { icon: Store, label: 'Quán đã nhận đơn', time: '11:42' },
  { icon: ChefHat, label: 'Món đã nấu xong', time: '11:51' },
  { icon: Bike, label: 'Tài xế đang giao tới bạn', time: 'Còn 8 phút' },
  { icon: House, label: 'Đã giao', time: '' },
]
const FINAL_STEP = 2

/** Minh hoạ trang đăng nhập: một đơn hàng chạy qua các bước rồi dừng ở "đang giao" */
export function OrderTrackingCard({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(reduceMotion ? FINAL_STEP : 0)

  useEffect(() => {
    if (reduceMotion || active >= FINAL_STEP) return
    const timer = setTimeout(() => setActive((s) => s + 1), active === 0 ? 900 : 1100)
    return () => clearTimeout(timer)
  }, [active, reduceMotion])

  return (
    <div
      className={cn(
        'w-[320px] rounded-3xl bg-white p-5 text-aubergine shadow-2xl shadow-black/30',
        className,
      )}
    >
      <div className="mb-4 flex items-baseline justify-between">
        <p className="font-display text-lg font-bold">Đơn #AG2611</p>
        <p className="text-xs text-muted-foreground">Phở bò tái nạm x2</p>
      </div>
      <ol className="relative space-y-4">
        <span aria-hidden className="absolute bottom-3 left-[15px] top-3 w-0.5 bg-muted" />
        <motion.span
          aria-hidden
          className="absolute left-[15px] top-3 w-0.5 origin-top bg-primary"
          initial={false}
          animate={{ height: `${(active / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ maxHeight: 'calc(100% - 1.5rem)' }}
        />
        {STEPS.map((step, i) => {
          const done = i < active
          const current = i === active
          const Icon = done ? Check : step.icon
          return (
            <li key={step.label} className="relative flex items-center gap-3">
              <span
                className={cn(
                  'relative z-10 grid size-8 place-items-center rounded-full transition-colors duration-300',
                  done && 'bg-primary text-white',
                  current && 'bg-primary text-white ring-4 ring-primary/20',
                  !done && !current && 'bg-muted text-muted-foreground',
                )}
              >
                <Icon className="size-4" aria-hidden />
                {current && i === FINAL_STEP && (
                  <span
                    className="absolute inset-0 animate-ping rounded-full bg-primary/40"
                    aria-hidden
                  />
                )}
              </span>
              <span
                className={cn(
                  'flex-1 text-sm',
                  current ? 'font-semibold' : !done && 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
              <span
                className={cn(
                  'text-xs tabular-nums',
                  current ? 'font-semibold text-primary' : 'text-muted-foreground',
                )}
              >
                {i <= active ? step.time : ''}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
