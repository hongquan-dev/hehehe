import { LoaderCircle, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/common/logo'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/features/auth/hooks/use-auth'
import { useAuthStore } from '@/features/auth/store/auth.store'

/** Đầu trang của kênh nhà hàng: logo, tên kênh, tài khoản đang đăng nhập và nút đăng xuất. */
export function MerchantHeader() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  const signOut = () => logout.mutate(undefined, { onSuccess: () => toast.success('Đã đăng xuất') })

  return (
    <header className="container flex items-center justify-between gap-4 py-5">
      <div className="flex min-w-0 items-center gap-3">
        <Logo />
        <span className="hidden border-l pl-3 text-sm font-semibold text-muted-foreground sm:inline">
          Kênh nhà hàng
        </span>
      </div>
      <div className="flex min-w-0 items-center gap-3">
        {user && (
          <p className="hidden min-w-0 text-right text-sm sm:block">
            <span className="block truncate font-semibold">{user.username}</span>
            <span className="block truncate text-xs text-muted-foreground">Chủ quán</span>
          </p>
        )}
        <Button variant="outline" onClick={signOut} disabled={logout.isPending}>
          {logout.isPending ? (
            <LoaderCircle className="animate-spin" aria-hidden />
          ) : (
            <LogOut aria-hidden />
          )}
          Đăng xuất
        </Button>
      </div>
    </header>
  )
}
