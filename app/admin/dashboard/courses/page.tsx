'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin-sidebar'
import { useStore, Course, City, Day } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2, Plus, X, MapPin, Calendar, BookOpen, Edit3, CheckCircle2,
  Clock, AlertCircle, Wifi, Layers, Save, Sparkles, Search
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

  const openAdd = () => { setForm(emptyForm); setFormError(''); setEditingId(null); setMode('add') }

  const openEdit = (course: Course) => {
    setForm({
      name: course.name,
      description: course.description,
      duration: course.duration || '',
      deadline: course.deadline || '',
      delivery: course.delivery || 'Blended',
      daysSchedule: course.daysSchedule || '',
      requirements: course.requirements || '',
      cities: course.cities?.length ? course.cities.map(c => ({ name: c.name })) : [{ name: '' }],
      days: course.days?.length ? course.days.map(d => ({ name: d.name, date: d.date })) : [{ name: '', date: '' }],
    })
    setEditingId(course.id)
    setFormError('')
    setMode('edit')
  }

  const handleSave = () => {
    setFormError('')
    if (!form.name.trim()) return setFormError('Course title is required.')
    if (!form.description.trim()) return setFormError('Description is required.')
    if (!form.duration.trim()) return setFormError('Duration is required.')
    if (!form.deadline.trim()) return setFormError('Submission deadline is required.')
    if (!form.requirements.trim()) return setFormError('Entry requirements are required.')

    const validCities: City[] = form.cities
      .filter(c => c.name.trim())
      .map(c => ({ id: Math.random().toString(36).substring(7), name: c.name.trim() }))

    const validDays: Day[] = form.days
      .filter(d => d.name.trim())
      .map(d => ({ id: Math.random().toString(36).substring(7), name: d.name.trim(), date: d.date.trim() || form.delivery }))

    if (validCities.length === 0) return setFormError('Add at least one location.')

    if (mode === 'edit' && editingId) {
      const updated = courses.map(c =>
        c.id === editingId
          ? { ...c, name: form.name, description: form.description, duration: form.duration, deadline: form.deadline, delivery: form.delivery, daysSchedule: form.daysSchedule, requirements: form.requirements, cities: validCities, days: validDays }
          : c
      )
      setCourses(updated)
    } else {
      const course: Course = {
        id: crypto.randomUUID(),
        name: form.name,
        description: form.description,
        duration: form.duration,
        deadline: form.deadline,
        delivery: form.delivery,
        daysSchedule: form.daysSchedule,
        requirements: form.requirements,
        cities: validCities,
        days: validDays,
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
    <div className="flex min-h-screen bg-[#050510]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/8 blur-[120px] rounded-full" />
      </div>

      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 overflow-auto md:ml-64 relative z-10">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest">
                  <Sparkles size={11} /> Courses
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Course Portfolio</h1>
              <p className="text-gray-500 mt-1 text-sm">{courses.length} programs available</p>
            </div>
            {mode === 'list' && (
              <button
                onClick={openAdd}
                className="btn-primary flex items-center gap-2 !py-3 !px-6 text-sm font-bold shrink-0"
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
                className="glass-card !rounded-2xl p-6 md:p-8 mb-8 ring-1 ring-purple-500/20"
              >
                {/* Form Header */}
                <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                      {mode === 'edit' ? <Edit3 size={18} className="text-white" /> : <Plus size={18} className="text-white" />}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{mode === 'edit' ? 'Edit Course' : 'New Course'}</h2>
                      <p className="text-xs text-gray-500">{mode === 'edit' ? 'Update course information' : 'Fill in all course details'}</p>
                    </div>
                  </div>
                  <button onClick={() => setMode('list')} className="p-2 glass rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                    <X size={20} />
                  </button>
                </div>

                {formError && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium flex items-center gap-2">
                    <AlertCircle size={16} /> {formError}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column — Core Info */}
                  <div className="space-y-5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2"><BookOpen size={12} /> Core Information</h3>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Course Title</label>
                      <input
                        type="text"
                        placeholder="e.g., HND Business / Digital Technology"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 glass-input text-white placeholder:text-gray-600 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Description</label>
                      <textarea
                        placeholder="Describe what this course covers..."
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        className="w-full px-4 py-3 glass-input text-white placeholder:text-gray-600 font-medium resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1"><Clock size={10} /> Duration</label>
                        <select
                          value={form.duration}
                          onChange={e => setForm({ ...form, duration: e.target.value })}
                          className="w-full px-4 py-3 glass-input text-white font-medium bg-transparent"
                        >
                          <option value="" className="bg-[#0c0c23]">Select…</option>
                          {durationOptions.map(d => <option key={d} value={d} className="bg-[#0c0c23]">{d}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1"><Wifi size={10} /> Delivery</label>
                        <select
                          value={form.delivery}
                          onChange={e => setForm({ ...form, delivery: e.target.value })}
                          className="w-full px-4 py-3 glass-input text-white font-medium bg-transparent"
                        >
                          {deliveryOptions.map(d => <option key={d} value={d} className="bg-[#0c0c23]">{d}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1"><AlertCircle size={10} /> Document Submission Deadline</label>
                      <input
                        type="text"
                        placeholder="e.g., 25 September"
                        value={form.deadline}
                        onChange={e => setForm({ ...form, deadline: e.target.value })}
                        className="w-full px-4 py-3 glass-input text-white placeholder:text-gray-600 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1"><Calendar size={10} /> Days Schedule</label>
                      <input
                        type="text"
                        placeholder="e.g., Tuesday On-Campus & Saturday Online"
                        value={form.daysSchedule}
                        onChange={e => setForm({ ...form, daysSchedule: e.target.value })}
                        className="w-full px-4 py-3 glass-input text-white placeholder:text-gray-600 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1"><Layers size={10} /> Entry Requirements</label>
                      <input
                        type="text"
                        placeholder="e.g., 5 years work experience or Level 3"
                        value={form.requirements}
                        onChange={e => setForm({ ...form, requirements: e.target.value })}
                        className="w-full px-4 py-3 glass-input text-white placeholder:text-gray-600 font-medium"
                      />
                    </div>
                  </div>

                  {/* Right Column — Cities & Schedule */}
                  <div className="space-y-6">
                    {/* Cities */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2 mb-4"><MapPin size={12} /> Training Locations</h3>
                      <div className="glass-card-static bg-white/[0.02] border-white/5 rounded-xl p-4 space-y-3">
                        {form.cities.map((city, i) => (
                          <div key={i} className="flex gap-2 group">
                            <div className="relative flex-1">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                              <input
                                type="text"
                                placeholder="City name (e.g. London)"
                                value={city.name}
                                onChange={e => {
                                  const cities = [...form.cities]; cities[i].name = e.target.value
                                  setForm({ ...form, cities })
                                }}
                                className="w-full pl-9 pr-4 py-2.5 glass-input text-white placeholder:text-gray-600 text-sm"
                              />
                            </div>
                            <button
                              onClick={() => setForm({ ...form, cities: form.cities.filter((_, idx) => idx !== i) })}
                              className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => setForm({ ...form, cities: [...form.cities, { name: '' }] })}
                          className="w-full py-2.5 border border-dashed border-white/10 rounded-lg text-xs font-bold text-gray-500 hover:text-purple-400 hover:border-purple-500/40 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Plus size={14} /> Add Location
                        </button>
                      </div>
                    </div>

                    {/* Days */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2 mb-4"><Calendar size={12} /> Class Schedule Slots</h3>
                      <div className="glass-card-static bg-white/[0.02] border-white/5 rounded-xl p-4 space-y-3">
                        {form.days.map((day, i) => (
                          <div key={i} className="flex gap-2 group">
                            <input
                              type="text"
                              placeholder="Label (e.g. Monday & Wednesday)"
                              value={day.name}
                              onChange={e => {
                                const days = [...form.days]; days[i].name = e.target.value
                                setForm({ ...form, days })
                              }}
                              className="flex-1 px-3 py-2.5 glass-input text-white placeholder:text-gray-600 text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Type (Blended/Online)"
                              value={day.date}
                              onChange={e => {
                                const days = [...form.days]; days[i].date = e.target.value
                                setForm({ ...form, days })
                              }}
                              className="w-32 px-3 py-2.5 glass-input text-white placeholder:text-gray-600 text-sm"
                            />
                            <button
                              onClick={() => setForm({ ...form, days: form.days.filter((_, idx) => idx !== i) })}
                              className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => setForm({ ...form, days: [...form.days, { name: '', date: '' }] })}
                          className="w-full py-2.5 border border-dashed border-white/10 rounded-lg text-xs font-bold text-gray-500 hover:text-cyan-400 hover:border-cyan-500/40 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Plus size={14} /> Add Schedule Slot
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-white/5">
                  <button onClick={() => setMode('list')} className="btn-secondary px-6 py-3 text-sm font-bold">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="btn-primary flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2">
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search courses by name or requirements..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 glass-input text-white placeholder:text-gray-600 font-medium"
              />
            </motion.div>
          )}

          {/* Courses Grid */}
          {mode === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredCourses.length === 0 ? (
                <div className="col-span-full glass-card !rounded-2xl p-14 text-center">
                  <BookOpen size={40} className="text-gray-700 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-400">{search ? 'No matches found' : 'No courses yet'}</h3>
                  <p className="text-gray-600 text-sm mt-1">{search ? 'Try a different search term.' : 'Click "Add New Course" to get started.'}</p>
                </div>
              ) : (
                filteredCourses.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="glass-card !rounded-2xl p-5 hover:border-white/10 transition-all duration-300 group relative"
                  >
                    {/* Actions */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => openEdit(course)}
                        className="p-2 glass rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                        title="Edit"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(course.id)}
                        className="p-2 glass rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Course name */}
                    <div className="flex items-start gap-3 mb-4 pr-16">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
                        <BookOpen size={15} className="text-purple-400" />
                      </div>
                      <h3 className="text-sm font-bold text-white leading-snug">{course.name}</h3>
                    </div>

                    {/* Meta pills */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock size={11} className="text-purple-400" />
                        <span className="font-semibold text-gray-300">{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Wifi size={11} className="text-cyan-400" />
                        <span className="font-semibold text-gray-300">{course.delivery}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs col-span-2">
                        <AlertCircle size={11} className="text-rose-400 shrink-0" />
                        <span className="text-rose-300 font-semibold">Deadline: {course.deadline}</span>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="bg-amber-500/8 border border-amber-500/20 rounded-lg px-3 py-2 mb-4">
                      <p className="text-[0.65rem] font-bold uppercase tracking-widest text-amber-500 mb-0.5">Requirements</p>
                      <p className="text-xs text-amber-200 font-medium">{course.requirements}</p>
                    </div>

                    {/* Locations */}
                    {course.cities?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {course.cities.map(city => (
                          <span key={city.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 text-[0.65rem] font-semibold border border-purple-500/15">
                            <MapPin size={9} /> {city.name}
                          </span>
                        ))}
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
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative glass-card !rounded-2xl p-8 max-w-sm w-full text-center ring-1 ring-red-500/20"
            >
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Delete Course?</h3>
              <p className="text-gray-400 text-sm mb-6">This will permanently remove the course and cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-secondary py-3 text-sm font-bold">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-sm font-bold transition-all">
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
