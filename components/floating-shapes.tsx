'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface FloatingShapesProps {
  variant?: 'hero' | 'section' | 'minimal'
}

export default function FloatingShapes({ variant = 'section' }: FloatingShapesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.z = 5.5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25))
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight(0x6366f1, 3.5)
    dirLight1.position.set(5, 5, 5)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 2.5)
    dirLight2.position.set(-5, -3, -2)
    scene.add(dirLight2)

    const mainGroup = new THREE.Group()

    // ─── ACADEMIC ELEMENT CREATORS ───

    // Helper: Create a 3D Book
    const create3DBook = (width: number, height: number, depth: number, coverColor: number) => {
      const book = new THREE.Group()
      const coverMat = new THREE.MeshPhysicalMaterial({ color: coverColor, roughness: 0.3, metalness: 0.1, clearcoat: 0.5 })
      const pageMat = new THREE.MeshStandardMaterial({ color: 0xfffdf0, roughness: 0.8 })

      const cover = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), coverMat)
      book.add(cover)

      const pages = new THREE.Mesh(new THREE.BoxGeometry(width - 0.06, height - 0.04, depth - 0.05), pageMat)
      pages.position.set(0.02, 0, 0)
      book.add(pages)

      return book
    }

    // Helper: Create a 3D Graduation Cap
    const create3DCap = (scale: number = 1) => {
      const capGroup = new THREE.Group()
      const mat = new THREE.MeshPhysicalMaterial({ color: 0x4f46e5, roughness: 0.25, metalness: 0.1 })
      const gold = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.6 })

      // Top square
      const top = new THREE.Mesh(new THREE.BoxGeometry(1.4 * scale, 0.07 * scale, 1.4 * scale), mat)
      top.position.y = 0.4 * scale
      capGroup.add(top)

      // Base
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42 * scale, 0.45 * scale, 0.35 * scale, 32), mat)
      base.position.y = 0.2 * scale
      capGroup.add(base)

      // Button
      const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.07 * scale, 0.07 * scale, 0.05 * scale, 16), gold)
      btn.position.y = 0.45 * scale
      capGroup.add(btn)

      return capGroup
    }

    // Helper: Create a 3D Atom / Science Model
    const create3DAtom = () => {
      const atomGroup = new THREE.Group()
      const nucleusMat = new THREE.MeshPhysicalMaterial({ color: 0xec4899, roughness: 0.2, metalness: 0.3, clearcoat: 0.8 })
      const ringMat = new THREE.MeshPhysicalMaterial({ color: 0x06b6d4, roughness: 0.3, transmission: 0.4, transparent: true, opacity: 0.8 })

      const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), nucleusMat)
      atomGroup.add(nucleus)

      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.03, 16, 64), ringMat)
      ring1.rotation.x = Math.PI / 3
      atomGroup.add(ring1)

      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.03, 16, 64), ringMat)
      ring2.rotation.y = Math.PI / 3
      atomGroup.add(ring2)

      return atomGroup
    }

    // Build scene based on variant
    let primaryObj: THREE.Group
    let secondaryObj1: THREE.Group
    let secondaryObj2: THREE.Group

    if (variant === 'hero' || variant === 'section') {
      // Primary: Academic Book
      primaryObj = create3DBook(1.5, 0.25, 1.1, 0x6366f1)
      primaryObj.position.set(-0.2, 0.1, 0)
      mainGroup.add(primaryObj)

      // Secondary 1: Floating Graduation Cap
      secondaryObj1 = create3DCap(0.85)
      secondaryObj1.position.set(1.4, 0.6, 0.2)
      secondaryObj1.rotation.z = -0.2
      mainGroup.add(secondaryObj1)

      // Secondary 2: Science Atom Model
      secondaryObj2 = create3DAtom()
      secondaryObj2.position.set(-1.4, -0.6, 0.3)
      mainGroup.add(secondaryObj2)
    } else {
      // Minimal variant (e.g. CTA section)
      primaryObj = create3DCap(0.95)
      primaryObj.position.set(0, 0.1, 0)
      mainGroup.add(primaryObj)

      secondaryObj1 = create3DBook(1.2, 0.2, 0.9, 0x06b6d4)
      secondaryObj1.position.set(1.2, -0.4, 0.2)
      secondaryObj1.rotation.y = 0.4
      mainGroup.add(secondaryObj1)

      secondaryObj2 = create3DAtom()
      secondaryObj2.position.set(-1.2, 0.4, 0.2)
      secondaryObj2.scale.setScalar(0.75)
      mainGroup.add(secondaryObj2)
    }

    scene.add(mainGroup)

    // Mouse tracking
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
      mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const startTime = performance.now()
    let animId: number

    const animate = () => {
      const t = (performance.now() - startTime) / 1000

      targetX += (mouseX - targetX) * 0.04
      targetY += (mouseY - targetY) * 0.04

      // Gentle floating animation
      mainGroup.rotation.y = t * 0.3 + targetX * 0.5
      mainGroup.rotation.x = Math.sin(t * 0.6) * 0.06 + targetY * 0.3
      mainGroup.position.y = Math.sin(t * 1.2) * 0.08

      // Individual object micro-rotations
      primaryObj.rotation.y = Math.sin(t * 0.8) * 0.2
      secondaryObj1.rotation.y = t * 0.5
      secondaryObj1.position.y = (variant === 'hero' ? 0.6 : 0.4) + Math.sin(t * 1.5) * 0.08

      secondaryObj2.rotation.x = t * 0.8
      secondaryObj2.rotation.y = t * 1.2

      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [variant])

  const height = variant === 'hero' ? 'h-[450px]' : variant === 'section' ? 'h-[350px]' : 'h-[250px]'

  return (
    <div className={`relative w-full ${height} flex items-center justify-center`}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
