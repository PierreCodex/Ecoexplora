'use client'
import { supabase } from '@/lib/supabase/client'
import type { Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export const useAuth = () => {
  const router = useRouter()

  const [session, setSession] = useState<Session | null>(null)
  const [sessionReady, setSessionReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setSessionReady(true)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true)
        setError(null)
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
        setSession(data.session)
        router.replace('/dashboard')
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al iniciar sesión'
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [router],
  )

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setSession(null)
    router.replace('/auth/sign-in')
  }, [router])

  const isAuthenticated = !!session
  const user: User | null = session?.user ?? null

  return {
    login,
    logout,
    isAuthenticated,
    sessionReady,
    session,
    user,
    loading,
    error,
  }
}