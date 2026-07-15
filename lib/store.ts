import { create } from 'zustand'

export interface Course {
  id: string
  name: string
  description: string
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
  createdAt: string
}

interface AppStore {
  courses: Course[]
  cities: City[]
  days: Day[]
  galleryImages: GalleryImage[]
  registrations: StudentRegistration[]

  addCourse: (course: Course) => void
  removeCourse: (id: string) => void
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

  addRegistration: (registration: StudentRegistration) => void
  removeRegistration: (id: string) => void
  setRegistrations: (registrations: StudentRegistration[]) => void
}

export const useStore = create<AppStore>((set) => ({
  courses: [],
  cities: [],
  days: [],
  galleryImages: [],
  registrations: [],

  addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
  removeCourse: (id) => set((state) => ({ courses: state.courses.filter((c) => c.id !== id) })),
  setCourses: (courses) => set({ courses }),

  addCity: (city) => set((state) => ({ cities: [...state.cities, city] })),
  removeCity: (id) => set((state) => ({ cities: state.cities.filter((c) => c.id !== id) })),
  setCities: (cities) => set({ cities }),

  addDay: (day) => set((state) => ({ days: [...state.days, day] })),
  removeDay: (id) => set((state) => ({ days: state.days.filter((d) => d.id !== id) })),
  setDays: (days) => set({ days }),

  addGalleryImage: (image) => set((state) => ({ galleryImages: [...state.galleryImages, image] })),
  removeGalleryImage: (id) => set((state) => ({ galleryImages: state.galleryImages.filter((img) => img.id !== id) })),
  setGalleryImages: (images) => set({ galleryImages: images }),

  addRegistration: (registration) => set((state) => ({ registrations: [...state.registrations, registration] })),
  removeRegistration: (id) => set((state) => ({ registrations: state.registrations.filter((r) => r.id !== id) })),
  setRegistrations: (registrations) => set({ registrations }),
}))
