import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Search } from 'lucide-react'
import { FoodImage } from '@/components/common/food-image'
import { Button } from '@/components/ui/button'
import { useMealTime } from '@/hooks/use-meal-time'
import { formatCurrency } from '@/lib/format'
import { img } from '@/mocks/data/images'
import { selectCurrentAddress, useLocationStore } from '@/stores/location.store'

interface HeroSectionProps {
  keyword: string
  onSearch: (keyword: string) => void
}

const PLATES = [
  {
    src: img('spicyNoodleSoup', 640, 640),
    name: 'Bún bò Huế',
    price: 60000,
    className: 'right-6 top-4 size-[300px]',
    rotate: -14,
    delay: 0.15,
  },
  {
    src: img('bubbleTea', 400, 400),
    name: 'Trà sữa ô long',
    price: 39000,
    className: 'left-2 top-0 size-[170px]',
    rotate: 10,
    delay: 0.3,
  },
  {
    src: img('friedRice', 480, 480),
    name: 'Cơm chiên',
    price: 45000,
    className: 'bottom-2 left-24 size-[210px]',
    rotate: -8,
    delay: 0.45,
  },
]

export function HeroSection({ keyword, onSearch }: HeroSectionProps) {
  const { question, suggestions } = useMealTime()
  const address = useLocationStore(selectCurrentAddress)
  const reduceMotion = useReducedMotion()
  const [value, setValue] = useState(keyword)

  // Đồng bộ ô tìm kiếm khi từ khoá bị xoá/đổi từ nơi khác (nút "Bỏ từ khoá", nút back)
  useEffect(() => setValue(keyword), [keyword])

  return (
    <section className="relative overflow-hidden bg-aubergine text-white">
      <div className="container grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:py-16">
        <div className="max-w-xl">
          <p className="text-[15px] text-white/60">Quán quanh {address.district} đang nhận đơn</p>
          <motion.h1
            className="mt-3 font-display text-[52px] font-extrabold leading-[0.95] tracking-[-0.03em] sm:text-7xl lg:text-[88px]"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {question}
          </motion.h1>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              onSearch(value.trim())
            }}
            className="mt-8 flex items-center gap-2 rounded-full bg-white p-1.5 pl-5 text-foreground shadow-xl shadow-black/20 focus-within:ring-4 focus-within:ring-primary/40"
          >
            <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden />
            <label htmlFor="hero-search" className="sr-only">
              Tìm món hoặc quán
            </label>
            <input
              id="hero-search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Tìm món hoặc quán"
              className="h-11 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit" className="px-6">
              Tìm
            </Button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-white/60">Gợi ý:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setValue(s)
                  onSearch(s)
                }}
                className="rounded-full border border-white/20 px-3.5 py-1.5 text-sm text-white/90 transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="relative hidden h-[440px] lg:block" aria-hidden>
          {PLATES.map((plate) => (
            <motion.figure
              key={plate.name}
              className={`absolute ${plate.className}`}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.6, rotate: plate.rotate - 40 }}
              animate={{ opacity: 1, scale: 1, rotate: plate.rotate }}
              transition={{ delay: plate.delay, type: 'spring', stiffness: 120, damping: 16 }}
            >
              <FoodImage
                src={plate.src}
                alt=""
                className="size-full rounded-full shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ring-[10px] ring-white/95"
              />
              <figcaption
                className="absolute -bottom-2 left-1/2 whitespace-nowrap rounded-full bg-turmeric px-3 py-1 text-xs font-bold text-aubergine shadow-lg"
                style={{ transform: `translateX(-50%) rotate(${-plate.rotate}deg)` }}
              >
                {plate.name} {formatCurrency(plate.price)}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
