import { Logo } from '@/components/common/logo'
import { AddressPicker } from '@/components/layout/address-picker'
import { UserMenu } from '@/components/layout/user-menu'
import { CartButton } from '@/features/cart/components/cart-button'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container flex h-16 items-center gap-3 md:gap-6">
        <Logo />
        <div className="hidden min-w-0 md:block">
          <AddressPicker />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <CartButton />
          <UserMenu />
        </div>
      </div>
      <div className="container pb-2 md:hidden">
        <AddressPicker />
      </div>
    </header>
  )
}
