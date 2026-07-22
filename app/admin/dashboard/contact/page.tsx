'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin-sidebar'
import { useStore, ContactMessage } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Download, Eye, X, Mail, Search, Sparkles, MessageSquare, Clock, User, CheckCircle2 } from 'lucide-react'

export default function ContactManagement() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const { contactMessages, removeContactMessage } = useStore()

  useEffect(() => {
    const session = localStorage.getItem('adminSession')
    if (!session) router.push('/admin/login')
    else setIsAuthed(true)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.push('/admin/login')
  }

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Subject', 'Message', 'Status', 'Date']
    const rows = contactMessages.map(msg => [
      `"${msg.name}"`,
      `"${msg.email}"`,
      `"${msg.subject}"`,
      `"${msg.message.replace(/"/g, '""')}"`,
      msg.status,
      new Date(msg.createdAt).toLocaleDateString(),
    ])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contact_messages.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = contactMessages.filter(m =>
    `${m.name} ${m.email} ${m.subject} ${m.message}`.toLowerCase().includes(search.toLowerCase())
  )

  if (!isAuthed) return null

  const selected = contactMessages.find(m => m.id === selectedMsg)

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-1 overflow-auto md:ml-64 relative z-10">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-widest">
                  <MessageSquare size={11} /> Contact Form Submissions
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Client Inquiries</h1>
              <p className="text-slate-600 mt-1 text-sm">{contactMessages.length} total messages received</p>
            </div>
            {contactMessages.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 btn-secondary !py-3 !px-6 text-sm font-bold shrink-0"
              >
                <Download size={16} /> Export CSV
              </button>
            )}
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search messages by name, email, subject or message..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 glass-input text-white placeholder:text-gray-600 font-medium"
            />
          </motion.div>

          {/* Messages Grid */}
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-card !rounded-2xl p-14 text-center">
              <Mail size={40} className="text-gray-700 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-400">{search ? 'No matches found' : 'No messages yet'}</h3>
              <p className="text-gray-600 text-sm mt-1">
                {search ? 'Try a different search term.' : 'Client messages submitted from the contact page will appear here.'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card !rounded-2xl p-5 hover:border-white/10 transition-all group relative cursor-pointer"
                  onClick={() => setSelectedMsg(msg.id)}
                >
                  {/* Actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedMsg(msg.id)}
                      className="p-2 glass rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                      title="View Details"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(msg.id)}
                      className="p-2 glass rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Sender Info */}
                  <div className="flex items-center gap-3 mb-4 pr-16">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-emerald-500/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-purple-400">{msg.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{msg.name}</p>
                      <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Subject & Message snippet */}
                  <div className="space-y-1.5 mb-4">
                    <p className="text-xs font-bold text-emerald-400 truncate">{msg.subject || 'No Subject'}</p>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{msg.message}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-gray-500">
                    <span className="truncate">{msg.email}</span>
                    <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                      Received
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedMsg && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedMsg(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative glass-card !rounded-2xl max-w-lg w-full ring-1 ring-purple-500/20 max-h-[90vh] flex flex-col"
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent rounded-t-2xl z-10" />
              <button
                onClick={() => setSelectedMsg(null)}
                className="absolute top-4 right-4 p-2 glass rounded-xl text-gray-500 hover:text-white transition-all z-10"
              >
                <X size={18} />
              </button>

              <div className="p-8 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-3 mb-6 pr-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-purple-500/25 shrink-0">
                    <span className="text-base font-bold text-white">{selected.name[0]}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                    <p className="text-xs text-gray-400">{selected.email}</p>
                    <p className="text-[0.65rem] text-gray-500 mt-0.5">Submitted {new Date(selected.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-[0.65rem] font-bold uppercase tracking-widest text-emerald-400 mb-1">Subject</p>
                    <p className="text-sm font-bold text-white">{selected.subject || 'No Subject'}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-500 mb-2">Message Body</p>
                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMsg(null)}
                  className="w-full btn-primary mt-6 !py-3 text-sm font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative glass-card !rounded-2xl p-8 max-w-sm w-full text-center ring-1 ring-red-500/20"
            >
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Delete Inquiry?</h3>
              <p className="text-gray-400 text-sm mb-6">This will permanently delete this client&apos;s message.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-secondary py-3 text-sm font-bold">Cancel</button>
                <button
                  onClick={() => { removeContactMessage(deleteConfirm); setDeleteConfirm(null) }}
                  className="flex-1 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-sm font-bold transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
