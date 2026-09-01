'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Sparkles, GraduationCap, Users, Award, Globe, ArrowRight, Code, Smartphone, BrainCircuit, Cloud, Shield, BarChart3, Star, Zap, Target, Mail, Quote, ChevronRight, Play, Calendar, BookOpen, Building, Clock, Layers, Filter, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import AnimatedBanner from '@/components/animated-banner'
import GalleryCarousel from '@/components/gallery-carousel'
import dynamic from 'next/dynamic'
import Footer from '@/components/footer'
import SpotlightCursor from '@/components/spotlight-cursor'

const ThreeCanvas = dynamic(() => import('@/components/three-canvas'), { ssr: false })
const ParticleField = dynamic(() => import('@/components/particle-field'), { ssr: false })
const AchievementsSection = dynamic(() => import('@/components/achievements-section'), { ssr: false })
import ScheduleMeetingModal from '@/components/schedule-meeting-modal'
import RegistrationModal from '@/components/registration-modal'
import CourseDirectoryModal from '@/components/course-directory-modal'
import { useStore } from '@/lib/store'

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const duration = 2500
    const startTime = performance.now()
    const animate = (t: number) => {
      const progress = Math.min((t - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, target])

  return <span ref={ref} className="stat-number">{count.toLocaleString()}{suffix}</span>
}

/* ─── Floating Orb ─── */
function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [-25, 25, -25], x: [-15, 15, -15], scale: [1, 1.15, 1] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay }}
      className={className}
    />
  )
}

/* ─── Section Header ─── */
function SectionHeader({ badge, badgeIcon: BadgeIcon, title, highlight, subtitle }: {
  badge: string; badgeIcon: React.ElementType; title: string; highlight: string; subtitle: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="text-center mb-20"
    >
      <span className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full mb-6 text-xs text-indigo-600 font-bold tracking-widest uppercase">
        <BadgeIcon size={13} />
        {badge}
      </span>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 tracking-tight leading-tight">
        {title} <span className="gradient-text">{highlight}</span>
      </h2>
      <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">{subtitle}</p>
    </motion.div>
  )
}



