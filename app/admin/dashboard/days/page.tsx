'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin-sidebar'
import { useStore, Day } from '@/lib/store'
import { Trash2, Plus, Download } from 'lucide-react'

export default function DaysManagement() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [isAddingDay, setIsAddingDay] = useState(false)
  const [newDay, setNewDay] = useState({ name: '', date: '' })
  const { days, addDay, removeDay } = useStore()

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

  const handleAddDay = () => {
    if (newDay.name.trim() && newDay.date) {
      const day: Day = {
        id: Date.now().toString(),
        name: newDay.name,
        date: newDay.date,
      }
      addDay(day)
      setNewDay({ name: '', date: '' })
      setIsAddingDay(false)
      console.log('[v0] Day added:', day)
    }
  }

  const handleExportCSV = () => {
    const csv = ['Day Name,Date', ...days.map(d => `${d.name},${d.date}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'days.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())
        const newDays = lines.slice(1).map(line => {
          const [name, date] = line.split(',')
          return {
            id: Date.now().toString() + Math.random(),
            name: name.trim(),
            date: date.trim(),
          }
        })
        newDays.forEach(day => addDay(day))
        console.log('[v0] Days imported:', newDays)
      }
      reader.readAsText(file)
    }
  }

  if (!isAuthed) return null

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 overflow-auto md:ml-64">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Days</h1>
            <div className="flex gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                <Download size={20} /> Export CSV
              </button>
              <label className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer">
                <span>Import CSV</span>
                <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
              </label>
              <button
                onClick={() => setIsAddingDay(!isAddingDay)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                <Plus size={20} /> Add Day
              </button>
            </div>
          </div>

          {/* Add Day Form */}
          {isAddingDay && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Day</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Day Name (e.g., Monday)"
                  value={newDay.name}
                  onChange={(e) => setNewDay({ ...newDay, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
                <input
                  type="date"
                  value={newDay.date}
                  onChange={(e) => setNewDay({ ...newDay, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleAddDay}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Save Day
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingDay(false)
                      setNewDay({ name: '', date: '' })
                    }}
                    className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Days List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {days.length === 0 ? (
              <div className="p-8 text-center text-gray-600">No days yet. Add your first day above.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Day Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {days.map((day) => (
                      <tr key={day.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-gray-900 font-semibold">{day.name}</td>
                        <td className="px-6 py-3 text-gray-600">{new Date(day.date).toLocaleDateString()}</td>
                        <td className="px-6 py-3 text-center">
                          <button
                            onClick={() => removeDay(day.id)}
                            className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-2 mx-auto"
                          >
                            <Trash2 size={18} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
