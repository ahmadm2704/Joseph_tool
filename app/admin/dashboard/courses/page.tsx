'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin-sidebar'
import { useStore, Course, City, Day, DocumentCategory, DocumentItem } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2, Plus, X, MapPin, Calendar, BookOpen, Edit3,
  Clock, AlertCircle, Wifi, Layers, Save, Sparkles, Search, FileText, CheckCircle2, ShieldCheck, FileCheck, FolderPlus, Award
} from 'lucide-react'

const defaultIDCategories: DocumentCategory[] = [
  {
    id: 'cat-1',
    categoryName: 'British Citizens',
    documents: [
      { id: 'doc-1', name: 'Passport', required: true },
      { id: 'doc-2', name: 'National Insurance Number', required: true },
      { id: 'doc-3', name: 'Proof of Address', required: false },
    ]
  },
  {
    id: 'cat-2',
    categoryName: 'Non-British Students',
    documents: [
      { id: 'doc-4', name: 'Passport', required: true },
      { id: 'doc-5', name: 'Share Code', required: true },
      { id: 'doc-6', name: 'National Insurance Number', required: true },
      { id: 'doc-7', name: 'Proof of Address', required: false },
      { id: 'doc-8', name: 'Work Reference', required: false },
    ]
  },
  {
    id: 'cat-3',
    categoryName: 'Students with ILR',
    documents: [
      { id: 'doc-9', name: 'Passport', required: true },
      { id: 'doc-10', name: 'Share Code', required: true },
      { id: 'doc-11', name: 'National Insurance Number', required: true },
      { id: 'doc-12', name: 'ILR Document', required: false },
      { id: 'doc-13', name: 'Proof of Address', required: false },
    ]
  },
  {
    id: 'cat-4',
    categoryName: 'Pre-Settled Status Applicants',
    documents: [
      { id: 'doc-14', name: 'Last 3 months payslips', required: true },
      { id: 'doc-15', name: 'Employer contract', required: true },
      { id: 'doc-16', name: 'Last 2 years P60', required: true },
      { id: 'doc-17', name: 'Share Code', required: false },
    ]
  }
]

