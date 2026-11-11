import { z } from 'zod'

// Cùng quy tắc với AuthValidator / IdentifierNormalizer của fd-auth-service
const USERNAME = /^[a-z0-9._]{3,30}$/
const EMAIL = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
const VN_PHONE = /^(?:\+?84|0)[35789]\d{8}$/

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Nhập tên đăng nhập, email hoặc số điện thoại'),
  password: z.string().min(1, 'Nhập mật khẩu'),
})

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .toLowerCase()
      .regex(USERNAME, 'Từ 3–30 ký tự, chỉ gồm chữ thường không dấu, số, dấu chấm hoặc gạch dưới'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(254, 'Email quá dài')
      .regex(EMAIL, 'Email không hợp lệ'),
    phoneNumber: z
      .string()
      .transform((v) => v.replace(/[\s.()-]/g, ''))
      .pipe(z.string().regex(VN_PHONE, 'Số điện thoại di động Việt Nam không hợp lệ')),
    password: z.string().min(8, 'Mật khẩu cần ít nhất 8 ký tự').max(64, 'Mật khẩu tối đa 64 ký tự'),
    confirmPassword: z.string().min(1, 'Nhập lại mật khẩu'),
    acceptTerms: z.boolean().refine((v) => v, 'Bạn cần đồng ý điều khoản để tạo tài khoản'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu nhập lại không khớp',
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormInput = z.input<typeof registerSchema>
export type RegisterFormValues = z.output<typeof registerSchema>
