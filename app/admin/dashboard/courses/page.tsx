'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin-sidebar'
import { useStore, Course, City, Day } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2, Plus, X, MapPin, Calendar, BookOpen, Edit3,
  Clock, AlertCircle, Wifi, Layers, Save, Sparkles, Search, FileText, CheckCircle2, ShieldCheck
} from 'lucide-react'

type CourseForm = {
  name: string
  description: string
  duration: string
  deadline: string
  delivery: string
  daysSchedule: string
  requirements: string
  cities: { name: string }[]
  days: { name: string; date: string }[]
  requiredDocuments: string[]
  qualificationTypes: string[]
}

const defaultDocsOptions = [
  'Passport',
  'National Insurance Number',
  'Share Code',
  'Proof of Address',
  'Last 3 months payslips',
  'Employer Contract',
  'P60 Document',
  'Work Reference'
]

const defaultQualOptions = [
  'Level 3 Diploma',
  'High School Certificate',
  'CV / Resume',
  'Work Experience Reference',
  'Academic Transcripts',
  'English Proficiency Certificate'
]

const emptyForm: CourseForm = {
  name: '',
  description: '',
  duration: '',
  deadline: '',
  delivery: 'Blended',
  daysSchedule: '',
  requirements: '',
  cities: [{ name: '' }],
  days: [{ name: '', date: '' }],
  requiredDocuments: ['Passport', 'National Insurance Number'],
  qualificationTypes: ['Level 3 Diploma', 'CV / Resume'],
}

const deliveryOptions = ['Blended', 'Online', 'On-Campus', 'Hybrid']
const durationOptions = ['1 Year', '2 Years', '3 Years', '4 Years', '6 Months', '18 Months']

