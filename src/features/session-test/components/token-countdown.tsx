import { Skeleton } from '@/components/ui/skeleton'
import type { PingResponse } from '@/features/session-test/types'
import { useNow } from '@/hooks/use-now'
import { formatClock, formatCountdown } from '@/lib/format'

interface TokenCountdownProps {
  ping: PingResponse | undefined
  /** Lúc nhận được `ping` (`dataUpdatedAt` của query), để bù chênh lệch đồng hồ với máy chủ */
  receivedAt: number
  isLoading: boolean
  errorMessage: string | null
}

/** Khối nền cà tím: thời gian còn lại của access token và thông tin phiên, điểm nhấn duy nhất của trang. */
export function TokenCountdown({ ping, receivedAt, isLoading, errorMessage }: TokenCountdownProps) {
  const now = useNow()

  if (isLoading) {
    return (
      <Panel>
        <Skeleton className="h-4 w-36 bg-white/10" />
        <Skeleton className="mt-4 h-20 w-56 bg-white/10" />
        <Skeleton className="mt-6 h-1.5 w-full bg-white/10" />
      </Panel>
    )
  }

  if (!ping) {
    return (
      <Panel>
        <h2 className="font-display text-lg font-bold">Chưa lấy được thời hạn access token</h2>
        <p className="mt-2 max-w-xl text-sm text-white/60">
          {errorMessage ?? 'Bấm Gọi API thử để lấy lại.'}
        </p>
      </Panel>
    )
  }

  // Giờ máy chủ tại thời điểm hiện tại = giờ máy người dùng + độ lệch đo được lúc nhận phản hồi
  const offset = Date.parse(ping.serverTime) - receivedAt
  const expiresAt = Date.parse(ping.expiresAt)
  const issuedAt = ping.issuedAt ? Date.parse(ping.issuedAt) : null
  const remaining = expiresAt - (now + offset)
  const expired = remaining <= 0
  const lifetime = issuedAt === null ? null : expiresAt - issuedAt
  const fraction = lifetime ? Math.min(1, Math.max(0, remaining / lifetime)) : 0

  return (
    <Panel>
      <h2 className="text-sm font-medium text-white/60">
        {expired ? 'Access token đã hết hạn' : 'Access token còn hạn'}
      </h2>
      <p
        role="timer"
        aria-live="off"
        className="mt-2 font-display text-[64px] font-extrabold tabular-nums leading-none tracking-[-0.03em] sm:text-[88px]"
      >
        {formatCountdown(remaining)}
      </p>
      {lifetime !== null && (
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/15" aria-hidden>
          <div
            className="h-full rounded-full bg-turmeric transition-[width] duration-1000 ease-linear"
            style={{ width: `${fraction * 100}%` }}
          />
        </div>
      )}
      <p className="mt-4 max-w-xl text-sm text-white/60">
        {expired
          ? 'Trình duyệt đã xoá access token. Bấm Gọi API thử: request đầu sẽ bị từ chối, trình duyệt tự dùng refresh token lấy token mới rồi gọi lại.'
          : 'Khi về 00:00, trình duyệt xoá access token và lần gọi API tiếp theo sẽ tự làm mới phiên.'}
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
        <Info label="Cấp lúc" value={issuedAt === null ? 'Không rõ' : formatClock(issuedAt)} />
        <Info label="Hết hạn lúc" value={formatClock(expiresAt)} />
        <Info label="Mã người dùng" value={String(ping.userId)} />
        <Info label="Vai trò" value={ping.role} />
      </dl>
    </Panel>
  )
}

function Panel({ children }: { children: React.ReactNode }) {
  return <section className="rounded-3xl bg-aubergine p-6 text-white sm:p-8">{children}</section>
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-white/60">{label}</dt>
      <dd className="mt-0.5 truncate font-semibold tabular-nums">{value}</dd>
    </div>
  )
}
