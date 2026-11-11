import { useMemo } from 'react'

export type MealTime = 'sang' | 'trua' | 'chieu' | 'toi' | 'khuya'

const MEALS: Record<MealTime, { question: string; suggestions: string[] }> = {
  sang: { question: 'Sáng nay ăn gì?', suggestions: ['Phở', 'Bánh mì', 'Xôi', 'Cà phê sữa'] },
  trua: { question: 'Trưa nay ăn gì?', suggestions: ['Cơm tấm', 'Bún bò', 'Cơm gà', 'Trà sữa'] },
  chieu: {
    question: 'Chiều nay ăn gì?',
    suggestions: ['Trà sữa', 'Bánh tráng trộn', 'Sinh tố', 'Há cảo'],
  },
  toi: { question: 'Tối nay ăn gì?', suggestions: ['Lẩu', 'Pizza', 'Nướng', 'Ramen'] },
  khuya: { question: 'Khuya rồi, ăn gì?', suggestions: ['Mì xào', 'Cháo', 'Gà rán', 'Burger'] },
}

function mealOf(hour: number): MealTime {
  if (hour >= 5 && hour < 10) return 'sang'
  if (hour >= 10 && hour < 14) return 'trua'
  if (hour >= 14 && hour < 17) return 'chieu'
  if (hour >= 17 && hour < 22) return 'toi'
  return 'khuya'
}

/** Câu hỏi và gợi ý món theo giờ hiện tại */
export function useMealTime(now = new Date()) {
  const hour = now.getHours()
  return useMemo(() => MEALS[mealOf(hour)], [hour])
}
