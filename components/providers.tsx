'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import RegistrationModal from '@/components/registration-modal'

function GlobalRegistrationModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { courses } = useStore()

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-registration', handleOpen)
    return () => window.removeEventListener('open-registration', handleOpen)
  }, [])

  return (
    <RegistrationModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      courses={courses}
    />
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  const syncData = useStore(state => state.syncData)

  useEffect(() => {
    // Sync data from Supabase on load
    syncData()
  }, [syncData])

  return (
    <>
      {children}
      <GlobalRegistrationModal />
    </>
  )
}
