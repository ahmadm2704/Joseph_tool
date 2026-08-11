import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { supabase } from './supabase'

export interface DocumentItem {
  id: string
  name: string
  required: boolean
}

export interface DocumentCategory {
  id: string
  categoryName: string
  documents: DocumentItem[]
}

export interface CourseDocumentRequirement {
  id: string
  name: string
  category: string
  isRequired: boolean
}

export interface Course {
  id: string
  name: string
  description: string
  duration: string
  deadline: string
  delivery: string
  daysSchedule: string
  requirements: string
  cities: City[]
  days: Day[]
  requiredDocuments?: string[]
  qualificationTypes?: string[]
  documentRules?: CourseDocumentRequirement[]
  documentCategories?: DocumentCategory[]
  qualificationCategories?: DocumentCategory[]
}

export interface City {
  id: string
  name: string
}

export interface Day {
  id: string
  name: string
  date: string
}

export interface GalleryImage {
  id: string
  url: string
  type: 'main' | 'group'
}

export interface StudentRegistration {
  id: string
  courseId: string
  cityId: string
  dayId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  documentsAttached: boolean
  documentUrls?: string[]
  citizenshipStatus?: string
  meetingDate?: string
  meetingTime?: string
  createdAt: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'replied'
  createdAt: string
}

export interface MeetingDate {
  date: string
  slots: string[]
}

interface AppStore {
  courses: Course[]
  cities: City[]
  days: Day[]
  galleryImages: GalleryImage[]
  registrations: StudentRegistration[]
  contactMessages: ContactMessage[]
  meetingSlots: string[]
  meetingDates: MeetingDate[]

  setMeetingSlots: (slots: string[]) => Promise<void>
  setMeetingDates: (dates: MeetingDate[]) => Promise<void>

  addCourse: (course: Course) => Promise<void>
  removeCourse: (id: string) => Promise<void>
  updateCourse: (course: Course) => Promise<void>
  setCourses: (courses: Course[]) => void

  addCity: (city: City) => Promise<void>
  removeCity: (id: string) => Promise<void>
  setCities: (cities: City[]) => Promise<void>

  addDay: (day: Day) => Promise<void>
  removeDay: (id: string) => Promise<void>
  setDays: (days: Day[]) => Promise<void>

  addGalleryImage: (image: GalleryImage) => Promise<void>
  removeGalleryImage: (id: string) => Promise<void>
  setGalleryImages: (images: GalleryImage[]) => Promise<void>

  addRegistration: (registration: StudentRegistration) => Promise<void>
  updateRegistration: (id: string, updates: Partial<StudentRegistration>) => Promise<void>
  removeRegistration: (id: string) => Promise<void>
  setRegistrations: (registrations: StudentRegistration[]) => void

  addContactMessage: (msg: ContactMessage) => Promise<void>
  removeContactMessage: (id: string) => Promise<void>
  setContactMessages: (messages: ContactMessage[]) => void

  syncData: () => Promise<void>
}

