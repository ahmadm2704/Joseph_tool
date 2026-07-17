'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin-sidebar'
import { useStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { BookOpen, Users, GraduationCap, ArrowUpRight, Clock, AlertCircle, TrendingUp, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const { courses, registrations } = useStore()

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
    {
      label: 'Total Courses',
      value: courses.length,
      icon: BookOpen,
      color: 'from-purple-500 to-violet-600',
      glow: 'shadow-purple-500/30',
      href: '/admin/dashboard/courses',
      change: 'Active programs',
    },
    {
      label: 'Registrations',
      value: registrations.length,
      icon: Users,
      color: 'from-cyan-500 to-blue-600',
      glow: 'shadow-cyan-500/30',
      href: '/admin/dashboard/registrations',
      change: 'Total students',
    },
    {
      label: 'Upcoming Deadlines',
      value: courses.filter(c => c.deadline).length,
      icon: AlertCircle,
      color: 'from-rose-500 to-pink-600',
      glow: 'shadow-rose-500/30',
      href: '/admin/dashboard/courses',
      change: 'Courses with deadlines',
    },
    {
      label: 'Blended Courses',
      value: courses.filter(c => c.delivery === 'Blended').length,
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-600',
      glow: 'shadow-amber-500/30',
      href: '/admin/dashboard/courses',
      change: 'Blended delivery',
    },
  ]

  const quickActions = [
    { label: 'Add New Course', href: '/admin/dashboard/courses', icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20' },
    { label: 'View Registrations', href: '/admin/dashboard/registrations', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/20' },
    { label: 'Manage Gallery', href: '/admin/dashboard/gallery', icon: GraduationCap, color: 'text-amber-400', bg: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20' },
  ]

  return (
    <div className="flex min-h-screen bg-[#050510]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/8 blur-[120px] rounded-full" />
      </div>

      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 overflow-auto md:ml-64 relative z-10">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest">
                <Sparkles size={11} /> Overview
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-2">Welcome back, Admin. Here&apos;s what&apos;s happening.</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link href={stat.href} className="block glass-card !rounded-2xl p-6 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 group">
                    <div className="flex items-start justify-between mb-5">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg ${stat.glow}`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <ArrowUpRight size={16} className="text-gray-600 group-hover:text-gray-400 transition-colors mt-1" />
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-sm font-semibold text-gray-400">{stat.label}</p>
                    <p className="text-xs text-gray-600 mt-1">{stat.change}</p>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Bottom section */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card !rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                {quickActions.map(action => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 group ${action.bg}`}
                    >
                      <Icon size={18} className={action.color} />
                      <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
                      <ArrowUpRight size={14} className="ml-auto text-gray-600 group-hover:text-gray-400 transition-colors" />
                    </Link>
                  )
                })}
              </div>
            </motion.div>

            {/* Course List */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }} className="glass-card !rounded-2xl p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  Active Courses
                </h2>
                <Link href="/admin/dashboard/courses" className="text-xs font-bold text-purple-400 hover:text-purple-300 uppercase tracking-widest transition-colors">
                  Manage →
                </Link>
              </div>
              {courses.length === 0 ? (
                <div className="text-center py-10">
                  <BookOpen size={36} className="text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No courses yet. Add your first course!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
                        <BookOpen size={16} className="text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{course.name}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={10} /> {course.duration}</span>
                          <span className="text-xs text-rose-400 flex items-center gap-1"><AlertCircle size={10} /> {course.deadline}</span>
                        </div>
                      </div>
                      <span className="text-[0.6rem] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 px-2 py-1 rounded-lg border border-purple-500/20 shrink-0">{course.delivery}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Recent Registrations */}
          {registrations.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card !rounded-2xl p-6 mt-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  Recent Registrations
                </h2>
                <Link href="/admin/dashboard/registrations" className="text-xs font-bold text-purple-400 hover:text-purple-300 uppercase tracking-widest transition-colors">
                  View All →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {registrations.slice(-6).reverse().map((reg) => (
                  <div key={reg.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="font-semibold text-white text-sm">{reg.firstName} {reg.lastName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{reg.email}</p>
                    <p className="text-xs text-gray-600 mt-1">{new Date(reg.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
