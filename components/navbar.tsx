'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'glass shadow-2xl shadow-purple-950/10'
          : 'bg-transparent'
      }`}
    >
      {/* Bottom glow line */}
      <div className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-700 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
        <div className="h-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.6 }}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
              >
                <Sparkles className="text-white" size={20} />
              </motion.div>
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-15 blur-xl transition-all duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl gradient-text tracking-tight leading-tight">
                CoursePro
              </span>
              <span className="text-[0.6rem] text-gray-600 font-medium tracking-[0.2em] uppercase">Academy</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-5 py-2.5 rounded-xl text-[0.82rem] font-semibold tracking-wide transition-all duration-300 ${
                  isActive(link.href)
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-200'
                }`}
              >
                {isActive(link.href) && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 rounded-xl overflow-hidden"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/15 to-cyan-600/10 border border-purple-500/15 rounded-xl" />
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
                  </motion.div>
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}

            <div className="ml-5 h-8 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            <Link
              href="/"
              className="ml-5 btn-primary !py-2.5 !px-6 text-[0.8rem] flex items-center gap-2 tracking-wide"
              onClick={(e) => {
                e.preventDefault()
                window.dispatchEvent(new CustomEvent('open-registration'))
              }}
            >
              <Sparkles size={13} />
              Enroll Now
            </Link>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl glass text-gray-400 hover:text-white transition-colors"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pb-6 space-y-1.5">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      className={`block px-5 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive(link.href)
                          ? 'bg-gradient-to-r from-purple-600/15 to-cyan-600/10 text-white border border-purple-500/15'
                          : 'text-gray-500 hover:text-white hover:bg-white/3'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="pt-3"
                >
                  <button className="w-full btn-primary text-sm flex items-center justify-center gap-2">
                    <Sparkles size={14} />
                    Enroll Now
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