export default function CoursesManagement() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState<CourseForm>(emptyForm)
  const [search, setSearch] = useState('')
  const [customDoc, setCustomDoc] = useState('')
  const [customQual, setCustomQual] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const { courses, addCourse, removeCourse, setCourses } = useStore()

  useEffect(() => {
    const session = localStorage.getItem('adminSession')
    if (!session) router.push('/admin/login')
    else setIsAuthed(true)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.push('/admin/login')
  }

  const openAdd = () => {
    setForm(emptyForm)
    setEditingId(null)
    setFormError('')
    setMode('add')
  }

  const openEdit = (course: Course) => {
    setForm({
      name: course.name || '',
      description: course.description || '',
      duration: course.duration || '',
      deadline: course.deadline || '',
      delivery: course.delivery || 'Blended',
      daysSchedule: course.daysSchedule || '',
      requirements: course.requirements || '',
      cities: course.cities?.length ? course.cities.map(c => ({ name: c.name })) : [{ name: '' }],
      days: course.days?.length ? course.days.map(d => ({ name: d.name, date: d.date })) : [{ name: '', date: '' }],
      requiredDocuments: course.requiredDocuments || ['Passport', 'National Insurance Number'],
      qualificationTypes: course.qualificationTypes || ['Level 3 Diploma', 'CV / Resume'],
    })
    setEditingId(course.id)
    setFormError('')
    setMode('edit')
  }

  const toggleDoc = (doc: string) => {
    const exists = form.requiredDocuments.includes(doc)
    if (exists) {
      setForm({ ...form, requiredDocuments: form.requiredDocuments.filter(d => d !== doc) })
    } else {
      setForm({ ...form, requiredDocuments: [...form.requiredDocuments, doc] })
    }
  }

  const toggleQual = (qual: string) => {
    const exists = form.qualificationTypes.includes(qual)
    if (exists) {
      setForm({ ...form, qualificationTypes: form.qualificationTypes.filter(q => q !== qual) })
    } else {
      setForm({ ...form, qualificationTypes: [...form.qualificationTypes, qual] })
    }
  }

  const addCustomDoc = () => {
    if (customDoc.trim() && !form.requiredDocuments.includes(customDoc.trim())) {
      setForm({ ...form, requiredDocuments: [...form.requiredDocuments, customDoc.trim()] })
      setCustomDoc('')
    }
  }

  const addCustomQual = () => {
    if (customQual.trim() && !form.qualificationTypes.includes(customQual.trim())) {
      setForm({ ...form, qualificationTypes: [...form.qualificationTypes, customQual.trim()] })
      setCustomQual('')
    }
  }

  const handleSave = () => {
    if (!form.name.trim()) {
      setFormError('Course title is required.')
      return
    }

    const validCities: City[] = form.cities
      .filter(c => c.name.trim())
      .map((c, i) => ({ id: `${Date.now()}-c${i}`, name: c.name.trim() }))

    const validDays: Day[] = form.days
      .filter(d => d.name.trim())
      .map((d, i) => ({ id: `${Date.now()}-d${i}`, name: d.name.trim(), date: d.date.trim() || 'Blended' }))

    if (mode === 'edit' && editingId) {
      const updated = courses.map(c => {
        if (c.id === editingId) {
          return {
            ...c,
            name: form.name,
            description: form.description,
            duration: form.duration,
            deadline: form.deadline,
            delivery: form.delivery,
            daysSchedule: form.daysSchedule,
            requirements: form.requirements,
            cities: validCities,
            days: validDays,
            requiredDocuments: form.requiredDocuments,
            qualificationTypes: form.qualificationTypes,
          }
        }
        return c
      })
      setCourses(updated)
    } else {
      const course: Course = {
        id: Date.now().toString(),
        name: form.name,
        description: form.description,
        duration: form.duration,
        deadline: form.deadline,
        delivery: form.delivery,
        daysSchedule: form.daysSchedule,
        requirements: form.requirements,
        cities: validCities,
        days: validDays,
        requiredDocuments: form.requiredDocuments,
        qualificationTypes: form.qualificationTypes,
      }
      addCourse(course)
    }
    setMode('list')
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    removeCourse(id)
    setDeleteConfirm(null)
  }

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.requirements?.toLowerCase().includes(search.toLowerCase())
  )

  if (!isAuthed) return null

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 overflow-auto md:ml-64 relative z-10">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-bold uppercase tracking-widest">
                  <Sparkles size={11} /> Courses
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Course Portfolio</h1>
              <p className="text-slate-600 mt-1 text-sm">{courses.length} programs available for student enrollment</p>
            </div>
            {mode === 'list' && (
              <button
                onClick={openAdd}
                className="btn-primary flex items-center gap-2 !py-3 !px-6 text-sm font-bold shrink-0 shadow-md shadow-indigo-500/20"
              >
                <Plus size={18} /> Add New Course
              </button>
            )}
          </motion.div>

          {/* Add / Edit Form */}
          <AnimatePresence>
            {(mode === 'add' || mode === 'edit') && (
              <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl p-6 md:p-8 mb-10 shadow-xl border border-slate-200"
              >
                {/* Form Header */}
                <div className="flex items-center justify-between mb-8 pb-5 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{mode === 'edit' ? 'Edit Course' : 'Create New Course'}</h2>
                      <p className="text-xs text-slate-500 font-medium">Configure all 5 enrollment steps: Info, Location, Schedule, Documents & Qualifications</p>
                    </div>
                  </div>
                  <button onClick={() => setMode('list')} className="p-2.5 bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all">
                    <X size={20} />
                  </button>
                </div>

                {formError && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mb-6 px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-bold flex items-center gap-2">
                    <AlertCircle size={16} /> {formError}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column — Core Info & Entry Requirements */}
                  <div className="space-y-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2"><BookOpen size={14} className="text-indigo-600" /> Step 1: Program Information</h3>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-wider text-slate-700 uppercase">Course Title *</label>
                      <input
                        type="text"
                        placeholder="e.g., HND Business / Software Engineering"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        suppressHydrationWarning
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 font-medium focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-wider text-slate-700 uppercase">Course Description</label>
                      <textarea
                        placeholder="Describe what students will learn in this program..."
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        suppressHydrationWarning
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 font-medium resize-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold tracking-wider text-slate-700 uppercase flex items-center gap-1"><Clock size={11} className="text-indigo-600" /> Duration</label>
                        <select
                          value={form.duration}
                          onChange={e => setForm({ ...form, duration: e.target.value })}
                          suppressHydrationWarning
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold text-sm focus:border-indigo-600"
                        >
                          <option value="">Select duration…</option>
                          {durationOptions.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold tracking-wider text-slate-700 uppercase flex items-center gap-1"><Wifi size={11} className="text-cyan-600" /> Delivery Mode</label>
                        <select
                          value={form.delivery}
                          onChange={e => setForm({ ...form, delivery: e.target.value })}
                          suppressHydrationWarning
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold text-sm focus:border-indigo-600"
                        >
                          {deliveryOptions.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-wider text-slate-700 uppercase flex items-center gap-1"><AlertCircle size={11} className="text-rose-600" /> Document Submission Deadline</label>
                      <input
                        type="text"
                        placeholder="e.g., September or October 2026"
                        value={form.deadline}
                        onChange={e => setForm({ ...form, deadline: e.target.value })}
                        suppressHydrationWarning
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 font-medium focus:border-indigo-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-wider text-slate-700 uppercase flex items-center gap-1"><Calendar size={11} className="text-emerald-600" /> Schedule Summary</label>
                      <input
                        type="text"
                        placeholder="e.g., Tuesday On-Campus & Saturday Online"
                        value={form.daysSchedule}
                        onChange={e => setForm({ ...form, daysSchedule: e.target.value })}
                        suppressHydrationWarning
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 font-medium focus:border-indigo-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-wider text-slate-700 uppercase flex items-center gap-1"><Layers size={11} className="text-amber-600" /> Entry Requirements Summary</label>
                      <input
                        type="text"
                        placeholder="e.g., Standard Entry / Level 3 or 3+ years work experience"
                        value={form.requirements}
                        onChange={e => setForm({ ...form, requirements: e.target.value })}
                        suppressHydrationWarning
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 font-medium focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  {/* Right Column — Locations, Schedule, Documents & Qualifications */}
                  <div className="space-y-6">
                    {/* Cities */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-4"><MapPin size={13} className="text-cyan-600" /> Step 2: Available Training Locations</h3>
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                        {form.cities.map((city, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <div className="relative flex-1">
                              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                              <input
                                type="text"
                                placeholder="City name (e.g. London, Birmingham, Leicester)"
                                value={city.name}
                                onChange={e => {
                                  const cities = [...form.cities]; cities[i].name = e.target.value
                                  setForm({ ...form, cities })
                                }}
                                suppressHydrationWarning
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-xl text-sm font-medium focus:border-indigo-600"
                              />
                            </div>
                            <button
                              onClick={() => setForm({ ...form, cities: form.cities.filter((_, idx) => idx !== i) })}
                              className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => setForm({ ...form, cities: [...form.cities, { name: '' }] })}
                          className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Plus size={14} /> Add Location Option
                        </button>
                      </div>
                    </div>

                    {/* Schedule Slots */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-4"><Calendar size={13} className="text-pink-600" /> Step 3: Class Schedule Batches</h3>
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                        {form.days.map((day, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="Batch Name (e.g. Sep 2026)"
                              value={day.name}
                              onChange={e => {
                                const days = [...form.days]; days[i].name = e.target.value
                                setForm({ ...form, days })
                              }}
                              suppressHydrationWarning
                              className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-xl text-sm font-medium focus:border-indigo-600"
                            />
                            <input
                              type="text"
                              placeholder="Type (e.g. Blended)"
                              value={day.date}
                              onChange={e => {
                                const days = [...form.days]; days[i].date = e.target.value
                                setForm({ ...form, days })
                              }}
                              suppressHydrationWarning
                              className="w-32 px-3.5 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-xl text-sm font-medium focus:border-indigo-600"
                            />
                            <button
                              onClick={() => setForm({ ...form, days: form.days.filter((_, idx) => idx !== i) })}
                              className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => setForm({ ...form, days: [...form.days, { name: '', date: '' }] })}
                          className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Plus size={14} /> Add Schedule Option
                        </button>
                      </div>
                    </div>

                    {/* Required Documents */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-4"><ShieldCheck size={14} className="text-indigo-600" /> Step 4: Required ID & Citizenship Documents</h3>
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                        <p className="text-xs text-slate-600 mb-2">Select documents required from students during enrollment step 4:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {defaultDocsOptions.map(doc => {
                            const isSelected = form.requiredDocuments.includes(doc)
                            return (
                              <button
                                key={doc}
                                type="button"
                                onClick={() => toggleDoc(doc)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all flex items-center gap-2 border ${
                                  isSelected
                                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                <CheckCircle2 size={13} className={isSelected ? 'text-indigo-600' : 'text-slate-300'} />
                                <span className="truncate">{doc}</span>
                              </button>
                            )
                          })}
                        </div>

                        {/* Add Custom Document */}
                        <div className="flex gap-2 pt-2">
                          <input
                            type="text"
                            placeholder="Add custom required document..."
                            value={customDoc}
                            onChange={e => setCustomDoc(e.target.value)}
                            suppressHydrationWarning
                            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                          />
                          <button
                            type="button"
                            onClick={addCustomDoc}
                            className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Qualification Types */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-4"><FileText size={14} className="text-purple-600" /> Step 5: Required Qualifications & Certificates</h3>
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                        <p className="text-xs text-slate-600 mb-2">Select qualification proofs required from students during enrollment step 5:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {defaultQualOptions.map(qual => {
                            const isSelected = form.qualificationTypes.includes(qual)
                            return (
                              <button
                                key={qual}
                                type="button"
                                onClick={() => toggleQual(qual)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all flex items-center gap-2 border ${
                                  isSelected
                                    ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                <CheckCircle2 size={13} className={isSelected ? 'text-purple-600' : 'text-slate-300'} />
                                <span className="truncate">{qual}</span>
                              </button>
                            )
                          })}
                        </div>

                        {/* Add Custom Qualification */}
                        <div className="flex gap-2 pt-2">
                          <input
                            type="text"
                            placeholder="Add custom qualification..."
                            value={customQual}
                            onChange={e => setCustomQual(e.target.value)}
                            suppressHydrationWarning
                            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                          />
                          <button
                            type="button"
                            onClick={addCustomQual}
                            className="px-3 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200">
                  <button onClick={() => setMode('list')} className="btn-secondary px-6 py-3.5 text-sm font-bold">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="btn-primary flex-1 py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-md">
                    <Save size={16} />
                    {mode === 'edit' ? 'Save Changes' : 'Publish Course'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search */}
          {mode === 'list' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search courses by name, requirements, or documents..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                suppressHydrationWarning
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 font-medium shadow-sm focus:border-indigo-600"
              />
            </motion.div>
          )}

          {/* Courses Grid */}
          {mode === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.length === 0 ? (
                <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-14 text-center">
                  <BookOpen size={40} className="text-slate-400 mx-auto mb-3 opacity-60" />
                  <h3 className="text-lg font-bold text-slate-900">{search ? 'No matches found' : 'No courses available'}</h3>
                  <p className="text-slate-500 text-sm mt-1">{search ? 'Try a different search term.' : 'Click "Add New Course" to create a program.'}</p>
                </div>
              ) : (
                filteredCourses.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md hover:shadow-xl hover:border-indigo-400 transition-all duration-300 group relative flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar: Icon + Actions */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                          <BookOpen size={20} className="text-indigo-600" />
                        </div>

                        <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => openEdit(course)}
                            className="p-2 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl transition-all"
                            title="Edit"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(course.id)}
                            className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl transition-all"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Course Title */}
                      <h3 className="text-lg font-bold text-slate-900 leading-snug mb-3 group-hover:text-indigo-600 transition-colors">{course.name}</h3>

                      {/* Meta Details */}
                      <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Clock size={13} className="text-indigo-600 shrink-0" />
                          <span className="font-bold">{course.duration || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Wifi size={13} className="text-cyan-600 shrink-0" />
                          <span className="font-bold">{course.delivery || 'Blended'}</span>
                        </div>
                        {course.deadline && (
                          <div className="flex items-center gap-1.5 text-xs col-span-2 mt-1">
                            <AlertCircle size={13} className="text-rose-600 shrink-0" />
                            <span className="text-rose-700 font-bold">Deadline: {course.deadline}</span>
                          </div>
                        )}
                      </div>

                      {/* Entry Requirements */}
                      {course.requirements && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 mb-4">
                          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-800 mb-0.5">Requirements</p>
                          <p className="text-xs text-amber-950 font-bold">{course.requirements}</p>
                        </div>
                      )}

                      {/* Required Documents Badge summary */}
                      {course.requiredDocuments && course.requiredDocuments.length > 0 && (
                        <div className="mb-4 bg-indigo-50/60 border border-indigo-100 rounded-xl px-3 py-2">
                          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-indigo-700 mb-1 flex items-center gap-1">
                            <ShieldCheck size={11} /> Required Documents ({course.requiredDocuments.length})
                          </p>
                          <p className="text-xs text-indigo-900 font-semibold truncate">{course.requiredDocuments.join(', ')}</p>
                        </div>
                      )}
                    </div>

                    {/* Locations Tags */}
                    {course.cities?.length > 0 && (
                      <div className="pt-3 border-t border-slate-100">
                        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400 mb-2">Available Locations</p>
                        <div className="flex flex-wrap gap-1.5">
                          {course.cities.map(city => (
                            <span key={city.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                              <MapPin size={11} className="text-indigo-600" /> {city.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center z-10"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Course?</h3>
              <p className="text-sm text-slate-600 mb-6">Are you sure you want to remove this course? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1 py-2.5 text-sm font-bold">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm)} className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors flex-1 shadow-md">
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
