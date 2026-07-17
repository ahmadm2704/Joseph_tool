'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, BookOpen, Users, Image, LogOut, GraduationCap, ChevronRight, Sparkles } from 'lucide-react'
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
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-purple-400' },
    { href: '/admin/dashboard/courses', label: 'Manage Courses', icon: BookOpen, color: 'text-cyan-400' },
    { href: '/admin/dashboard/registrations', label: 'Registrations', icon: Users, color: 'text-pink-400' },
    { href: '/admin/dashboard/gallery', label: 'Gallery', icon: Image, color: 'text-amber-400' },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">CoursePro</h1>
            <p className="text-[0.65rem] text-purple-400 font-semibold uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-gray-600 px-3 mb-3">Menu</p>
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
                  ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/10 text-white border border-purple-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full" />
              )}
              <Icon size={18} className={active ? 'text-purple-400' : item.color + ' opacity-60 group-hover:opacity-100 transition-opacity'} />
              <span className="text-sm font-semibold">{item.label}</span>
              {active && <ChevronRight size={14} className="ml-auto text-purple-400" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="px-3 pb-6 border-t border-white/5 pt-4">
        <button
          onClick={() => { setIsOpen(false); onLogout() }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
        >
          <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
          <span className="text-sm font-semibold">Logout</span>
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
          className="p-2.5 glass border border-white/10 text-white rounded-xl backdrop-blur-xl"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col bg-[rgba(8,8,25,0.95)] border-r border-white/5 backdrop-blur-xl z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-[rgba(8,8,25,0.98)] border-r border-white/5 z-50 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
