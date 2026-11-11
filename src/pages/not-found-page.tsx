import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { paths } from '@/routes/paths'

export default function NotFoundPage() {
  return (
    <div className="container grid min-h-[60vh] place-items-center py-20 text-center">
      <div className="max-w-md">
        <p className="font-display text-[120px] font-extrabold leading-none text-primary">404</p>
        <h1 className="mt-2 text-2xl font-bold">Không tìm thấy trang này</h1>
        <p className="mt-2 text-muted-foreground">Đường dẫn có thể đã đổi hoặc bị gõ nhầm.</p>
        <Button asChild className="mt-6">
          <Link to={paths.home}>Về trang chủ</Link>
        </Button>
      </div>
    </div>
  )
}
