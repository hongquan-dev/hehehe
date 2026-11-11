import { Link } from 'react-router-dom'
import { LogOut, MapPin, Receipt, Ticket, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useLogout } from '@/features/auth/hooks/use-auth'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { paths } from '@/routes/paths'

const soon = (feature: string) => () => toast.info(`${feature} đang được xây dựng`)

export function UserMenu() {
  const { status, user } = useAuthStore()
  const logout = useLogout()

  if (status === 'checking') return <Skeleton className="size-10 rounded-full" />

  if (!user) {
    return (
      <div className="flex items-center gap-1">
        <Button variant="ghost" asChild className="hidden sm:inline-flex">
          <Link to={paths.register}>Đăng ký</Link>
        </Button>
        <Button asChild>
          <Link to={paths.login}>Đăng nhập</Link>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Avatar className="size-10">
          <AvatarFallback className="bg-aubergine text-white">
            {user.username.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="sr-only">Tài khoản của {user.username}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <span className="block font-semibold">{user.username}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={soon('Đơn hàng')}>
          <Receipt /> Đơn hàng của tôi
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={soon('Ví voucher')}>
          <Ticket /> Ví voucher
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={soon('Sổ địa chỉ')}>
          <MapPin /> Sổ địa chỉ
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={soon('Trang cá nhân')}>
          <UserRound /> Thông tin tài khoản
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() =>
            logout.mutate(undefined, { onSuccess: () => toast.success('Đã đăng xuất') })
          }
          className="text-destructive focus:text-destructive [&_svg]:!text-destructive"
        >
          <LogOut /> Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
