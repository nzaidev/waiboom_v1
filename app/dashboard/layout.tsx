'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Create a workspace for the user if it doesn't exist
  const ensureWorkspaceExists = async (userId: string) => {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('owner_id', userId)
      .limit(1)

    if (!data || data.length === 0) {
      const { error: insertError } = await supabase
        .from('workspaces')
        .insert({ name: 'My Workspace', owner_id: userId })

      if (insertError) {
        console.error("❌ Failed to create workspace:", insertError.message)
      } else {
        console.log("✅ Workspace created")
      }
    } else {
      console.log("✅ Workspace already exists")
    }
  }

  // Create a profile in the `profiles` table if missing
  const ensureProfileExists = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!data && (!error || error.code === 'PGRST116')) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId, full_name: 'New Waiboom User' })

      if (insertError) {
        console.error("❌ Failed to create profile:", insertError.message)
      } else {
        console.log("✅ Profile created")
      }
    } else if (data) {
      console.log("✅ Profile already exists")
    }
  }

  useEffect(() => {
    let unsubscribe: any
    let retryCount = 0
    const maxRetries = 8
    const retryDelay = 2000

    const isMagicLinkRedirect = () => {
      return window.location.hash.includes('access_token') ||
             window.location.hash.includes('type=recovery') ||
             window.location.search.includes('access_token')
    }

    const refreshSession = async () => {
      try {
        const { data, error } = await supabase.auth.refreshSession()
        if (error) {
          console.error("❌ Error refreshing session:", error.message)
          return false
        }
        return !!data.session
      } catch (err) {
        console.error("❌ Exception refreshing session:", err)
        return false
      }
    }

    const checkAuth = async () => {
      try {
        console.log(`🔁 Auth check attempt ${retryCount + 1}/${maxRetries}`)

        if (isMagicLinkRedirect()) {
          console.log("🔑 Magic link detected, refreshing session...")
          const refreshed = await refreshSession()
          if (refreshed) {
            console.log("✅ Session refreshed successfully")
          } else {
            console.log("⚠️ Failed to refresh session")
          }
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (session?.user) {
          console.log("✅ Session found:", session.user.email)
          await ensureProfileExists(session.user.id)
          await ensureWorkspaceExists(session.user.id)
          setLoading(false)
          return
        } else {
          console.log("❔ No session found, trying getUser...")
          const { data: { user }, error } = await supabase.auth.getUser()

          if (user) {
            console.log("✅ User found via getUser:", user.email)
            await ensureProfileExists(user.id)
            await ensureWorkspaceExists(user.id)
            setLoading(false)
            return
          } else if (retryCount < maxRetries) {
            console.log(`⏳ Retry ${retryCount + 1}/${maxRetries}...`)
            retryCount++
            setTimeout(checkAuth, retryDelay)
            return
          } else {
            console.log("❌ No user found after retries, redirecting to login")
            router.push('/login')
          }
        }

        // Listen for future auth changes
        unsubscribe = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("🔄 Auth state changed:", event)
          if (event === 'SIGNED_OUT' || !session?.user) {
            router.push('/login')
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            await ensureProfileExists(session.user.id)
            await ensureWorkspaceExists(session.user.id)
            setLoading(false)
          }
        })

      } catch (err) {
        console.error("❌ Authentication error:", err)
        if (retryCount < maxRetries) {
          retryCount++
          setTimeout(checkAuth, retryDelay)
        } else {
          router.push('/login')
        }
      }
    }

    checkAuth()

    return () => {
      if (unsubscribe?.data?.subscription) {
        unsubscribe.data.subscription.unsubscribe()
      }
    }
  }, [router])

  if (loading) return <p className="text-center p-10">Loading your dashboard...</p>

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-100 p-4 hidden md:block">
        {/* Sidebar */}
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
