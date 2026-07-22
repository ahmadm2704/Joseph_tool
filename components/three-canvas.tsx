'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.set(0, 1.2, 5.5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25))
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0x6366f1, 4.0)
    mainLight.position.set(6, 8, 6)
    scene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0x06b6d4, 3.0)
    fillLight.position.set(-6, -2, -2)
    scene.add(fillLight)

    const topLight = new THREE.PointLight(0xec4899, 2.5, 12)
    topLight.position.set(0, 4, 3)
    scene.add(topLight)

    // Academic Master Group
    const academicGroup = new THREE.Group()

    // ─── 1. GRADUATION CAP (Mortarboard) ───
    const capGroup = new THREE.Group()

    // Cap Top (Square Board)
    const capTopGeo = new THREE.BoxGeometry(1.7, 0.08, 1.7)
    const capMat = new THREE.MeshPhysicalMaterial({
      color: 0x4f46e5,
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 0.8,
    })
    const capTop = new THREE.Mesh(capTopGeo, capMat)
    capTop.position.y = 0.5
    capGroup.add(capTop)

    // Cap Base (Skull Cap)
    const capBaseGeo = new THREE.CylinderGeometry(0.52, 0.55, 0.45, 32)
    const capBase = new THREE.Mesh(capBaseGeo, capMat)
    capBase.position.y = 0.24
    capGroup.add(capBase)

    // Button on top
    const buttonGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16)
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2,
    })
    const button = new THREE.Mesh(buttonGeo, goldMat)
    button.position.y = 0.56
    capGroup.add(button)

    // Tassel Cord & Ball
    const tasselMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 })
    const tasselBallGeo = new THREE.SphereGeometry(0.09, 16, 16)
    const tasselBall = new THREE.Mesh(tasselBallGeo, tasselMat)
    tasselBall.position.set(0.75, 0.2, 0.75)
    capGroup.add(tasselBall)

    capGroup.position.set(0, 0.8, 0)
    capGroup.rotation.z = -0.1
    academicGroup.add(capGroup)

    // ─── 2. STACK OF BOOKS ───
    const booksGroup = new THREE.Group()

    const pageMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.8 })

    const createBook = (width: number, height: number, depth: number, coverColor: number, rotY: number, posY: number) => {
      const book = new THREE.Group()

      // Cover
      const coverMat = new THREE.MeshPhysicalMaterial({ color: coverColor, roughness: 0.3, metalness: 0.1, clearcoat: 0.5 })
      const coverGeo = new THREE.BoxGeometry(width, height, depth)
      const cover = new THREE.Mesh(coverGeo, coverMat)
      book.add(cover)

      // Inner Pages (slightly recessed inside cover)
      const pagesGeo = new THREE.BoxGeometry(width - 0.08, height - 0.04, depth - 0.06)
      const pages = new THREE.Mesh(pagesGeo, pageMat)
      pages.position.set(0.03, 0, 0)
      book.add(pages)

      book.position.y = posY
      book.rotation.y = rotY
      return book
    }

    // Book 1 (Bottom - Cyan)
    const book1 = createBook(1.9, 0.28, 1.4, 0x06b6d4, 0.1, -0.6)
    booksGroup.add(book1)

    // Book 2 (Middle - Purple)
    const book2 = createBook(1.7, 0.26, 1.3, 0x8b5cf6, -0.2, -0.32)
    booksGroup.add(book2)

    // Book 3 (Top - Emerald)
    const book3 = createBook(1.5, 0.24, 1.2, 0x10b981, 0.3, -0.06)
    booksGroup.add(book3)

    academicGroup.add(booksGroup)

    // ─── 3. ROLLED DIPLOMA SCROLL ───
    const diplomaGroup = new THREE.Group()

    const paperMat = new THREE.MeshStandardMaterial({ color: 0xfffdf0, roughness: 0.4 })
    const scrollGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.5, 32)
    const scroll = new THREE.Mesh(scrollGeo, paperMat)
    scroll.rotation.z = Math.PI / 2
    diplomaGroup.add(scroll)

    // Ribbon Ring around Scroll
    const ribbonGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 32)
    const ribbonMat = new THREE.MeshPhysicalMaterial({ color: 0xef4444, roughness: 0.3, metalness: 0.2 })
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat)
    ribbon.rotation.z = Math.PI / 2
    diplomaGroup.add(ribbon)

    diplomaGroup.position.set(0.2, -0.78, 0.6)
    diplomaGroup.rotation.y = -0.4
    academicGroup.add(diplomaGroup)

    scene.add(academicGroup)

    // Mouse Tracking
    let targetX = 0
    let targetY = 0
    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
      mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Animation Loop (using performance.now to prevent Three.js Clock deprecation warning)
    const startTime = performance.now()
    let animationId: number

    const animate = () => {
      const elapsedTime = (performance.now() - startTime) / 1000

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.05
      targetY += (mouseY - targetY) * 0.05

      // Academic group rotation & floating oscillation
      academicGroup.rotation.y = elapsedTime * 0.35 + targetX * 0.6
      academicGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.08 + targetY * 0.4
      academicGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.12

      // Gentle floating relative animation for graduation cap
      capGroup.rotation.y = Math.sin(elapsedTime * 1.5) * 0.1

      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
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
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div className="relative w-full h-[480px] flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  )
}
