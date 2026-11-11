import { LoaderCircle } from 'lucide-react'

export function PageLoader({ label = 'Đang tải…' }: { label?: string }) {
  return (
    <div role="status" className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <LoaderCircle className="size-7 animate-spin text-primary" aria-hidden />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  )
}
