'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Shield } from 'lucide-react'

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
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 relative overflow-hidden text-slate-900">
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-200 relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/20 mb-6">
              <Shield size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Admin Access</h1>
            <p className="text-slate-600 text-sm font-medium">Sign in to manage your course portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-slate-700 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  required
                  suppressHydrationWarning
                  className={`w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 transition-all ${focused === 'email' ? 'border-indigo-600 ring-2 ring-indigo-500/20' : ''}`}
                  placeholder="admin@coursepro.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-slate-700 uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('pass')}
                  onBlur={() => setFocused(null)}
                  required
                  suppressHydrationWarning
                  className={`w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 transition-all ${focused === 'pass' ? 'border-indigo-600 ring-2 ring-indigo-500/20' : ''}`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              suppressHydrationWarning
              className="w-full btn-primary text-base flex items-center justify-center gap-2 !py-4 font-bold disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <Link href="/" className="text-xs text-slate-500 hover:text-indigo-600 font-semibold transition-colors">
                ← Back to CoursePro Academy
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
