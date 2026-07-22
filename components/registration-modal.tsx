'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, MapPin, Calendar, User, ChevronRight, CheckCircle2, Building, Mail, Phone, Map, FileText, UploadCloud, FileCheck, Sparkles, Star, Clock, AlertCircle, Layers, Wifi } from 'lucide-react'
import { useStore, Course, City, Day } from '@/lib/store'
import { supabase } from '@/lib/supabase'

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  courses: Course[]
}

type FormStep = 'course' | 'city' | 'day' | 'documents' | 'qualification' | 'personal' | 'success'

interface FormData {
  courseId: string
  cityId: string
  dayId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  citizenshipStatus: string
  citizenshipDocsAttached: boolean
  documentsAttached: boolean
}

const steps = [
  { id: 'course', label: 'Course', icon: BookOpen },
  { id: 'city', label: 'Location', icon: MapPin },
  { id: 'day', label: 'Schedule', icon: Calendar },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'qualification', label: 'Qualification', icon: FileText },
  { id: 'personal', label: 'Details', icon: User },
]

export default function RegistrationModal({ isOpen, onClose, courses }: RegistrationModalProps) {
  const [step, setStep] = useState<FormStep>('course')
  const [formData, setFormData] = useState<FormData>({ courseId: '', cityId: '', dayId: '', firstName: '', lastName: '', email: '', phone: '', address: '', citizenshipStatus: '', citizenshipDocsAttached: false, documentsAttached: false })
  const [focused, setFocused] = useState<string | null>(null)
  const [citizenshipFiles, setCitizenshipFiles] = useState<File[]>([])
  const [qualificationFiles, setQualificationFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
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
  const handleCitizenshipSkipOrNext = () => { setStep('qualification') }
  const handleDocumentSkipOrNext = () => { setStep('personal') }
  
  const handleCitizenshipDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number, status: string) => { 
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setCitizenshipFiles(prev => {
        const next = [...prev];
        next[index] = file;
        const reqs = citizenshipRequirements[status as keyof typeof citizenshipRequirements] || [];
        const isAllRequiredUploaded = reqs.every((r, idx) => !r.required || !!next[idx]);
        setFormData(fd => ({ ...fd, citizenshipDocsAttached: isAllRequiredUploaded }));
        return next;
      });
    } 
  }

  const citizenshipRequirements = {
    'British Citizens': [
      { name: 'Passport', required: true },
      { name: 'Proof of Address', required: false },
      { name: 'National Insurance Number', required: true },
    ],
    'Non-British Students': [
      { name: 'Passport', required: true },
      { name: 'Share Code', required: true },
      { name: 'Proof of Address', required: false },
      { name: 'National Insurance Number', required: true },
      { name: 'Work Reference (if currently working)', required: false },
    ],
    'Students with ILR': [
      { name: 'Passport', required: true },
      { name: 'ILR (Indefinite Leave to Remain)', required: false },
      { name: 'Share Code', required: true },
      { name: 'Proof of Address', required: false },
      { name: 'National Insurance Number', required: true },
    ],
    'Pre-Settled Status Applicants': [
      { name: 'Last 3 months payslips', required: true },
      { name: 'Employer contract', required: true },
      { name: 'Last 2 years P60', required: true },
    ]
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => { 
    if (e.target.files && e.target.files.length > 0) {
      setQualificationFiles(Array.from(e.target.files))
      setFormData({ ...formData, documentsAttached: true }) 
    } 
  }

  const handleSubmit = async () => {
    if (formData.firstName && formData.lastName && formData.email && formData.phone && formData.address) {
      setIsSubmitting(true)
      try {
        const fileUrls: string[] = []
        const allFiles = [...citizenshipFiles.filter(Boolean), ...qualificationFiles.filter(Boolean)]
        
        for (const file of allFiles) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${crypto.randomUUID()}.${fileExt}`
          const { data } = await supabase.storage.from('documents').upload(fileName, file)
          
          if (data) {
            const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName)
            if (urlData) {
              fileUrls.push(urlData.publicUrl)
            }
          }
        }
        
        await addRegistration({ id: crypto.randomUUID(), ...formData, documentUrls: fileUrls, createdAt: new Date().toISOString() })
        setStep('success')
      } catch (error) {
        console.error("Upload error", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleClose = () => {
    setStep('course')
    setFormData({ courseId: '', cityId: '', dayId: '', firstName: '', lastName: '', email: '', phone: '', address: '', citizenshipStatus: '', citizenshipDocsAttached: false, documentsAttached: false })
    setCitizenshipFiles([])
    setQualificationFiles([])
    onClose()
  }

  const getStepIndex = (currentStep: FormStep) => currentStep === 'success' ? 5 : steps.findIndex(s => s.id === currentStep)
  const currentStepIndex = getStepIndex(step)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop with soft blur */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-200 sticky top-0 z-10 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                    <Sparkles size={16} />
                  </div>
                  Secure Registration
                </h2>
                <p className="text-sm text-slate-600 mt-1 font-medium">Join our premium professional training programs</p>
              </div>
              <button onClick={handleClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all group">
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Progress Stepper */}
            {step !== 'success' && (
              <div className="px-8 py-5 bg-slate-50 border-b border-slate-200 relative z-10">
                <div className="flex justify-between relative">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-600 rounded-full"
                      initial={{ width: '0%' }} animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }} transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                  </div>
                  
                  {steps.map((s, i) => {
                    const StepIcon = s.icon
                    const isCompleted = i < currentStepIndex
                    const isCurrent = i === currentStepIndex
                    return (
                      <div key={s.id} className="relative z-10 flex flex-col items-center gap-1.5">
                        <motion.div animate={{ scale: isCurrent ? 1.1 : 1 }}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isCompleted ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 
                            isCurrent ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-4 ring-indigo-100' : 
                            'bg-white text-slate-400 border border-slate-300'
                          }`}>
                          {isCompleted ? <CheckCircle2 size={16} /> : <StepIcon size={15} />}
                        </motion.div>
                        <span className={`text-[0.65rem] uppercase tracking-wider font-bold ${isCurrent || isCompleted ? 'text-indigo-600' : 'text-slate-400'}`}>{s.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="p-8 overflow-y-auto relative z-10 bg-white">
              <AnimatePresence mode="wait">
                
                {step === 'course' && (
                  <motion.div key="course" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 tracking-tight">
                      <BookOpen className="text-indigo-600" size={20} /> Select Your Program
                    </h3>
                    <div className="grid gap-4">
                      {courses.map((course: Course) => (
                        <button key={course.id} onClick={() => handleCourseSelect(course.id)} className="w-full text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">{course.name}</span>
                                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[0.65rem] font-bold uppercase tracking-wider shrink-0"><Star size={10} className="fill-amber-500 text-amber-500"/> 4.9</div>
                              </div>
                              <div className="text-xs text-slate-600 mb-3 line-clamp-1">{course.description}</div>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                  <Clock size={13} className="text-indigo-600 shrink-0" />
                                  <span className="font-semibold text-slate-800">{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                  <AlertCircle size={13} className="text-rose-500 shrink-0" />
                                  <span>Deadline: <span className="font-semibold text-rose-600">{course.deadline}</span></span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                  <Wifi size={13} className="text-cyan-600 shrink-0" />
                                  <span className="font-semibold text-slate-800">{course.delivery}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                  <Calendar size={13} className="text-emerald-600 shrink-0" />
                                  <span className="font-semibold text-slate-800 truncate">{course.daysSchedule}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                                <Layers size={12} className="text-amber-600 shrink-0" />
                                <span className="text-xs text-amber-900 font-medium">Requirements: {course.requirements}</span>
                              </div>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 group-hover:shadow-md group-hover:scale-105 shrink-0 mt-1 flex items-center justify-center">
                              <ChevronRight size={16} />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 'city' && (
                  <motion.div key="city" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 tracking-tight">
                      <MapPin className="text-cyan-600" size={20} /> Select Training Location
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {courses.find((c: Course) => c.id === formData.courseId)?.cities?.map((city: City) => (
                        <button key={city.id} onClick={() => handleCitySelect(city.id)} className="w-full text-left bg-white border border-slate-200 rounded-2xl p-6 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 group flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-cyan-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md shadow-cyan-500/20">
                              <Building size={20} />
                            </div>
                            <div className="font-bold text-slate-900 text-lg group-hover:text-cyan-600 transition-colors">{city.name}</div>
                          </div>
                          <ChevronRight size={18} className="text-slate-400 group-hover:text-cyan-600" />
                        </button>
                      ))}
                    </div>
                    <div className="pt-8 mt-4 border-t border-slate-200"><button onClick={() => setStep('course')} className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2">← Back to programs</button></div>
                  </motion.div>
                )}

                {step === 'day' && (
                  <motion.div key="day" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 tracking-tight">
                      <Calendar className="text-pink-600" size={20} /> Choose Your Schedule
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {courses.find((c: Course) => c.id === formData.courseId)?.days?.map((day: Day) => (
                        <button key={day.id} onClick={() => handleDaySelect(day.id)} className="w-full text-left bg-white border border-slate-200 rounded-2xl p-6 hover:border-pink-500 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 group">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 rounded-xl bg-pink-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md shadow-pink-500/20">
                              <Calendar size={20} />
                            </div>
                            <div className="font-bold text-slate-900 text-lg group-hover:text-pink-600 transition-colors">{day.name}</div>
                          </div>
                          <div className="text-sm text-slate-600 font-semibold pl-16 flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span></span> {day.date}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="pt-8 mt-4 border-t border-slate-200"><button onClick={() => setStep('city')} className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2">← Back to locations</button></div>
                  </motion.div>
                )}

                {step === 'documents' && (() => {
                  const selectedCourse = courses.find((c: Course) => c.id === formData.courseId)
                  
                  // Use course-specific custom document categories or fallback to default
                  const activeCategories: { status: string; reqs: { name: string; required: boolean }[] }[] = selectedCourse?.documentCategories
                    ? selectedCourse.documentCategories.map(c => ({
                        status: c.categoryName,
                        reqs: c.documents.map(d => ({ name: d.name, required: d.required }))
                      }))
                    : Object.entries(citizenshipRequirements).map(([status, reqs]) => ({ status, reqs }))

                  return (
                    <motion.div key="documents" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 tracking-tight">
                          <FileText className="text-indigo-600" size={20} /> Required Documents
                        </h3>
                        <p className="text-slate-600 text-sm mt-1">Please select your category/status to see required documents.</p>
                      </div>

                      <div className="space-y-4">
                        {activeCategories.map(({ status, reqs }) => (
                          <div key={status} className="flex flex-col">
                            <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${formData.citizenshipStatus === status ? 'border-indigo-600 bg-indigo-50/70 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                              <input 
                                type="radio" 
                                name="citizenshipStatus" 
                                value={status} 
                                checked={formData.citizenshipStatus === status} 
                                onChange={(e) => {
                                  setFormData({ ...formData, citizenshipStatus: e.target.value, citizenshipDocsAttached: false });
                                  setCitizenshipFiles([]);
                                }} 
                                className="hidden" 
                              />
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.citizenshipStatus === status ? 'border-indigo-600 bg-indigo-600' : 'border-slate-400'}`}>
                                {formData.citizenshipStatus === status && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                              <span className="text-slate-900 text-sm font-bold">{status}</span>
                            </label>

                            {formData.citizenshipStatus === status && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 p-5 rounded-2xl bg-slate-50 border border-slate-200 ml-6 overflow-hidden">
                                <h4 className="text-slate-900 font-bold mb-3 text-sm">Required Documents:</h4>
                                
                                {status === 'Non-British Students' && (
                                  <p className="text-indigo-600 mb-4 text-xs font-semibold flex items-center gap-2">
                                    <MapPin size={14}/> You must have lived in the UK for at least 3 years
                                  </p>
                                )}
                                
                                <div className="space-y-3">
                                  {reqs.map((req, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                                      <div className="flex items-center gap-2 flex-1 mr-4">
                                        <span className="text-slate-900 text-sm font-semibold">{req.name}</span>
                                        {req.required ? (
                                          <span className="text-[0.65rem] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 uppercase tracking-wider">Required</span>
                                        ) : (
                                          <span className="text-[0.65rem] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">Optional</span>
                                        )}
                                      </div>
                                      <div className="relative shrink-0">
                                        <input 
                                          type="file" 
                                          id={`file-${status}-${idx}`} 
                                          onChange={(e) => handleCitizenshipDocumentUpload(e, idx, status)} 
                                          className="hidden" 
                                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                                        />
                                        <label 
                                          htmlFor={`file-${status}-${idx}`} 
                                          className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all inline-block text-center min-w-[90px] ${
                                            citizenshipFiles[idx] 
                                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm' 
                                              : req.required 
                                                ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
                                                : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                                          }`}
                                        >
                                          {citizenshipFiles[idx] ? 'Uploaded' : 'Upload'}
                                        </label>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <p className="text-emerald-700 text-xs font-semibold mt-5 flex items-center gap-1.5">
                                  <CheckCircle2 size={14}/> Make sure all documents are valid and up to date
                                </p>
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <button onClick={() => setStep('day')} className="w-1/3 py-3.5 px-4 btn-secondary text-sm font-bold">Back</button>
                        <button onClick={handleCitizenshipSkipOrNext} className="w-2/3 btn-primary text-sm flex items-center justify-center gap-2 !py-3.5 font-bold">
                          {formData.citizenshipDocsAttached ? 'Continue' : 'Skip & Continue'} <ChevronRight size={18} />
                        </button>
                      </div>
                    </motion.div>
                  )
                })()}

                {step === 'qualification' && (() => {
                  const selectedCourse = courses.find((c: Course) => c.id === formData.courseId)
                  const qualCats = selectedCourse?.qualificationCategories || []

                  return (
                    <motion.div key="qualification" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 tracking-tight">
                          <FileText className="text-indigo-600" size={20} /> Upload Qualifications
                        </h3>
                        <p className="text-slate-600 text-sm mt-1">Please select your entry pathway and upload required qualification documents.</p>
                      </div>

                      {/* Entry Requirements Banner */}
                      {selectedCourse && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-200/60 flex items-center justify-center shrink-0">
                              <Layers size={16} className="text-amber-800" />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-0.5">Entry Requirements Summary</p>
                              <p className="text-sm text-amber-950 font-bold">{selectedCourse.requirements}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Qualification Categories / Pathways */}
                      {qualCats.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Select Qualification Pathway:</p>
                          <div className="grid gap-3">
                            {qualCats.map(cat => (
                              <div key={cat.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-purple-600" /> {cat.categoryName}
                                </h4>
                                <div className="space-y-1.5 pl-4">
                                  {cat.documents.map(doc => (
                                    <div key={doc.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 last:border-0">
                                      <span className="font-medium text-slate-800">{doc.name}</span>
                                      <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded uppercase ${doc.required ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'}`}>
                                        {doc.required ? 'Compulsory' : 'Optional'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Course Meta row */}
                      {selectedCourse && (
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                            <Clock size={15} className="text-indigo-600 mx-auto mb-1" />
                            <p className="text-[0.6rem] uppercase tracking-wider text-slate-500 font-bold">Duration</p>
                            <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedCourse.duration}</p>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                            <AlertCircle size={15} className="text-rose-600 mx-auto mb-1" />
                            <p className="text-[0.6rem] uppercase tracking-wider text-slate-500 font-bold">Deadline</p>
                            <p className="text-xs font-bold text-rose-700 mt-0.5">{selectedCourse.deadline}</p>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                            <Wifi size={15} className="text-cyan-600 mx-auto mb-1" />
                            <p className="text-[0.6rem] uppercase tracking-wider text-slate-500 font-bold">Delivery</p>
                            <p className="text-xs font-bold text-cyan-800 mt-0.5">{selectedCourse.delivery}</p>
                          </div>
                        </div>
                      )}

                      <div 
                        className={`border-dashed border-2 rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer relative overflow-hidden ${formData.documentsAttached ? 'border-emerald-400 bg-emerald-50/60' : 'border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/40'}`}
                        onClick={() => !formData.documentsAttached && fileInputRef.current?.click()}
                      >
                        <input type="file" ref={fileInputRef} onChange={handleDocumentUpload} className="hidden" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                        {!formData.documentsAttached ? (
                          <>
                            <div className="w-12 h-12 rounded-2xl bg-indigo-100 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300">
                              <UploadCloud className="text-indigo-600" size={24} />
                            </div>
                            <h4 className="text-slate-900 font-bold text-base mb-1">Upload your qualifications</h4>
                            <p className="text-slate-600 text-xs">Click to browse or drag and drop</p>
                            <p className="text-slate-400 text-[0.65rem] mt-2">PDF, DOC, DOCX, JPG, PNG accepted</p>
                            <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }} className="btn-secondary text-sm mt-4">Browse Files</button>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 mx-auto flex items-center justify-center mb-3 ring-4 ring-emerald-100">
                              <FileCheck className="text-emerald-700" size={24} />
                            </div>
                            <h4 className="text-emerald-800 font-bold text-base mb-1">Qualifications Attached</h4>
                            <p className="text-slate-600 text-xs mb-4">Your files are ready to submit</p>
                            <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }} className="text-xs font-bold tracking-wide text-emerald-700 hover:text-emerald-800 transition-colors uppercase">Upload different files</button>
                          </>
                        )}
                      </div>

                      <div className="flex gap-3 pt-6 border-t border-slate-200">
                        <button onClick={() => setStep('documents')} className="w-1/3 py-3.5 px-4 btn-secondary text-sm font-bold">Back</button>
                        <button onClick={handleDocumentSkipOrNext} className="w-2/3 btn-primary text-sm flex items-center justify-center gap-2 !py-3.5 font-bold">
                          {formData.documentsAttached ? 'Continue to Details' : 'Skip & Continue'} <ChevronRight size={18} />
                        </button>
                      </div>
                    </motion.div>
                  )
                })()}

                {step === 'personal' && (
                  <motion.div key="personal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2 tracking-tight"><User className="text-indigo-600" size={20} /> Personal Details</h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-slate-700 uppercase ml-1">First Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="text" name="firstName" value={formData.firstName} onChange={handlePersonalChange} onFocus={() => setFocused('fn')} onBlur={() => setFocused(null)} suppressHydrationWarning className={`w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 ${focused==='fn'?'border-indigo-600 ring-2 ring-indigo-500/20':''}`} placeholder="First Name" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-slate-700 uppercase ml-1">Last Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="text" name="lastName" value={formData.lastName} onChange={handlePersonalChange} onFocus={() => setFocused('ln')} onBlur={() => setFocused(null)} suppressHydrationWarning className={`w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 ${focused==='ln'?'border-indigo-600 ring-2 ring-indigo-500/20':''}`} placeholder="Last Name" />
                        </div>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-bold tracking-wider text-slate-700 uppercase ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="email" name="email" value={formData.email} onChange={handlePersonalChange} onFocus={() => setFocused('em')} onBlur={() => setFocused(null)} suppressHydrationWarning className={`w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 ${focused==='em'?'border-indigo-600 ring-2 ring-indigo-500/20':''}`} placeholder="email@example.com" />
                        </div>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-bold tracking-wider text-slate-700 uppercase ml-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="tel" name="phone" value={formData.phone} onChange={handlePersonalChange} onFocus={() => setFocused('ph')} onBlur={() => setFocused(null)} suppressHydrationWarning className={`w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 ${focused==='ph'?'border-indigo-600 ring-2 ring-indigo-500/20':''}`} placeholder="+44 7000 000000" />
                        </div>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-bold tracking-wider text-slate-700 uppercase ml-1">Home Address</label>
                        <div className="relative">
                          <Map className="absolute left-4 top-4 text-slate-400" size={18} />
                          <textarea name="address" value={formData.address} onChange={handlePersonalChange} onFocus={() => setFocused('ad')} onBlur={() => setFocused(null)} suppressHydrationWarning className={`w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 resize-none min-h-[100px] ${focused==='ad'?'border-indigo-600 ring-2 ring-indigo-500/20':''}`} rows={3} placeholder="Full Address" />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6 mt-4 border-t border-slate-200">
                      <button onClick={() => setStep('qualification')} className="w-1/3 py-4 px-4 btn-secondary text-sm font-bold" disabled={isSubmitting}>Back</button>
                      <button onClick={handleSubmit} disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || isSubmitting} className="w-2/3 btn-primary text-sm flex items-center justify-center gap-2 !py-4 font-bold disabled:opacity-30 disabled:cursor-not-allowed">
                        {isSubmitting ? (
                          <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"/> Submitting...</span>
                        ) : (
                          <><CheckCircle2 size={18} /> Complete Registration</>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 px-4 relative z-10">
                    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }} className="w-28 h-28 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/30">
                      <CheckCircle2 size={56} className="text-white" />
                    </motion.div>
                    <h3 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">You&apos;re in!</h3>
                    <p className="text-slate-600 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
                      Your seat is secured. We&apos;ve sent a confirmation email to <br/><span className="font-bold text-indigo-600">{formData.email}</span>
                    </p>
                    <button onClick={handleClose} className="w-full max-w-xs mx-auto btn-primary !py-4 text-base font-bold">Close & Return</button>
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
