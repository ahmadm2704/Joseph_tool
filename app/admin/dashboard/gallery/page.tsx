'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin-sidebar'
import { useStore, GalleryImage } from '@/lib/store'
import { Trash2, Plus } from 'lucide-react'
import Image from 'next/image'

export default function GalleryManagement() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [isAddingImage, setIsAddingImage] = useState(false)
  const [imageType, setImageType] = useState<'main' | 'group'>('group')
  const [imageUrl, setImageUrl] = useState('')
  const { galleryImages, addGalleryImage, removeGalleryImage } = useStore()

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

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      const image: GalleryImage = {
        id: Date.now().toString(),
        url: imageUrl,
        type: imageType,
      }
      addGalleryImage(image)
      setImageUrl('')
      setIsAddingImage(false)
      console.log('[v0] Gallery image added:', image)
    }
  }

  const mainImages = galleryImages.filter(img => img.type === 'main')
  const groupImages = galleryImages.filter(img => img.type === 'group')

  if (!isAuthed) return null

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 overflow-auto md:ml-64">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Gallery</h1>
            <button
              onClick={() => setIsAddingImage(!isAddingImage)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              <Plus size={20} /> Add Image
            </button>
          </div>

          {/* Add Image Form */}
          {isAddingImage && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Image</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Image Type</label>
                  <select
                    value={imageType}
                    onChange={(e) => setImageType(e.target.value as 'main' | 'group')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="group">Group Photo</option>
                    <option value="main">Main Instructor Photo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    For demo: Use URLs from unsplash.com or placeholder services
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddImage}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Save Image
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingImage(false)
                      setImageUrl('')
                    }}
                    className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Instructor Photos */}
          {mainImages.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Main Instructor Photos</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {mainImages.map((image) => (
                  <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative w-full h-48">
                      <Image
                        src={image.url}
                        alt="Main instructor"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <button
                        onClick={() => removeGalleryImage(image.id)}
                        className="w-full text-red-600 hover:text-red-800 font-semibold flex items-center justify-center gap-2 py-2"
                      >
                        <Trash2 size={18} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group Photos */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Group Photos</h2>
            {groupImages.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
                No group photos yet. Add your first group photo above.
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {groupImages.map((image) => (
                  <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative w-full h-48">
                      <Image
                        src={image.url}
                        alt="Group photo"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <button
                        onClick={() => removeGalleryImage(image.id)}
                        className="w-full text-red-600 hover:text-red-800 font-semibold flex items-center justify-center gap-2 py-2"
                      >
                        <Trash2 size={18} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
