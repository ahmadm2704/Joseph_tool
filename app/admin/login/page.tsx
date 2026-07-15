'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Demo login - for now accept admin@coursepro.com / admin123
    if (email === 'admin@coursepro.com' && password === 'admin123') {
      // Set session in localStorage for demo purposes
      localStorage.setItem('adminSession', JSON.stringify({ email, timestamp: Date.now() }))
      console.log('[v0] Admin logged in')
      router.push('/admin/dashboard')
    } else {
      setError('Invalid email or password. Try: admin@coursepro.com / admin123')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">CoursePro Admin</h1>
        <p className="text-gray-600 text-center mb-8">Manage your courses and registrations</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-900 placeholder:text-gray-400 bg-white"
              placeholder="admin@coursepro.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-900 placeholder:text-gray-400 bg-white"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm text-center mb-4">Demo Credentials:</p>
          <p className="text-gray-600 text-sm text-center">Email: admin@coursepro.com</p>
          <p className="text-gray-600 text-sm text-center mb-4">Password: admin123</p>
        </div>

        <Link href="/" className="block text-center text-blue-600 hover:text-blue-700 font-semibold mt-6">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
