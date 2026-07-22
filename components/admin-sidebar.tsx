'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, BookOpen, Users, Image, LogOut, GraduationCap, ChevronRight, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AdminSidebarProps {
  onLogout: () => void
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-indigo-600' },
    { href: '/admin/dashboard/courses', label: 'Manage Courses', icon: BookOpen, color: 'text-cyan-600' },
    { href: '/admin/dashboard/registrations', label: 'Registrations', icon: Users, color: 'text-pink-600' },
    { href: '/admin/dashboard/contact', label: 'Contact Messages', icon: MessageSquare, color: 'text-emerald-600' },
    { href: '/admin/dashboard/gallery', label: 'Gallery', icon: Image, color: 'text-amber-600' },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">CoursePro</h1>
            <p className="text-[0.65rem] text-indigo-600 font-bold uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-slate-400 px-3 mb-3">Menu</p>
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                active
                  ? 'bg-indigo-50 text-indigo-600 font-bold border border-indigo-200/60 shadow-sm'
                  : 'text-slate-600 font-medium hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 rounded-full" />
              )}
              <Icon size={18} className={active ? 'text-indigo-600' : item.color + ' opacity-75 group-hover:opacity-100 transition-opacity'} />
              <span className="text-sm">{item.label}</span>
              {active && <ChevronRight size={14} className="ml-auto text-indigo-600" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="px-3 pb-6 border-t border-slate-100 pt-4">
        <button
          onClick={() => { setIsOpen(false); onLogout() }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 group font-semibold"
        >
          <LogOut size={18} className="group-hover:text-rose-600 transition-colors" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl shadow-md"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col bg-white border-r border-slate-200 z-30 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-white border-r border-slate-200 z-50 md:hidden shadow-xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
