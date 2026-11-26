import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import { FormAlert } from '@/features/auth/components/form-alert'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { restaurantKeys, useCreateRestaurant } from '@/features/merchant/hooks/use-restaurant'
import {
  createRestaurantSchema,
  type CreateRestaurantFormInput,
  type CreateRestaurantFormValues,
} from '@/features/merchant/schemas'
import { ApiError } from '@/lib/api-error'
import { applyApiErrors } from '@/lib/form'

// Câu hiển thị thay cho message tiếng Anh của backend
const ERROR_MESSAGES: Record<string, string> = {
  RESTAURANT_ALREADY_EXISTS: 'Tài khoản này đã có quán. Đang mở thông tin quán của bạn.',
  ACCESS_DENIED: 'Chỉ tài khoản chủ quán mới tạo được quán.',
}

export function CreateRestaurantForm() {
  const create = useCreateRestaurant()
  const queryClient = useQueryClient()
  const userId = useAuthStore((s) => s.user?.id)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<CreateRestaurantFormInput, unknown, CreateRestaurantFormValues>({
    resolver: zodResolver(createRestaurantSchema),
    mode: 'onTouched',
    defaultValues: { name: '', address: '', phoneNumber: '', description: '' },
  })

  const onSubmit = form.handleSubmit(async ({ description, ...body }) => {
    setFormError(null)
    try {
      const restaurant = await create.mutateAsync({ ...body, description: description || null })
      toast.success('Đã tạo quán', { description: `${restaurant.name} đang chờ Ăn Gì duyệt.` })
    } catch (error) {
      setFormError(applyApiErrors(form, error, ERROR_MESSAGES))
      // Quán đã được tạo ở tab khác: tải lại để trang hiện quán đó thay cho form
      if (ApiError.from(error).code === 'RESTAURANT_ALREADY_EXISTS') {
        void queryClient.invalidateQueries({ queryKey: restaurantKeys.mine(userId) })
      }
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <FormAlert message={formError} />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên quán</FormLabel>
              <FormControl>
                <Input autoComplete="organization" placeholder="vd: Phở Bát Đàn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Input
                  autoComplete="street-address"
                  placeholder="Số nhà, đường, phường, quận"
                  {...field}
                />
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
              <FormLabel>Số điện thoại của quán</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0912 345 678"
                  {...field}
                />
              </FormControl>
              <FormDescription>Ăn Gì và tài xế gọi số này khi cần xác nhận đơn.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới thiệu quán</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Món nổi bật, giờ mở cửa, điều làm quán bạn khác biệt"
                  {...field}
                />
              </FormControl>
              <FormDescription>Không bắt buộc, tối đa 1.000 ký tự.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full" disabled={create.isPending}>
          {create.isPending && <LoaderCircle className="animate-spin" aria-hidden />}
          {create.isPending ? 'Đang tạo quán…' : 'Tạo quán'}
        </Button>
      </form>
    </Form>
  )
}