const defaultQualCategories: DocumentCategory[] = [
  {
    id: 'qcat-1',
    categoryName: 'Standard Entry Pathway (Certificates)',
    documents: [
      { id: 'qdoc-1', name: 'Level 3 Diploma or High School Certificate', required: true },
      { id: 'qdoc-2', name: 'Academic Transcripts', required: false },
    ]
  },
  {
    id: 'qcat-2',
    categoryName: 'Work Experience Pathway (Mature Students)',
    documents: [
      { id: 'qdoc-3', name: 'CV / Resume (min 3+ years experience)', required: true },
      { id: 'qdoc-4', name: 'Work Reference Letter from Employer', required: true },
      { id: 'qdoc-5', name: 'Prior Training Certificates', required: false },
    ]
  },
  {
    id: 'qcat-3',
    categoryName: 'Postgraduate / Degree Pathway',
    documents: [
      { id: 'qdoc-6', name: 'Bachelor’s Degree Certificate', required: true },
      { id: 'qdoc-7', name: 'Official University Transcripts', required: true },
      { id: 'qdoc-8', name: 'Personal Statement / Essay', required: false },
    ]
  }
]

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
  documentCategories: DocumentCategory[]
  qualificationCategories: DocumentCategory[]
}

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
  documentCategories: defaultIDCategories,
  qualificationCategories: defaultQualCategories,
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
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // New Category input states
  const [newIDCatName, setNewIDCatName] = useState('')
  const [newQualCatName, setNewQualCatName] = useState('')

  const { courses, addCourse, removeCourse, setCourses, updateCourse } = useStore()

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
      documentCategories: course.documentCategories ? course.documentCategories : defaultIDCategories,
      qualificationCategories: course.qualificationCategories ? course.qualificationCategories : defaultQualCategories,
    })
    setEditingId(course.id)
    setFormError('')
    setMode('edit')
  }

  // ID Category management helpers
  const addIDCategory = () => {
    if (!newIDCatName.trim()) return
    const newCat: DocumentCategory = {
      id: `idcat-${Date.now()}`,
      categoryName: newIDCatName.trim(),
      documents: [{ id: `doc-${Date.now()}-1`, name: 'Passport', required: true }]
    }
    setForm({ ...form, documentCategories: [...form.documentCategories, newCat] })
    setNewIDCatName('')
  }

  const updateIDCategoryName = (catId: string, name: string) => {
    setForm({
      ...form,
      documentCategories: form.documentCategories.map(c => c.id === catId ? { ...c, categoryName: name } : c)
    })
  }

  const removeIDCategory = (catId: string) => {
    setForm({ ...form, documentCategories: form.documentCategories.filter(c => c.id !== catId) })
  }

  const addDocToIDCategory = (catId: string) => {
    setForm({
      ...form,
      documentCategories: form.documentCategories.map(c => {
        if (c.id === catId) {
          const newDoc: DocumentItem = { id: `doc-${Date.now()}`, name: '', required: true }
          return { ...c, documents: [...c.documents, newDoc] }
        }
        return c
      })
    })
  }

  const updateIDDocItem = (catId: string, docId: string, updates: Partial<DocumentItem>) => {
    setForm({
      ...form,
      documentCategories: form.documentCategories.map(c => {
        if (c.id === catId) {
          return { ...c, documents: c.documents.map(d => d.id === docId ? { ...d, ...updates } : d) }
        }
        return c
      })
    })
  }

  const removeDocFromIDCategory = (catId: string, docId: string) => {
    setForm({
      ...form,
      documentCategories: form.documentCategories.map(c => {
        if (c.id === catId) {
          return { ...c, documents: c.documents.filter(d => d.id !== docId) }
        }
        return c
      })
    })
  }

  // Qual Category management helpers
  const addQualCategory = () => {
    if (!newQualCatName.trim()) return
    const newCat: DocumentCategory = {
      id: `qcat-${Date.now()}`,
      categoryName: newQualCatName.trim(),
      documents: [{ id: `qdoc-${Date.now()}-1`, name: 'Certificate / Diploma', required: true }]
    }
    setForm({ ...form, qualificationCategories: [...form.qualificationCategories, newCat] })
    setNewQualCatName('')
  }

  const updateQualCategoryName = (catId: string, name: string) => {
    setForm({
      ...form,
      qualificationCategories: form.qualificationCategories.map(c => c.id === catId ? { ...c, categoryName: name } : c)
    })
  }

  const removeQualCategory = (catId: string) => {
    setForm({ ...form, qualificationCategories: form.qualificationCategories.filter(c => c.id !== catId) })
  }

  const addDocToQualCategory = (catId: string) => {
    setForm({
      ...form,
      qualificationCategories: form.qualificationCategories.map(c => {
        if (c.id === catId) {
          const newDoc: DocumentItem = { id: `qdoc-${Date.now()}`, name: '', required: true }
          return { ...c, documents: [...c.documents, newDoc] }
        }
        return c
      })
    })
  }

  const updateQualDocItem = (catId: string, docId: string, updates: Partial<DocumentItem>) => {
    setForm({
      ...form,
      qualificationCategories: form.qualificationCategories.map(c => {
        if (c.id === catId) {
          return { ...c, documents: c.documents.map(d => d.id === docId ? { ...d, ...updates } : d) }
        }
        return c
      })
    })
  }

  const removeDocFromQualCategory = (catId: string, docId: string) => {
    setForm({
      ...form,
      qualificationCategories: form.qualificationCategories.map(c => {
        if (c.id === catId) {
          return { ...c, documents: c.documents.filter(d => d.id !== docId) }
        }
        return c
      })
    })
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

    const cleanedIDCategories: DocumentCategory[] = form.documentCategories.map(c => ({
      ...c,
      documents: c.documents.filter(d => d.name.trim() !== '')
    })).filter(c => c.categoryName.trim() !== '')

    const cleanedQualCategories: DocumentCategory[] = form.qualificationCategories.map(c => ({
      ...c,
      documents: c.documents.filter(d => d.name.trim() !== '')
    })).filter(c => c.categoryName.trim() !== '')

    if (mode === 'edit' && editingId) {
      const existingCourse = courses.find(c => c.id === editingId)
      if (existingCourse) {
        updateCourse({
          ...existingCourse,
          name: form.name,
          description: form.description,
          duration: form.duration,
          deadline: form.deadline,
          delivery: form.delivery,
          daysSchedule: form.daysSchedule,
          requirements: form.requirements,
          cities: validCities,
          days: validDays,
          documentCategories: cleanedIDCategories,
          qualificationCategories: cleanedQualCategories,
        })
      }
    } else {
      const course: Course = {
        id: typeof window !== 'undefined' && window.crypto?.randomUUID ? window.crypto.randomUUID() : `c1000000-0000-4000-8000-${Date.now().toString(16).padStart(12, '0')}`,
        name: form.name,
        description: form.description,
        duration: form.duration,
        deadline: form.deadline,
        delivery: form.delivery,
        daysSchedule: form.daysSchedule,
        requirements: form.requirements,
        cities: validCities,
        days: validDays,
        documentCategories: cleanedIDCategories,
        qualificationCategories: cleanedQualCategories,
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
                      <p className="text-xs text-slate-500 font-medium">Full course setup matching Step 4 (ID Categories) & Step 5 (Qualification Categories)</p>
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

                <div className="space-y-8">
                  {/* Step 1: Core Info */}
                  <div className="space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <BookOpen size={16} className="text-indigo-600" /> Step 1: Course Overview
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5 md:col-span-2">
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

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold tracking-wider text-slate-700 uppercase">Course Description</label>
                        <textarea
                          placeholder="Describe what students will learn in this program..."
                          value={form.description}
                          onChange={e => setForm({ ...form, description: e.target.value })}
                          suppressHydrationWarning
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 font-medium resize-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                          rows={2}
                        />
                      </div>

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
                        <label className="text-xs font-bold tracking-wider text-slate-700 uppercase flex items-center gap-1"><Layers size={11} className="text-amber-600" /> Entry Requirements Summary</label>
                        <input
                          type="text"
                          placeholder="e.g., Standard Entry / Level 3 Diploma or 3+ years work experience"
                          value={form.requirements}
                          onChange={e => setForm({ ...form, requirements: e.target.value })}
                          suppressHydrationWarning
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 font-medium focus:border-indigo-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2 & 3: Locations & Schedules Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Cities */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-4"><MapPin size={15} className="text-cyan-600" /> Step 2: Training Locations</h3>
                      <div className="space-y-3">
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
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-4"><Calendar size={15} className="text-pink-600" /> Step 3: Class Schedule Batches</h3>
                      <div className="space-y-3">
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
                  </div>

                  {/* Step 4: Step 4 ID & Residency Categories */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                          <ShieldCheck size={18} className="text-indigo-600" /> Step 4: ID & Residency Categories
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Configure radio options shown in registration Step 4 (e.g. <em>British Citizens, Non-British Students, Students with ILR</em>) and set required/optional documents per category.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setForm({ ...form, documentCategories: defaultIDCategories })}
                        className="text-xs font-bold text-indigo-600 hover:underline shrink-0"
                      >
                        Reset to Default ID Categories
                      </button>
                    </div>

                    {/* Add ID Category Header */}
                    <div className="flex gap-2 max-w-md bg-white p-2 rounded-2xl border border-slate-300 shadow-sm">
                      <input
                        type="text"
                        placeholder="Add ID Category (e.g. EU Citizens)..."
                        value={newIDCatName}
                        onChange={e => setNewIDCatName(e.target.value)}
                        suppressHydrationWarning
                        className="flex-1 px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addIDCategory}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 flex items-center gap-1 shrink-0"
                      >
                        <FolderPlus size={14} /> Add Category
                      </button>
                    </div>

                    {/* Render ID Category Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {form.documentCategories.map((cat, catIdx) => (
                        <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 relative flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
                              <div className="flex items-center gap-2 flex-1">
                                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                                  {catIdx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={cat.categoryName}
                                  onChange={e => updateIDCategoryName(cat.id, e.target.value)}
                                  suppressHydrationWarning
                                  className="font-bold text-sm text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none flex-1 py-0.5"
                                  placeholder="Category Name"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => removeIDCategory(cat.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            <div className="space-y-2.5">
                              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">Required Documents for {cat.categoryName}:</p>
                              {cat.documents.map(doc => (
                                <div key={doc.id} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                  <input
                                    type="text"
                                    value={doc.name}
                                    onChange={e => updateIDDocItem(cat.id, doc.id, { name: e.target.value })}
                                    placeholder="Document name (e.g. Passport)"
                                    suppressHydrationWarning
                                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:border-indigo-600"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => updateIDDocItem(cat.id, doc.id, { required: !doc.required })}
                                    className={`px-3 py-1.5 rounded-lg text-[0.7rem] font-bold transition-all border shrink-0 ${
                                      doc.required
                                        ? 'bg-rose-100 border-rose-300 text-rose-800'
                                        : 'bg-amber-100 border-amber-300 text-amber-900'
                                    }`}
                                  >
                                    {doc.required ? '★ Compulsory' : '○ Optional'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeDocFromIDCategory(cat.id, doc.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                                  >
                                    <X size={15} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => addDocToIDCategory(cat.id)}
                            className="w-full py-2 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-1.5 mt-3"
                          >
                            <Plus size={14} /> Add Document to {cat.categoryName}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 5: Academic Qualification Categories & Pathways */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                          <Award size={18} className="text-purple-600" /> Step 5: Academic Qualification Categories & Pathways
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Configure entry pathways shown in registration Step 5 (e.g. <em>Standard Entry Pathway, Work Experience Pathway, Postgraduate Pathway</em>) and set required/optional certificates per pathway.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setForm({ ...form, qualificationCategories: defaultQualCategories })}
                        className="text-xs font-bold text-purple-600 hover:underline shrink-0"
                      >
                        Reset to Default Qualification Pathways
                      </button>
                    </div>

                    {/* Add Qualification Category Header */}
                    <div className="flex gap-2 max-w-md bg-white p-2 rounded-2xl border border-slate-300 shadow-sm">
                      <input
                        type="text"
                        placeholder="Add Qualification Pathway (e.g. Mature Student Pathway)..."
                        value={newQualCatName}
                        onChange={e => setNewQualCatName(e.target.value)}
                        suppressHydrationWarning
                        className="flex-1 px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addQualCategory}
                        className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 flex items-center gap-1 shrink-0"
                      >
                        <FolderPlus size={14} /> Add Pathway
                      </button>
                    </div>

                    {/* Render Qualification Category Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {form.qualificationCategories.map((cat, catIdx) => (
                        <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 relative flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
                              <div className="flex items-center gap-2 flex-1">
                                <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                                  {catIdx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={cat.categoryName}
                                  onChange={e => updateQualCategoryName(cat.id, e.target.value)}
                                  suppressHydrationWarning
                                  className="font-bold text-sm text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-purple-600 focus:outline-none flex-1 py-0.5"
                                  placeholder="Pathway Name"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => removeQualCategory(cat.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            <div className="space-y-2.5">
                              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">Required Documents for {cat.categoryName}:</p>
                              {cat.documents.map(doc => (
                                <div key={doc.id} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                  <input
                                    type="text"
                                    value={doc.name}
                                    onChange={e => updateQualDocItem(cat.id, doc.id, { name: e.target.value })}
                                    placeholder="Document name (e.g. Level 3 Diploma)"
                                    suppressHydrationWarning
                                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:border-purple-600"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => updateQualDocItem(cat.id, doc.id, { required: !doc.required })}
                                    className={`px-3 py-1.5 rounded-lg text-[0.7rem] font-bold transition-all border shrink-0 ${
                                      doc.required
                                        ? 'bg-rose-100 border-rose-300 text-rose-800'
                                        : 'bg-amber-100 border-amber-300 text-amber-900'
                                    }`}
                                  >
                                    {doc.required ? '★ Compulsory' : '○ Optional'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeDocFromQualCategory(cat.id, doc.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                                  >
                                    <X size={15} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => addDocToQualCategory(cat.id)}
                            className="w-full py-2 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center gap-1.5 mt-3"
                          >
                            <Plus size={14} /> Add Document to {cat.categoryName}
                          </button>
                        </div>
                      ))}
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
                filteredCourses.map((course, i) => {
                  const idCats = course.documentCategories || defaultIDCategories
                  const qualCats = course.qualificationCategories || defaultQualCategories

                  return (
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

                        {/* Document Categories Badges */}
                        <div className="mb-4 space-y-2">
                          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-2.5">
                            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-indigo-800 mb-1 flex items-center gap-1">
                              <ShieldCheck size={11} /> Step 4 ID Categories ({idCats.length})
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {idCats.map(cat => (
                                <span key={cat.id} className="px-2 py-0.5 rounded bg-white text-indigo-900 border border-indigo-200 text-[0.65rem] font-bold">
                                  {cat.categoryName}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-2.5">
                            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-purple-800 mb-1 flex items-center gap-1">
                              <Award size={11} /> Step 5 Qualification Pathways ({qualCats.length})
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {qualCats.map(cat => (
                                <span key={cat.id} className="px-2 py-0.5 rounded bg-white text-purple-900 border border-purple-200 text-[0.65rem] font-bold">
                                  {cat.categoryName}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
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
                  )
                })
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
