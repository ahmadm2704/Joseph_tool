'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeAbout() {
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
    mainLight.position.set(6, 6, 6)
    scene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0x06b6d4, 3.0)
    fillLight.position.set(-6, -4, -2)
    scene.add(fillLight)

    const globeGroup = new THREE.Group()

    // ─── 3D GLOBAL NETWORK SPHERE (ABOUT STORY & REACH) ───

    // Central Globe Core
    const globeMat = new THREE.MeshPhysicalMaterial({
      color: 0x4f46e5,
      roughness: 0.25,
      metalness: 0.2,
      transmission: 0.35,
      transparent: true,
      opacity: 0.9,
      ior: 1.4,
      clearcoat: 1.0,
    })
    const globe = new THREE.Mesh(new THREE.SphereGeometry(1.35, 32, 32), globeMat)
    globeGroup.add(globe)

    // Wireframe Latitude / Longitude Ring Shell
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.35 })
    const wireSphere = new THREE.Mesh(new THREE.SphereGeometry(1.42, 20, 20), wireMat)
    globeGroup.add(wireSphere)

    // Orbit Ring 1 (Timeline Arc)
    const ring1Mat = new THREE.MeshPhysicalMaterial({ color: 0xec4899, roughness: 0.2, transmission: 0.5, transparent: true, opacity: 0.8 })
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.04, 16, 64), ring1Mat)
    ring1.rotation.x = Math.PI / 3
    ring1.rotation.y = Math.PI / 6
    globeGroup.add(ring1)

    // Orbit Ring 2 (Global Network Arc)
    const ring2Mat = new THREE.MeshPhysicalMaterial({ color: 0x10b981, roughness: 0.2, transmission: 0.5, transparent: true, opacity: 0.7 })
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.03, 16, 64), ring2Mat)
    ring2.rotation.x = -Math.PI / 4
    ring2.rotation.y = Math.PI / 4
    globeGroup.add(ring2)

    // Milestone Location Pins & Satellites
    const pinGeo = new THREE.ConeGeometry(0.12, 0.35, 16)
    const pinMat = new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.7 })

    const pins: THREE.Mesh[] = []
    const pinCoords = [
      { lat: 0.5, lon: 0.3 },
      { lat: -0.6, lon: 1.2 },
      { lat: 0.8, lon: -1.5 },
      { lat: -0.3, lon: -0.8 },
      { lat: 0.2, lon: 2.2 },
    ]

    pinCoords.forEach(coord => {
      const pin = new THREE.Mesh(pinGeo, pinMat)
      const phi = (90 - coord.lat * 45) * (Math.PI / 180)
      const theta = (coord.lon * 60) * (Math.PI / 180)

      pin.position.x = 1.45 * Math.sin(phi) * Math.cos(theta)
      pin.position.y = 1.45 * Math.cos(phi)
      pin.position.z = 1.45 * Math.sin(phi) * Math.sin(theta)

      pin.lookAt(0, 0, 0)
      pin.rotateX(Math.PI / 2)
      globeGroup.add(pin)
      pins.push(pin)
    })

    scene.add(globeGroup)

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

      // Continuous rotation of the global story sphere
      globeGroup.rotation.y = t * 0.35 + targetX * 0.8
      globeGroup.rotation.x = Math.sin(t * 0.5) * 0.1 + targetY * 0.5
      globeGroup.position.y = Math.sin(t * 1.2) * 0.1

      ring1.rotation.z = t * 0.4
      ring2.rotation.z = -t * 0.5

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
