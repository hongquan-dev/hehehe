import { Button } from '@/components/ui/button'
import { useRequestLogStore } from '@/features/session-test/store/request-log.store'
import type { HttpLogEntry } from '@/lib/http'
import { formatClock } from '@/lib/format'
import { cn } from '@/lib/utils'

// Giải thích ngắn cho các bước của cơ chế làm mới phiên; request bình thường không cần ghi chú
function describe(entry: HttpLogEntry): string | null {
  if (entry.status === 0) return 'Không kết nối được máy chủ'
  if (entry.url.endsWith('/auth/refresh')) {
    return entry.status < 400
      ? 'Đã cấp access token và refresh token mới'
      : 'Không làm mới được phiên, cần đăng nhập lại'
  }
  if (entry.retried) {
    return entry.status < 400
      ? 'Gọi lại thành công sau khi làm mới phiên'
      : 'Gọi lại vẫn bị từ chối'
  }
  if (entry.code === 'TOKEN_EXPIRED') return 'Access token hết hạn, tự làm mới phiên'
  if (entry.code === 'UNAUTHENTICATED') return 'Không có access token hợp lệ, tự làm mới phiên'
  return null
}

/** Các request gần nhất, mới nhất ở trên, để thấy chuỗi 401 → làm mới phiên → gọi lại. */
export function RequestLog() {
  const entries = useRequestLogStore((s) => s.entries)
  const clear = useRequestLogStore((s) => s.clear)

  return (
    <section className="pt-12" aria-labelledby="request-log-title">
      <div className="flex items-center justify-between gap-4">
        <h2 id="request-log-title" className="text-2xl font-bold sm:text-[28px]">
          Nhật ký request
        </h2>
        {entries.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clear}>
            Xoá nhật ký
          </Button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="mt-5 rounded-3xl bg-secondary px-6 py-14 text-center">
          <p className="font-display text-lg font-bold">Chưa có request nào</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Bấm Gọi API thử hoặc Làm mới phiên, kết quả sẽ hiện ở đây.
          </p>
        </div>
      ) : (
        <ol className="mt-5 divide-y border-y">
          {entries.map((entry) => (
            <LogRow key={entry.id} entry={entry} />
          ))}
        </ol>
      )}
    </section>
  )
}

function LogRow({ entry }: { entry: HttpLogEntry }) {
  const ok = entry.status >= 200 && entry.status < 400
  const note = describe(entry)

  return (
    // Cột giờ rộng cố định: chữ số của font nội dung không đều nhau, để auto thì cột method bị lệch giữa các dòng
    <li className="grid grid-cols-[4.25rem_minmax(0,1fr)_auto] items-start gap-x-3 py-3">
      <time
        dateTime={new Date(entry.at).toISOString()}
        className="pt-0.5 text-xs tabular-nums text-muted-foreground"
      >
        {formatClock(entry.at)}
      </time>
      <div className="min-w-0">
        <p className="truncate text-sm">
          <span className="font-semibold">{entry.method}</span> {entry.url}
        </p>
        <p className="mt-0.5 text-[13px] text-muted-foreground">
          {[ok ? null : entry.code, `${entry.durationMs} ms`].filter(Boolean).join(', ')}
          {note && <span className="block text-foreground">{note}</span>}
        </p>
      </div>
      <span
        className={cn(
          'rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums',
          ok ? 'bg-basil/10 text-basil' : 'bg-destructive/10 text-destructive',
        )}
      >
        {entry.status === 0 ? 'Lỗi mạng' : entry.status}
      </span>
    </li>
  )
}
