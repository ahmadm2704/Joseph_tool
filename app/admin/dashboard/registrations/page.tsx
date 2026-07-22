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
    a.download = 'registrations.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = registrations.filter(r =>
    `${r.firstName} ${r.lastName} ${r.email} ${getCourseName(r.courseId)}`.toLowerCase().includes(search.toLowerCase())
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
                className="flex items-center gap-2 btn-secondary !py-3 !px-6 text-sm font-bold shrink-0"
              >
                <Download size={16} /> Export CSV
              </button>
            )}
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or course..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 glass-input text-white placeholder:text-gray-600 font-medium"
            />
          </motion.div>

          {/* Registration Cards */}
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-card !rounded-2xl p-14 text-center">
              <Users size={40} className="text-gray-700 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-400">{search ? 'No matches found' : 'No registrations yet'}</h3>
              <p className="text-gray-600 text-sm mt-1">
                {search ? 'Try a different search term.' : 'Students will appear here once they register.'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((reg, i) => (
                <motion.div
                  key={reg.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card !rounded-2xl p-5 hover:border-white/10 transition-all group relative"
                >
                  {/* Actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => setSelectedReg(reg.id)}
                      className="p-2 glass rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                      title="View Details"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(reg.id)}
                      className="p-2 glass rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Student Info */}
                  <div className="flex items-center gap-3 mb-4 pr-16">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-cyan-400">{reg.firstName[0]}{reg.lastName[0]}</span>
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{reg.firstName} {reg.lastName}</p>
                      <p className="text-xs text-gray-500">{new Date(reg.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Mail size={12} className="text-purple-400 shrink-0" />
                      <span className="truncate">{reg.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Phone size={12} className="text-cyan-400 shrink-0" />
                      <span>{reg.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <BookOpen size={12} className="text-pink-400 shrink-0" />
                      <span className="truncate font-medium text-gray-300">{getCourseName(reg.courseId)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <MapPin size={12} className="text-amber-400 shrink-0" />
                      <span className="truncate">{getCityName(reg.courseId, reg.cityId)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                    <span className={`inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${reg.documentsAttached ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'}`}>
                      <FileCheck size={10} /> {reg.documentsAttached ? 'Docs Submitted' : 'No Docs'}
                    </span>
                    {getCourseDeadline(reg.courseId) && (
                      <span className="text-[0.65rem] text-gray-600 ml-auto">
                        Deadline: {getCourseDeadline(reg.courseId)}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedReg && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedReg(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative glass-card !rounded-2xl max-w-md w-full ring-1 ring-purple-500/20 max-h-[90vh] flex flex-col"
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent rounded-t-2xl z-10" />
              <button
                onClick={() => setSelectedReg(null)}
                className="absolute top-4 right-4 p-2 glass rounded-xl text-gray-500 hover:text-white transition-all z-10"
              >
                <X size={18} />
              </button>

              {/* Scrollable inner content */}
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-3 mb-6 pr-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/25 shrink-0">
                    <span className="text-base font-bold text-white">{selected.firstName[0]}{selected.lastName[0]}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selected.firstName} {selected.lastName}</h2>
                    <p className="text-xs text-gray-500">Registered {new Date(selected.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: Mail, label: 'Email', value: selected.email, color: 'text-purple-400' },
                    { icon: Phone, label: 'Phone', value: selected.phone, color: 'text-cyan-400' },
                    { icon: Map, label: 'Address', value: selected.address, color: 'text-pink-400' },
                    { icon: BookOpen, label: 'Course', value: getCourseName(selected.courseId), color: 'text-amber-400' },
                    { icon: MapPin, label: 'Location', value: getCityName(selected.courseId, selected.cityId), color: 'text-emerald-400' },
                    { icon: Calendar, label: 'Schedule', value: getDayName(selected.courseId, selected.dayId), color: 'text-blue-400' },
                  ].map(field => {
                    const Icon = field.icon
                    return (
                      <div key={field.label} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0`}>
                          <Icon size={14} className={field.color} />
                        </div>
                        <div>
                          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-500">{field.label}</p>
                          <p className="text-sm text-white font-medium mt-0.5">{field.value}</p>
                        </div>
                      </div>
                    )
                  })}

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <FileCheck size={14} className={selected.documentsAttached ? 'text-green-400' : 'text-gray-500'} />
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-500">Qualification</p>
                      <p className={`text-sm font-bold mt-0.5 ${selected.documentsAttached ? 'text-green-400' : 'text-gray-500'}`}>
                        {selected.documentsAttached ? 'Submitted' : 'Not submitted'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <User size={14} className={selected.citizenshipStatus ? 'text-blue-400' : 'text-gray-500'} />
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-500">Citizenship Status</p>
                      <p className={`text-sm font-bold mt-0.5 ${selected.citizenshipStatus ? 'text-white' : 'text-gray-500'}`}>
                        {selected.citizenshipStatus || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  {selected.documentUrls && selected.documentUrls.length > 0 && (
                    <div className="col-span-2 flex flex-col gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-500">Attached Documents</p>
                      <div className="flex flex-col gap-2 mt-1">
                        {selected.documentUrls.map((url, idx) => (
                          <a key={idx} href={url} target="_blank" rel="noreferrer" className="text-sm text-purple-400 hover:text-purple-300 underline break-all flex items-center gap-2">
                            <FileCheck size={14} /> Document {idx + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedReg(null)}
                  className="w-full btn-primary mt-6 !py-3 text-sm font-bold"
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
              <h3 className="text-lg font-bold text-white mb-2">Delete Registration?</h3>
              <p className="text-gray-400 text-sm mb-6">This will permanently remove this student&apos;s registration.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-secondary py-3 text-sm font-bold">Cancel</button>
                <button
                  onClick={() => { removeRegistration(deleteConfirm); setDeleteConfirm(null) }}
                  className="flex-1 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-sm font-bold transition-all"
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
