'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin-sidebar'
import { useStore } from '@/lib/store'
import { BookOpen, MapPin, Calendar, Users } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const { courses, cities, days, registrations } = useStore()

  useEffect(() => {
    const session = localStorage.getItem('adminSession')
    if (!session) {
      router.push('/admin/login')
    } else {
      setIsAuthed(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.push('/admin/login')
  }

  if (!isAuthed) return null

  const stats = [
    { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Total Cities', value: cities.length, icon: MapPin, color: 'bg-green-500' },
    { label: 'Total Days', value: days.length, icon: Calendar, color: 'bg-purple-500' },
    { label: 'Registrations', value: registrations.length, icon: Users, color: 'bg-orange-500' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 overflow-auto md:ml-64">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-4 rounded-lg`}>
                      <Icon className="text-white" size={24} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <a
                  href="/admin/dashboard/courses"
                  className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 font-semibold transition-colors"
                >
                  → Manage Courses
                </a>
                <a
                  href="/admin/dashboard/cities"
                  className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-600 font-semibold transition-colors"
                >
                  → Manage Cities
                </a>
                <a
                  href="/admin/dashboard/days"
                  className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 font-semibold transition-colors"
                >
                  → Manage Days
                </a>
                <a
                  href="/admin/dashboard/registrations"
                  className="block p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-600 font-semibold transition-colors"
                >
                  → View Registrations
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              {registrations.length === 0 ? (
                <p className="text-gray-600">No recent registrations yet.</p>
              ) : (
                <div className="space-y-3">
                  {registrations.slice(-5).reverse().map((reg) => (
                    <div key={reg.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-900">{reg.firstName} {reg.lastName}</p>
                      <p className="text-sm text-gray-600">{reg.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
