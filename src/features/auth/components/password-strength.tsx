import { cn } from '@/lib/utils'

const LEVELS = [
  { label: 'Quá ngắn', color: 'bg-destructive' },
  { label: 'Yếu', color: 'bg-destructive' },
  { label: 'Tạm được', color: 'bg-turmeric' },
  { label: 'Khá mạnh', color: 'bg-basil' },
  { label: 'Mạnh', color: 'bg-basil' },
]

function scoreOf(password: string) {
  if (password.length < 8) return 0
  let score = 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 14) score++
  return score
}

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  const score = scoreOf(password)
  const level = LEVELS[score]
  return (
    <div className="flex items-center gap-3" aria-live="polite">
      <div className="flex flex-1 gap-1">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              i <= score ? level.color : 'bg-muted',
            )}
          />
        ))}
      </div>
      <span className="w-16 text-right text-xs text-muted-foreground">{level.label}</span>
    </div>
  )
}