const initialCourses: Course[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'HND Business',
    description: 'Higher National Diploma in Business. Limited places available – apply early.',
    duration: '2 Years',
    deadline: 'September or October 2026',
    delivery: 'Blended',
    daysSchedule: 'Flexible',
    requirements: 'Standard Entry',
    cities: [
      { id: 'loc-1', name: 'Leicester' },
      { id: 'loc-2', name: 'Nottingham' },
      { id: 'loc-3', name: 'Birmingham' }
    ],
    days: [
      { id: 'day-1', name: 'September 2026 Start', date: 'Sep 2026' },
      { id: 'day-2', name: 'October 2026 Start', date: 'Oct 2026' }
    ],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'FDA Business',
    description: 'Foundation Degree in Business. Limited places available – apply early.',
    duration: '2 Years',
    deadline: 'September or October 2026',
    delivery: 'Blended',
    daysSchedule: 'Flexible',
    requirements: 'Standard Entry',
    cities: [
      { id: 'loc-1', name: 'Leicester' },
      { id: 'loc-2', name: 'Nottingham' },
      { id: 'loc-3', name: 'Birmingham' }
    ],
    days: [
      { id: 'day-1', name: 'September 2026 Start', date: 'Sep 2026' },
      { id: 'day-2', name: 'October 2026 Start', date: 'Oct 2026' }
    ],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'Business & Tourism',
    description: 'Comprehensive program in Business & Tourism. Limited places available – apply early.',
    duration: '3 Years',
    deadline: 'September or October 2026',
    delivery: 'Blended',
    daysSchedule: 'Flexible',
    requirements: 'Standard Entry',
    cities: [
      { id: 'loc-1', name: 'Leicester' },
      { id: 'loc-2', name: 'Nottingham' },
      { id: 'loc-3', name: 'Birmingham' }
    ],
    days: [
      { id: 'day-1', name: 'September 2026 Start', date: 'Sep 2026' },
      { id: 'day-2', name: 'October 2026 Start', date: 'Oct 2026' }
    ],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Fashion Design',
    description: 'Degree in Fashion Design. Limited places available – apply early.',
    duration: '3 Years',
    deadline: 'September or October 2026',
    delivery: 'On-Campus',
    daysSchedule: 'Full-time',
    requirements: 'Standard Entry / Portfolio',
    cities: [
      { id: 'loc-1', name: 'Leicester' },
      { id: 'loc-2', name: 'Nottingham' },
      { id: 'loc-3', name: 'Birmingham' }
    ],
    days: [
      { id: 'day-1', name: 'September 2026 Start', date: 'Sep 2026' },
      { id: 'day-2', name: 'October 2026 Start', date: 'Oct 2026' }
    ],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    name: 'Business with Foundation Year',
    description: '4-year Business degree including a foundation year. Limited places available – apply early.',
    duration: '4 Years',
    deadline: 'September or October 2026',
    delivery: 'Blended',
    daysSchedule: 'Flexible',
    requirements: 'No standard entry requirements',
    cities: [
      { id: 'loc-1', name: 'Leicester' },
      { id: 'loc-2', name: 'Nottingham' },
      { id: 'loc-3', name: 'Birmingham' }
    ],
    days: [
      { id: 'day-1', name: 'September 2026 Start', date: 'Sep 2026' },
      { id: 'day-2', name: 'October 2026 Start', date: 'Oct 2026' }
    ],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    name: 'Security Door Supervisor Course',
    description: 'Certification for Security Door Supervision. Limited places available – apply early.',
    duration: 'Short Course',
    deadline: 'September or October 2026',
    delivery: 'On-Campus',
    daysSchedule: 'Intensive',
    requirements: 'Standard Entry',
    cities: [
      { id: 'loc-1', name: 'Leicester' },
      { id: 'loc-2', name: 'Nottingham' },
      { id: 'loc-3', name: 'Birmingham' }
    ],
    days: [
      { id: 'day-1', name: 'September 2026 Start', date: 'Sep 2026' },
      { id: 'day-2', name: 'October 2026 Start', date: 'Oct 2026' }
    ],
  },
  {
    id: 'c1000000-0000-0000-0000-000000000007',
    name: 'Master’s Degree (Postgraduate)',
    description: 'Postgraduate Master’s program. Limited places available – apply early.',
    duration: '1-2 Years',
    deadline: 'September or October 2026',
    delivery: 'Blended',
    daysSchedule: 'Flexible',
    requirements: 'Bachelor’s Degree',
    cities: [
      { id: 'loc-1', name: 'Leicester' },
      { id: 'loc-2', name: 'Nottingham' },
      { id: 'loc-3', name: 'Birmingham' }
    ],
    days: [
      { id: 'day-1', name: 'September 2026 Start', date: 'Sep 2026' },
      { id: 'day-2', name: 'October 2026 Start', date: 'Oct 2026' }
    ],
  }
]

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      courses: initialCourses,
      cities: [
        { id: 'loc-1', name: 'Leicester' },
        { id: 'loc-2', name: 'Nottingham' },
        { id: 'loc-3', name: 'Birmingham' },
        { id: 'loc-4', name: 'London' }
      ],
      days: [
        { id: 'day-1', name: 'September 2026 Start', date: 'Sep 2026' },
        { id: 'day-2', name: 'October 2026 Start', date: 'Oct 2026' }
      ],
      galleryImages: [],
      registrations: [],
      contactMessages: [],
      meetingSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
      meetingDates: [], // By default, let's keep it empty, meaning the logic can fall back to generic dates if empty or we can force them to add some. We will handle this in UI.

      setMeetingSlots: async (slots) => {
        set({ meetingSlots: slots })
        try {
          await fetch('/api/settings/meeting', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slots }) })
        } catch (e) {
          console.warn("API operation bypassed:", e)
        }
      },
      setMeetingDates: async (dates) => {
        set({ meetingDates: dates })
        try {
          await fetch('/api/settings/meeting', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dates }) })
        } catch (e) {
          console.warn("API operation bypassed:", e)
        }
      },

      addCity: async (city) => {
        set((state) => ({ cities: [...state.cities, city] }))
        try { await fetch('/api/settings/global', { method: 'POST', body: JSON.stringify({ cities: get().cities }) }) } catch (e) { console.warn(e) }
      },
      removeCity: async (id) => {
        set((state) => ({ cities: state.cities.filter((c) => c.id !== id) }))
        try { await fetch('/api/settings/global', { method: 'POST', body: JSON.stringify({ cities: get().cities }) }) } catch (e) { console.warn(e) }
      },
      setCities: async (cities) => {
        set({ cities })
        try { await fetch('/api/settings/global', { method: 'POST', body: JSON.stringify({ cities }) }) } catch (e) { console.warn(e) }
      },

      addDay: async (day) => {
        set((state) => ({ days: [...state.days, day] }))
        try { await fetch('/api/settings/global', { method: 'POST', body: JSON.stringify({ days: get().days }) }) } catch (e) { console.warn(e) }
      },
      removeDay: async (id) => {
        set((state) => ({ days: state.days.filter((d) => d.id !== id) }))
        try { await fetch('/api/settings/global', { method: 'POST', body: JSON.stringify({ days: get().days }) }) } catch (e) { console.warn(e) }
      },
      setDays: async (days) => {
        set({ days })
        try { await fetch('/api/settings/global', { method: 'POST', body: JSON.stringify({ days }) }) } catch (e) { console.warn(e) }
      },

      addGalleryImage: async (image) => {
        set((state) => ({ galleryImages: [...state.galleryImages, image] }))
        try { await fetch('/api/settings/global', { method: 'POST', body: JSON.stringify({ galleryImages: get().galleryImages }) }) } catch (e) { console.warn(e) }
      },
      removeGalleryImage: async (id) => {
        set((state) => ({ galleryImages: state.galleryImages.filter((img) => img.id !== id) }))
        try { await fetch('/api/settings/global', { method: 'POST', body: JSON.stringify({ galleryImages: get().galleryImages }) }) } catch (e) { console.warn(e) }
      },
      setGalleryImages: async (images) => {
        set({ galleryImages: images })
        try { await fetch('/api/settings/global', { method: 'POST', body: JSON.stringify({ galleryImages: images }) }) } catch (e) { console.warn(e) }
      },

      addCourse: async (course) => {
        set((state) => ({ courses: [...state.courses, course] }))
        try {
          const { error } = await supabase.from('courses').insert({
            id: course.id,
            name: course.name,
            description: course.description,
            duration: course.duration,
            deadline: course.deadline,
            delivery: course.delivery,
            days_schedule: course.daysSchedule,
            requirements: course.requirements,
            cities: course.cities,
            days: course.days,
            document_categories: course.documentCategories,
            qualification_categories: course.qualificationCategories
          })
          if (error) {
            // Fallback insert without extra json columns if columns do not exist in SQL schema yet
            const { error: err2 } = await supabase.from('courses').insert({
              id: course.id,
              name: course.name,
              description: course.description,
              duration: course.duration,
              deadline: course.deadline,
              delivery: course.delivery,
              days_schedule: course.daysSchedule,
              requirements: course.requirements,
              cities: course.cities,
              days: course.days
            })
            if (err2) console.warn("Supabase course insert notice:", err2.message || err2)
          }
        } catch (e) {
          console.warn("Supabase operation bypassed:", e)
        }
      },

      removeCourse: async (id) => {
        set((state) => ({ courses: state.courses.filter((c) => c.id !== id) }))
        try {
          const { error } = await supabase.from('courses').delete().eq('id', id)
          if (error) console.warn("Supabase course delete notice:", error.message || error)
        } catch (e) {
          console.warn("Supabase operation bypassed:", e)
        }
      },
      
      updateCourse: async (updatedCourse) => {
        set((state) => ({
          courses: state.courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
        }))
        try {
          const { error } = await supabase.from('courses').update({
            name: updatedCourse.name,
            description: updatedCourse.description,
            duration: updatedCourse.duration,
            deadline: updatedCourse.deadline,
            delivery: updatedCourse.delivery,
            days_schedule: updatedCourse.daysSchedule,
            requirements: updatedCourse.requirements,
            cities: updatedCourse.cities,
            days: updatedCourse.days,
            document_categories: updatedCourse.documentCategories,
            qualification_categories: updatedCourse.qualificationCategories
          }).eq('id', updatedCourse.id)
          
          if (error) {
             const { error: err2 } = await supabase.from('courses').update({
              name: updatedCourse.name,
              description: updatedCourse.description,
              duration: updatedCourse.duration,
              deadline: updatedCourse.deadline,
              delivery: updatedCourse.delivery,
              days_schedule: updatedCourse.daysSchedule,
              requirements: updatedCourse.requirements,
              cities: updatedCourse.cities,
              days: updatedCourse.days
            }).eq('id', updatedCourse.id)
            if (err2) console.warn("Supabase course update notice:", err2.message || err2)
          }
        } catch (e) {
          console.warn("Supabase operation bypassed:", e)
        }
      },

      setCourses: (courses) => set({ courses }),



      addRegistration: async (registration) => {
        set((state) => ({ registrations: [...state.registrations, registration] }))
        try {
          const { error } = await supabase.from('registrations').insert({
            id: registration.id,
            course_id: registration.courseId === '00000000-0000-0000-0000-000000000000' ? null : registration.courseId,
            city_name: registration.cityId,
            day_schedule: registration.dayId,
            first_name: registration.firstName,
            last_name: registration.lastName,
            email: registration.email,
            phone: registration.phone,
            address: registration.address,
            document_url: registration.documentUrls ? registration.documentUrls.join(',') : null,
            citizenship_status: registration.citizenshipStatus || null,
            meeting_date: registration.meetingDate || null,
            meeting_time: registration.meetingTime || null,
            created_at: registration.createdAt
          })
          if (error) console.warn("Supabase registration insert notice:", error.message || error)
        } catch (e) {
          console.warn("Supabase operation bypassed:", e)
        }
      },

      updateRegistration: async (id, updates) => {
        set((state) => ({
          registrations: state.registrations.map(r => r.id === id ? { ...r, ...updates } : r)
        }))
        try {
          const dbUpdates: any = {}
          if (updates.meetingDate !== undefined) dbUpdates.meeting_date = updates.meetingDate
          if (updates.meetingTime !== undefined) dbUpdates.meeting_time = updates.meetingTime
          if (Object.keys(dbUpdates).length > 0) {
            const { error } = await supabase.from('registrations').update(dbUpdates).eq('id', id)
            if (error) console.warn("Supabase registration update notice:", error.message || error)
          }
        } catch (e) {
          console.warn("Supabase operation bypassed:", e)
        }
      },

      removeRegistration: async (id) => {
        set((state) => ({ registrations: state.registrations.filter((r) => r.id !== id) }))
        try {
          const { error } = await supabase.from('registrations').delete().eq('id', id)
          if (error) console.warn("Supabase registration delete notice:", error.message || error)
        } catch (e) {
          console.warn("Supabase operation bypassed:", e)
        }
      },

      setRegistrations: (registrations) => set({ registrations }),

      addContactMessage: async (msg) => {
        set((state) => ({ contactMessages: [...state.contactMessages, msg] }))
        try {
          const { error } = await supabase.from('contact_messages').insert({
            id: msg.id,
            name: msg.name,
            email: msg.email,
            subject: msg.subject,
            message: msg.message,
            status: msg.status,
            created_at: msg.createdAt
          })
          if (error) console.warn("Supabase contact insert notice:", error.message || error)
        } catch (e) {
          console.warn("Supabase operation bypassed:", e)
        }
      },

      removeContactMessage: async (id) => {
        set((state) => ({ contactMessages: state.contactMessages.filter((m) => m.id !== id) }))
        try {
          const { error } = await supabase.from('contact_messages').delete().eq('id', id)
          if (error) console.warn("Supabase contact delete notice:", error.message || error)
        } catch (e) {
          console.warn("Supabase operation bypassed:", e)
        }
      },

      setContactMessages: (messages) => set({ contactMessages: messages }),

      syncData: async () => {
        try {
          const [coursesRes, regRes, msgRes] = await Promise.all([
            supabase.from('courses').select('*'),
            supabase.from('registrations').select('*'),
            supabase.from('contact_messages').select('*')
          ])

          if (coursesRes.data) {
            let currentCourses: Course[] = coursesRes.data.map(c => {
              const existingCourse = get().courses.find(ec => ec.id === c.id)
              return {
                id: c.id,
                name: c.name,
                description: c.description,
                duration: c.duration,
                deadline: c.deadline,
                delivery: c.delivery,
                daysSchedule: c.days_schedule,
                requirements: c.requirements,
                cities: c.cities || [],
                days: c.days || [],
                documentCategories: c.document_categories ?? existingCourse?.documentCategories,
                qualificationCategories: c.qualification_categories ?? existingCourse?.qualificationCategories
              }
            })
            
            // Check for missing initial courses and seed them
            const existingIds = new Set(currentCourses.map(c => c.id))
            const missingCourses = initialCourses.filter(c => !existingIds.has(c.id))
            
            if (missingCourses.length > 0) {
              console.log(`Seeding ${missingCourses.length} missing initial courses...`)
              for (const course of missingCourses) {
                const { error } = await supabase.from('courses').insert({
                  id: course.id,
                  name: course.name,
                  description: course.description,
                  duration: course.duration,
                  deadline: course.deadline,
                  delivery: course.delivery,
                  days_schedule: course.daysSchedule,
                  requirements: course.requirements,
                  cities: course.cities,
                  days: course.days
                })
                if (error) {
                  console.error("FAILED TO SEED COURSE:", course.name, error.message, error.details)
                } else {
                  console.log("Successfully seeded course:", course.name)
                  currentCourses.push(course)
                }
              }
            }
            
            set({ courses: currentCourses })
          }

          if (regRes.data) {
            const mappedRegs = regRes.data.map(r => ({
              id: r.id,
              courseId: r.course_id || '00000000-0000-0000-0000-000000000000',
              cityId: r.city_name || '',
              dayId: r.day_schedule || '',
              firstName: r.first_name,
              lastName: r.last_name,
              email: r.email,
              phone: r.phone,
              address: r.address,
              documentsAttached: !!r.document_url,
              documentUrls: r.document_url ? r.document_url.split(',') : [],
              citizenshipStatus: r.citizenship_status || '',
              meetingDate: r.meeting_date || undefined,
              meetingTime: r.meeting_time || undefined,
              createdAt: r.created_at
            }))
            set({ registrations: mappedRegs })
          }

          if (msgRes.data) {
            const mappedMsgs = msgRes.data.map(m => ({
              id: m.id,
              name: m.name,
              email: m.email,
              subject: m.subject || '',
              message: m.message,
              status: m.status || 'unread',
              createdAt: m.created_at
            }))
            set({ contactMessages: mappedMsgs })
          }

          try {
            const settingsRes = await fetch('/api/settings/meeting');
            if (settingsRes.ok) {
              const data = await settingsRes.json();
              if (data.slots && data.slots.length > 0) set({ meetingSlots: data.slots });
              if (data.dates) set({ meetingDates: data.dates });
            }
          } catch (err) {
            console.warn("Failed to sync meeting settings", err);
          }

          try {
            const globalRes = await fetch('/api/settings/global');
            if (globalRes.ok) {
              const data = await globalRes.json();
              if (data.cities && data.cities.length > 0) set({ cities: data.cities });
              if (data.days && data.days.length > 0) set({ days: data.days });
              if (data.galleryImages && data.galleryImages.length > 0) set({ galleryImages: data.galleryImages });
            }
          } catch (err) {
            console.warn("Failed to sync global settings", err);
          }
        } catch (error) {
          console.error("Error syncing with Supabase", error)
        }
      }
    }),
    {
      name: 'coursepro-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      })
    }
  )
)
