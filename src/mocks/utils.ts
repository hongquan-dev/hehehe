import { sleep } from '@/lib/utils'
import type { ApiResponse } from '@/types/api'

/** Giả lập độ trễ mạng để thấy được trạng thái loading */
export const mockLatency = (min = 300, max = 800) => sleep(min + Math.random() * (max - min))

export const ok = <T>(data: T, status = 200): ApiResponse<T> => ({
  success: true,
  status,
  code: 'SUCCESS',
  message: 'Success',
  data,
  timestamp: new Date().toISOString(),
})

/** Ảnh Unsplash đã cắt sẵn theo kích thước */
export const unsplash = (id: string, w = 640, h = 440) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=70`
