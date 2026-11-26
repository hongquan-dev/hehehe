import { z } from 'zod'

// Cùng quy tắc với RestaurantValidator của fd-restaurant-service: độ dài tính sau khi bỏ khoảng trắng hai đầu,
// số điện thoại là di động Việt Nam (đầu 03, 05, 07, 08, 09)
const VN_MOBILE = /^(?:\+?84|0)[35789]\d{8}$/

export const createRestaurantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nhập tên quán')
    .min(2, 'Tên quán cần 2–100 ký tự')
    .max(100, 'Tên quán cần 2–100 ký tự'),
  address: z
    .string()
    .trim()
    .min(1, 'Nhập địa chỉ quán')
    .min(5, 'Địa chỉ cần 5–255 ký tự')
    .max(255, 'Địa chỉ cần 5–255 ký tự'),
  phoneNumber: z
    .string()
    .transform((v) => v.replace(/[\s.()-]/g, ''))
    .pipe(
      z
        .string()
        .min(1, 'Nhập số điện thoại của quán')
        .regex(VN_MOBILE, 'Nhập số di động Việt Nam, vd 0912 345 678'),
    ),
  // Để trống là không có giới thiệu: form gửi null thay cho chuỗi rỗng
  description: z.string().trim().max(1000, 'Giới thiệu tối đa 1.000 ký tự'),
})

export type CreateRestaurantFormInput = z.input<typeof createRestaurantSchema>
export type CreateRestaurantFormValues = z.output<typeof createRestaurantSchema>
