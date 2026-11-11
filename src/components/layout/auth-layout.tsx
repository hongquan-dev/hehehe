import { Link, Outlet, useMatch } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/common/logo'
import { AuthAside } from '@/features/auth/components/auth-aside'
import { paths } from '@/routes/paths'

const ASIDE = {
  login: {
    title: 'Món quen, quán quen, giao đúng giờ.',
    description: 'Theo dõi đơn từ lúc quán nhận tới lúc tài xế bấm chuông nhà bạn.',
  },
  register: {
    title: 'Đơn đầu tiên giảm một nửa.',
    description: 'Tạo tài khoản trong một phút, nhập mã BANMOI50 ở bước thanh toán.',
  },
}

export function AuthLayout() {
  const isRegister = useMatch(paths.register) !== null
  const aside = isRegister ? ASIDE.register : ASIDE.login

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            to={paths.home}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Trang chủ
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[400px]">
            <Outlet />
          </div>
        </div>
      </div>
      <AuthAside {...aside} />
    </div>
  )
}
