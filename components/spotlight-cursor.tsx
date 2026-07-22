'use client'

import { useEffect, useRef } from 'react'

export default function SpotlightCursor() {
  const spotlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (spotlightRef.current) {
            spotlightRef.current.style.setProperty('--x', `${e.clientX}px`)
            spotlightRef.current.style.setProperty('--y', `${e.clientY}px`)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={spotlightRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{
        background: `radial-gradient(800px circle at var(--x, -1000px) var(--y, -1000px), rgba(139, 92, 246, 0.035), transparent 40%)`,
      }}
    />
  )
}
