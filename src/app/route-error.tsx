import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { paths } from '@/routes/paths'

export function RouteError() {
  const error = useRouteError()
  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : (error as Error)?.message

  return (
    <div className="grid min-h-dvh place-items-center px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-2xl font-bold">Trang gặp lỗi khi hiển thị</h1>
        <p className="mt-2 text-muted-foreground">
          Tải lại trang thường sẽ khắc phục được. Nếu vẫn lỗi, quay về trang chủ.
        </p>
        {import.meta.env.DEV && detail && (
          <pre className="mt-4 overflow-x-auto rounded-xl bg-muted p-3 text-left text-xs">
            {detail}
          </pre>
        )}
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={() => window.location.reload()}>Tải lại</Button>
          <Button variant="outline" asChild>
            <Link to={paths.home}>Về trang chủ</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
