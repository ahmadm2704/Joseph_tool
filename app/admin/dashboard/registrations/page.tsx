'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin-sidebar'
import { useStore } from '@/lib/store'
import { Trash2, Download, Eye } from 'lucide-react'

interface StudentDetails {
  name: string
  email: string
  phone: string
}

export default function RegistrationsManagement() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [selectedReg, setSelectedReg] = useState<string | null>(null)
  const { registrations, removeRegistration, courses, cities, days } = useStore()

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

  const getCourseName = (courseId: string) => courses.find(c => c.id === courseId)?.name || 'Unknown'
  const getCityName = (cityId: string) => cities.find(c => c.id === cityId)?.name || 'Unknown'
  const getDayName = (dayId: string) => days.find(d => d.id === dayId)?.name || 'Unknown'

  const handleExportCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Address', 'Course', 'City', 'Day', 'Date']
    const rows = registrations.map(reg => [
      reg.firstName,
      reg.lastName,
      reg.email,
      reg.phone,
      reg.address,
      getCourseName(reg.courseId),
      getCityName(reg.cityId),
      getDayName(reg.dayId),
      new Date(reg.createdAt).toLocaleDateString(),
    ])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'registrations.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isAuthed) return null

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 overflow-auto md:ml-64">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Student Registrations</h1>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              <Download size={20} /> Export CSV
            </button>
          </div>

          {/* Registrations Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {registrations.length === 0 ? (
              <div className="p-8 text-center text-gray-600">No registrations yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Course</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">City</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Day</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-gray-900 font-semibold">
                          {reg.firstName} {reg.lastName}
                        </td>
                        <td className="px-6 py-3 text-gray-600">{reg.email}</td>
                        <td className="px-6 py-3 text-gray-600">{getCourseName(reg.courseId)}</td>
                        <td className="px-6 py-3 text-gray-600">{getCityName(reg.cityId)}</td>
                        <td className="px-6 py-3 text-gray-600">{getDayName(reg.dayId)}</td>
                        <td className="px-6 py-3 text-gray-600">
                          {new Date(reg.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => setSelectedReg(selectedReg === reg.id ? null : reg.id)}
                              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                            >
                              <Eye size={18} /> Details
                            </button>
                            <button
                              onClick={() => removeRegistration(reg.id)}
                              className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                            >
                              <Trash2 size={18} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Details Modal */}
          {selectedReg && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                {(() => {
                  const reg = registrations.find(r => r.id === selectedReg)
                  return reg ? (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Details</h2>
                      <div className="space-y-3">
                        <div>
                          <p className="text-gray-600 font-semibold">Name</p>
                          <p className="text-gray-900">{reg.firstName} {reg.lastName}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Email</p>
                          <p className="text-gray-900">{reg.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Phone</p>
                          <p className="text-gray-900">{reg.phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Address</p>
                          <p className="text-gray-900">{reg.address}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Course</p>
                          <p className="text-gray-900">{getCourseName(reg.courseId)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">City</p>
                          <p className="text-gray-900">{getCityName(reg.cityId)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Day</p>
                          <p className="text-gray-900">{getDayName(reg.dayId)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-semibold">Registration Date</p>
                          <p className="text-gray-900">{new Date(reg.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedReg(null)}
                        className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        Close
                      </button>
                    </>
                  ) : null
                })()}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
