'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  pulse: number
  pulseSpeed: number
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Particle[] = []
    let mouseX = -1000
    let mouseY = -1000

    const colors = [
      'rgba(139, 92, 246, ',  // purple
      'rgba(6, 182, 212, ',   // cyan
      'rgba(236, 72, 153, ',  // pink
      'rgba(168, 85, 247, ',  // violet
      'rgba(34, 211, 238, ',  // light cyan
    ]

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = document.documentElement.scrollHeight
    }

    const createParticles = () => {
      const count = Math.min(120, Math.floor(window.innerWidth / 12))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      }))
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY + window.scrollY
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        // Update
        p.x += p.vx
        p.y += p.vy
        p.pulse += p.pulseSpeed
        const pulseScale = 1 + Math.sin(p.pulse) * 0.3

        // Mouse interaction — particles gently repel
        const dx = p.x - mouseX
        const dy = p.y - mouseY
        const distMouse = Math.sqrt(dx * dx + dy * dy)
        if (distMouse < 200) {
          const force = (200 - distMouse) / 200 * 0.5
          p.vx += (dx / distMouse) * force * 0.02
          p.vy += (dy / distMouse) * force * 0.02
        }

        // Dampen velocity
        p.vx *= 0.999
        p.vy *= 0.999

        // Wrap
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw particle with glow
        const size = p.size * pulseScale
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3)
        grad.addColorStop(0, `${p.color}${p.opacity * 0.8})`)
        grad.addColorStop(0.5, `${p.color}${p.opacity * 0.2})`)
        grad.addColorStop(1, `${p.color}0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, size * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${p.opacity * 1.2})`
        ctx.fill()

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const ox = particles[j].x - p.x
          const oy = particles[j].y - p.y
          const dist = Math.sqrt(ox * ox + oy * oy)

          if (dist < 180) {
            const lineOpacity = (1 - dist / 180) * 0.12
            const gradient = ctx.createLinearGradient(p.x, p.y, particles[j].x, particles[j].y)
            gradient.addColorStop(0, `rgba(139, 92, 246, ${lineOpacity})`)
            gradient.addColorStop(1, `rgba(6, 182, 212, ${lineOpacity * 0.5})`)
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = 0.4
            ctx.stroke()
          }
        }
      })

      animationId = requestAnimationFrame(draw)
    }

    resize()
    createParticles()
    draw()

    window.addEventListener('resize', () => { resize(); createParticles() })
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  )
}
