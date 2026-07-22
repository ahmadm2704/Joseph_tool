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

interface AppStore {
  courses: Course[]
  cities: City[]
  days: Day[]
  galleryImages: GalleryImage[]
  registrations: StudentRegistration[]
  contactMessages: ContactMessage[]

  addCourse: (course: Course) => Promise<void>
  removeCourse: (id: string) => Promise<void>
  updateCourse: (course: Course) => Promise<void>
  setCourses: (courses: Course[]) => void

  addCity: (city: City) => void
  removeCity: (id: string) => void
  setCities: (cities: City[]) => void

  addDay: (day: Day) => void
  removeDay: (id: string) => void
  setDays: (days: Day[]) => void

  addGalleryImage: (image: GalleryImage) => void
  removeGalleryImage: (id: string) => void
  setGalleryImages: (images: GalleryImage[]) => void

  addRegistration: (registration: StudentRegistration) => Promise<void>
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

      addCity: (city) => set((state) => ({ cities: [...state.cities, city] })),
      removeCity: (id) => set((state) => ({ cities: state.cities.filter((c) => c.id !== id) })),
      setCities: (cities) => set({ cities }),

      addDay: (day) => set((state) => ({ days: [...state.days, day] })),
      removeDay: (id) => set((state) => ({ days: state.days.filter((d) => d.id !== id) })),
      setDays: (days) => set({ days }),

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

      addGalleryImage: (image) => set((state) => ({ galleryImages: [...state.galleryImages, image] })),
      removeGalleryImage: (id) => set((state) => ({ galleryImages: state.galleryImages.filter((img) => img.id !== id) })),
      setGalleryImages: (images) => set({ galleryImages: images }),

      addRegistration: async (registration) => {
        set((state) => ({ registrations: [...state.registrations, registration] }))
        try {
          const { error } = await supabase.from('registrations').insert({
            id: registration.id,
            course_id: registration.courseId,
            city_name: registration.cityId,
            day_schedule: registration.dayId,
            first_name: registration.firstName,
            last_name: registration.lastName,
            email: registration.email,
            phone: registration.phone,
            address: registration.address,
            document_url: registration.documentUrls ? registration.documentUrls.join(',') : null,
            citizenship_status: registration.citizenshipStatus || null,
            created_at: registration.createdAt
          })
          if (error) console.warn("Supabase registration insert notice:", error.message || error)
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
            let currentCourses: Course[] = coursesRes.data.map(c => ({
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
              documentCategories: c.document_categories || undefined,
              qualificationCategories: c.qualification_categories || undefined
            }))
            
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
              courseId: r.course_id,
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
