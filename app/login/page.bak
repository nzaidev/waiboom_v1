'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for the magic link to log in.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold mb-4">Login to Waiboom</h1>
      <input
        type="email"
        placeholder="you@example.com"
        className="border p-2 w-full max-w-md"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-black text-white px-4 py-2 mt-4 w-full max-w-md"
      >
        Send Magic Link
      </button>
      <p className="text-sm text-gray-500 mt-2">{message}</p>
    </div>
  )
}
