import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { usePromotions } from '@/features/catalog/hooks/use-catalog'
import type { Promotion } from '@/features/catalog/types'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

const TONES = ['bg-primary text-white', 'bg-turmeric text-aubergine', 'bg-basil text-white']

// Khoét hai nửa hình tròn ở mép cuống vé
const notch = {
  WebkitMask:
    'radial-gradient(circle 10px at 100% 0, #0000 98%, #000) top/100% 51% no-repeat, radial-gradient(circle 10px at 100% 100%, #0000 98%, #000) bottom/100% 51% no-repeat',
  mask: 'radial-gradient(circle 10px at 100% 0, #0000 98%, #000) top/100% 51% no-repeat, radial-gradient(circle 10px at 100% 100%, #0000 98%, #000) bottom/100% 51% no-repeat',
} satisfies React.CSSProperties

function Ticket({ promo, tone }: { promo: Promotion; tone: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(promo.code)
      toast.success(`Đã sao chép mã ${promo.code}`)
    } catch {
      toast.info(`Mã của bạn: ${promo.code}`)
    }
  }

  const expires = new Date(promo.expiresAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  })

  return (
    <article className="flex w-[320px] shrink-0 snap-start drop-shadow-sm md:w-auto">
      <div
        style={notch}
        className={cn(
          'flex w-28 shrink-0 flex-col justify-center rounded-l-2xl px-4 py-5 lg:w-32',
          tone,
        )}
      >
        <p className="font-display text-2xl font-extrabold leading-none">{promo.title}</p>
      </div>
      <div
        style={{ borderLeftStyle: 'dashed' }}
        className="flex flex-1 flex-col gap-3 rounded-r-2xl border border-l-2 bg-card px-4 py-4"
      >
        <div>
          <p className="text-sm font-medium leading-snug">{promo.description}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {promo.minOrder
              ? `Đơn từ ${formatCurrency(promo.minOrder)}`
              : 'Không cần đơn tối thiểu'}
            , hạn {expires}
          </p>
        </div>
        <button
          type="button"
          onClick={copy}
          className="mt-auto flex items-center justify-between rounded-lg border border-dashed px-3 py-1.5 text-sm transition-colors hover:border-foreground/40 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="font-display font-bold tracking-wide">{promo.code}</span>
          <span className="flex items-center gap-1 whitespace-nowrap text-xs text-muted-foreground">
            <Copy className="size-3.5" aria-hidden /> Sao chép
          </span>
        </button>
      </div>
    </article>
  )
}

export function PromoTickets() {
  const { data, isPending } = usePromotions()

  return (
    <section aria-labelledby="promo-heading" className="container pt-12">
      <h2 id="promo-heading" className="text-2xl font-bold sm:text-[28px]">
        Mã giảm giá hôm nay
      </h2>
      <div className="scrollbar-none -mx-4 mt-5 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
        {isPending
          ? Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-[120px] w-[320px] shrink-0 rounded-2xl md:w-auto" />
            ))
          : data?.map((promo, i) => (
              <Ticket key={promo.id} promo={promo} tone={TONES[i % TONES.length]} />
            ))}
      </div>
    </section>
  )
}
