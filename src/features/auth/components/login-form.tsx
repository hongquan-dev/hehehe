import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { env } from '@/config/env'
import { FormAlert } from '@/features/auth/components/form-alert'
import { PasswordInput } from '@/features/auth/components/password-input'
import { useLogin } from '@/features/auth/hooks/use-auth'
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { applyApiErrors } from '@/lib/form'
import { DEMO_ACCOUNT } from '@/mocks/data/users'

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Sai tài khoản hoặc mật khẩu',
  ACCOUNT_DISABLED: 'Tài khoản đã bị khoá. Liên hệ tổng đài để được hỗ trợ.',
}

export function LoginForm() {
  const login = useLogin()
  const notice = useAuthStore((s) => s.notice)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' },
  })

  // Chuyển trang sau khi đăng nhập do GuestRoute đảm nhận (về trang định vào trước đó hoặc trang chủ)
  const onSubmit = form.handleSubmit((values) => {
    setFormError(null)
    login.mutate(values, {
      onSuccess: (user) => toast.success(`Chào ${user.username}, hôm nay ăn gì nhỉ?`),
      onError: (error) => {
        setFormError(applyApiErrors(form, error, ERROR_MESSAGES))
        form.resetField('password', { keepError: true })
      },
    })
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <FormAlert message={formError ?? notice} tone={formError ? 'error' : 'info'} />

        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên đăng nhập, email hoặc số điện thoại</FormLabel>
              <FormControl>
                <Input
                  autoComplete="username"
                  autoFocus
                  placeholder="vd: 0901 234 567"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Mật khẩu</FormLabel>
                <button
                  type="button"
                  onClick={() => toast.info('Khôi phục mật khẩu đang được xây dựng')}
                  className="text-[13px] font-medium text-primary hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <FormControl>
                <PasswordInput autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full" disabled={login.isPending}>
          {login.isPending && <LoaderCircle className="animate-spin" aria-hidden />}
          {login.isPending ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </Button>

        {env.useMock && (
          <div className="rounded-xl border border-dashed p-3.5 text-sm">
            <p className="text-muted-foreground">
              Đang dùng dữ liệu giả. Tài khoản thử:{' '}
              <b className="text-foreground">{DEMO_ACCOUNT.identifier}</b> /{' '}
              <b className="text-foreground">{DEMO_ACCOUNT.password}</b>
            </p>
            <button
              type="button"
              className="mt-1.5 text-[13px] font-semibold text-primary hover:underline"
              onClick={() => {
                form.setValue('identifier', DEMO_ACCOUNT.identifier, { shouldValidate: true })
                form.setValue('password', DEMO_ACCOUNT.password, { shouldValidate: true })
              }}
            >
              Điền tài khoản thử
            </button>
          </div>
        )}
      </form>
    </Form>
  )
}
