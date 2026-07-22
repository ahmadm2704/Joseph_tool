'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin-sidebar'
import { useStore, City } from '@/lib/store'
import { Trash2, Plus, Download } from 'lucide-react'

export default function CitiesManagement() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [isAddingCity, setIsAddingCity] = useState(false)
  const [newCityName, setNewCityName] = useState('')
  const { cities, addCity, removeCity, setCities } = useStore()

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
    if (newCityName.trim()) {
      const city: City = {
        id: Date.now().toString(),
        name: newCityName,
      }
      addCity(city)
      setNewCityName('')
      setIsAddingCity(false)
      console.log('[v0] City added:', city)
    }
  }

  const handleExportCSV = () => {
    const csv = ['City Name', ...cities.map((c: City) => c.name)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cities.csv'
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
        const newCities = lines.slice(1).map(name => ({
          id: Date.now().toString() + Math.random(),
          name: name.trim(),
        }))
        newCities.forEach(city => addCity(city))
        console.log('[v0] Cities imported:', newCities)
      }
      reader.readAsText(file)
    }
  }

  if (!isAuthed) return null

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 overflow-auto md:ml-64">
        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Manage Cities</h1>
            <div className="flex gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 btn-secondary !py-2.5 !px-5 text-sm font-bold shrink-0"
              >
                <Download size={16} /> Export CSV
              </button>
              <label className="flex items-center gap-2 btn-secondary !py-2.5 !px-5 text-sm font-bold shrink-0 cursor-pointer">
                <span>Import CSV</span>
                <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
              </label>
              <button
                onClick={() => setIsAddingCity(!isAddingCity)}
                className="flex items-center gap-2 btn-primary !py-2.5 !px-5 text-sm font-bold shrink-0"
              >
                <Plus size={18} /> Add City
              </button>
            </div>
          </div>

          {/* Add City Form */}
          {isAddingCity && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 mb-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Add New City</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="City Name"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  suppressHydrationWarning
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-xl focus:outline-none focus:border-indigo-600 font-medium text-sm"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleAddCity}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Save City
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingCity(false)
                      setNewCityName('')
                    }}
                    className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cities List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {cities.length === 0 ? (
              <div className="p-8 text-center text-gray-600">No cities yet. Add your first city above.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">City Name</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cities.map((city: City) => (
                      <tr key={city.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-gray-900 font-semibold">{city.name}</td>
                        <td className="px-6 py-3 text-center">
                          <button
                            onClick={() => removeCity(city.id)}
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
