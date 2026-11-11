import { Outlet, ScrollRestoration } from 'react-router-dom'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { CartSheet } from '@/features/cart/components/cart-sheet'

export function MainLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <CartSheet />
      <ScrollRestoration />
    </div>
  )
}
