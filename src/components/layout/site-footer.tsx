import { Logo } from '@/components/common/logo'
import { siteConfig } from '@/config/site'

const columns = [
  { title: 'Về chúng tôi', links: ['Giới thiệu', 'Tuyển dụng', 'Blog ẩm thực'] },
  { title: 'Hợp tác', links: ['Mở quán trên Ăn Gì', 'Trở thành tài xế', 'Đặt đồ ăn cho công ty'] },
  { title: 'Hỗ trợ', links: ['Trung tâm trợ giúp', 'Điều khoản sử dụng', 'Chính sách bảo mật'] },
]

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-aubergine text-white/70">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Logo tone="light" />
          <p className="max-w-xs text-sm leading-relaxed">{siteConfig.description}</p>
          <p className="text-sm">
            Tổng đài <span className="font-semibold text-white">{siteConfig.hotline}</span>
            <br />
            {siteConfig.supportEmail}
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="space-y-3">
            <h2 className="font-display text-base font-bold text-white">{col.title}</h2>
            <ul className="space-y-2 text-sm">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="transition-colors hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10">
        <p className="container py-5 text-xs text-white/50">
          © {new Date().getFullYear()} {siteConfig.name}. Dự án học tập.
        </p>
      </div>
    </footer>
  )
}
