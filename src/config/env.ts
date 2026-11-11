/** Biến môi trường đã đọc sẵn và có kiểu, chỉ import từ đây thay vì đọc import.meta.env rải rác. */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
  isDev: import.meta.env.DEV,
} as const
