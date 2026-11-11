import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DeliveryAddress {
  id: string
  label: string
  street: string
  district: string
}

const SAVED_ADDRESSES: DeliveryAddress[] = [
  { id: 'a1', label: 'Nhà', street: '12 Nguyễn Huệ', district: 'Quận 1' },
  { id: 'a2', label: 'Công ty', street: '68 Võ Văn Tần', district: 'Quận 3' },
  { id: 'a3', label: 'Nhà bạn', street: '201 Nguyễn Trãi', district: 'Quận 5' },
]

interface LocationState {
  addresses: DeliveryAddress[]
  selectedId: string
  select: (id: string) => void
}

/** Store toàn cục (dùng ở nhiều feature): địa chỉ đang giao tới. Tạm dùng danh sách giả. */
export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      addresses: SAVED_ADDRESSES,
      selectedId: SAVED_ADDRESSES[0].id,
      select: (selectedId) => set({ selectedId }),
    }),
    { name: 'delivery-address', partialize: (s) => ({ selectedId: s.selectedId }) },
  ),
)

export const selectCurrentAddress = (s: LocationState) =>
  s.addresses.find((a) => a.id === s.selectedId) ?? s.addresses[0]
