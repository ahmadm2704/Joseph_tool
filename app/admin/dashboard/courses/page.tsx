'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin-sidebar'
import { useStore, Course, City, Day } from '@/lib/store'
import { Trash2, Plus, X, MapPin, Calendar, BookOpen } from 'lucide-react'

export default function CoursesManagement() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [isAddingCourse, setIsAddingCourse] = useState(false)
  const [formError, setFormError] = useState('')
  
  const [newCourse, setNewCourse] = useState<{
    name: string;
    description: string;
    cities: { name: string }[];
    days: { name: string; date: string }[];
  }>({ 
    name: '', 
    description: '',
    cities: [{ name: '' }],
    days: [{ name: '', date: '' }]
  })

  const { courses, addCourse, removeCourse } = useStore()

  useEffect(() => {
    const session = localStorage.getItem('adminSession')
    if (!session) {
      router.push('/admin/login')
    } else {
      setIsAuthed(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.push('/admin/login')
  }

  const handleAddCity = () => {
    setNewCourse({ ...newCourse, cities: [...newCourse.cities, { name: '' }] })
  }

  const handleRemoveCity = (index: number) => {
    const newCities = newCourse.cities.filter((_, i) => i !== index)
    setNewCourse({ ...newCourse, cities: newCities })
  }

  const handleCityChange = (index: number, value: string) => {
    const newCities = [...newCourse.cities]
    newCities[index].name = value
    setNewCourse({ ...newCourse, cities: newCities })
  }

  const handleAddDay = () => {
    setNewCourse({ ...newCourse, days: [...newCourse.days, { name: '', date: '' }] })
  }

  const handleRemoveDay = (index: number) => {
    const newDays = newCourse.days.filter((_, i) => i !== index)
    setNewCourse({ ...newCourse, days: newDays })
  }

  const handleDayChange = (index: number, field: 'name' | 'date', value: string) => {
    const newDays = [...newCourse.days]
    newDays[index][field] = value
    setNewCourse({ ...newCourse, days: newDays })
  }

  const handleAddCourse = () => {
    setFormError('')
    if (!newCourse.name.trim() || !newCourse.description.trim()) {
      setFormError('Please provide both a Course Title and a Course Description.')
      return
    }

    const validCities: City[] = newCourse.cities
      .filter(c => c.name.trim() !== '')
      .map(c => ({ id: Math.random().toString(36).substring(7), name: c.name }))
      
    const validDays: Day[] = newCourse.days
      .filter(d => d.name.trim() !== '' && d.date.trim() !== '')
      .map(d => ({ id: Math.random().toString(36).substring(7), name: d.name, date: d.date }))

    if (validCities.length === 0) {
      setFormError('Please add at least one valid city.')
      return
    }

    if (validDays.length === 0) {
      setFormError('Please add at least one valid schedule day with a date.')
      return
    }

    const course: Course = {
      id: Date.now().toString(),
      name: newCourse.name,
      description: newCourse.description,
      cities: validCities,
      days: validDays
    }
    
    addCourse(course)
    setNewCourse({ name: '', description: '', cities: [{ name: '' }], days: [{ name: '', date: '' }] })
    setIsAddingCourse(false)
  }

  if (!isAuthed) return null

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 overflow-auto md:ml-64 relative">
        <div className="p-8 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Course Portfolio</h1>
              <p className="text-gray-500 mt-1">Manage your courses, locations, and schedules all in one place.</p>
            </div>
            <button
              onClick={() => setIsAddingCourse(!isAddingCourse)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              {isAddingCourse ? <X size={20} /> : <Plus size={20} />} 
              {isAddingCourse ? 'Cancel' : 'Create New Course'}
            </button>
          </div>

          {isAddingCourse && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-10 transition-all animate-in slide-in-from-top-4 fade-in duration-300">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <BookOpen size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Course Configuration</h2>
                </div>
                {formError && (
                  <div className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-100">
                    {formError}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Course Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Advanced React Development"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Course Description</label>
                    <textarea
                      placeholder="What will students learn?"
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none text-gray-900 placeholder:text-gray-400"
                      rows={5}
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Cities Section */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <MapPin size={16} className="text-blue-600"/> Available Cities
                      </label>
                      <button onClick={handleAddCity} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
                        <Plus size={14} /> Add City
                      </button>
                    </div>
                    <div className="space-y-3">
                      {newCourse.cities.map((city, index) => (
                        <div key={index} className="flex gap-2 group">
                          <input
                            type="text"
                            placeholder="City name (e.g. New York)"
                            value={city.name}
                            onChange={(e) => handleCityChange(index, e.target.value)}
                            className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                          />
                          <button onClick={() => handleRemoveCity(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Days Section */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Calendar size={16} className="text-purple-600"/> Schedule & Days
                      </label>
                      <button onClick={handleAddDay} className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-lg">
                        <Plus size={14} /> Add Day
                      </button>
                    </div>
                    <div className="space-y-3">
                      {newCourse.days.map((day, index) => (
                        <div key={index} className="flex gap-2 group">
                          <input
                            type="text"
                            placeholder="Day (e.g. Mon-Wed)"
                            value={day.name}
                            onChange={(e) => handleDayChange(index, 'name', e.target.value)}
                            className="w-1/2 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder:text-gray-400"
                          />
                          <input
                            type="date"
                            value={day.date}
                            onChange={(e) => handleDayChange(index, 'date', e.target.value)}
                            className="w-1/2 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder:text-gray-400"
                          />
                          <button onClick={() => handleRemoveDay(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
                <button
                  onClick={() => setIsAddingCourse(false)}
                  className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCourse}
                  className="px-8 py-2.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition-colors shadow-md"
                >
                  Publish Course
                </button>
              </div>
            </div>
          )}

          {/* Courses List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                  <BookOpen size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No courses yet</h3>
                <p className="text-gray-500 mt-2">Create your first course to start accepting registrations.</p>
              </div>
            ) : (
              courses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                  <button
                    onClick={() => removeCourse(course.id)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete Course"
                  >
                    <Trash2 size={18} />
                  </button>
                  <h3 className="text-xl font-bold text-gray-900 pr-8">{course.name}</h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-[40px]">{course.description}</p>
                  
                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1"><MapPin size={12}/> Locations ({course.cities?.length || 0})</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.cities?.map(city => (
                          <span key={city.id} className="inline-flex px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                            {city.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Calendar size={12}/> Schedule ({course.days?.length || 0})</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.days?.map(day => (
                          <span key={day.id} className="inline-flex px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                            {day.name} ({day.date})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
