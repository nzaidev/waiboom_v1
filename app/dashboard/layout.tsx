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
    let retryCount = 0
    const maxRetries = 8 // Increased to 8 retries
    const retryDelay = 2000 // Increased to 2 seconds

    // Function to check if we're on a magic link redirect
    const isMagicLinkRedirect = () => {
      return window.location.hash.includes('access_token') || 
             window.location.hash.includes('type=recovery') ||
             window.location.search.includes('access_token');
    }

    // Function to refresh the session
    const refreshSession = async () => {
      try {
        // Try to refresh the session
        const { data, error } = await supabase.auth.refreshSession()
        if (error) {
          console.error("Error refreshing session:", error.message)
          return false
        }
        return !!data.session
      } catch (err) {
        console.error("Exception refreshing session:", err)
        return false
      }
    }

    const checkAuth = async () => {
      try {
        console.log(`Auth check attempt ${retryCount + 1}/${maxRetries}`)
        
        // If this is a magic link redirect, try to refresh the session first
        if (isMagicLinkRedirect()) {
          console.log("Detected magic link redirect, attempting to refresh session...")
          const refreshed = await refreshSession()
          if (refreshed) {
            console.log("Session refreshed successfully")
          } else {
            console.log("Failed to refresh session, will continue with normal auth check")
          }
        }

        // First, try to get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (session?.user) {
          console.log("User found in session:", session.user.email)
          // User exists in session, ensure they have a workspace
          await ensureWorkspaceExists(session.user.id)
          setLoading(false)
          return // Exit early if we found a user
        } else {
          console.log("No session found, trying getUser...")
          // No session, try getUser as fallback
          const { data: { user }, error } = await supabase.auth.getUser()
          
          if (user) {
            console.log("User found via getUser:", user.email)
            // User exists, ensure they have a workspace
            await ensureWorkspaceExists(user.id)
            setLoading(false)
            return // Exit early if we found a user
          } else if (retryCount < maxRetries) {
            // No user found, but we'll retry a few times (helps with magic link redirects)
            console.log(`No user found, retrying (${retryCount + 1}/${maxRetries})...`)
            retryCount++
            setTimeout(checkAuth, retryDelay)
            return
          } else {
            // No user found after retries, redirect to login
            console.log("No user found after retries, redirecting to login")
            router.push('/login')
          }
        }

        // Set up auth state change listener for future changes
        unsubscribe = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", event)
          
          if (event === 'SIGNED_OUT' || !session?.user) {
            console.log("User signed out, redirecting to login")
            router.push('/login')
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            // User is signed in, ensure they have a workspace
            console.log("User signed in via auth state change:", session.user.email)
            await ensureWorkspaceExists(session.user.id)
            setLoading(false)
          }
        })
      } catch (err) {
        console.error("Authentication error:", err)
        if (retryCount < maxRetries) {
          // Retry on error
          console.log(`Authentication error, retrying (${retryCount + 1}/${maxRetries})...`)
          retryCount++
          setTimeout(checkAuth, retryDelay)
        } else {
          router.push('/login')
        }
      }
    }

    // Initial check
    checkAuth()

    // Clean up the subscription when component unmounts
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
