import { Link } from 'react-router-dom'
import { RegisterForm } from '@/features/auth/components/register-form'
import { paths } from '@/routes/paths'

export default function RegisterPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Tạo tài khoản</h1>
        <p className="text-muted-foreground">
          Lưu địa chỉ, theo dõi đơn và nhận ưu đãi riêng cho bạn.
        </p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{' '}
        <Link to={paths.login} className="font-semibold text-primary hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}
