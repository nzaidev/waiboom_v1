'use client' // Enables React hooks and interactivity (client-side logic only)

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

// Dashboard layout wrapper — this will wrap all /dashboard pages
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // This function ensures a workspace exists for the logged-in user
  const ensureWorkspaceExists = async (userId: string) => {
    // Check if a workspace already exists for this user
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('owner_id', userId)
      .limit(1)

    // If not, create one
    if (!data || data.length === 0) {
      const { error: insertError } = await supabase
        .from('workspaces')
        .insert({ name: 'My Workspace', owner_id: userId })

      if (insertError) {
        console.error("Failed to create workspace:", insertError.message)
      }
    }
  }

  // Run on component mount: check auth + trigger workspace logic
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      // If no session, send to login
      if (!session?.user) {
        router.push('/login')
      } else {
        // Otherwise, make sure this user has a workspace
        await ensureWorkspaceExists(session.user.id)
        setLoading(false) // Done loading, show dashboard
      }
    }

    checkAuth()
  }, [router])

  // Show loading screen while auth and workspace check runs
  if (loading) return <p className="text-center p-10">Loading...</p>

  // Main dashboard layout — sidebar + content
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-100 p-4 hidden md:block">
        {/* Sidebar UI (optional navigation here) */}
      </aside>
      <main className="flex-1 p-6">
        {children} {/* Dashboard content will be injected here */}
      </main>
    </div>
  )
}
