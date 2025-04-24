'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Create a workspace for new users if needed
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
        console.error("Failed to create workspace:", insertError.message)
      }
    }
  }

  useEffect(() => {
    let unsubscribe: any

    const checkAuth = async () => {
      // Listen for session changes — reliable after magic link login
      unsubscribe = supabase.auth.onAuthStateChange(async (event, session) => {
        const user = session?.user
        if (!user) {
          console.error("No user session (auth state)")
          router.push('/login')
        } else {
          await ensureWorkspaceExists(user.id)
          setLoading(false)
        }
      })

      // Fallback: try getUser on first load
      const { data, error } = await supabase.auth.getUser()
      if (data?.user) {
        await ensureWorkspaceExists(data.user.id)
        setLoading(false)
      } else {
        console.log("Waiting for auth state to initialize...")
      }
    }

    checkAuth()

    return () => {
      unsubscribe?.data?.subscription?.unsubscribe()
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
