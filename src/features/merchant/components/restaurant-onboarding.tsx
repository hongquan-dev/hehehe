import { CreateRestaurantForm } from '@/features/merchant/components/create-restaurant-form'
import { cn } from '@/lib/utils'

// Các bước thật sự nối tiếp nhau để quán bắt đầu nhận đơn, nên được đánh số
const STEPS = [
  {
    title: 'Điền thông tin quán',
    description: 'Tên, địa chỉ và số điện thoại để khách tìm thấy bạn.',
  },
  { title: 'Ăn Gì duyệt quán', description: 'Quán chỉ hiện với khách sau khi được duyệt.' },
  { title: 'Thêm món và mở bán', description: 'Lên menu, bật nhận đơn và bắt đầu bán.' },
]

/** Chủ quán chưa có quán: giải thích các bước bên trái, form tạo quán bên phải. */
export function RestaurantOnboarding() {
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
      <section className="rounded-3xl bg-aubergine px-6 py-9 text-white sm:px-10 sm:py-12">
        <h1 className="text-4xl font-extrabold leading-[1.02] tracking-[-0.02em] sm:text-[52px]">
          Đưa quán của bạn lên Ăn Gì.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
          Điền vài thông tin cơ bản, Ăn Gì duyệt quán rồi bạn thêm món và bắt đầu nhận đơn.
        </p>

        <ol className="mt-10 space-y-5">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span
                aria-hidden
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-full font-display text-sm font-bold',
                  index === 0 ? 'bg-turmeric text-aubergine' : 'bg-white/10 text-white/70',
                )}
              >
                {index + 1}
              </span>
              <div>
                <p className={cn('font-semibold', index !== 0 && 'text-white/80')}>
                  {step.title}
                  {index === 0 && <span className="sr-only"> (bước hiện tại)</span>}
                </p>
                <p className="mt-0.5 text-sm text-white/60">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="restaurant-form-title" className="w-full max-w-[460px] lg:pt-4">
        <h2 id="restaurant-form-title" className="text-2xl font-bold sm:text-[28px]">
          Thông tin quán
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Khách thấy tên, địa chỉ và giới thiệu này khi quán được duyệt.
        </p>
        <div className="mt-6">
          <CreateRestaurantForm />
        </div>
      </section>
    </div>
  )
}
