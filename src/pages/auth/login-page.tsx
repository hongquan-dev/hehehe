import { Link } from 'react-router-dom'
import { LoginForm } from '@/features/auth/components/login-form'
import { paths } from '@/routes/paths'

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Đăng nhập</h1>
        <p className="text-muted-foreground">Để đặt món và xem lại các đơn đã đặt.</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{' '}
        <Link to={paths.register} className="font-semibold text-primary hover:underline">
          Tạo tài khoản
        </Link>
      </p>
    </div>
  )
}
