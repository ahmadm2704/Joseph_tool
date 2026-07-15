'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Expand, Play } from 'lucide-react'
import Image from 'next/image'

interface GalleryCarouselProps {
  mainImage: string
  groupImages: string[]
}

export default function GalleryCarousel({ mainImage, groupImages }: GalleryCarouselProps) {
  const allImages = [mainImage, ...groupImages]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isPlaying, allImages.length])

  const next = () => { setCurrentIndex((prev) => (prev + 1) % allImages.length); setIsPlaying(false) }
  const prev = () => { setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length); setIsPlaying(false) }

  return (
    <div className="relative group">
      {/* Ambient glow behind carousel */}
      <div className="absolute -inset-4 bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-600/10 blur-2xl rounded-3xl -z-10" />

      {/* Main Display */}
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl glass-card-static border border-white/10 shadow-2xl shadow-[#050510]/50 ring-1 ring-white/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={allImages[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
            {/* Vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050510]/80 via-transparent to-[#050510]/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,16,0.4)_100%)]" />
          </motion.div>
        </AnimatePresence>

        {/* Controls - appear on hover */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <button
            onClick={prev}
            className="w-12 h-12 rounded-full glass bg-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 transition-all duration-300 backdrop-blur-md"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="w-12 h-12 rounded-full glass bg-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 transition-all duration-300 backdrop-blur-md"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Top Right Controls */}
        <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-xl glass bg-black/40 flex items-center justify-center text-white hover:bg-white/10 transition-all backdrop-blur-md"
          >
            {isPlaying ? (
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
                <div className="w-1 h-3 bg-white rounded-full animate-pulse delay-75" />
              </div>
            ) : (
              <Play size={16} className="ml-1" />
            )}
          </button>
          <button className="w-10 h-10 rounded-xl glass bg-black/40 flex items-center justify-center text-white hover:bg-white/10 transition-all backdrop-blur-md">
            <Expand size={16} />
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center gap-4 mt-8">
        {allImages.map((src, i) => (
          <button
            key={i}
            onClick={() => { setCurrentIndex(i); setIsPlaying(false) }}
            className={`relative w-24 h-16 rounded-xl overflow-hidden transition-all duration-300 ${
              currentIndex === i
                ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-[#050510] scale-110 shadow-lg shadow-purple-500/30'
                : 'opacity-50 hover:opacity-100 filter grayscale-[50%]'
            }`}
          >
            <Image src={src} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
            <div className={`absolute inset-0 ${currentIndex === i ? 'bg-purple-500/20' : 'bg-black/40'}`} />
          </button>
        ))}
      </div>
    </div>
  )
}
