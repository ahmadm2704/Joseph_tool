'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, MapPin, Calendar, User, ChevronRight, CheckCircle2, Building, Mail, Phone, Map, FileText, Upload, Sparkles, Star } from 'lucide-react'
import { useStore, Course, City, Day } from '@/lib/store'

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  courses: Course[]
}

type FormStep = 'course' | 'city' | 'day' | 'personal' | 'documents' | 'success'

interface FormData {
  courseId: string
  cityId: string
  dayId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  documentsAttached: boolean
}

const steps = [
  { id: 'course', label: 'Course', icon: BookOpen },
  { id: 'city', label: 'Location', icon: MapPin },
  { id: 'day', label: 'Schedule', icon: Calendar },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'personal', label: 'Details', icon: User },
]

export default function RegistrationModal({ isOpen, onClose, courses }: RegistrationModalProps) {
  const [step, setStep] = useState<FormStep>('course')
  const [formData, setFormData] = useState<FormData>({ courseId: '', cityId: '', dayId: '', firstName: '', lastName: '', email: '', phone: '', address: '', documentsAttached: false })
  const [focused, setFocused] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addRegistration } = useStore()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const handleCourseSelect = (courseId: string) => { setFormData({ ...formData, courseId, cityId: '', dayId: '' }); setStep('city') }
  const handleCitySelect = (cityId: string) => { setFormData({ ...formData, cityId, dayId: '' }); setStep('day') }
  const handleDaySelect = (dayId: string) => { setFormData({ ...formData, dayId }); setStep('documents') }
  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }) }
  const handleDocumentSkipOrNext = () => { setStep('personal') }
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files.length > 0) setFormData({ ...formData, documentsAttached: true }) }

  const handleSubmit = () => {
    if (formData.firstName && formData.lastName && formData.email && formData.phone && formData.address) {
      addRegistration({ id: Date.now().toString(), ...formData, createdAt: new Date().toISOString() })
      setStep('success')
    }
  }

  const handleClose = () => {
    setStep('course')
    setFormData({ courseId: '', cityId: '', dayId: '', firstName: '', lastName: '', email: '', phone: '', address: '', documentsAttached: false })
    onClose()
  }

  const getStepIndex = (currentStep: FormStep) => currentStep === 'success' ? 5 : steps.findIndex(s => s.id === currentStep)
  const currentStepIndex = getStepIndex(step)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop with intense blur */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#050510]/80 backdrop-blur-xl"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] glass-card !rounded-3xl shadow-2xl shadow-purple-900/30 ring-1 ring-purple-500/20"
          >
            {/* Inner Glow */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-600/20 blur-[80px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="px-8 py-7 border-b border-white/5 sticky top-0 z-10 flex justify-between items-center bg-[rgba(12,12,35,0.7)] backdrop-blur-2xl">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Sparkles className="text-white" size={16} />
                  </div>
                  Secure Registration
                </h2>
                <p className="text-sm text-gray-400 mt-1.5 font-medium tracking-wide">Join our premium professional training programs</p>
              </div>
              <button onClick={handleClose} className="p-2.5 text-gray-500 hover:text-white glass rounded-xl transition-all hover:bg-white/10 group">
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Progress Stepper */}
            {step !== 'success' && (
              <div className="px-8 pt-7 pb-3 bg-[rgba(12,12,35,0.3)] relative z-10">
                <div className="flex justify-between relative">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -translate-y-1/2 z-0 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 animated-gradient rounded-full"
                      initial={{ width: '0%' }} animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }} transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                  </div>
                  
                  {steps.map((s, i) => {
                    const StepIcon = s.icon
                    const isCompleted = i < currentStepIndex
                    const isCurrent = i === currentStepIndex
                    return (
                      <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                        <motion.div animate={{ scale: isCurrent ? 1.15 : 1 }}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                            isCompleted ? 'bg-gradient-to-br from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/30' : 
                            isCurrent ? 'bg-gradient-to-br from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/30 ring-4 ring-purple-500/20' : 
                            'glass bg-white/5 text-gray-500 border border-white/5'
                          }`}>
                          {isCompleted ? <CheckCircle2 size={18} className="animate-in zoom-in duration-300" /> : <StepIcon size={16} />}
                        </motion.div>
                        <span className={`text-[0.65rem] uppercase tracking-widest font-bold ${isCurrent || isCompleted ? 'text-gray-300' : 'text-gray-600'}`}>{s.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="p-8 overflow-y-auto relative z-10">
              <AnimatePresence mode="wait">
                
                {step === 'course' && (
                  <motion.div key="course" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 tracking-tight">
                      <BookOpen className="text-purple-400" size={20} /> Select Your Program
                    </h3>
                    <div className="grid gap-4">
                      {courses.map((course: Course) => (
                        <button key={course.id} onClick={() => handleCourseSelect(course.id)} className="w-full text-left glass-card-static bg-white/[0.02] border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">{course.name}</span>
                              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-wider"><Star size={10} className="fill-amber-400"/> 4.9</div>
                            </div>
                            <div className="text-sm text-gray-500 mt-1 line-clamp-1">{course.description}</div>
                            <div className="flex gap-2 mt-4">
                              <span className="tag-pill bg-purple-500/10 text-purple-300 border-purple-500/10">{course.cities?.length || 0} Locations</span>
                              <span className="tag-pill bg-cyan-500/10 text-cyan-300 border-cyan-500/10">{course.days?.length || 0} Schedules</span>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-xl glass bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 group-hover:shadow-lg shadow-purple-500/30 group-hover:scale-110">
                            <ChevronRight size={18} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 'city' && (
                  <motion.div key="city" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 tracking-tight">
                      <MapPin className="text-cyan-400" size={20} /> Select Training Location
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {courses.find((c: Course) => c.id === formData.courseId)?.cities?.map((city: City) => (
                        <button key={city.id} onClick={() => handleCitySelect(city.id)} className="w-full text-left glass-card-static bg-white/[0.02] border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/20">
                              <Building size={20} />
                            </div>
                            <div className="font-bold text-white text-lg group-hover:text-cyan-300 transition-colors">{city.name}</div>
                          </div>
                          <ChevronRight size={18} className="text-gray-500 group-hover:text-cyan-400" />
                        </button>
                      ))}
                    </div>
                    <div className="pt-8 mt-4 border-t border-white/5"><button onClick={() => setStep('course')} className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-2">← Back to programs</button></div>
                  </motion.div>
                )}

                {step === 'day' && (
                  <motion.div key="day" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 tracking-tight">
                      <Calendar className="text-pink-400" size={20} /> Choose your schedule
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {courses.find((c: Course) => c.id === formData.courseId)?.days?.map((day: Day) => (
                        <button key={day.id} onClick={() => handleDaySelect(day.id)} className="w-full text-left glass-card-static bg-white/[0.02] border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 group">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-pink-500/20">
                              <Calendar size={20} />
                            </div>
                            <div className="font-bold text-white text-lg group-hover:text-pink-300 transition-colors">{day.name}</div>
                          </div>
                          <div className="text-sm text-gray-400 font-medium pl-16 flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span></span> {day.date}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="pt-8 mt-4 border-t border-white/5"><button onClick={() => setStep('city')} className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-2">← Back to locations</button></div>
                  </motion.div>
                )}

                {step === 'documents' && (
                  <motion.div key="documents" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 tracking-tight"><FileText className="text-purple-400" size={20} /> Optional Documents</h3>
                    <p className="text-gray-400 text-sm">Upload transcripts, CV, or prior certifications to accelerate your placement.</p>

                    <div 
                      className={`glass-card-static border-dashed border-2 rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer relative overflow-hidden ${formData.documentsAttached ? 'border-green-500/40 bg-green-500/5' : 'border-white/10 hover:border-purple-500/40 bg-white/[0.02] hover:bg-purple-500/5'}`}
                      onClick={() => !formData.documentsAttached && fileInputRef.current?.click()}
                    >
                      <input type="file" ref={fileInputRef} onChange={handleDocumentUpload} className="hidden" multiple />
                      {!formData.documentsAttached ? (
                        <>
                          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-purple-500/20 group-hover:scale-105 transition-transform"><Upload size={28} className="text-white" /></div>
                          <h4 className="text-white font-bold text-lg mb-2">Upload your documents</h4>
                          <p className="text-gray-500 text-sm mb-6">Drag and drop or click to browse</p>
                          <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }} className="btn-secondary text-sm">Browse Files</button>
                        </>
                      ) : (
                        <>
                          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-green-500/20"><CheckCircle2 size={32} className="text-white" /></div>
                          <h4 className="text-green-400 font-bold text-lg mb-2">Documents Attached</h4>
                          <p className="text-green-500/60 text-sm mb-6">Your files are ready for review.</p>
                          <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }} className="text-sm font-bold tracking-wide text-green-400 hover:text-green-300 transition-colors uppercase">Upload different files</button>
                        </>
                      )}
                    </div>

                    <div className="flex gap-4 pt-6 mt-4 border-t border-white/5">
                      <button onClick={() => setStep('day')} className="w-1/3 py-4 px-4 btn-secondary text-sm font-bold">Back</button>
                      <button onClick={handleDocumentSkipOrNext} className="w-2/3 btn-primary text-sm flex items-center justify-center gap-2 !py-4 font-bold">
                        {formData.documentsAttached ? 'Continue to Details' : 'Skip & Continue'} <ChevronRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'personal' && (
                  <motion.div key="personal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 tracking-tight"><User className="text-purple-400" size={20} /> Personal Details</h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest text-gray-400 uppercase ml-1">First Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input type="text" name="firstName" value={formData.firstName} onChange={handlePersonalChange} onFocus={() => setFocused('fn')} onBlur={() => setFocused(null)} className={`w-full pl-12 pr-4 py-4 glass-input text-white font-medium placeholder:text-gray-600 ${focused==='fn'?'border-purple-500/50 glow-purple bg-white/[0.05]':''}`} placeholder="John" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest text-gray-400 uppercase ml-1">Last Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input type="text" name="lastName" value={formData.lastName} onChange={handlePersonalChange} onFocus={() => setFocused('ln')} onBlur={() => setFocused(null)} className={`w-full pl-12 pr-4 py-4 glass-input text-white font-medium placeholder:text-gray-600 ${focused==='ln'?'border-purple-500/50 glow-purple bg-white/[0.05]':''}`} placeholder="Doe" />
                        </div>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-bold tracking-widest text-gray-400 uppercase ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input type="email" name="email" value={formData.email} onChange={handlePersonalChange} onFocus={() => setFocused('em')} onBlur={() => setFocused(null)} className={`w-full pl-12 pr-4 py-4 glass-input text-white font-medium placeholder:text-gray-600 ${focused==='em'?'border-purple-500/50 glow-purple bg-white/[0.05]':''}`} placeholder="john.doe@example.com" />
                        </div>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-bold tracking-widest text-gray-400 uppercase ml-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                          <input type="tel" name="phone" value={formData.phone} onChange={handlePersonalChange} onFocus={() => setFocused('ph')} onBlur={() => setFocused(null)} className={`w-full pl-12 pr-4 py-4 glass-input text-white font-medium placeholder:text-gray-600 ${focused==='ph'?'border-purple-500/50 glow-purple bg-white/[0.05]':''}`} placeholder="+1 (555) 000-0000" />
                        </div>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-bold tracking-widest text-gray-400 uppercase ml-1">Home Address</label>
                        <div className="relative">
                          <Map className="absolute left-4 top-4 text-gray-500" size={18} />
                          <textarea name="address" value={formData.address} onChange={handlePersonalChange} onFocus={() => setFocused('ad')} onBlur={() => setFocused(null)} className={`w-full pl-12 pr-4 py-4 glass-input text-white font-medium placeholder:text-gray-600 resize-none min-h-[100px] ${focused==='ad'?'border-purple-500/50 glow-purple bg-white/[0.05]':''}`} rows={3} placeholder="Full Address" />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6 mt-4 border-t border-white/5">
                      <button onClick={() => setStep('documents')} className="w-1/3 py-4 px-4 btn-secondary text-sm font-bold">Back</button>
                      <button onClick={handleSubmit} disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address} className="w-2/3 btn-primary text-sm flex items-center justify-center gap-2 !py-4 font-bold disabled:opacity-30 disabled:cursor-not-allowed">
                        <CheckCircle2 size={18} /> Complete Registration
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 px-4 relative z-10">
                    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }} className="w-28 h-28 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/40 border-4 border-[#050510]">
                      <CheckCircle2 size={56} className="text-white" />
                    </motion.div>
                    <h3 className="text-4xl font-bold text-white mb-4 tracking-tight">You&apos;re in!</h3>
                    <p className="text-gray-400 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
                      Your seat is secured. We&apos;ve sent a confirmation email to <br/><span className="font-bold text-purple-300">{formData.email}</span>
                    </p>
                    <button onClick={handleClose} className="w-full max-w-xs mx-auto btn-primary !py-4 text-base font-bold">Return to Dashboard</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
