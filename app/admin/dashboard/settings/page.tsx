'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin-sidebar'
import { useStore, MeetingDate } from '@/lib/store'
import { motion } from 'framer-motion'
import { Settings, Save, Clock, Plus, Trash2, Calendar, X, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'

export default function SettingsManagement() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const { meetingSlots, setMeetingSlots, meetingDates, setMeetingDates } = useStore()
  const [localSlots, setLocalSlots] = useState<string[]>([])
  const [localDates, setLocalDates] = useState<MeetingDate[]>([])
  const [newSlot, setNewSlot] = useState('')
  const [newDate, setNewDate] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pwStatus, setPwStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isChangingPw, setIsChangingPw] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem('adminSession')
    if (!session) router.push('/admin/login')
    else {
      setIsAuthed(true)
      setLocalSlots(meetingSlots || [])
      setLocalDates(meetingDates || [])
    }
  }, [router, meetingSlots, meetingDates])

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.push('/admin/login')
  }

  const handleChangePassword = async () => {
    setPwStatus(null)
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwStatus({ type: 'error', message: 'Please fill in all fields.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPwStatus({ type: 'error', message: 'New passwords do not match.' })
      return
    }
    if (newPassword.length < 6) {
      setPwStatus({ type: 'error', message: 'New password must be at least 6 characters.' })
      return
    }
    setIsChangingPw(true)
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (res.ok) {
        setPwStatus({ type: 'success', message: 'Password changed! Check your email for confirmation.' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPwStatus({ type: 'error', message: data.error || 'Failed to change password.' })
      }
    } catch {
      setPwStatus({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setIsChangingPw(false)
    }
  }

  const handleAddSlot = () => {
    if (newSlot && !localSlots.includes(newSlot)) {
      const parsedSlot = parseTimeString(newSlot)
      setLocalSlots([...localSlots, parsedSlot].sort((a, b) => compareTime(a, b)))
      setNewSlot('')
    }
  }

  const handleRemoveSlot = (slotToRemove: string) => {
    setLocalSlots(localSlots.filter(slot => slot !== slotToRemove))
  }

  const handleAddDate = () => {
    if (newDate && !localDates.find(d => d.date === newDate)) {
      setLocalDates([...localDates, { date: newDate, slots: [...localSlots] }].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
      setNewDate('')
    }
  }

  const handleRemoveDate = (dateToRemove: string) => {
    setLocalDates(localDates.filter(d => d.date !== dateToRemove))
  }

  const handleAddSlotToDate = (date: string, slotStr: string) => {
      if (!slotStr) return
      const parsedSlot = parseTimeString(slotStr)
      setLocalDates(localDates.map(d => {
          if (d.date === date && !d.slots.includes(parsedSlot)) {
              return { ...d, slots: [...d.slots, parsedSlot].sort((a,b) => compareTime(a,b)) }
          }
          return d
      }))
  }

  const handleRemoveSlotFromDate = (date: string, slotToRemove: string) => {
      setLocalDates(localDates.map(d => {
          if (d.date === date) {
              return { ...d, slots: d.slots.filter(s => s !== slotToRemove) }
          }
          return d
      }))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setMeetingSlots(localSlots)
      setMeetingDates(localDates)
      setIsSaving(false)
    }, 500)
  }
  
  // Format basic 10:00 to 10:00 AM
  const parseTimeString = (time: string) => {
    if (time.includes('AM') || time.includes('PM')) return time
    try {
      const [hours, minutes] = time.split(':')
      let h = parseInt(hours)
      const ampm = h >= 12 ? 'PM' : 'AM'
      if (h > 12) h -= 12
      if (h === 0) h = 12
      return `${h.toString().padStart(2, '0')}:${minutes} ${ampm}`
    } catch (e) {
      return time
    }
  }
  
  const compareTime = (timeA: string, timeB: string) => {
      const getMin = (t: string) => {
          let [hStr, rest] = t.split(':')
          if (!rest) return 0
          let [mStr, ampm] = rest.split(' ')
          let h = parseInt(hStr)
          let m = parseInt(mStr)
          if (ampm === 'PM' && h < 12) h += 12
          if (ampm === 'AM' && h === 12) h = 0
          return h * 60 + m
      }
      return getMin(timeA) - getMin(timeB)
  }

  if (!isAuthed) return null

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 overflow-auto md:ml-64 relative z-10">
        <div className="p-6 md:p-10 max-w-4xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest">
                  <Settings size={11} /> Settings
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
              <p className="text-slate-600 mt-1 text-sm">Manage configuration options</p>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 btn-primary !py-3 !px-6 text-sm font-bold shrink-0 shadow-sm"
            >
              {isSaving ? (
                 <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"/> Saving...</span>
              ) : (
                <><Save size={16} /> Save Changes</>
              )}
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
                <Clock className="text-indigo-600" size={20} /> Admission Meeting Time Slots
              </h2>
              <p className="text-slate-600 text-sm mb-6">
                Configure the available time slots that students can select from when scheduling their admission interview upon successful enrollment.
              </p>

              <div className="flex gap-3 mb-8 max-w-sm">
                <input 
                    type="time" 
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium shadow-sm focus:border-indigo-600"
                />
                <button 
                  onClick={handleAddSlot}
                  disabled={!newSlot}
                  className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus size={18} /> Add
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {localSlots.map(slot => (
                  <div key={slot} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl group">
                    <span className="font-bold text-slate-800 text-sm">{slot}</span>
                    <button 
                      onClick={() => handleRemoveSlot(slot)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              
              {localSlots.length === 0 && (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl border-dashed">
                      <Clock size={32} className="text-slate-400 mx-auto mb-3 opacity-50" />
                      <p className="text-slate-600 font-medium">No time slots configured.</p>
                      <p className="text-slate-400 text-xs mt-1">Students won't be able to pick a time for their meeting.</p>
                  </div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
                <Clock className="text-indigo-600" size={20} /> Admission Meeting Dates
              </h2>
              <p className="text-slate-600 text-sm mb-6">
                Configure specific dates when you are available for admission meetings. If no dates are added, students can pick any date 3 days from today.
              </p>

              <div className="flex gap-3 mb-8 max-w-sm">
                <input 
                    type="date" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium shadow-sm focus:border-indigo-600"
                />
                <button 
                  onClick={handleAddDate}
                  disabled={!newDate}
                  className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus size={18} /> Add
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {localDates.map(dateObj => (
                  <div key={dateObj.date} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200/60">
                      <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                         <Calendar className="text-indigo-500" size={18} />
                         {new Date(dateObj.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </h4>
                      <button 
                        onClick={() => handleRemoveDate(dateObj.date)}
                        className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 size={14} /> Remove Date
                      </button>
                    </div>

                    <div className="space-y-3">
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time Slots for this date</p>
                       <div className="flex flex-wrap gap-2">
                         {dateObj.slots.map(slot => (
                           <div key={slot} className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg pl-3 pr-1 py-1 text-sm font-bold text-slate-700 shadow-sm">
                             {slot}
                             <button 
                               onClick={() => handleRemoveSlotFromDate(dateObj.date, slot)}
                               className="p-1 hover:bg-rose-50 hover:text-rose-600 rounded text-slate-400 transition-colors"
                             >
                               <X size={14} />
                             </button>
                           </div>
                         ))}
                         {dateObj.slots.length === 0 && (
                            <span className="text-sm text-slate-400 italic">No slots added.</span>
                         )}
                       </div>

                       <div className="flex gap-2 mt-2 max-w-[200px]">
                           <input 
                             type="time" 
                             id={`time-${dateObj.date}`}
                             className="flex-1 px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 font-medium shadow-sm focus:border-indigo-600"
                           />
                           <button 
                             onClick={() => {
                                const input = document.getElementById(`time-${dateObj.date}`) as HTMLInputElement
                                if (input) {
                                    handleAddSlotToDate(dateObj.date, input.value)
                                    input.value = ''
                                }
                             }}
                             className="px-3 py-1.5 bg-slate-200 hover:bg-indigo-100 hover:text-indigo-700 text-slate-700 rounded-lg font-bold transition-colors text-sm"
                           >
                             Add Slot
                           </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {localDates.length === 0 && (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl border-dashed">
                      <Clock size={32} className="text-slate-400 mx-auto mb-3 opacity-50" />
                      <p className="text-slate-600 font-medium">No specific dates configured.</p>
                      <p className="text-slate-400 text-xs mt-1">Students will be able to pick any date starting 3 days from now.</p>
                  </div>
              )}
            </div>
          </motion.div>

          {/* Change Password */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
                <Lock className="text-rose-600" size={20} /> Change Admin Password
              </h2>
              <p className="text-slate-600 text-sm mb-6">Update your admin login password. A confirmation email with the new password will be sent to your admin email.</p>

              <div className="max-w-md space-y-4">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                    />
                    <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors">
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 chars)"
                      className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                    />
                    <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors">
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                    />
                    <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Status */}
                {pwStatus && (
                  <div className={`flex items-center gap-2.5 p-3.5 rounded-xl text-sm font-medium ${
                    pwStatus.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-rose-50 border border-rose-200 text-rose-700'
                  }`}>
                    {pwStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {pwStatus.message}
                  </div>
                )}

                <button
                  onClick={handleChangePassword}
                  disabled={isChangingPw}
                  className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChangingPw ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Changing...</>
                  ) : (
                    <><Lock size={16} /> Change Password</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