export default function Home() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('All')
  const { courses } = useStore()
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.96])

  useEffect(() => {
    setMounted(true)
    const handleOpen = () => setIsRegistrationOpen(true)
    window.addEventListener('open-registration', handleOpen)
    return () => window.removeEventListener('open-registration', handleOpen)
  }, [])

  if (!mounted) return null

  const features = [
    { icon: Target, title: 'Expert Guidance', description: 'We help you navigate the complex world of higher education to find the perfect fit.', color: 'from-violet-600 to-purple-700', shadow: 'shadow-violet-500/25' },
    { icon: GraduationCap, title: 'University Admissions', description: 'Assistance with applications, documentation, and securing your spot at top institutions.', color: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/25' },
    { icon: BookOpen, title: 'Course Selection', description: 'Personalized advice on which programs align best with your long-term career goals.', color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/25' },
    { icon: Globe, title: 'Visa & Immigration', description: 'Comprehensive support with student visa applications and immigration requirements.', color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/25' },
    { icon: Award, title: 'Career Counseling', description: 'Insights into post-graduation opportunities and pathways for professional success.', color: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/25' },
    { icon: Shield, title: 'Dedicated Support', description: 'Ongoing assistance and mentorship throughout your entire educational journey.', color: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-500/25' },
  ]

  const stats = [
    { value: 15000, suffix: '+', label: 'Students Enrolled', icon: Users },
    { value: 6000, suffix: '+', label: 'Active Students', icon: Zap },
    { value: 98, suffix: '%', label: 'Success Rate', icon: Award },
    { value: 250, suffix: '+', label: 'Available Options', icon: BookOpen },
    { value: 100, suffix: '%', label: 'UK Exclusive', icon: Globe },
  ]


  const courseCards = [
    {
      id: 'sirm-1',
      provider: 'SIRM',
      campus: 'Leicester',
      title: 'Business and Tourism with Foundation Year',
      duration: '4 Years',
      startDate: '21 September 2026',
      icon: GraduationCap,
      color: 'from-blue-600 to-cyan-500',
      shadow: 'shadow-blue-500/20',
      schedules: [
        {
          label: 'Option 1',
          campus: 'Thursday, 9:30am - 4:30pm',
          online: 'Tuesday & Wednesday evenings, 6:00pm - 9:00pm'
        },
        {
          label: 'Option 2',
          campus: 'Tuesday, 9:30am - 4:30pm',
          online: 'Monday, 9:30am - 4:30pm'
        }
      ],
      tags: ['Foundation Year', 'Tourism & Business', 'Leicester']
    },
    {
      id: 'sirm-2',
      provider: 'SIRM',
      campus: 'Leicester',
      title: 'HND Business',
      duration: '2 Years',
      startDate: '5 October 2026',
      icon: BookOpen,
      color: 'from-sky-500 to-blue-600',
      shadow: 'shadow-sky-500/20',
      schedules: [
        {
          label: 'Timetable',
          campus: 'Thursday, 9:30am - 4:30pm',
          online: 'Tuesday, 9:30am - 4:30pm'
        }
      ],
      tags: ['HND Diploma', 'Business Administration', 'Leicester']
    },
    {
      id: 'sirm-3',
      provider: 'SIRM',
      campus: 'Leicester',
      title: 'Level 4 Data Analyst NCFE',
      duration: '2 Years',
      startDate: '1 September 2026',
      icon: BarChart3,
      color: 'from-cyan-500 to-teal-600',
      shadow: 'shadow-cyan-500/20',
      schedules: [
        {
          label: 'Timetable',
          campus: 'Tuesday, 9:30am - 4:30pm',
          online: 'Friday, 9:30am - 4:30pm'
        }
      ],
      tags: ['NCFE Level 4', 'Data Analytics', 'Tech & AI']
    },
    {
      id: 'sirm-4',
      provider: 'SIRM',
      campus: 'Leicester',
      title: 'NCC Business',
      duration: '1 Year',
      startDate: '1 September 2026',
      icon: Award,
      color: 'from-indigo-500 to-sky-600',
      shadow: 'shadow-indigo-500/20',
      schedules: [
        {
          label: 'Timetable',
          campus: 'Tuesday, 9:30am - 4:30pm',
          online: 'Wednesday & Thursday evenings, 6:00pm - 9:00pm'
        }
      ],
      tags: ['NCC Education', '1-Year Fast Track', 'Business']
    },
    {
      id: 'cecos-1',
      provider: 'CECOS',
      campus: 'Leicester Campus',
      title: 'Business Management - BSc BMF',
      duration: '4 Years',
      startDate: 'September 2026',
      icon: GraduationCap,
      color: 'from-blue-600 to-indigo-700',
      shadow: 'shadow-blue-500/20',
      schedules: [
        {
          label: 'Option 1',
          campus: 'Monday & Tuesday, 10:00am - 5:00pm',
          online: null
        },
        {
          label: 'Option 2',
          campus: 'Monday & Tuesday 6:00pm - 9:00pm + Friday 10:00am - 5:00pm',
          online: null
        }
      ],
      tags: ['BSc (Hons)', 'Business Management', 'Undergraduate']
    },
    {
      id: 'cecos-2',
      provider: 'CECOS',
      campus: 'Leicester Campus',
      title: 'Foundation Degree Business and Management',
      duration: '2 Years',
      startDate: 'September 2026',
      icon: BookOpen,
      color: 'from-teal-500 to-cyan-600',
      shadow: 'shadow-teal-500/20',
      schedules: [
        {
          label: 'Option 1',
          campus: 'Thursday on campus, 10:00am - 5:00pm',
          online: 'Friday online, 10:00am - 5:00pm'
        },
        {
          label: 'Option 2',
          campus: 'Monday & Tuesday, 6:00pm - 9:00pm',
          online: 'Saturday online, 10:00am - 5:00pm'
        }
      ],
      tags: ['Foundation Degree', 'Management', 'Blended Learning']
    },
    {
      id: 'cecos-3',
      provider: 'CECOS',
      campus: 'Leicester Campus',
      title: 'FdA Early Childhood Studies',
      duration: '2 Years',
      startDate: 'September 2026',
      icon: Users,
      color: 'from-rose-500 to-pink-600',
      shadow: 'shadow-rose-500/20',
      schedules: [
        {
          label: 'Timetable',
          campus: 'Monday & Tuesday 6:00pm - 9:00pm + Saturday 10:00am - 5:00pm (Campus)',
          online: null
        }
      ],
      tags: ['FdA Degree', 'Early Childhood', 'Education']
    },
    {
      id: 'cecos-4',
      provider: 'CECOS',
      campus: 'Leicester Campus',
      title: 'FdSc Leadership Principles in Health and Social Care',
      duration: '2 Years',
      startDate: 'September 2026',
      icon: Shield,
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/20',
      schedules: [
        {
          label: 'Timetable',
          campus: 'Thursday on campus',
          online: 'Friday online, 10:00am - 5:00pm'
        }
      ],
      tags: ['FdSc Degree', 'Health & Social Care', 'Leadership']
    },
    {
      id: 'apex-1',
      provider: 'Apex College',
      campus: 'Nottingham & Leicester',
      title: 'HND Business Management',
      duration: '2 Years',
      startDate: '2026 Intake',
      icon: Target,
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/20',
      schedules: [
        {
          label: 'Timetable',
          campus: 'Flexible schedule across Nottingham & Leicester campuses',
          online: 'Timetable confirmed upon enrollment'
        }
      ],
      tags: ['HND Pearson', 'Nottingham & Leicester', 'Business']
    },
  ]

  const testimonials = [
    { name: 'Sarah Chen', role: 'Software Engineer at Google', avatar: '/avatar-1.png', text: 'CoursePro completely transformed my career. The instructors are world-class and the curriculum is incredibly relevant to what companies are looking for today.', rating: 5 },
    { name: 'James Martinez', role: 'Data Scientist at Meta', avatar: '/avatar-2.png', text: 'The Data Science program exceeded every expectation. Within 3 months of completing the course, I landed my dream role. Absolutely worth every penny.', rating: 5 },
    { name: 'Alex Thompson', role: 'CTO at TechStart', avatar: '/avatar-3.png', text: 'As someone who hires developers daily, I can confidently say CoursePro graduates stand out. The practical training approach makes all the difference.', rating: 5 },
  ]

  const logos = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Spotify', 'Stripe']

  return (
    <main className="min-h-screen bg-[#f8fafc] relative text-[#0f172a]">

      <div className="relative z-10">
        <Navbar />
        <AnimatedBanner message="🎓 Enroll now and start your learning journey! Limited seats available for Q3 2026." />

        {/* ════════════════════════════════════════
            HERO
            ════════════════════════════════════════ */}
        <section className="relative min-h-[95vh] flex items-center overflow-hidden aurora-bg">
          <div className="absolute inset-0 grid-pattern" />

          <motion.div
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
          >
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              {/* Left — Text */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full mb-10"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase">Now Enrolling — Class of 2026</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.05] mb-8 tracking-tight"
                >
                  <span className="text-slate-900">Start Your</span>
                  <br />
                  <span className="gradient-text">Career</span>
                  <br />
                  <span className="text-slate-900">Today.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.55 }}
                  className="text-lg text-slate-600 mb-12 max-w-lg leading-relaxed"
                >
                  Transform your career with world-class courses taught by industry veterans. Practical projects, lifetime mentorship, and a global community of ambitious professionals.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.65 }}
                  className="flex flex-wrap gap-4 mb-14"
                >
                  <button
                    onClick={() => setIsRegistrationOpen(true)}
                    className="btn-primary text-base flex items-center gap-3 group"
                    id="hero-register-btn"
                  >
                    Enroll Now
                    <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                  </button>
                  <button onClick={() => setIsScheduleOpen(true)} className="btn-secondary text-base flex items-center gap-3 group">
                    <Calendar size={16} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                    Schedule Meeting
                  </button>
                </motion.div>

                {/* Social Proof */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.8 }}
                  className="flex items-center gap-5"
                >
                  <div className="flex -space-x-3">
                    {['/avatar-1.png', '/avatar-2.png', '/avatar-3.png'].map((src, i) => (
                      <div key={i} className="relative w-11 h-11 rounded-full border-2 border-white overflow-hidden">
                        <Image src={src} alt="Student" fill className="object-cover" />
                      </div>
                    ))}
                    <div className="w-11 h-11 rounded-full border-2 border-white bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                      +15K
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                      ))}
                      <span className="text-xs text-slate-500 ml-1.5 font-semibold">4.9/5</span>
                    </div>
                    <p className="text-xs text-slate-500">from <span className="text-slate-600 font-semibold">15,000+</span> verified reviews</p>
                  </div>
                </motion.div>
              </div>

              {/* Right — 3D Interactive WebGL Hero */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, rotateY: -10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative hidden lg:block"
              >
                <div className="relative perspective-container">
                  <div className="absolute -inset-10 bg-gradient-to-br from-indigo-500/15 via-transparent to-cyan-500/15 blur-3xl rounded-full" />

                  <div className="relative rounded-3xl overflow-hidden animated-border float-3d" style={{ transformStyle: 'preserve-3d' }}>
                    <div className="glass-card-static p-4">
                      <ThreeCanvas />
                    </div>
                  </div>

                  {/* Floating Cards */}
                  <motion.div
                    animate={{ y: [-12, 12, -12] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -left-8 top-[20%] glass-card-static p-4 !rounded-2xl shadow-xl shadow-indigo-500/10 glow-purple"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <Users size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[0.65rem] text-slate-500 font-semibold uppercase tracking-wider">Active Students</p>
                        <p className="text-xl font-bold text-slate-900">15,234</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [12, -12, 12] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                    className="absolute -right-6 bottom-[25%] glass-card-static p-4 !rounded-2xl shadow-xl shadow-cyan-500/10 glow-cyan"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <Award size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[0.65rem] text-slate-500 font-semibold uppercase tracking-wider">Success Rate</p>
                        <p className="text-xl font-bold text-slate-900">98.7%</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════
            TRUSTED BY — LOGO MARQUEE
            ════════════════════════════════════════ */}
        <section className="relative py-12 border-y border-slate-200 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f8fafc] via-transparent to-[#f8fafc] z-10 pointer-events-none" />
          <div className="flex items-center">
            <div className="marquee-track flex items-center gap-16 whitespace-nowrap">
              {[...logos, ...logos].map((logo, i) => (
                <span key={i} className="text-lg font-bold text-slate-400 tracking-widest uppercase select-none">{logo}</span>
              ))}
            </div>
          </div>
          <p className="text-center text-[0.65rem] text-slate-500 uppercase tracking-[0.3em] font-medium mt-6">Our graduates work at top companies worldwide</p>
        </section>

        {/* ════════════════════════════════════════
            STATS
            ════════════════════════════════════════ */}
        <section className="relative py-24">
          <div className="section-divider mb-24" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
              {stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.6 }}
                    className="text-center group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-slate-200 flex items-center justify-center mx-auto mb-5 group-hover:border-indigo-500/20 transition-colors">
                      <Icon size={22} className="text-indigo-500" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        <AchievementsSection />

        {/* ════════════════════════════════════════
            COURSES
            ════════════════════════════════════════ */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative particle-bg">
          <div className="relative z-10 max-w-7xl mx-auto">
            <SectionHeader
              badge="2026 Intake"
              badgeIcon={BookOpen}
              title="World-Class"
              highlight="Courses"
              subtitle="Choose from our accredited programs across Leicester & Nottingham campuses with flexible campus, evening, and online schedules."
            />

            {/* Provider Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
              {[
                { id: 'All', label: 'All Courses' },
                { id: 'SIRM', label: 'SIRM - Leicester' },
                { id: 'CECOS', label: 'CECOS - Leicester' },
                { id: 'Apex College', label: 'Apex College' },
              ].map((p) => {
                const count = p.id === 'All' ? courseCards.length : courseCards.filter(c => c.provider === p.id).length
                const active = selectedProvider === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProvider(p.id)}
                    className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                      active
                        ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-500/25 scale-105'
                        : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/90 hover:border-sky-300 hover:text-sky-600 shadow-2xs'
                    }`}
                  >
                    {p.label} <span className={`ml-1.5 text-xs px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
                  </button>
                )
              })}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 perspective-container">
              {courseCards
                .filter((course) => selectedProvider === 'All' || course.provider === selectedProvider)
                .map((course, i) => {
                  const Icon = course.icon
                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className="glass-card p-6 sm:p-7 flex flex-col justify-between group hover:border-sky-500/30 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-sky-200/40 relative"
                    >
                      <div>
                        {/* Header: Provider Badge & Duration */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-700 border border-sky-500/20">
                            <Building size={12} className="text-sky-600" />
                            {course.provider} • {course.campus}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                            <Clock size={11} className="text-emerald-600" />
                            {course.duration}
                          </span>
                        </div>

                        {/* Title & Icon Header */}
                        <div className="flex items-start gap-3.5 mb-3">
                          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center shrink-0 shadow-md ${course.shadow} group-hover:scale-110 transition-transform duration-300`}>
                            <Icon size={20} className="text-white" />
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-sky-600 transition-colors">
                            {course.title}
                          </h3>
                        </div>

                        {/* Start Date / Intake */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 px-1">
                          <Calendar size={13} className="text-sky-500" />
                          <span>Intake / Start Date: <strong className="text-slate-800 font-semibold">{course.startDate}</strong></span>
                        </div>

                        {/* Schedule Details Box */}
                        <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-100 mb-5 space-y-2">
                          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                            <Layers size={12} className="text-sky-600" />
                            Schedule & Timetable Options
                          </div>
                          {course.schedules.map((sch, sIdx) => (
                            <div key={sIdx} className="text-xs bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs space-y-1">
                              <div className="font-bold text-sky-700 text-[11px] uppercase tracking-wide flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                {sch.label}
                              </div>
                              {sch.campus && (
                                <div className="flex items-start gap-1.5 text-slate-600 pl-2.5">
                                  <span className="font-semibold text-slate-700 shrink-0">Campus:</span>
                                  <span className="leading-tight">{sch.campus}</span>
                                </div>
                              )}
                              {sch.online && (
                                <div className="flex items-start gap-1.5 text-slate-600 pl-2.5">
                                  <span className="font-semibold text-slate-700 shrink-0">Online:</span>
                                  <span className="leading-tight">{sch.online}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {course.tags.map((tag) => (
                            <span key={tag} className="tag-pill text-[11px]">{tag}</span>
                          ))}
                        </div>
                      </div>

                      {/* Card Action Footer */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          2026 Intake Open
                        </span>
                        <button
                          onClick={() => setIsRegistrationOpen(true)}
                          className="btn-primary py-2 px-4 text-xs inline-flex items-center gap-1.5 font-bold shadow-md hover:scale-105 cursor-pointer"
                        >
                          Enroll Now
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-14"
            >
              <button
                onClick={() => setIsDirectoryOpen(true)}
                className="btn-secondary text-sm inline-flex items-center gap-2.5 group cursor-pointer shadow-sm hover:shadow-md py-3.5 px-7"
              >
                <MapPin size={16} className="text-sky-600 group-hover:scale-110 transition-transform" />
                View All Programs & Cities
                <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            GALLERY
            ════════════════════════════════════════ */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 mesh-gradient opacity-40" />
          <div className="relative z-10 max-w-6xl mx-auto">
            <SectionHeader
              badge="Campus Life"
              badgeIcon={Award}
              title="Our"
              highlight="Gallery"
              subtitle="Get a glimpse of our modern facilities and vibrant learning community."
            />
            <GalleryCarousel
              mainImage="/gallery/image2.png"
              groupImages={['/gallery/image1.jpg', '/gallery/image3.jpg', '/gallery/image4.png', '/gallery-classroom.png', '/about-scene.png']}
            />
          </div>
        </section>

        {/* ════════════════════════════════════════
            FEATURES — 6 CARDS
            ════════════════════════════════════════ */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative aurora-bg">
          <div className="relative z-10 max-w-7xl mx-auto">
            <SectionHeader
              badge="Our Expertise"
              badgeIcon={Sparkles}
              title="Why Students Choose"
              highlight="Us"
              subtitle="We guide you to the right courses and institutions for your academic success."
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-container">
              {features.map((f, i) => {
                const Icon = f.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                    className="glass-card p-8 group card-3d"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-xl ${f.shadow} group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{f.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{f.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            TESTIMONIALS
            ════════════════════════════════════════ */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative">
          <div className="relative z-10 max-w-7xl mx-auto">
            <SectionHeader
              badge="Testimonials"
              badgeIcon={Quote}
              title="What Our Students"
              highlight="Say"
              subtitle="Don't just take our word for it. Hear from graduates who transformed their careers."
            />

            <div className="grid md:grid-cols-3 gap-8 perspective-container">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  className="glass-card p-8 card-3d group relative"
                >
                  {/* Quote mark */}
                  <div className="absolute top-6 right-6 text-purple-500/10 group-hover:text-purple-500/20 transition-colors">
                    <Quote size={48} />
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-slate-700 text-sm leading-relaxed mb-8 relative z-10">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200">
                      <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            CTA
            ════════════════════════════════════════ */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient-intense" />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full mb-10 text-xs text-indigo-600 font-bold tracking-widest uppercase">
                <Globe size={13} />
                Join 15,000+ Professionals
              </span>

              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight tracking-tight">
                Ready to
                <br />
                <span className="gradient-text">Transform</span> Your Career?
              </h2>
              <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Join the next generation of tech professionals. Your future starts with a single step.
              </p>

              <div className="flex flex-wrap justify-center gap-5">
                <button
                  onClick={() => setIsRegistrationOpen(true)}
                  className="btn-primary text-lg flex items-center gap-3 group !py-4 !px-10"
                  id="cta-register-btn"
                >
                  Register Today
                  <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
                <Link href="/contact" className="btn-secondary text-lg flex items-center gap-3 !py-4 !px-10">
                  <Mail size={18} />
                  Contact Us
                </Link>
              </div>

              {/* Trust */}
              <p className="mt-10 text-xs text-slate-500">
                ✦ No credit card required · 30-day money-back guarantee · Cancel anytime
              </p>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
      
      <ScheduleMeetingModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />
      <RegistrationModal isOpen={isRegistrationOpen} onClose={() => setIsRegistrationOpen(false)} courses={courses} />
      <CourseDirectoryModal isOpen={isDirectoryOpen} onClose={() => setIsDirectoryOpen(false)} />
    </main>
  )
}
