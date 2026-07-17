'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'

export function Providers({ children }: { children: React.ReactNode }) {
  const syncData = useStore(state => state.syncData)

  useEffect(() => {
    // Sync data from Supabase on load
    syncData()
  }, [syncData])

  return <>{children}</>
}
