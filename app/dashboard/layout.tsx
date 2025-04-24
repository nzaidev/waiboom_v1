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
      try {
        // Get the current user using getUser() instead of getSession()
        const { data: { user }, error } = await supabase.auth.getUser()

        // If there's an error or no user, redirect to login
        if (error || !user) {
          console.error("Authentication error:", error?.message || "No user found")
          router.push('/login')
          return
        }

        // User exists, ensure they have a workspace
        await ensureWorkspaceExists(user.id)
        setLoading(false) // Done loading, show dashboard
      } catch (err) {
        // Handle any unexpected errors
        console.error("Unexpected error during authentication:", err)
        router.push('/login')
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
