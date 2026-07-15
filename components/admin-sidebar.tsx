'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, BookOpen, MapPin, Calendar, Users, Image, LogOut } from 'lucide-react'
import { useState } from 'react'

interface AdminSidebarProps {
  onLogout: () => void
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: BookOpen },
    { href: '/admin/dashboard/courses', label: 'Manage Courses', icon: BookOpen },
    { href: '/admin/dashboard/registrations', label: 'Registrations', icon: Users },
    { href: '/admin/dashboard/gallery', label: 'Gallery', icon: Image },
  ]

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-gray-800 text-white rounded-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white transition-transform md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } z-30`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">CoursePro</h1>
          <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={() => {
              setIsOpen(false)
              onLogout()
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
