import { AnimatePresence, motion } from 'motion/react'
import { CircleAlert, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormAlertProps {
  message: string | null
  tone?: 'error' | 'info'
}

export function FormAlert({ message, tone = 'error' }: FormAlertProps) {
  const Icon = tone === 'error' ? CircleAlert : Info
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.div
          key={message}
          role={tone === 'error' ? 'alert' : 'status'}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div
            className={cn(
              'flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-sm',
              tone === 'error'
                ? 'bg-destructive/10 text-destructive'
                : 'bg-secondary text-foreground',
            )}
          >
            <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
