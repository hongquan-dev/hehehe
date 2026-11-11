import { unsplash } from '@/mocks/utils'

/** Ảnh món ăn dùng cho dữ liệu giả, đặt tên theo nội dung ảnh */
export const IMG = {
  pho: 'photo-1582878826629-29b7ad1cdc43',
  ramen: 'photo-1569718212165-3a8278d5f624',
  stirFriedNoodle: 'photo-1626804475297-41608ea09aeb',
  vietSpread: 'photo-1504674900247-0877df9cc836',
  pizza: 'photo-1565299624946-b28f40a0ae38',
  friedRice: 'photo-1512058564366-18510be2db19',
  curryRice: 'photo-1559847844-5315695dadae',
  spicyNoodleSoup: 'photo-1555126634-323283e090fa',
  chowMein: 'photo-1585032226651-759b368d7246',
  healthyBowl: 'photo-1547592180-85f173990554',
  bao: 'photo-1563245372-f21724e3856d',
  burger: 'photo-1568901346375-23c9450c58cd',
  mangoSmoothie: 'photo-1525385133512-2f3bdd039054',
  bubbleTea: 'photo-1558857563-b371033873b8',
  tea: 'photo-1576092768241-dec231879fc3',
  salad: 'photo-1540189549336-e6e99c3679fe',
  dumplings: 'photo-1534422298391-e4f8c172dddb',
  feast: 'photo-1600891964599-f61ba0e24092',
  pizza2: 'photo-1513104890138-7c749659a591',
  creamyNoodle: 'photo-1617093727343-374698b1b08d',
} as const

export const img = (key: keyof typeof IMG, w?: number, h?: number) => unsplash(IMG[key], w, h)
