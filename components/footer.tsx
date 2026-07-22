'use client'

import Link from 'next/link'
import { Sparkles, Mail, Phone, MapPin, ArrowUpRight, Globe, MessageCircle, Users } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative pt-24 pb-12 overflow-hidden border-t border-slate-200 bg-[#f1f5f9] text-[#0f172a]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] via-indigo-50/30 to-[#f1f5f9] pointer-events-none" />
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 group mb-6">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-500">
                  <Sparkles className="text-white" size={18} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">CoursePro</span>
                <span className="text-[0.6rem] text-slate-500 font-medium tracking-[0.2em] uppercase">Academy</span>
              </div>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed mb-8 pr-4">
              Transforming careers through world-class professional training programs since 2020. Elevating the standard of online education.
            </p>
            <div className="flex gap-3">
              {[Globe, MessageCircle, Users].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-xl bg-white/80 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-white hover:bg-indigo-500 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-1 transition-all duration-300">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-slate-900 font-bold mb-6 tracking-wide">Platform</h4>
            <ul className="space-y-4">
              {['Programs', 'Curriculum', 'Mentors', 'Pricing'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 group">
                    {item}
                    <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="text-slate-900 font-bold mb-6 tracking-wide">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 group">
                    {item}
                    <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-slate-900 font-bold mb-6 tracking-wide">Contact Us</h4>
            <ul className="space-y-5">
              <li>
                <a href="#" className="flex items-start gap-3 text-sm text-slate-600 hover:text-indigo-600 transition-colors group">
                  <Mail size={18} className="mt-0.5 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                  <span>info@coursepro.com<br/>support@coursepro.com</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-start gap-3 text-sm text-slate-600 hover:text-indigo-600 transition-colors group">
                  <Phone size={18} className="mt-0.5 text-cyan-500 group-hover:text-cyan-600 transition-colors" />
                  <span>+1 (800) 123-4567<br/>9AM-6PM EST</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-slate-600 group">
                  <MapPin size={18} className="mt-0.5 text-pink-500 group-hover:text-pink-600 transition-colors" />
                  <span>123 Innovation Drive<br/>Tech District, NY 10001</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} CoursePro Academy. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
