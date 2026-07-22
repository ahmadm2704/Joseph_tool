'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin-sidebar'
import { useStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { BookOpen, Users, GraduationCap, ArrowUpRight, AlertCircle, Sparkles, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const { courses, registrations, contactMessages } = useStore()

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
      color: 'from-indigo-600 to-purple-600',
      glow: 'shadow-indigo-500/20',
      href: '/admin/dashboard/courses',
      change: 'Active programs',
    },
    {
      label: 'Registrations',
      value: registrations.length,
      icon: Users,
      color: 'from-cyan-600 to-blue-600',
      glow: 'shadow-cyan-500/20',
      href: '/admin/dashboard/registrations',
      change: 'Total students',
    },
    {
      label: 'Client Inquiries',
      value: contactMessages.length,
      icon: MessageSquare,
      color: 'from-emerald-600 to-teal-600',
      glow: 'shadow-emerald-500/20',
      href: '/admin/dashboard/contact',
      change: 'Contact submissions',
    },
    {
      label: 'Upcoming Deadlines',
      value: courses.filter(c => c.deadline).length,
      icon: AlertCircle,
      color: 'from-rose-600 to-pink-600',
      glow: 'shadow-rose-500/20',
      href: '/admin/dashboard/courses',
      change: 'Courses with deadlines',
    },
  ]

  const quickActions = [
    { label: 'Add New Course', href: '/admin/dashboard/courses', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50 hover:bg-indigo-100/70 border-indigo-200' },
    { label: 'View Registrations', href: '/admin/dashboard/registrations', icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-50 hover:bg-cyan-100/70 border-cyan-200' },
    { label: 'Client Inquiries', href: '/admin/dashboard/contact', icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200' },
    { label: 'Manage Gallery', href: '/admin/dashboard/gallery', icon: GraduationCap, color: 'text-amber-600', bg: 'bg-amber-50 hover:bg-amber-100/70 border-amber-200' },
  ]

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 overflow-auto md:ml-64 relative z-10">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-bold uppercase tracking-widest">
                <Sparkles size={11} /> Overview
              </span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-600 mt-2">Welcome back, Admin. Here&apos;s what&apos;s happening across your academy.</p>
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
                  <Link href={stat.href} className="block glass-card !rounded-2xl p-6 hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1 group">
                    <div className="flex items-start justify-between mb-5">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md ${stat.glow}`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <ArrowUpRight size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors mt-1" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                    <p className="text-sm font-bold text-slate-700">{stat.label}</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{stat.change}</p>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Bottom section */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card !rounded-2xl p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
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
                      <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-900 transition-colors">{action.label}</span>
                      <ArrowUpRight size={14} className="ml-auto text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </Link>
                  )
                })}
              </div>
            </motion.div>

            {/* Recent Registrations */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="lg:col-span-2 glass-card !rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-600" />
                  Recent Registrations
                </h2>
                <Link href="/admin/dashboard/registrations" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  View all <ArrowUpRight size={13} />
                </Link>
              </div>

              {registrations.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Users size={32} className="mx-auto mb-3 text-slate-400 opacity-60" />
                  <p className="text-sm font-semibold">No registrations yet</p>
                  <p className="text-xs text-slate-400 mt-1">Student submissions will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {registrations.slice(0, 5).map(reg => (
                    <div key={reg.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{reg.firstName} {reg.lastName}</p>
                        <p className="text-xs text-slate-600 font-medium">{reg.email}</p>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                        {reg.citizenshipStatus || 'Student'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  )
}
