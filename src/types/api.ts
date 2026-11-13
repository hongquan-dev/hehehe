/** Khớp `com.fooddelivery.dto.response.ApiResponse` của backend (common-dto-lib). */
export interface ApiResponse<T> {
  success: boolean
  status: number
  code: string
  message: string
  data: T
  errors?: FieldErrorDetail[]
  meta?: PageMeta
  timestamp: string
  path?: string
}

export interface FieldErrorDetail {
  field: string
  message: string
}

export interface PageMeta {
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface Paged<T> {
  items: T[]
  meta: PageMeta
}
