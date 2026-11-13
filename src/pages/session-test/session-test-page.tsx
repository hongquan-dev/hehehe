import { LoaderCircle, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/common/logo'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/features/auth/hooks/use-auth'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { RequestLog } from '@/features/session-test/components/request-log'
import { TokenCountdown } from '@/features/session-test/components/token-countdown'
import { usePing, useRefreshSession } from '@/features/session-test/hooks/use-session-test'
import { useRequestLogStore } from '@/features/session-test/store/request-log.store'
import { ApiError } from '@/lib/api-error'

/** Trang chủ sau khi đăng nhập: kiểm tra access token, refresh token và đăng xuất với backend thật. */
export default function SessionTestPage() {
  const user = useAuthStore((s) => s.user)
  const ping = usePing()
  const refresh = useRefreshSession()
  const logout = useLogout()

  const callPing = async () => {
    const result = await ping.refetch()
    if (result.isError) toast.error(ApiError.from(result.error).message)
    else toast.success('Gọi API thành công')
  }

  const refreshSession = () =>
    refresh.mutate(undefined, {
      onSuccess: () => toast.success('Đã làm mới phiên'),
      onError: (error) => toast.error(ApiError.from(error).message),
    })

  const signOut = () =>
    logout.mutate(undefined, {
      onSuccess: () => {
        useRequestLogStore.getState().clear()
        toast.success('Đã đăng xuất')
      },
    })

  return (
    <div className="min-h-dvh">
      <header className="container flex items-center justify-between gap-4 py-5">
        <Logo />
        <div className="flex min-w-0 items-center gap-3">
          {user && (
            <p className="hidden min-w-0 text-right text-sm sm:block">
              <span className="block truncate font-semibold">{user.username}</span>
              <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
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

      <main className="container pb-16 pt-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Kiểm tra phiên đăng nhập</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Gọi một API cần đăng nhập để xem access token còn hạn bao lâu. Khi token hết hạn, trình
          duyệt tự dùng refresh token để lấy token mới rồi gọi lại, bạn không phải đăng nhập lại.
        </p>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <TokenCountdown
            ping={ping.data}
            receivedAt={ping.dataUpdatedAt}
            isLoading={ping.isPending}
            errorMessage={ping.isError ? ApiError.from(ping.error).message : null}
          />

          <section aria-label="Thao tác" className="divide-y">
            <Action
              title="Gọi API cần đăng nhập"
              description="GET /auth/test/ping trả về chủ và thời hạn của access token. Token hết hạn thì request bị từ chối với 401, rồi tự làm mới phiên và gọi lại."
            >
              <Button onClick={callPing} disabled={ping.isFetching}>
                {ping.isFetching && <LoaderCircle className="animate-spin" aria-hidden />}
                Gọi API thử
              </Button>
            </Action>
            <Action
              title="Làm mới phiên ngay"
              description="POST /auth/refresh đổi refresh token lấy access token và refresh token mới, không cần chờ hết hạn. Refresh token cũ không dùng lại được."
            >
              <Button variant="outline" onClick={refreshSession} disabled={refresh.isPending}>
                {refresh.isPending && <LoaderCircle className="animate-spin" aria-hidden />}
                Làm mới phiên
              </Button>
            </Action>
          </section>
        </div>

        <RequestLog />
      </main>
    </div>
  )
}

function Action({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="py-6 first:pt-0 last:pb-0">
      <h2 className="font-sans text-base font-semibold tracking-normal">{title}</h2>
      <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  )
}
