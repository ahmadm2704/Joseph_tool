'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { GraduationCap, Mail, Lock, ArrowRight, Sparkles, Shield } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const validEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@coursepro.com'
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

    await new Promise(r => setTimeout(r, 600))

    if (email === validEmail && password === validPassword) {
      localStorage.setItem('adminSession', JSON.stringify({ email, timestamp: Date.now() }))
      router.push('/admin/dashboard')
    } else {
      setError('Invalid credentials. Please try again.')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-cyan-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Top glow line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent rounded-t-3xl" />

        <div className="glass-card !rounded-3xl p-8 shadow-2xl shadow-purple-900/30 ring-1 ring-purple-500/20 backdrop-blur-2xl relative overflow-hidden">
          {/* Inner decorative glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-600/15 blur-[60px] rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-cyan-600/10 blur-[60px] rounded-full" />

          {/* Header */}
          <div className="text-center mb-10 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/30 mb-6">
              <Shield size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Admin Access</h1>
            <p className="text-gray-500 text-sm">Sign in to manage your course portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-gray-400 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  required
                  className={`w-full pl-12 pr-4 py-4 glass-input text-white font-medium placeholder:text-gray-600 transition-all ${focused === 'email' ? 'border-purple-500/50 bg-white/[0.05]' : ''}`}
                  placeholder="admin@coursepro.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-gray-400 uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('pass')}
                  onBlur={() => setFocused(null)}
                  required
                  className={`w-full pl-12 pr-4 py-4 glass-input text-white font-medium placeholder:text-gray-600 transition-all ${focused === 'pass' ? 'border-purple-500/50 bg-white/[0.05]' : ''}`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary !py-4 text-base font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Hint */}
          <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
            <p className="text-center text-xs text-gray-600">
              Credentials are set via your <span className="text-purple-400 font-mono">.env.local</span> file
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-purple-400 transition-colors font-medium">
            ← Back to Website
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
