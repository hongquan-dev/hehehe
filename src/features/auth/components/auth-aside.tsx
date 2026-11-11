import { motion } from 'motion/react'
import { FoodImage } from '@/components/common/food-image'
import { OrderTrackingCard } from '@/features/auth/components/order-tracking-card'
import { img } from '@/mocks/data/images'

interface AuthAsideProps {
  title: string
  description: string
}

export function AuthAside({ title, description }: AuthAsideProps) {
  return (
    <aside className="relative hidden overflow-hidden bg-aubergine text-white lg:flex lg:flex-col">
      <div className="relative z-10 max-w-xl px-14 pt-16">
        <h2 className="font-display text-[44px] font-extrabold leading-[1.05] tracking-tight">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/70">{description}</p>
      </div>

      <motion.div
        aria-hidden
        className="absolute -bottom-24 -right-28 size-[560px] rounded-full bg-white/5 p-6"
        initial={{ rotate: -25, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <FoodImage
          src={img('pho', 900, 900)}
          alt=""
          className="size-full rounded-full shadow-2xl shadow-black/40"
        />
      </motion.div>

      <motion.div
        className="relative z-10 mt-auto px-14 pb-16"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <OrderTrackingCard />
      </motion.div>
    </aside>
  )
}
