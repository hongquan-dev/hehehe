import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FormAlert } from '@/features/auth/components/form-alert'
import { PasswordInput } from '@/features/auth/components/password-input'
import { PasswordStrength } from '@/features/auth/components/password-strength'
import { useLogin, useRegister } from '@/features/auth/hooks/use-auth'
import {
  registerSchema,
  type RegisterFormInput,
  type RegisterFormValues,
} from '@/features/auth/schemas'
import { applyApiErrors } from '@/lib/form'

export function RegisterForm() {
  const register = useRegister()
  const login = useLogin()
  const [formError, setFormError] = useState<string | null>(null)
  const isSubmitting = register.isPending || login.isPending

  const form = useForm<RegisterFormInput, unknown, RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  })
  const password = useWatch({ control: form.control, name: 'password' })

  // Backend chỉ tạo tài khoản (201), nên đăng nhập luôn bằng thông tin vừa nhập để người dùng không phải gõ lại
  const onSubmit = form.handleSubmit(async ({ confirmPassword: _c, acceptTerms: _a, ...body }) => {
    setFormError(null)
    try {
      const user = await register.mutateAsync(body)
      await login.mutateAsync({ identifier: user.username, password: body.password })
      toast.success('Đã tạo tài khoản', {
        description: 'Đơn đầu tiên nhập mã BANMOI50 để được giảm 50%.',
      })
    } catch (error) {
      setFormError(applyApiErrors(form, error))
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <FormAlert message={formError} />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên đăng nhập</FormLabel>
              <FormControl>
                <Input
                  autoComplete="username"
                  autoCapitalize="none"
                  placeholder="vd: lan.nguyen"
                  {...field}
                />
              </FormControl>
              <FormDescription>Chữ thường không dấu, số, dấu chấm hoặc gạch dưới.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" placeholder="ban@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="0901 234 567"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  placeholder="Ít nhất 8 ký tự"
                  {...field}
                />
              </FormControl>
              <PasswordStrength password={password} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhập lại mật khẩu</FormLabel>
              <FormControl>
                <PasswordInput autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="space-y-1.5 pt-1">
              <div className="flex items-start gap-2.5">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(v === true)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    className="mt-0.5"
                  />
                </FormControl>
                <FormLabel className="text-[13px] font-normal leading-snug text-muted-foreground">
                  Tôi đồng ý với{' '}
                  <a href="#" className="font-medium text-foreground underline underline-offset-2">
                    Điều khoản sử dụng
                  </a>{' '}
                  và{' '}
                  <a href="#" className="font-medium text-foreground underline underline-offset-2">
                    Chính sách bảo mật
                  </a>
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <LoaderCircle className="animate-spin" aria-hidden />}
          {isSubmitting ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'}
        </Button>
      </form>
    </Form>
  )
}
