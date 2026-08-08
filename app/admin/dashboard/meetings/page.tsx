'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin-sidebar'
import { useStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Download, Eye, X, Users, User, Search, Mail, Phone, MapPin, Calendar, BookOpen, FileCheck, Map, Video, Clock, CheckCircle2, Plus, ExternalLink } from 'lucide-react'

export default function MeetingsManagement() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [selectedReg, setSelectedReg] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [schedulingFor, setSchedulingFor] = useState<string | null>(null)
  const [schedDate, setSchedDate] = useState('')
  const [schedTime, setSchedTime] = useState('')
  const [isScheduling, setIsScheduling] = useState(false)
  const [schedResult, setSchedResult] = useState<{ meetLink?: string; eventLink?: string } | null>(null)
  const { registrations, removeRegistration, updateRegistration, courses, meetingSlots } = useStore()

  useEffect(() => {
    const session = localStorage.getItem('adminSession')
    if (!session) router.push('/admin/login')
    else setIsAuthed(true)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.push('/admin/login')
  }

  const getCourseName = (courseId: string) => {
    if (courseId === '00000000-0000-0000-0000-000000000000') return 'General Query Meeting'
    return courses.find(c => c.id === courseId)?.name || 'Unknown Course'
  }
  
  const getCityName = (courseId: string, cityId: string) => {
    if (courseId === '00000000-0000-0000-0000-000000000000') return 'Online'
    const course = courses.find(c => c.id === courseId)
    return course?.cities?.find(c => c.id === cityId)?.name || 'Unknown Location'
  }
  
  const getDayName = (courseId: string, dayId: string) => {
    if (courseId === '00000000-0000-0000-0000-000000000000') return 'Direct Meeting'
    const course = courses.find(c => c.id === courseId)
    const day = course?.days?.find(d => d.id === dayId)
    return day ? `${day.name} (${day.date})` : 'Unknown Schedule'
  }

  const handleExportCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Meeting Date', 'Meeting Time', 'Date Created']
    const rows = generalMeetings.map(reg => [
      reg.firstName,
      reg.lastName,
      reg.email,
      reg.phone,
      reg.meetingDate ? `"${new Date(reg.meetingDate).toLocaleDateString()}"` : 'Not Scheduled',
      `"${reg.meetingTime || ''}"`,
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

  const handleAdminSchedule = async () => {
    const reg = registrations.find(r => r.id === schedulingFor)
    if (!reg || !schedDate || !schedTime) return
    setIsScheduling(true)
    setSchedResult(null)
    try {
      await updateRegistration(reg.id, { meetingDate: schedDate, meetingTime: schedTime })
      const res = await fetch('/api/schedule-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: reg.firstName,
          lastName: reg.lastName,
          email: reg.email,
          meetingDate: schedDate,
          meetingTime: schedTime,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSchedResult({ meetLink: data.meetLink, eventLink: data.eventLink })
      } else {
        console.error('Calendar error:', data.error)
        setSchedResult({})
      }
    } catch (err) {
      console.error('Scheduling error:', err)
      setSchedResult({})
    } finally {
      setIsScheduling(false)
    }
  }

  const openScheduler = (regId: string) => {
    const reg = registrations.find(r => r.id === regId)
    // Pre-fill with existing date/time if already scheduled
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const yyyy = tomorrow.getFullYear()
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0')
    const dd = String(tomorrow.getDate()).padStart(2, '0')
    setSchedDate(reg?.meetingDate || `${yyyy}-${mm}-${dd}`)
    setSchedTime(reg?.meetingTime || '')
    setSchedResult(null)
    setSchedulingFor(regId)
  }

  const filtered = registrations.filter(r =>
    r.courseId === '00000000-0000-0000-0000-000000000000' && 
    `${r.firstName} ${r.lastName} ${r.email} ${r.phone}`.toLowerCase().includes(search.toLowerCase())
  )

  const generalMeetings = registrations.filter(r => r.courseId === '00000000-0000-0000-0000-000000000000')

  if (!isAuthed) return null

  const selected = registrations.find(r => r.id === selectedReg)
  const schedulingReg = registrations.find(r => r.id === schedulingFor)

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
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">General Meetings</h1>
              <p className="text-slate-600 mt-1 text-sm">{generalMeetings.length} total meetings</p>
            </div>
            {generalMeetings.length > 0 && (
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
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Contact</th>
                      <th className="py-4 px-6 text-center">Meeting Date & Time</th>
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
                        <td className="py-4 px-6 text-center">
                          {reg.meetingDate ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                              <CheckCircle2 size={11} />
                              {new Date(reg.meetingDate).toLocaleDateString()} {reg.meetingTime}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold border border-slate-200">
                              <Clock size={11} />
                              Not Scheduled
                            </span>
                          )}
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
                              onClick={() => openScheduler(reg.id)}
                              className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-xl transition-all"
                              title="Schedule Meeting"
                            >
                              <Video size={15} />
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

              <div className="p-6 md:p-8 overflow-y-auto">
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
                    { icon: Phone, label: 'Phone', value: selected.phone, color: 'text-cyan-600' }
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



                  <div className={`flex items-center gap-3 p-3.5 rounded-2xl border ${selected.meetingDate ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                      <Video size={15} className={selected.meetingDate ? 'text-indigo-600' : 'text-slate-400'} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">Admission Meeting</p>
                      <p className={`text-sm font-bold mt-0.5 ${selected.meetingDate ? 'text-indigo-700' : 'text-slate-500'}`}>
                        {selected.meetingDate ? `${new Date(selected.meetingDate).toLocaleDateString()} at ${selected.meetingTime}` : 'Not Scheduled'}
                      </p>
                    </div>
                    <button
                      onClick={() => { setSelectedReg(null); openScheduler(selected.id) }}
                      className="shrink-0 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                      title="Schedule or Reschedule Meeting"
                    >
                      <Plus size={14} />
                    </button>
                  </div>


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

      {/* Admin Scheduler Modal */}
      <AnimatePresence>
        {schedulingFor && schedulingReg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => { if (!isScheduling) { setSchedulingFor(null); setSchedResult(null) } }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl z-10 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                    <Video size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Schedule Meeting</h2>
                    <p className="text-xs text-slate-500 font-medium">{schedulingReg.firstName} {schedulingReg.lastName} &bull; {schedulingReg.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setSchedulingFor(null); setSchedResult(null) }}
                  className="p-2 bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all"
                  disabled={isScheduling}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {schedResult ? (
                  /* Success State */
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">Meeting Scheduled!</h3>
                    <p className="text-slate-500 text-sm mb-5">
                      The calendar event has been created and an invite sent to <span className="font-bold text-slate-700">{schedulingReg.email}</span>.
                    </p>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-left space-y-2 mb-5">
                      <p className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Meeting Details</p>
                      <p className="text-sm font-bold text-slate-900">
                        {schedDate && new Date(schedDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {schedTime}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {schedResult.meetLink && (
                        <a href={schedResult.meetLink} target="_blank" rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors">
                          <Video size={15} /> Open Meet
                        </a>
                      )}
                      {schedResult.eventLink && (
                        <a href={schedResult.eventLink} target="_blank" rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-sm transition-colors">
                          <ExternalLink size={15} /> View Event
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => { setSchedulingFor(null); setSchedResult(null) }}
                      className="w-full mt-3 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  /* Schedule Form */
                  <>
                    {schedulingReg.meetingDate && (
                      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-semibold">
                        <Clock size={13} />
                        Currently scheduled: {new Date(schedulingReg.meetingDate).toLocaleDateString()} at {schedulingReg.meetingTime}. This will be overwritten.
                      </div>
                    )}

                    {/* Date */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Select Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="date"
                          value={schedDate}
                          onChange={e => setSchedDate(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:border-indigo-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Time slots */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Select Time Slot</label>
                      {meetingSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {meetingSlots.map(slot => (
                            <button
                              key={slot}
                              onClick={() => setSchedTime(slot)}
                              className={`py-3 px-2 rounded-xl text-sm font-bold border transition-all duration-200 ${schedTime === slot ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20' : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50'}`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-semibold">
                          No time slots configured. Go to <span className="underline">Settings</span> to add time slots.
                        </div>
                      )}
                    </div>

                    {/* Custom time input fallback */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Or Type a Custom Time</label>
                      <input
                        type="time"
                        onChange={e => {
                          // Convert HH:MM to "HH:MM AM/PM"
                          const [h, m] = e.target.value.split(':').map(Number)
                          if (!isNaN(h) && !isNaN(m)) {
                            const ampm = h >= 12 ? 'PM' : 'AM'
                            const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h
                            setSchedTime(`${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`)
                          }
                        }}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-indigo-600 focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={handleAdminSchedule}
                      disabled={!schedDate || !schedTime || isScheduling}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-colors shadow-md shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isScheduling ? (
                        <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Scheduling...</>
                      ) : (
                        <><Video size={16} /> Schedule & Send Invite</>
                      )}
                    </button>
                  </>
                )}
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
