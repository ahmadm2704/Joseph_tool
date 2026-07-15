'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Code, Smartphone, BrainCircuit, Cloud, Shield, BarChart3, ChevronDown, Users, Clock, Star, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import Navbar from '@/components/navbar'
import ParticleField from '@/components/particle-field'
import SpotlightCursor from '@/components/spotlight-cursor'
import Footer from '@/components/footer'

export default function Services() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const services = [
    { id: '1', icon: Code, title: 'Web Development', description: 'Master modern web technologies and frameworks', details: 'Learn HTML, CSS, JavaScript, React, Node.js, and more. Build full-stack applications from scratch. Includes real projects and portfolio building.', price: '$499', duration: '12 weeks', students: '3,200+', rating: '4.9', color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20', technologies: ['React', 'Node.js', 'TypeScript', 'Next.js'], features: ['15+ Projects', 'Live Mentoring', 'Certificate'] },
    { id: '2', icon: Smartphone, title: 'Mobile App Development', description: 'Create native iOS and Android applications', details: 'Learn Swift for iOS and Kotlin for Android. Build production-ready apps. Covers user interface design, APIs, and deployment.', price: '$599', duration: '14 weeks', students: '2,800+', rating: '4.8', color: 'from-purple-500 to-pink-500', shadow: 'shadow-purple-500/20', technologies: ['Swift', 'Kotlin', 'React Native', 'Flutter'], features: ['12+ Apps', 'App Store Deploy', 'Portfolio'] },
    { id: '3', icon: BrainCircuit, title: 'Data Science & AI', description: 'Master data analysis, machine learning, and AI', details: 'Learn Python, TensorFlow, and data visualization. Build predictive models and work with real datasets. Covers ML algorithms and deep learning.', price: '$699', duration: '16 weeks', students: '4,100+', rating: '4.9', color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20', technologies: ['Python', 'TensorFlow', 'PyTorch', 'Pandas'], features: ['20+ Models', 'Real Datasets', 'Research Paper'] },
    { id: '4', icon: Cloud, title: 'Cloud Computing', description: 'AWS, Azure, and Google Cloud expertise', details: 'Deploy and manage applications in the cloud. Learn infrastructure as code, serverless computing, and DevOps practices.', price: '$549', duration: '10 weeks', students: '1,900+', rating: '4.7', color: 'from-orange-500 to-amber-500', shadow: 'shadow-orange-500/20', technologies: ['AWS', 'Azure', 'Docker', 'Kubernetes'], features: ['Cloud Labs', 'AWS Cert Prep', 'DevOps'] },
    { id: '5', icon: Shield, title: 'Cybersecurity', description: 'Secure systems and protect against threats', details: 'Network security, penetration testing, and ethical hacking. Learn to protect systems and secure data. Includes hands-on labs.', price: '$649', duration: '12 weeks', students: '2,300+', rating: '4.8', color: 'from-red-500 to-rose-500', shadow: 'shadow-red-500/20', technologies: ['Kali Linux', 'Wireshark', 'Metasploit', 'Burp Suite'], features: ['CTF Challenges', 'Ethical Hacking', 'Cert Prep'] },
    { id: '6', icon: BarChart3, title: 'Business Analytics', description: 'Drive decisions with data insights', details: 'Excel, SQL, Tableau, and Python for analytics. Learn to analyze data and create meaningful visualizations for business intelligence.', price: '$449', duration: '8 weeks', students: '1,700+', rating: '4.7', color: 'from-indigo-500 to-purple-500', shadow: 'shadow-indigo-500/20', technologies: ['SQL', 'Tableau', 'Power BI', 'Excel'], features: ['Case Studies', 'Dashboards', 'Reports'] },
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
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <span className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full mb-8 text-xs text-purple-300 font-semibold tracking-widest uppercase"><Sparkles size={13} /> Programs</span>
                <h1 className="text-5xl md:text-6xl lg:text-[4.2rem] font-bold leading-[1.05] mb-8 tracking-tight">
                  <span className="text-white">Our Premium</span><br />
                  <span className="gradient-text">Training</span><br />
                  <span className="text-white">Programs.</span>
                </h1>
                <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
                  Comprehensive programs designed by industry experts, built to meet today&apos;s demands and launch your career to extraordinary heights.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="relative hidden lg:block">
                <div className="absolute -inset-10 bg-gradient-to-br from-purple-600/15 via-transparent to-cyan-600/10 blur-3xl rounded-full" />
                <div className="relative rounded-3xl overflow-hidden animated-border float-3d">
                  <div className="glass-card-static p-2">
                    <Image src="/services-grid.png" alt="Holographic icons" width={600} height={450} className="w-full h-auto rounded-2xl" priority />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-container">
              {services.map((s, i) => {
                const Icon = s.icon
                const isExpanded = expandedId === s.id
                return (
                  <motion.div
                    key={s.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}
                    layout
                    className={`glass-card overflow-hidden group cursor-pointer card-3d ${isExpanded ? '!border-purple-500/20 glow-purple' : ''}`}
                    onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  >
                    <div className="p-7">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-xl ${s.shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                          <Icon size={24} className="text-white" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Star size={13} className="text-amber-400 fill-amber-400" />
                          <span className="text-amber-400 font-bold text-sm">{s.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{s.title}</h3>
                      <p className="text-sm text-gray-500 mb-5 leading-relaxed">{s.description}</p>

                      <div className="flex flex-wrap gap-2 mb-5">
                        {s.technologies.map((t) => (<span key={t} className="tag-pill">{t}</span>))}
                      </div>

                      <div className="flex items-center justify-between pt-5 border-t border-white/5">
                        <span className="text-3xl font-bold gradient-text">{s.price}</span>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1"><Clock size={11} />{s.duration}</span>
                          <span className="flex items-center gap-1"><Users size={11} />{s.students}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-center">
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                          <ChevronDown size={16} className="text-gray-600" />
                        </motion.div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                          <div className="px-7 pb-7 pt-3 border-t border-white/5">
                            <p className="text-gray-400 text-sm leading-relaxed mb-5">{s.details}</p>
                            <div className="flex flex-wrap gap-3 mb-6">
                              {s.features.map((f) => (
                                <span key={f} className="flex items-center gap-1.5 text-xs text-green-400">
                                  <CheckCircle2 size={12} /> {f}
                                </span>
                              ))}
                            </div>
                            <button className="w-full btn-primary text-sm flex items-center justify-center gap-2 group/btn">
                              Enroll Now <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient-intense" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight">
                Not sure which <span className="gradient-text">course</span> is right?
              </h2>
              <p className="text-lg text-gray-400 mb-12 leading-relaxed">Schedule a free 1-on-1 consultation with our career advisors. We&apos;ll help you find the perfect program.</p>
              <button className="btn-primary text-lg flex items-center gap-3 mx-auto group !py-4 !px-10">
                Book Free Consultation <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
              <p className="mt-6 text-xs text-gray-600">✦ No commitment required · Takes 15 minutes</p>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
