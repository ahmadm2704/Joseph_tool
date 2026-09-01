'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, MapPin, Building, Calendar, Clock, BookOpen, ArrowRight, Layers, CheckCircle2, GraduationCap, Globe } from 'lucide-react'
import { useStore, Course as StoreCourse } from '@/lib/store'

interface CourseDirectoryItem {
  id: string
  title: string
  provider: string
  duration: string
  startDate: string
  delivery: string
  cities: string[]
  tags: string[]
  schedules?: {
    label: string
    campus?: string
    online?: string | null
    time?: string
  }[]
  source: 'intake2026' | 'database'
}

interface CourseDirectoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectCourse?: (courseTitle: string) => void
}

const staticIntakeCourses: CourseDirectoryItem[] = [
  {
    id: 'intake-sirm-1',
    title: 'Business and Tourism with Foundation Year',
    provider: 'SIRM',
    duration: '4 Years',
    startDate: '21 September 2026',
    delivery: 'Campus & Online',
    cities: ['Leicester'],
    tags: ['Foundation Year', 'Tourism & Hospitality', 'Business'],
    schedules: [
      { label: 'Option 1', campus: 'Thursday, 9:30am - 4:30pm', online: 'Tue & Wed evenings, 6:00pm - 9:00pm' },
      { label: 'Option 2', campus: 'Tuesday, 9:30am - 4:30pm', online: 'Monday, 9:30am - 4:30pm' },
    ],
    source: 'intake2026',
  },
  {
    id: 'intake-sirm-2',
    title: 'HND Business',
    provider: 'SIRM',
    duration: '2 Years',
    startDate: '5 October 2026',
    delivery: 'Campus & Online',
    cities: ['Leicester', 'Nottingham'],
    tags: ['HND Diploma', 'Business Administration'],
    schedules: [
      { label: 'Timetable', campus: 'Thursday, 9:30am - 4:30pm', online: 'Tuesday, 9:30am - 4:30pm' },
    ],
    source: 'intake2026',
  },
  {
    id: 'intake-sirm-3',
    title: 'Level 4 Data Analyst NCFE',
    provider: 'SIRM',
    duration: '2 Years',
    startDate: '1 September 2026',
    delivery: 'Campus & Online',
    cities: ['Leicester'],
    tags: ['Level 4 NCFE', 'Data Analytics', 'Tech & AI'],
    schedules: [
      { label: 'Timetable', campus: 'Tuesday, 9:30am - 4:30pm', online: 'Friday, 9:30am - 4:30pm' },
    ],
    source: 'intake2026',
  },
  {
    id: 'intake-sirm-4',
    title: 'NCC Business',
    provider: 'SIRM',
    duration: '1 Year',
    startDate: '1 September 2026',
    delivery: 'Campus & Evening Online',
    cities: ['Leicester'],
    tags: ['NCC Education', '1-Year Fast Track'],
    schedules: [
      { label: 'Timetable', campus: 'Tuesday, 9:30am - 4:30pm', online: 'Wed & Thu evenings, 6:00pm - 9:00pm' },
    ],
    source: 'intake2026',
  },
  {
    id: 'intake-cecos-1',
    title: 'Business Management - BSc BMF',
    provider: 'CECOS',
    duration: '4 Years',
    startDate: 'September 2026',
    delivery: 'Campus & Weekend/Evening',
    cities: ['Leicester'],
    tags: ['BSc (Hons)', 'Management', 'Undergraduate'],
    schedules: [
      { label: 'Option 1', time: 'Monday & Tuesday, 10:00am - 5:00pm (Campus)' },
      { label: 'Option 2', time: 'Monday & Tuesday 6:00pm - 9:00pm + Friday 10:00am - 5:00pm' },
    ],
    source: 'intake2026',
  },
  {
    id: 'intake-cecos-2',
    title: 'Foundation Degree Business and Management',
    provider: 'CECOS',
    duration: '2 Years',
    startDate: 'September 2026',
    delivery: 'Blended Learning',
    cities: ['Leicester'],
    tags: ['Foundation Degree', 'Management'],
    schedules: [
      { label: 'Option 1', campus: 'Thursday on campus, 10:00am - 5:00pm', online: 'Friday online, 10:00am - 5:00pm' },
      { label: 'Option 2', campus: 'Monday & Tuesday, 6:00pm - 9:00pm', online: 'Saturday online, 10:00am - 5:00pm' },
    ],
    source: 'intake2026',
  },
  {
    id: 'intake-cecos-3',
    title: 'FdA Early Childhood Studies',
    provider: 'CECOS',
    duration: '2 Years',
    startDate: 'September 2026',
    delivery: 'On-Campus & Weekend',
    cities: ['Leicester'],
    tags: ['FdA Degree', 'Early Childhood', 'Education'],
    schedules: [
      { label: 'Timetable', time: 'Monday & Tuesday 6:00pm - 9:00pm + Saturday 10:00am - 5:00pm (Campus)' },
    ],
    source: 'intake2026',
  },
  {
    id: 'intake-cecos-4',
    title: 'FdSc Leadership Principles in Health and Social Care',
    provider: 'CECOS',
    duration: '2 Years',
    startDate: 'September 2026',
    delivery: 'Blended (Campus & Online)',
    cities: ['Leicester'],
    tags: ['FdSc Degree', 'Health & Social Care', 'Leadership'],
    schedules: [
      { label: 'Timetable', campus: 'Thursday on campus', online: 'Friday online, 10:00am - 5:00pm' },
    ],
    source: 'intake2026',
  },
  {
    id: 'intake-apex-1',
    title: 'HND Business Management',
    provider: 'Apex College',
    duration: '2 Years',
    startDate: '2026 Intake',
    delivery: 'Flexible Campus Schedules',
    cities: ['Nottingham', 'Leicester'],
    tags: ['HND Pearson', 'Nottingham & Leicester'],
    schedules: [
      { label: 'Timetable', time: 'Flexible schedules across Nottingham & Leicester campuses' },
    ],
    source: 'intake2026',
  },
]

