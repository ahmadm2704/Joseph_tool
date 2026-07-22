'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeContact() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.set(0, 0, 5.5)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25))
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0x6366f1, 4.0)
    mainLight.position.set(5, 5, 5)
    scene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0x06b6d4, 3.0)
    fillLight.position.set(-5, -3, -2)
    scene.add(fillLight)

    const contactGroup = new THREE.Group()

    // ─── 3D COMMUNICATION & MESSAGE HUB (CONTACT US) ───

    // 1. 3D Mail Envelope / Message Badge Centerpiece
    const envelopeGroup = new THREE.Group()
    const envMat = new THREE.MeshPhysicalMaterial({
      color: 0x6366f1,
      roughness: 0.2,
      metalness: 0.15,
      clearcoat: 0.8,
    })

    // Envelope Body
    const bodyGeo = new THREE.BoxGeometry(1.8, 1.2, 0.15)
    const body = new THREE.Mesh(bodyGeo, envMat)
    envelopeGroup.add(body)

    // Envelope Flap Top Triangle (Cone)
    const flapGeo = new THREE.ConeGeometry(0.9, 0.6, 4)
    const flap = new THREE.Mesh(flapGeo, envMat)
    flap.rotation.z = Math.PI
    flap.position.set(0, 0.35, 0.08)
    flap.scale.set(1.4, 1, 0.3)
    envelopeGroup.add(flap)

    // Gold Wax Seal / Badge
    const sealMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.2 })
    const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 32), sealMat)
    seal.rotation.x = Math.PI / 2
    seal.position.set(0, 0.05, 0.12)
    envelopeGroup.add(seal)

    contactGroup.add(envelopeGroup)

    // 2. Orbiting Speech Bubble Prisms & Signal Waves
    const bubbleMat1 = new THREE.MeshPhysicalMaterial({ color: 0x06b6d4, roughness: 0.2, transmission: 0.4, transparent: true, opacity: 0.9 })
    const bubbleMat2 = new THREE.MeshPhysicalMaterial({ color: 0xec4899, roughness: 0.2, transmission: 0.4, transparent: true, opacity: 0.9 })

    // Speech Bubble 1 (Cyan)
    const bubble1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.4, 0), bubbleMat1)
    bubble1.position.set(1.6, 0.8, 0.3)
    contactGroup.add(bubble1)

    // Speech Bubble 2 (Pink)
    const bubble2 = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), bubbleMat2)
    bubble2.position.set(-1.6, -0.7, 0.4)
    contactGroup.add(bubble2)

    // 3. Pulsing Communication Signal Rings
    const waveMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.4 })
    const waveRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.02, 16, 64), waveMat)
    waveRing1.rotation.x = Math.PI / 2.5
    contactGroup.add(waveRing1)

    const waveRing2 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.02, 16, 64), waveMat)
    waveRing2.rotation.x = -Math.PI / 3
    contactGroup.add(waveRing2)

    scene.add(contactGroup)

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

    const startTime = performance.now()
    let animationId: number

    const animate = () => {
      const t = (performance.now() - startTime) / 1000

      targetX += (mouseX - targetX) * 0.05
      targetY += (mouseY - targetY) * 0.05

      // Main group float & rotation
      contactGroup.rotation.y = t * 0.3 + targetX * 0.8
      contactGroup.rotation.x = Math.sin(t * 0.5) * 0.1 + targetY * 0.5
      contactGroup.position.y = Math.sin(t * 1.2) * 0.1

      // Envelope tilt micro-animation
      envelopeGroup.rotation.z = Math.sin(t * 1.5) * 0.05

      // Orbiting speech bubbles
      bubble1.position.x = Math.cos(t * 1.2) * 1.8
      bubble1.position.y = 0.8 + Math.sin(t * 1.5) * 0.2
      bubble1.rotation.y = t * 1.5

      bubble2.position.x = Math.cos(t * 1.2 + Math.PI) * 1.8
      bubble2.position.y = -0.7 + Math.sin(t * 1.5 + Math.PI) * 0.2
      bubble2.rotation.x = t * 1.8

      waveRing1.rotation.z = t * 0.4
      waveRing2.rotation.z = -t * 0.6

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
