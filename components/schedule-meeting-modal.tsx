'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, User, CheckCircle2, Clock } from 'lucide-react'
import { useStore } from '@/lib/store'

interface ScheduleMeetingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ScheduleMeetingModal({ isOpen, onClose }: ScheduleMeetingModalProps) {
  const [step, setStep] = useState<'details' | 'success'>('details')
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', meetingDate: '', meetingTime: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { addRegistration, meetingDates: storeMeetingDates, meetingSlots, registrations } = useStore()
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setStep('details')
      setFormData({ firstName: '', lastName: '', email: '', phone: '', meetingDate: '', meetingTime: '' })
      setIsSubmitting(false)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  // For general meetings: show ALL admin-configured dates (no day restriction)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const allMeetingDates = (storeMeetingDates || []).filter(md => new Date(md.date + 'T00:00:00') >= today)
  const globalSlots = meetingSlots || []

  // Get slots for the selected date, filtered to remove already-booked ones
  const getSlotsForDate = (dateStr: string) => {
    if (!dateStr) return []
    const dateObj = allMeetingDates.find(md => md.date === dateStr)
    const base = (dateObj && dateObj.slots.length > 0) ? dateObj.slots : globalSlots
    return base.filter(slot => !registrations.some(reg => reg.meetingDate === dateStr && reg.meetingTime === slot))
  }

  const availableSlots = getSlotsForDate(formData.meetingDate)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'meetingDate') {
      setFormData(prev => ({ ...prev, meetingDate: value, meetingTime: '' }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const newId = crypto.randomUUID()
      await addRegistration({
        id: newId,
        courseId: '00000000-0000-0000-0000-000000000000',
        cityId: '00000000-0000-0000-0000-000000000000',
        dayId: '00000000-0000-0000-0000-000000000000',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: 'N/A',
        documentsAttached: false,
        meetingDate: formData.meetingDate,
        meetingTime: formData.meetingTime,
        createdAt: new Date().toISOString()
      })

      await fetch('/api/schedule-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          meetingDate: formData.meetingDate,
          meetingTime: formData.meetingTime,
          isGeneralQuery: true
        }),
      })

      setStep('success')
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const isFormValid = formData.firstName && formData.email && formData.phone && formData.meetingDate && formData.meetingTime

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <button onClick={onClose} className="absolute top-5 right-5 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-[100]"><X size={20} /></button>
          <div className="relative p-6 sm:p-8 bg-slate-900 overflow-hidden shrink-0">
            <h2 className="text-2xl font-bold text-white relative z-10 flex items-center gap-3"><Calendar className="text-indigo-400" size={24} /> Schedule a Meeting</h2>
            <p className="text-slate-300 mt-2 relative z-10 text-sm max-w-md">Book a quick chat with our team if you have any issues or queries.</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
            <AnimatePresence mode="wait">
              {step === 'details' && (
                <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  
                  {/* Personal Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><User className="text-indigo-600" size={18} /> Your Details</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase ml-1">First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="First Name" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase ml-1">Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="Last Name" />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700 uppercase ml-1">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="email@example.com" />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700 uppercase ml-1 flex items-center gap-1">Phone Number <span className="text-rose-500">*</span></label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="+44 7700 900000" />
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Date & Time */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Calendar className="text-indigo-600" size={18} /> Select Date &amp; Time</h3>
                    
                    {/* Date picker */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase ml-1 block">Select Date</label>
                      {allMeetingDates.length > 0 ? (
                        <select
                          name="meetingDate"
                          value={formData.meetingDate}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none"
                        >
                          <option value="" disabled>Select a date</option>
                          {allMeetingDates.map(dateObj => (
                            <option key={dateObj.date} value={dateObj.date}>
                              {new Date(dateObj.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-sm text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-200">No dates currently configured. Please check back soon.</p>
                      )}
                    </div>

                    {/* Time slots — only shown once a date is selected */}
                    {formData.meetingDate && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase ml-1 block">
                          Select Time Slot <span className="text-indigo-500 lowercase normal-case">(UK Time)</span>
                        </label>
                        {availableSlots.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {availableSlots.map(slot => (
                              <button
                                key={slot}
                                onClick={() => setFormData(prev => ({ ...prev, meetingTime: slot }))}
                                className={`py-3 px-2 rounded-xl text-sm font-bold border transition-all duration-200 flex items-center justify-center gap-1.5 ${formData.meetingTime === slot ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20' : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'}`}
                              >
                                <Clock size={13} />
                                {slot}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                            <Clock size={28} className="text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500 font-medium">No slots available for this date.</p>
                            <p className="text-xs text-slate-400 mt-1">Please select a different date.</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!isFormValid || isSubmitting}
                    className="w-full btn-primary !py-4 font-bold flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"/> Scheduling...</span> : 'Confirm Meeting'}
                  </button>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 px-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Meeting Scheduled!</h3>
                  <p className="text-slate-600 mb-8 max-w-sm mx-auto">We&apos;ve sent a calendar invitation to <strong>{formData.email}</strong> with the Google Meet link.</p>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 max-w-sm mx-auto text-left">
                    <p className="text-sm text-slate-700 flex items-center gap-2 mb-2"><Calendar size={16} className="text-slate-400"/> {new Date(formData.meetingDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="text-sm text-slate-700 flex items-center gap-2"><Clock size={16} className="text-slate-400"/> {formData.meetingTime}</p>
                  </div>

                  <button onClick={onClose} className="btn-secondary w-full max-w-xs mx-auto font-bold">Close</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
