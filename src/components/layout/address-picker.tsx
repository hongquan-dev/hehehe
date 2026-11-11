import { Check, ChevronDown, MapPin } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { selectCurrentAddress, useLocationStore } from '@/stores/location.store'

export function AddressPicker() {
  const current = useLocationStore(selectCurrentAddress)
  const { addresses, select } = useLocationStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex min-w-0 items-center gap-2 rounded-full py-1.5 pl-2 pr-3 text-left transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <MapPin className="size-5 shrink-0 text-primary" aria-hidden />
        <span className="min-w-0 leading-tight">
          <span className="block text-[11px] text-muted-foreground">Giao đến</span>
          <span className="block truncate text-sm font-semibold">
            {current.street}, {current.district}
          </span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel className="text-muted-foreground">Địa chỉ đã lưu</DropdownMenuLabel>
        {addresses.map((a) => (
          <DropdownMenuItem key={a.id} onSelect={() => select(a.id)} className="items-start">
            <MapPin className="mt-0.5" />
            <span className="flex-1">
              <span className="block font-medium">{a.label}</span>
              <span className="block text-xs text-muted-foreground">
                {a.street}, {a.district}
              </span>
            </span>
            {a.id === current.id && <Check className="mt-0.5 !text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
