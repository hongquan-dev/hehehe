import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/features/auth/api/auth.api'
import { useAuthStore } from '@/features/auth/store/auth.store'

export const authKeys = {
  me: ['auth', 'me'] as const,
}

/** Gọi `GET /auth/me` một lần khi mở app để biết trạng thái đăng nhập, đồng bộ vào auth store. */
export function useSessionBootstrap() {
  const setUser = useAuthStore((s) => s.setUser)
  const signOut = useAuthStore((s) => s.signOut)
  const query = useQuery({
    queryKey: authKeys.me,
    queryFn: authApi.me,
    retry: false,
    staleTime: Infinity,
  })

  useEffect(() => {
    if (query.isSuccess) setUser(query.data)
    else if (query.isError) signOut()
  }, [query.isSuccess, query.isError, query.data, setUser, signOut])
}

export function useLogin() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me, user)
      setUser(user)
    },
  })
}

export function useRegister() {
  return useMutation({ mutationFn: authApi.register })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const signOut = useAuthStore((s) => s.signOut)
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      signOut()
      queryClient.removeQueries({ queryKey: authKeys.me })
    },
  })
}
