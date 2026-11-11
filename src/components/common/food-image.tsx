import { useState } from 'react'
import { UtensilsCrossed } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FoodImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
}

/** Ảnh món/quán: hiện nền tạm khi đang tải và biểu tượng thay thế khi ảnh lỗi */
export function FoodImage({ src, alt, className, ...props }: FoodImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      {status === 'error' ? (
        <div className="grid size-full place-items-center text-muted-foreground/60">
          <UtensilsCrossed className="size-8" aria-hidden />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'size-full object-cover transition-opacity duration-300',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
          )}
          {...props}
        />
      )}
    </div>
  )
}
