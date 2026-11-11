import { Link } from 'react-router-dom'
import { siteConfig } from '@/config/site'
import { paths } from '@/routes/paths'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  /** `light` dùng trên nền tối */
  tone?: 'dark' | 'light'
}

export function Logo({ className, tone = 'dark' }: LogoProps) {
  return (
    <Link
      to={paths.home}
      aria-label={`${siteConfig.name} — trang chủ`}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
        <rect width="32" height="32" rx="9" fill={tone === 'dark' ? '#2B1B2E' : '#FFFFFF'} />
        <path d="M7 17h18a9 9 0 0 1-18 0Z" fill="#E5372B" />
        <path
          d="M12 13c0-2 2-2 2-4M17 13c0-2 2-2 2-4"
          stroke="#F4B400"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span
        className={cn(
          'font-display text-[22px] font-extrabold leading-none tracking-tight',
          tone === 'dark' ? 'text-aubergine' : 'text-white',
        )}
      >
        {siteConfig.name.toLowerCase()}
      </span>
    </Link>
  )
}
