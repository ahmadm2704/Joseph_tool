'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeServices() {
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

    const matrixGroup = new THREE.Group()

    // ─── 3D TECH SKILLS MATRIX (PROGRAMS & SERVICES) ───

    // Centerpiece: Glowing Quantum Core Sphere
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x6366f1,
      roughness: 0.15,
      metalness: 0.3,
      transmission: 0.5,
      transparent: true,
      opacity: 0.9,
      clearcoat: 1.0,
    })
    const coreSphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1.0, 1), coreMat)
    matrixGroup.add(coreSphere)

    // Orbiting Skill Module Cubes
    const cubes: THREE.Mesh[] = []
    const cubeColors = [0x06b6d4, 0xec4899, 0x10b981, 0xf59e0b, 0x8b5cf6, 0x3b82f6]
    const cubePositions = [
      { x: -1.7, y: 0.9, z: 0.4 },
      { x: 1.8, y: 0.8, z: -0.3 },
      { x: -1.6, y: -0.9, z: -0.2 },
      { x: 1.7, y: -0.8, z: 0.5 },
      { x: 0, y: 1.8, z: -0.4 },
      { x: 0, y: -1.8, z: 0.3 },
    ]

    cubePositions.forEach((pos, i) => {
      const cubeMat = new THREE.MeshPhysicalMaterial({
        color: cubeColors[i % cubeColors.length],
        roughness: 0.2,
        metalness: 0.2,
        clearcoat: 0.8,
      })
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), cubeMat)
      cube.position.set(pos.x, pos.y, pos.z)
      matrixGroup.add(cube)
      cubes.push(cube)
    })

    // Holographic Connection Rings
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.3 })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.02, 16, 64), ringMat)
    ring.rotation.x = Math.PI / 3
    matrixGroup.add(ring)

    scene.add(matrixGroup)

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

      // Core rotation
      matrixGroup.rotation.y = t * 0.3 + targetX * 0.8
      matrixGroup.rotation.x = Math.sin(t * 0.5) * 0.1 + targetY * 0.5
      matrixGroup.position.y = Math.sin(t * 1.2) * 0.1

      coreSphere.rotation.x = t * 0.5
      coreSphere.rotation.y = t * 0.7

      // Individual skill blocks rotation
      cubes.forEach((cube, idx) => {
        cube.rotation.x = t * 1.2 + idx
        cube.rotation.y = t * 0.9 + idx
        cube.position.y = cubePositions[idx].y + Math.sin(t * 2 + idx) * 0.08
      })

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
