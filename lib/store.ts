import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { supabase } from './supabase'

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

interface AppStore {
  courses: Course[]
  galleryImages: GalleryImage[]
  registrations: StudentRegistration[]

  addCourse: (course: Course) => Promise<void>
  removeCourse: (id: string) => Promise<void>
  setCourses: (courses: Course[]) => void

  addGalleryImage: (image: GalleryImage) => void
  removeGalleryImage: (id: string) => void
  setGalleryImages: (images: GalleryImage[]) => void

  addRegistration: (registration: StudentRegistration) => Promise<void>
  removeRegistration: (id: string) => Promise<void>
  setRegistrations: (registrations: StudentRegistration[]) => void

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
      galleryImages: [],
      registrations: [],

      addCourse: async (course) => {
        set((state) => ({ courses: [...state.courses, course] }))
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
        if (error) console.error("Error inserting course", error)
      },

      removeCourse: async (id) => {
        set((state) => ({ courses: state.courses.filter((c) => c.id !== id) }))
        const { error } = await supabase.from('courses').delete().eq('id', id)
        if (error) console.error("Error deleting course", error)
      },
      
      setCourses: (courses) => set({ courses }),

      addGalleryImage: (image) => set((state) => ({ galleryImages: [...state.galleryImages, image] })),
      removeGalleryImage: (id) => set((state) => ({ galleryImages: state.galleryImages.filter((img) => img.id !== id) })),
      setGalleryImages: (images) => set({ galleryImages: images }),

      addRegistration: async (registration) => {
        set((state) => ({ registrations: [...state.registrations, registration] }))
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
        if (error) console.error("Error inserting registration:", error.message, error.details)
      },

      removeRegistration: async (id) => {
        set((state) => ({ registrations: state.registrations.filter((r) => r.id !== id) }))
        const { error } = await supabase.from('registrations').delete().eq('id', id)
        if (error) console.error("Error deleting registration", error)
      },

      setRegistrations: (registrations) => set({ registrations }),

      syncData: async () => {
        try {
          const [coursesRes, regRes] = await Promise.all([
            supabase.from('courses').select('*'),
            supabase.from('registrations').select('*')
          ])

          if (coursesRes.data) {
            let currentCourses = coursesRes.data.map(c => ({
              id: c.id,
              name: c.name,
              description: c.description,
              duration: c.duration,
              deadline: c.deadline,
              delivery: c.delivery,
              daysSchedule: c.days_schedule,
              requirements: c.requirements,
              cities: c.cities || [],
              days: c.days || []
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
