'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageSquare, Sparkles, Globe } from 'lucide-react'
import Image from 'next/image'
import Navbar from '@/components/navbar'
import ParticleField from '@/components/particle-field'
import SpotlightCursor from '@/components/spotlight-cursor'
import Footer from '@/components/footer'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitted(false)
    }, 3500)
  }

  const contactInfo = [
    { icon: Mail, title: 'Email Support', lines: ['info@coursepro.com', 'support@coursepro.com'], color: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/20' },
    { icon: Phone, title: 'Call Us', lines: ['+1 (800) 123-4567', 'Available 9AM-6PM EST'], color: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/20' },
    { icon: MapPin, title: 'Headquarters', lines: ['123 Innovation Drive', 'Tech District, NY 10001'], color: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/20' },
  ]

  return (
    <main className="min-h-screen bg-[#050510] relative">
      <ParticleField />
      <SpotlightCursor />
      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden aurora-bg">
          <div className="absolute inset-0 mesh-gradient-intense" />
          <div className="relative max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <span className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full mb-8 text-xs text-purple-300 font-semibold tracking-widest uppercase">
                  <MessageSquare size={13} /> Contact Us
                </span>
                <h1 className="text-5xl md:text-6xl lg:text-[4.2rem] font-bold leading-[1.05] mb-8 tracking-tight">
                  <span className="text-white">Let&apos;s Start a</span><br />
                  <span className="gradient-text">Conversation.</span>
                </h1>
                <p className="text-lg text-gray-400 leading-relaxed max-w-lg mb-8">
                  Have questions about our programs? Ready to transform your career? Our advisory team is here to guide you every step of the way.
                </p>
                <div className="inline-flex items-center gap-3 glass px-5 py-3 rounded-2xl border-green-500/20 bg-green-500/5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium text-gray-300">Average response time: <span className="text-green-400 font-bold">Under 2 hours</span></span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="relative hidden lg:block">
                <div className="absolute -inset-10 bg-gradient-to-br from-purple-600/15 via-transparent to-cyan-600/10 blur-3xl rounded-full" />
                <div className="relative rounded-3xl overflow-hidden animated-border float-3d">
                  <div className="glass-card-static p-2">
                    <Image src="/contact-scene.png" alt="3D communication hub" width={600} height={450} className="w-full h-auto rounded-2xl" priority />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Info Cards */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 relative z-20 -mt-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 perspective-container">
              {contactInfo.map((info, i) => {
                const Icon = info.icon
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} className="glass-card p-8 text-center group card-3d bg-[rgba(12,12,35,0.7)] backdrop-blur-2xl">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center mx-auto mb-6 shadow-xl ${info.shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-4">{info.title}</h3>
                    {info.lines.map((line, j) => (
                      <p key={j} className="text-gray-400 text-sm mb-1">{line}</p>
                    ))}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">Send us a <span className="gradient-text">Message</span></h2>
              <p className="text-gray-500">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="glass-card p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 blur-[80px] rounded-full pointer-events-none" />

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center py-20 relative z-10">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/30">
                      <CheckCircle2 size={48} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Message Received!</h3>
                    <p className="text-gray-400 text-lg">Thank you for reaching out. A confirmation email is on its way, and our team will contact you shortly.</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-7 relative z-10">
                    <div className="grid sm:grid-cols-2 gap-7">
                      <div className="space-y-2.5">
                        <label className="text-xs font-bold tracking-widest text-gray-400 uppercase ml-1">Full Name</label>
                        <input
                          type="text" name="name" value={formData.name} onChange={handleChange} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} required
                          className={`w-full px-5 py-4 glass-input text-white font-medium placeholder:text-gray-600 ${focused === 'name' ? 'border-purple-500/50 glow-purple bg-white/[0.05]' : ''}`}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-xs font-bold tracking-widest text-gray-400 uppercase ml-1">Email Address</label>
                        <input
                          type="email" name="email" value={formData.email} onChange={handleChange} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} required
                          className={`w-full px-5 py-4 glass-input text-white font-medium placeholder:text-gray-600 ${focused === 'email' ? 'border-purple-500/50 glow-purple bg-white/[0.05]' : ''}`}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold tracking-widest text-gray-400 uppercase ml-1">Subject</label>
                      <input
                        type="text" name="subject" value={formData.subject} onChange={handleChange} onFocus={() => setFocused('subject')} onBlur={() => setFocused(null)} required
                        className={`w-full px-5 py-4 glass-input text-white font-medium placeholder:text-gray-600 ${focused === 'subject' ? 'border-purple-500/50 glow-purple bg-white/[0.05]' : ''}`}
                        placeholder="How can we help?"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold tracking-widest text-gray-400 uppercase ml-1">Message</label>
                      <textarea
                        name="message" value={formData.message} onChange={handleChange} onFocus={() => setFocused('message')} onBlur={() => setFocused(null)} required
                        className={`w-full px-5 py-4 glass-input text-white font-medium placeholder:text-gray-600 resize-none ${focused === 'message' ? 'border-purple-500/50 glow-purple bg-white/[0.05]' : ''}`}
                        rows={6} placeholder="Tell us more about your goals..."
                      />
                    </div>
                    <div className="pt-2">
                      <button type="submit" className="w-full btn-primary text-lg flex items-center justify-center gap-3 group !py-4">
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Send Message
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Global Map Concept */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-purple-900/5 to-[#050510]" />
          <div className="relative z-10 max-w-5xl mx-auto text-center">
             <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/30">
               <Globe size={28} className="text-white" />
             </div>
             <h3 className="text-3xl font-bold text-white mb-4">Global Presence</h3>
             <p className="text-gray-500 max-w-2xl mx-auto">We serve ambitious learners in over 50 countries, bringing world-class education directly to your screen no matter where you are.</p>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
