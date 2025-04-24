'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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
    // Use Supabase auth state change listener
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user
      if (!user) {
        console.error("No user session found")
        router.push('/login')
      } else {
        await ensureWorkspaceExists(user.id)
        setLoading(false)
      }
    })

    // Trigger once on mount just in case
    supabase.auth.getUser().then(async ({ data, error }) => {
      if (error || !data.user) {
        console.error("Initial session missing:", error?.message || "No user found")
        return
      }
      await ensureWorkspaceExists(data.user.id)
      setLoading(false)
    })

    // Cleanup on unmount
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  if (loading) return <p className="text-center p-10">Loading...</p>

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
