'use client'

import Link from 'next/link'
import { Sparkles, Mail, Phone, MapPin, ArrowUpRight, Globe, MessageCircle, Users } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative pt-24 pb-12 overflow-hidden border-t border-white/5 bg-[#050510]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-purple-900/5 to-[#050510] pointer-events-none" />
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 group mb-6">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:rotate-12 transition-transform duration-500">
                  <Sparkles className="text-white" size={18} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-white tracking-tight leading-tight group-hover:text-purple-300 transition-colors">CoursePro</span>
                <span className="text-[0.6rem] text-gray-500 font-medium tracking-[0.2em] uppercase">Academy</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-8 pr-4">
              Transforming careers through world-class professional training programs since 2020. Elevating the standard of online education.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageCircle, Users].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-xl glass bg-white/[0.02] flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1 transition-all duration-300">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-white font-bold mb-6 tracking-wide">Platform</h4>
            <ul className="space-y-4">
              {['Programs', 'Curriculum', 'Mentors', 'Pricing'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1 group">
                    {item}
                    <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 tracking-wide">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-1 group">
                    {item}
                    <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6 tracking-wide">Contact Us</h4>
            <ul className="space-y-5">
              <li>
                <a href="#" className="flex items-start gap-3 text-sm text-gray-400 hover:text-white transition-colors group">
                  <Mail size={18} className="mt-0.5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <span>info@coursepro.com<br/>support@coursepro.com</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-start gap-3 text-sm text-gray-400 hover:text-white transition-colors group">
                  <Phone size={18} className="mt-0.5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                  <span>+1 (800) 123-4567<br/>9AM-6PM EST</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-gray-400 group">
                  <MapPin size={18} className="mt-0.5 text-pink-400 group-hover:text-pink-300 transition-colors" />
                  <span>123 Innovation Drive<br/>Tech District, NY 10001</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} CoursePro Academy. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
