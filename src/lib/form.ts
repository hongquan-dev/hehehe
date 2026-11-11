import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { ApiError } from '@/lib/api-error'

/**
 * Đẩy lỗi từ backend vào form: lỗi theo field (`errors[].field`) hiện dưới đúng ô,
 * còn lại trả về câu thông báo chung để hiển thị phía trên form.
 */
export function applyApiErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  error: unknown,
  messages: Record<string, string> = {},
): string | null {
  const apiError = ApiError.from(error)
  const fields = Object.keys(form.getValues())
  let focused = false

  for (const { field, message } of apiError.fieldErrors) {
    if (!fields.includes(field)) continue
    form.setError(field as Path<T>, { type: 'server', message }, { shouldFocus: !focused })
    focused = true
  }
  if (focused && !messages[apiError.code]) return null
  return messages[apiError.code] ?? apiError.message
}
