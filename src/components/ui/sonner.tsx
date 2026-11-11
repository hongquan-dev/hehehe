import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = (props: ToasterProps) => (
  <Sonner
    position="top-center"
    className="toaster group"
    toastOptions={{
      classNames: {
        toast:
          'group toast font-sans group-[.toaster]:rounded-2xl group-[.toaster]:border-border group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:shadow-lg',
        description: 'group-[.toast]:text-muted-foreground',
        actionButton:
          'group-[.toast]:!bg-primary group-[.toast]:!text-primary-foreground group-[.toast]:!rounded-full',
        cancelButton:
          'group-[.toast]:!bg-muted group-[.toast]:!text-muted-foreground group-[.toast]:!rounded-full',
      },
    }}
    {...props}
  />
)

export { Toaster }
