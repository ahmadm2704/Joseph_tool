'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface AnimatedBannerProps {
  message: string
}

export default function AnimatedBanner({ message }: AnimatedBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-500 overflow-hidden"
      >
        {/* Animated shimmer overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 relative z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-white animate-pulse" />
              <p className="text-xs sm:text-sm font-semibold text-white tracking-wide">{message}</p>
              <Link href="/services" className="hidden sm:flex items-center gap-1 text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-md ml-2 transition-colors uppercase tracking-wider">
                Learn More <ChevronRight size={12} />
              </Link>
            </div>
            
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-1 transition-all"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
