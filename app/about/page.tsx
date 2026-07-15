'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Award, Users, BookOpen, Globe, CheckCircle2, Sparkles, TrendingUp, Heart, GraduationCap, Target } from 'lucide-react'
import Image from 'next/image'
import Navbar from '@/components/navbar'
import ParticleField from '@/components/particle-field'
import SpotlightCursor from '@/components/spotlight-cursor'
import Footer from '@/components/footer'

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  useEffect(() => {
    if (!isInView) return
    const duration = 2200; const startTime = performance.now()
    const animate = (t: number) => {
      const p = Math.min((t - startTime) / duration, 1)
      setCount(Math.floor((1 - Math.pow(1 - p, 4)) * target))
      if (p < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, target])
  return <span ref={ref} className="stat-number">{count.toLocaleString()}{suffix}</span>
}

export default function About() {
  const milestones = [
    { year: '2020', title: 'Founded', description: 'Started with a mission to democratize world-class professional education.', icon: Sparkles, color: 'from-purple-500 to-violet-600' },
    { year: '2021', title: 'First 1,000 Students', description: 'Reached our first major milestone of enrolled learners worldwide.', icon: Users, color: 'from-blue-500 to-cyan-600' },
    { year: '2022', title: 'Global Expansion', description: 'Expanded to 25+ countries with localized content and mentors.', icon: Globe, color: 'from-emerald-500 to-teal-600' },
    { year: '2023', title: 'AI-Powered Learning', description: 'Introduced personalized, AI-driven adaptive course paths.', icon: Target, color: 'from-amber-500 to-orange-600' },
    { year: '2024', title: '15K+ Community', description: 'Built a thriving global community of ambitious tech professionals.', icon: GraduationCap, color: 'from-pink-500 to-rose-600' },
  ]

  const values = [
    { icon: TrendingUp, title: 'Excellence', description: 'We pursue the highest standards in every course, mentor, and learning outcome.', color: 'from-violet-600 to-purple-700', shadow: 'shadow-violet-500/25' },
    { icon: Heart, title: 'Student First', description: 'Every decision — from curriculum to pricing — centers around student success.', color: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/25' },
    { icon: Globe, title: 'Accessibility', description: 'Quality education available to everyone, everywhere, at an accessible price.', color: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/25' },
    { icon: Sparkles, title: 'Innovation', description: 'Continuously evolving our methods with cutting-edge AI and pedagogical research.', color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/25' },
  ]

  const advantages = [
    'Industry-experienced instructors with 10+ years of expertise',
    'Hands-on projects with real company datasets and codebases',
    'Dedicated career support and job placement assistance',
    'Flexible scheduling designed for working professionals',
    'Lifetime access to all course materials and updates',
    'Small cohort sizes for personalized mentoring attention',
  ]

  const stats = [
    { value: 15000, suffix: '+', label: 'Students' },
    { value: 98, suffix: '%', label: 'Success Rate' },
    { value: 250, suffix: '+', label: 'Mentors' },
    { value: 50, suffix: '+', label: 'Countries' },
  ]

  return (
    <main className="min-h-screen bg-[#050510] relative">
      <ParticleField />
      <SpotlightCursor />
      <div className="relative z-10">
        <Navbar />

        {/* Hero */}
        <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden aurora-bg">
          <div className="absolute inset-0 mesh-gradient-intense" />
          <div className="relative max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                  <span className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full mb-8 text-xs text-purple-300 font-semibold tracking-widest uppercase">
                    <BookOpen size={13} /> Our Story
                  </span>
                  <h1 className="text-5xl md:text-6xl lg:text-[4.2rem] font-bold leading-[1.05] mb-8 tracking-tight">
                    <span className="text-white">Shaping The</span><br />
                    <span className="gradient-text">Future of</span><br />
                    <span className="text-white">Learning.</span>
                  </h1>
                  <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
                    We&apos;re dedicated to providing world-class professional training that empowers individuals to transform their careers and achieve extraordinary things.
                  </p>
                </motion.div>

                {/* Stats row */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="grid grid-cols-4 gap-4 mt-14"
                >
                  {stats.map((s, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl md:text-3xl font-bold gradient-text"><AnimatedCounter target={s.value} suffix={s.suffix} /></div>
                      <div className="text-[0.65rem] text-gray-600 mt-1 font-medium uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative hidden lg:block"
              >
                <div className="absolute -inset-10 bg-gradient-to-br from-purple-600/15 via-transparent to-cyan-600/10 blur-3xl rounded-full" />
                <div className="relative rounded-3xl overflow-hidden animated-border float-3d">
                  <div className="glass-card-static p-2">
                    <Image src="/about-scene.png" alt="Futuristic learning" width={600} height={450} className="w-full h-auto rounded-2xl" priority />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
              <span className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full mb-6 text-xs text-purple-300 font-semibold tracking-widest uppercase"><Award size={13} /> Journey</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight">Our <span className="gradient-text">Timeline</span></h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">From a small startup to a global education platform.</p>
            </motion.div>

            <div className="relative">
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px">
                <div className="h-full bg-gradient-to-b from-purple-500/40 via-cyan-500/30 to-transparent" />
              </div>

              {milestones.map((m, i) => {
                const Icon = m.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className={`relative flex items-center mb-16 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className={`flex-1 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'} pl-20 md:pl-0`}>
                      <div className="glass-card p-7 group card-3d">
                        <div className={`inline-flex w-11 h-11 rounded-xl bg-gradient-to-br ${m.color} items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon size={18} className="text-white" />
                        </div>
                        <span className="block text-xs font-bold text-purple-400 mb-1 tracking-widest uppercase">{m.year}</span>
                        <h3 className="text-xl font-bold text-white mb-2">{m.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{m.description}</p>
                      </div>
                    </div>

                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/40 ring-4 ring-[#050510]" />
                    </div>

                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative aurora-bg">
          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
              <span className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full mb-6 text-xs text-purple-300 font-semibold tracking-widest uppercase"><Heart size={13} /> Core Values</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight">What Drives <span className="gradient-text">Us</span></h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-container">
              {values.map((v, i) => {
                const Icon = v.icon
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} className="glass-card p-8 text-center group card-3d">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center mx-auto mb-6 shadow-xl ${v.shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">{v.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Why We Stand Out */}
        <section className="py-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
              <span className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full mb-6 text-xs text-purple-300 font-semibold tracking-widest uppercase"><Users size={13} /> Advantages</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight">Why We <span className="gradient-text">Stand Out</span></h2>
            </motion.div>

            <div className="glass-card p-10 md:p-14">
              <div className="grid md:grid-cols-2 gap-4">
                {advantages.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="flex items-start gap-4 p-5 rounded-xl hover:bg-white/[0.02] transition-colors group cursor-default">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mt-0.5 shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