export default function CourseDirectoryModal({ isOpen, onClose, onSelectCourse }: CourseDirectoryModalProps) {
  const { courses: dbCourses } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [selectedProvider, setSelectedProvider] = useState('All Providers')

  // Merge static 2026 intake courses with courses from the database safely
  const allCourses = useMemo(() => {
    const combined: CourseDirectoryItem[] = [...staticIntakeCourses]
    const existingTitles = new Set(staticIntakeCourses.map(c => c.title.toLowerCase().trim()))

    if (dbCourses && dbCourses.length > 0) {
      dbCourses.forEach(dbC => {
        const titleNormalized = dbC.name.toLowerCase().trim()
        if (!existingTitles.has(titleNormalized)) {
          const cityNames = dbC.cities && dbC.cities.length > 0
            ? dbC.cities.map(ct => ct.name)
            : ['Leicester', 'Nottingham', 'Birmingham']

          combined.push({
            id: dbC.id,
            title: dbC.name,
            provider: 'Accredited Partner',
            duration: dbC.duration || 'Flexible',
            startDate: dbC.deadline || '2026 Intake',
            delivery: dbC.delivery || 'Blended',
            cities: cityNames,
            tags: [dbC.delivery || 'Blended', dbC.requirements || 'Standard Entry'],
            source: 'database',
          })
          existingTitles.add(titleNormalized)
        }
      })
    }
    return combined
  }, [dbCourses])

  // Extract all unique cities
  const availableCities = useMemo(() => {
    const set = new Set<string>()
    allCourses.forEach(c => c.cities.forEach(city => set.add(city)))
    return ['All Cities', ...Array.from(set).sort()]
  }, [allCourses])

  // Extract all unique providers
  const availableProviders = useMemo(() => {
    const set = new Set<string>()
    allCourses.forEach(c => set.add(c.provider))
    return ['All Providers', ...Array.from(set)]
  }, [allCourses])

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return allCourses.filter(c => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.cities.some(ct => ct.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCity =
        selectedCity === 'All Cities' || c.cities.includes(selectedCity)

      const matchesProvider =
        selectedProvider === 'All Providers' || c.provider === selectedProvider

      return matchesSearch && matchesCity && matchesProvider
    })
  }, [allCourses, searchQuery, selectedCity, selectedProvider])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-semibold uppercase tracking-wider mb-3">
              <MapPin size={13} className="text-cyan-300" />
              Course Directory By City
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Available Courses & Campuses
            </h2>
            <p className="text-sky-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Explore which accredited programs and flexible schedules are currently being offered in your city for the 2026 intake.
            </p>
          </div>

          {/* Search & Filters Bar */}
          <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 shrink-0 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search course title, qualification, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* City Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
                <MapPin size={13} className="text-sky-600" /> City:
              </span>
              {availableCities.map((city) => {
                const active = selectedCity === city
                const count = city === 'All Cities' ? allCourses.length : allCourses.filter(c => c.cities.includes(city)).length
                return (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-sky-600 text-white shadow-sm scale-105'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300 hover:text-sky-600'
                    }`}
                  >
                    {city} <span className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Courses List / Results */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-[#f8fafc]">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-4">
                  <Search size={26} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">No courses found</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">
                  Try adjusting your search query or switching to another city filter.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCity('All Cities'); setSelectedProvider('All Providers'); }}
                  className="px-4 py-2 rounded-full bg-sky-600 text-white text-xs font-bold hover:bg-sky-700"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                          <Building size={11} className="text-sky-600" />
                          {course.provider}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Clock size={11} className="text-emerald-600" />
                          {course.duration}
                        </span>
                      </div>

                      {/* Course Title */}
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
                        {course.title}
                      </h4>

                      {/* Cities Offered Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        <span className="text-[11px] font-semibold text-slate-400">Available in:</span>
                        {course.cities.map((ct) => (
                          <span
                            key={ct}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            <MapPin size={10} className="text-rose-500" />
                            {ct}
                          </span>
                        ))}
                      </div>

                      {/* Schedule / Delivery Details */}
                      {course.schedules && course.schedules.length > 0 && (
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-3 space-y-1.5 text-xs">
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <Layers size={11} className="text-sky-600" />
                            Timetable & Schedule
                          </div>
                          {course.schedules.map((sch, sIdx) => (
                            <div key={sIdx} className="bg-white p-2 rounded-lg border border-slate-100 text-slate-600 space-y-0.5">
                              <div className="font-semibold text-sky-700 text-[11px]">{sch.label}</div>
                              {sch.campus && <div><span className="font-medium text-slate-700">Campus:</span> {sch.campus}</div>}
                              {sch.online && <div><span className="font-medium text-slate-700">Online:</span> {sch.online}</div>}
                              {sch.time && <div>{sch.time}</div>}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {course.tags.map((t) => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                        <Calendar size={11} className="text-sky-500" />
                        {course.startDate}
                      </span>
                      <button
                        onClick={() => {
                          onClose()
                          if (onSelectCourse) {
                            onSelectCourse(course.title)
                          } else {
                            window.dispatchEvent(new CustomEvent('open-registration'))
                          }
                        }}
                        className="btn-primary py-2 px-3.5 text-xs inline-flex items-center gap-1.5 font-bold cursor-pointer"
                      >
                        Enroll Now
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-slate-500">
              Showing <strong className="text-slate-800">{filteredCourses.length}</strong> available programs across <strong className="text-slate-800">{availableCities.length - 1}</strong> cities.
            </div>
            <button
              onClick={() => {
                onClose()
                window.dispatchEvent(new CustomEvent('open-registration'))
              }}
              className="btn-primary py-2.5 px-5 text-xs inline-flex items-center gap-2 font-bold cursor-pointer"
            >
              Start General Application
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
