'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin-sidebar'
import { useStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Download, Eye, X, Users, User, Search, Mail, Phone, MapPin, Calendar, BookOpen, Sparkles, FileCheck, Map } from 'lucide-react'

export default function RegistrationsManagement() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [selectedReg, setSelectedReg] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const { registrations, removeRegistration, courses } = useStore()

  useEffect(() => {
    const session = localStorage.getItem('adminSession')
    if (!session) router.push('/admin/login')
    else setIsAuthed(true)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.push('/admin/login')
  }

  const getCourseName = (courseId: string) => courses.find(c => c.id === courseId)?.name || 'Unknown Course'
  const getCourseDeadline = (courseId: string) => courses.find(c => c.id === courseId)?.deadline || ''
  
  const getCityName = (courseId: string, cityId: string) => {
    const course = courses.find(c => c.id === courseId)
    return course?.cities?.find(c => c.id === cityId)?.name || 'Unknown Location'
  }
  
  const getDayName = (courseId: string, dayId: string) => {
    const course = courses.find(c => c.id === courseId)
    const day = course?.days?.find(d => d.id === dayId)
    return day ? `${day.name} (${day.date})` : 'Unknown Schedule'
  }

  const handleExportCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Address', 'Course', 'Location', 'Schedule', 'Citizenship', 'Qualification', 'Date']
    const rows = registrations.map(reg => [
      reg.firstName,
      reg.lastName,
      reg.email,
      reg.phone,
      `"${reg.address}"`,
      `"${getCourseName(reg.courseId)}"`,
      `"${getCityName(reg.courseId, reg.cityId)}"`,
      `"${getDayName(reg.courseId, reg.dayId)}"`,
      `"${reg.citizenshipStatus || 'N/A'}"`,
      reg.documentsAttached ? 'Yes' : 'No',
      new Date(reg.createdAt).toLocaleDateString(),
    ])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `student-registrations-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = registrations.filter(r =>
    `${r.firstName} ${r.lastName} ${r.email} ${r.phone} ${getCourseName(r.courseId)}`.toLowerCase().includes(search.toLowerCase())
  )

  if (!isAuthed) return null

  const selected = registrations.find(r => r.id === selectedReg)

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 overflow-auto md:ml-64 relative z-10">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold uppercase tracking-widest">
                  <Users size={11} /> Registrations
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Student Registrations</h1>
              <p className="text-slate-600 mt-1 text-sm">{registrations.length} total applications</p>
            </div>
            {registrations.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 btn-secondary !py-3 !px-6 text-sm font-bold shrink-0 shadow-sm"
              >
                <Download size={16} /> Export CSV
              </button>
            )}
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by student name, email, phone, or course..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              suppressHydrationWarning
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 font-medium shadow-sm focus:border-indigo-600"
            />
          </motion.div>

          {/* Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            {filtered.length === 0 ? (
              <div className="p-14 text-center">
                <Users size={40} className="text-slate-400 mx-auto mb-3 opacity-60" />
                <h3 className="text-lg font-bold text-slate-900">{search ? 'No matching registrations' : 'No registrations yet'}</h3>
                <p className="text-slate-500 text-sm mt-1">{search ? 'Try another search term.' : 'Applications submitted by students will appear here.'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[0.7rem] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-4 px-6">Student</th>
                      <th className="py-4 px-6">Contact</th>
                      <th className="py-4 px-6">Course</th>
                      <th className="py-4 px-6">Location & Schedule</th>
                      <th className="py-4 px-6 text-center">Citizenship</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filtered.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                              {reg.firstName[0]}{reg.lastName[0]}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{reg.firstName} {reg.lastName}</p>
                              <p className="text-[0.7rem] text-slate-500 font-medium">{new Date(reg.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-semibold text-slate-900">{reg.email}</p>
                          <p className="text-xs text-slate-500">{reg.phone}</p>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-900">{getCourseName(reg.courseId)}</span>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-semibold text-slate-800 flex items-center gap-1 text-xs">
                            <MapPin size={11} className="text-cyan-600 shrink-0" /> {getCityName(reg.courseId, reg.cityId)}
                          </p>
                          <p className="text-[0.7rem] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Calendar size={11} className="text-indigo-600 shrink-0" /> {getDayName(reg.courseId, reg.dayId)}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
                            {reg.citizenshipStatus || 'British'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedReg(reg.id)}
                              className="p-2 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl transition-all"
                              title="View Details"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(reg.id)}
                              className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl transition-all"
                              title="Delete Application"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Details View Modal */}
      <AnimatePresence>
        {selectedReg && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setSelectedReg(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl max-h-[90vh] flex flex-col z-10 overflow-hidden text-slate-900"
            >
              <button
                onClick={() => setSelectedReg(null)}
                className="absolute top-5 right-5 p-2 bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all z-10"
              >
                <X size={18} />
              </button>

              {/* Scrollable inner content */}
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-3 mb-6 pr-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0 font-bold text-lg">
                    {selected.firstName[0]}{selected.lastName[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 leading-tight">{selected.firstName} {selected.lastName}</h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Registered {new Date(selected.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: Mail, label: 'Email', value: selected.email, color: 'text-indigo-600' },
                    { icon: Phone, label: 'Phone', value: selected.phone, color: 'text-cyan-600' },
                    { icon: Map, label: 'Address', value: selected.address, color: 'text-pink-600' },
                    { icon: BookOpen, label: 'Course', value: getCourseName(selected.courseId), color: 'text-amber-600' },
                    { icon: MapPin, label: 'Location', value: getCityName(selected.courseId, selected.cityId), color: 'text-emerald-600' },
                    { icon: Calendar, label: 'Schedule', value: getDayName(selected.courseId, selected.dayId), color: 'text-indigo-600' },
                  ].map(field => {
                    const Icon = field.icon
                    return (
                      <div key={field.label} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                          <Icon size={15} className={field.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">{field.label}</p>
                          <p className="text-sm text-slate-900 font-bold mt-0.5 break-words">{field.value}</p>
                        </div>
                      </div>
                    )
                  })}

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                      <FileCheck size={15} className={selected.documentsAttached ? 'text-emerald-600' : 'text-slate-400'} />
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">Qualifications</p>
                      <p className={`text-sm font-bold mt-0.5 ${selected.documentsAttached ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {selected.documentsAttached ? 'Attached & Submitted' : 'Not submitted'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                      <User size={15} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">Citizenship / Residency Status</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        {selected.citizenshipStatus || 'British Citizens'}
                      </p>
                    </div>
                  </div>
                  
                  {selected.documentUrls && selected.documentUrls.length > 0 && (
                    <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-indigo-800">Attached Document Files</p>
                      <div className="flex flex-col gap-2 mt-1">
                        {selected.documentUrls.map((url, idx) => (
                          <a key={idx} href={url} target="_blank" rel="noreferrer" className="text-xs text-indigo-700 hover:text-indigo-900 font-bold underline break-all flex items-center gap-2">
                            <FileCheck size={14} /> Document {idx + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedReg(null)}
                  className="w-full btn-primary mt-6 !py-3.5 text-sm font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl p-6 max-w-sm w-full text-center border border-slate-200 shadow-2xl z-10"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Registration?</h3>
              <p className="text-slate-600 text-sm mb-6">This will permanently remove this student&apos;s registration.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-secondary py-2.5 text-sm font-bold">Cancel</button>
                <button
                  onClick={() => { removeRegistration(deleteConfirm); setDeleteConfirm(null) }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold transition-all shadow-md"
                >
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
