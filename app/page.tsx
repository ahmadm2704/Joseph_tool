'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Sparkles, GraduationCap, Users, Award, Globe, ArrowRight, Code, Smartphone, BrainCircuit, Cloud, Shield, BarChart3, Star, Zap, Target, Mail, Quote, ChevronRight, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import AnimatedBanner from '@/components/animated-banner'
import GalleryCarousel from '@/components/gallery-carousel'
import RegistrationModal from '@/components/registration-modal'
import ParticleField from '@/components/particle-field'
import SpotlightCursor from '@/components/spotlight-cursor'
import Footer from '@/components/footer'
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
      <span className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full mb-6 text-xs text-purple-300 font-semibold tracking-widest uppercase">
        <BadgeIcon size={13} />
        {badge}
      </span>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight leading-tight">
        {title} <span className="gradient-text">{highlight}</span>
      </h2>
      <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">{subtitle}</p>
    </motion.div>
  )
}

export default function Home() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { courses } = useStore()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

  useEffect(() => {
    setMounted(true)
    if (courses.length === 0) {
      useStore.setState({
        courses: [
          { id: '1', name: 'Web Development', description: 'Learn modern web technologies', cities: [{ id: '1', name: 'New York' }, { id: '2', name: 'Los Angeles' }], days: [{ id: '1', name: 'Monday', date: '2024-02-01' }, { id: '2', name: 'Wednesday', date: '2024-02-03' }] },
          { id: '2', name: 'Mobile App Dev', description: 'Build iOS and Android apps', cities: [{ id: '2', name: 'Los Angeles' }, { id: '3', name: 'Chicago' }], days: [{ id: '2', name: 'Wednesday', date: '2024-02-03' }, { id: '3', name: 'Friday', date: '2024-02-05' }] },
          { id: '3', name: 'Data Science', description: 'Master data analysis and ML', cities: [{ id: '1', name: 'New York' }, { id: '3', name: 'Chicago' }], days: [{ id: '1', name: 'Monday', date: '2024-02-01' }, { id: '3', name: 'Friday', date: '2024-02-05' }] },
        ]
      })
    }
    const handleOpen = () => setIsRegistrationOpen(true)
    window.addEventListener('open-registration', handleOpen)
    return () => window.removeEventListener('open-registration', handleOpen)
  }, [])

  if (!mounted) return null

  const features = [
    { icon: GraduationCap, title: 'Expert Instructors', description: 'Learn from seasoned professionals with 10+ years of hands-on industry experience.', color: 'from-violet-600 to-purple-700', shadow: 'shadow-violet-500/25' },
    { icon: Target, title: 'Flexible Schedule', description: 'Study at your own pace with schedules designed for busy professionals.', color: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/25' },
    { icon: Zap, title: 'Lifetime Access', description: 'Get unlimited mentorship, course updates, and career guidance — forever.', color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/25' },
    { icon: Globe, title: 'Global Community', description: 'Connect with 15,000+ ambitious learners and professionals worldwide.', color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/25' },
    { icon: Award, title: 'Certified Programs', description: 'Earn industry-recognized certifications that accelerate your career growth.', color: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/25' },
    { icon: Shield, title: 'Money-Back Guarantee', description: 'Not satisfied? Get a full refund within the first 30 days — no questions asked.', color: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-500/25' },
  ]

  const stats = [
    { value: 15000, suffix: '+', label: 'Students Enrolled', icon: Users },
    { value: 98, suffix: '%', label: 'Success Rate', icon: Award },
    { value: 250, suffix: '+', label: 'Expert Mentors', icon: GraduationCap },
    { value: 50, suffix: '+', label: 'Countries', icon: Globe },
  ]

  const courseCards = [
    { icon: Code, title: 'Web Development', price: '$499', color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20', students: '3.2K', rating: '4.9', tags: ['React', 'Next.js', 'Node'] },
    { icon: Smartphone, title: 'Mobile App Dev', price: '$599', color: 'from-purple-500 to-pink-500', shadow: 'shadow-purple-500/20', students: '2.8K', rating: '4.8', tags: ['Flutter', 'React Native'] },
    { icon: BrainCircuit, title: 'Data Science & AI', price: '$699', color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20', students: '4.1K', rating: '4.9', tags: ['Python', 'TensorFlow'] },
    { icon: Cloud, title: 'Cloud Computing', price: '$549', color: 'from-orange-500 to-amber-500', shadow: 'shadow-orange-500/20', students: '1.9K', rating: '4.7', tags: ['AWS', 'Docker'] },
    { icon: Shield, title: 'Cybersecurity', price: '$649', color: 'from-red-500 to-rose-500', shadow: 'shadow-red-500/20', students: '2.3K', rating: '4.8', tags: ['Kali', 'Pentesting'] },
    { icon: BarChart3, title: 'Business Analytics', price: '$449', color: 'from-indigo-500 to-purple-500', shadow: 'shadow-indigo-500/20', students: '1.7K', rating: '4.7', tags: ['SQL', 'Tableau'] },
  ]

  const testimonials = [
    { name: 'Sarah Chen', role: 'Software Engineer at Google', avatar: '/avatar-1.png', text: 'CoursePro completely transformed my career. The instructors are world-class and the curriculum is incredibly relevant to what companies are looking for today.', rating: 5 },
    { name: 'James Martinez', role: 'Data Scientist at Meta', avatar: '/avatar-2.png', text: 'The Data Science program exceeded every expectation. Within 3 months of completing the course, I landed my dream role. Absolutely worth every penny.', rating: 5 },
    { name: 'Alex Thompson', role: 'CTO at TechStart', avatar: '/avatar-3.png', text: 'As someone who hires developers daily, I can confidently say CoursePro graduates stand out. The practical training approach makes all the difference.', rating: 5 },
  ]

  const logos = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Spotify', 'Stripe']

  return (
    <main className="min-h-screen bg-[#050510] relative">
      <ParticleField />
      <SpotlightCursor />

      <div className="relative z-10">
        <Navbar />
        <AnimatedBanner message="🎓 Enroll now and start your learning journey! Limited seats available for Q3 2024." />

        {/* ════════════════════════════════════════
            HERO
            ════════════════════════════════════════ */}
        <section ref={heroRef} className="relative min-h-[95vh] flex items-center overflow-hidden aurora-bg">
          <div className="absolute inset-0 mesh-gradient-intense" />
          <div className="absolute inset-0 grid-pattern" />

          {/* Morphing Blobs */}
          <FloatingOrb className="absolute top-10 left-[10%] w-[500px] h-[500px] rounded-full bg-purple-600/8 blur-[100px] morphing-blob" delay={0} />
          <FloatingOrb className="absolute bottom-0 right-[5%] w-[600px] h-[600px] rounded-full bg-cyan-600/6 blur-[120px] morphing-blob" delay={3} />
          <FloatingOrb className="absolute top-1/2 left-[50%] w-[400px] h-[400px] rounded-full bg-pink-600/5 blur-[80px] morphing-blob" delay={6} />

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
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-semibold text-gray-300 tracking-widest uppercase">Now Enrolling — Class of 2024</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.05] mb-8 tracking-tight"
                >
                  <span className="text-white">Master Your</span>
                  <br />
                  <span className="gradient-text">Professional</span>
                  <br />
                  <span className="text-white">Craft.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.55 }}
                  className="text-lg text-gray-400 mb-12 max-w-lg leading-relaxed"
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
                    Start Learning
                    <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                  </button>
                  <button className="btn-secondary text-base flex items-center gap-3 group">
                    <Play size={16} className="group-hover:scale-110 transition-transform" />
                    Watch Demo
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
                      <div key={i} className="relative w-11 h-11 rounded-full border-2 border-[#050510] overflow-hidden">
                        <Image src={src} alt="Student" fill className="object-cover" />
                      </div>
                    ))}
                    <div className="w-11 h-11 rounded-full border-2 border-[#050510] bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                      +15K
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                      ))}
                      <span className="text-xs text-gray-500 ml-1.5 font-semibold">4.9/5</span>
                    </div>
                    <p className="text-xs text-gray-600">from <span className="text-gray-400 font-semibold">15,000+</span> verified reviews</p>
                  </div>
                </motion.div>
              </div>

              {/* Right — 3D Hero */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, rotateY: -10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative hidden lg:block"
              >
                <div className="relative perspective-container">
                  {/* Ambient glow behind image */}
                  <div className="absolute -inset-10 bg-gradient-to-br from-purple-600/15 via-transparent to-cyan-600/10 blur-3xl rounded-full" />

                  <div className="relative rounded-3xl overflow-hidden animated-border float-3d" style={{ transformStyle: 'preserve-3d' }}>
                    <div className="glass-card-static p-2">
                      <Image
                        src="/hero-3d.png"
                        alt="3D Crystalline graduation concept"
                        width={560}
                        height={480}
                        className="w-full h-auto rounded-2xl"
                        priority
                      />
                    </div>
                  </div>

                  {/* Floating Cards */}
                  <motion.div
                    animate={{ y: [-12, 12, -12] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -left-8 top-[20%] glass-card-static p-4 !rounded-2xl shadow-2xl shadow-purple-900/20 glow-purple"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                        <Users size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[0.65rem] text-gray-500 font-medium uppercase tracking-wider">Active Students</p>
                        <p className="text-xl font-bold text-white">15,234</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [12, -12, 12] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                    className="absolute -right-6 bottom-[25%] glass-card-static p-4 !rounded-2xl shadow-2xl shadow-cyan-900/20 glow-cyan"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <Award size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[0.65rem] text-gray-500 font-medium uppercase tracking-wider">Success Rate</p>
                        <p className="text-xl font-bold text-white">98.7%</p>
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
        <section className="relative py-12 border-y border-white/[0.03] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#050510] via-transparent to-[#050510] z-10 pointer-events-none" />
          <div className="flex items-center">
            <div className="marquee-track flex items-center gap-16 whitespace-nowrap">
              {[...logos, ...logos].map((logo, i) => (
                <span key={i} className="text-lg font-bold text-gray-700/50 tracking-widest uppercase select-none">{logo}</span>
              ))}
            </div>
          </div>
          <p className="text-center text-[0.65rem] text-gray-700 uppercase tracking-[0.3em] font-medium mt-6">Our graduates work at top companies worldwide</p>
        </section>

        {/* ════════════════════════════════════════
            STATS
            ════════════════════════════════════════ */}
        <section className="relative py-24">
          <div className="section-divider mb-24" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
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
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/5 flex items-center justify-center mx-auto mb-5 group-hover:border-purple-500/20 transition-colors">
                      <Icon size={22} className="text-purple-400" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            COURSES
            ════════════════════════════════════════ */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative particle-bg">
          <div className="relative z-10 max-w-7xl mx-auto">
            <SectionHeader
              badge="Programs"
              badgeIcon={Code}
              title="World-Class"
              highlight="Courses"
              subtitle="Choose from our curated selection of professional programs designed by industry leaders and taught by world-class mentors."
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-container">
              {courseCards.map((course, i) => {
                const Icon = course.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                    className="glass-card p-7 group cursor-pointer card-3d"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center shadow-xl ${course.shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star size={13} className="text-amber-400 fill-amber-400" />
                        <span className="text-amber-400 font-bold text-sm">{course.rating}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">{course.title}</h3>
                    <p className="text-sm text-gray-500 mb-5 leading-relaxed">Master the latest technologies and frameworks with real-world projects and expert mentorship.</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {course.tags.map((tag) => (
                        <span key={tag} className="tag-pill">{tag}</span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-5 border-t border-white/5">
                      <div>
                        <span className="text-3xl font-bold gradient-text">{course.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Users size={12} />
                        <span>{course.students} enrolled</span>
                      </div>
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
              <Link href="/services" className="btn-secondary text-sm inline-flex items-center gap-2 group">
                View All Programs
                <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
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
              mainImage="/gallery-classroom.png"
              groupImages={['/hero-bg.png', '/about-scene.png', '/services-grid.png']}
            />
          </div>
        </section>

        {/* ════════════════════════════════════════
            FEATURES — 6 CARDS
            ════════════════════════════════════════ */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative aurora-bg">
          <div className="relative z-10 max-w-7xl mx-auto">
            <SectionHeader
              badge="Why CoursePro"
              badgeIcon={Sparkles}
              title="Why Students Choose"
              highlight="Us"
              subtitle="We deliver an unparalleled learning experience that sets you apart in the industry."
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
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">{f.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
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
                  <p className="text-gray-300 text-sm leading-relaxed mb-8 relative z-10">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                      <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
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
          <FloatingOrb className="absolute top-0 left-[15%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[100px] morphing-blob" />
          <FloatingOrb className="absolute bottom-0 right-[15%] w-[400px] h-[400px] rounded-full bg-cyan-600/8 blur-[100px] morphing-blob" delay={4} />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full mb-10 text-xs text-purple-300 font-semibold tracking-widest uppercase">
                <Globe size={13} />
                Join 15,000+ Professionals
              </span>

              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
                Ready to
                <br />
                <span className="gradient-text">Transform</span> Your Career?
              </h2>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
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
              <p className="mt-10 text-xs text-gray-600">
                ✦ No credit card required · 30-day money-back guarantee · Cancel anytime
              </p>
            </motion.div>
          </div>
        </section>

        <Footer />

        <RegistrationModal
          isOpen={isRegistrationOpen}
          onClose={() => setIsRegistrationOpen(false)}
          courses={courses}
        />
      </div>
    </main>
  )
}
