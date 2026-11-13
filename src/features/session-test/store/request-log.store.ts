import { create } from 'zustand'
import { onHttpLog, type HttpLogEntry } from '@/lib/http'

const MAX_ENTRIES = 50

interface RequestLogState {
  /** Mới nhất ở đầu */
  entries: HttpLogEntry[]
  clear: () => void
}

export const useRequestLogStore = create<RequestLogState>()((set) => ({
  entries: [],
  clear: () => set({ entries: [] }),
}))

let started = false

/**
 * Ghi mọi request của `http` vào nhật ký. Gọi một lần lúc khởi động app, trước request đầu tiên, để nhật ký có cả
 * lần kiểm tra phiên khi mở trang (`GET /auth/me`) và lần đăng nhập.
 */
export function startRequestLog() {
  if (started) return
  started = true
  onHttpLog((entry) =>
    useRequestLogStore.setState((s) => ({ entries: [entry, ...s.entries].slice(0, MAX_ENTRIES) })),
  )
}
