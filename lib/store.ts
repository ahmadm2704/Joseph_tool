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
    id: 'e6b8c9d0-1234-4567-890a-bcdef1234561',
    name: 'Business and Tourism with Foundation',
    description: 'A comprehensive 4-year foundation program covering business principles and the tourism industry.',
    duration: '4 Years',
    deadline: '12 September',
    delivery: 'Blended',
    daysSchedule: 'Flexible Schedule',
    requirements: 'No work reference or Level 3',
    cities: [{ id: 'loc-1', name: 'London' }, { id: 'loc-2', name: 'Manchester' }],
    days: [{ id: 'day-1', name: 'Monday & Wednesday', date: 'Blended' }, { id: 'day-2', name: 'Tuesday & Thursday', date: 'Blended' }],
  },
  {
    id: 'e6b8c9d0-1234-4567-890a-bcdef1234562',
    name: 'HND Business / LM / HM / Digital Technology',
    description: 'A 2-year Higher National Diploma covering Business, Leadership & Management, Hospitality, and Digital Technology.',
    duration: '2 Years',
    deadline: '25 September',
    delivery: 'Blended',
    daysSchedule: 'Flexible Schedule',
    requirements: '5 years work experience or Level 3',
    cities: [{ id: 'loc-1', name: 'London' }, { id: 'loc-2', name: 'Manchester' }],
    days: [{ id: 'day-1', name: 'Monday & Wednesday', date: 'Blended' }, { id: 'day-2', name: 'Tuesday & Thursday', date: 'Blended' }],
  },
  {
    id: 'e6b8c9d0-1234-4567-890a-bcdef1234563',
    name: 'NCC Diploma Business Level 4',
    description: 'A 1-year NCC accredited diploma for business professionals seeking to advance their career to Level 4.',
    duration: '1 Year',
    deadline: '25 August',
    delivery: 'Blended',
    daysSchedule: 'Flexible Schedule',
    requirements: '5 years work experience or Level 3',
    cities: [{ id: 'loc-1', name: 'London' }, { id: 'loc-2', name: 'Manchester' }],
    days: [{ id: 'day-1', name: 'Monday & Wednesday', date: 'Blended' }, { id: 'day-2', name: 'Tuesday & Thursday', date: 'Blended' }],
  },
  {
    id: 'e6b8c9d0-1234-4567-890a-bcdef1234564',
    name: 'Data Analyst Level 4',
    description: 'A 1-year intensive data analytics program covering tools, techniques, and industry-standard frameworks.',
    duration: '1 Year',
    deadline: '25 August',
    delivery: 'Blended',
    daysSchedule: 'Tuesday On-Campus & Saturday Online',
    requirements: '5 years work experience or Level 3',
    cities: [{ id: 'loc-1', name: 'London' }, { id: 'loc-2', name: 'Manchester' }],
    days: [{ id: 'day-1', name: 'Tuesday (On-Campus)', date: 'On-Campus' }, { id: 'day-2', name: 'Saturday (Online)', date: 'Online' }],
  },
  {
    id: 'e6b8c9d0-1234-4567-890a-bcdef1234565',
    name: 'Top Up Level 6',
    description: 'A 1-year top-up program designed for Level 5 certificate holders to achieve a full Level 6 qualification.',
    duration: '1 Year',
    deadline: '10 September',
    delivery: 'Blended',
    daysSchedule: 'Flexible Schedule',
    requirements: 'Level 5 Certificate',
    cities: [{ id: 'loc-1', name: 'London' }, { id: 'loc-2', name: 'Manchester' }],
    days: [{ id: 'day-1', name: 'Monday & Wednesday', date: 'Blended' }, { id: 'day-2', name: 'Tuesday & Thursday', date: 'Blended' }],
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
        if (error) console.error("Error inserting registration", error)
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

          if (coursesRes.data && coursesRes.data.length > 0) {
            const mappedCourses = coursesRes.data.map(c => ({
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
            set({ courses: mappedCourses })
          } else if (coursesRes.data && coursesRes.data.length === 0) {
            // Database is empty, let's seed it with the default initial courses!
            console.log('Seeding initial courses to Supabase...')
            for (const course of initialCourses) {
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
              }
            }
            set({ courses: initialCourses })
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
