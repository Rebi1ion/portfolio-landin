import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import * as THREE from 'three'
import type { HeroPointerPosition } from '../hooks/useHeroPointer'

type HeroSceneProps = {
  pointerRef: RefObject<HeroPointerPosition>
}

const PARTICLE_SEED = 17.391

function seededValue(index: number) {
  const value = Math.sin(index * 12.9898 + PARTICLE_SEED) * 43758.5453
  return value - Math.floor(value)
}

function createParticleField(count: number) {
  const positions = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const theta = seededValue(index * 3) * Math.PI * 2
    const phi = Math.acos(1 - seededValue(index * 3 + 1) * 2)
    const radius = 2.1 + seededValue(index * 3 + 2) * 1.25
    const offset = index * 3

    positions[offset] = Math.sin(phi) * Math.cos(theta) * radius
    positions[offset + 1] = Math.cos(phi) * radius * 0.78
    positions[offset + 2] = Math.sin(phi) * Math.sin(theta) * radius
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: 0xff9500,
    depthWrite: false,
    opacity: 0.48,
    size: 0.026,
    transparent: true,
  })

  return new THREE.Points(geometry, material)
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh
    mesh.geometry?.dispose()

    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((material) => material.dispose())
    } else {
      mesh.material?.dispose()
    }
  })
}

export function HeroScene({ pointerRef }: HeroSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current

    if (!host) {
      return
    }

    const mobile = window.matchMedia('(max-width: 47.99rem)').matches

    // The CSS fallback keeps the signal readable on touch devices without a
    // continuously rendered WebGL scene competing with the page content.
    if (mobile) {
      return
    }

    let renderer: THREE.WebGLRenderer

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !window.matchMedia('(max-width: 63.99rem)').matches,
        powerPreference: 'high-performance',
      })
    } catch {
      return
    }

    const compact = window.matchMedia('(max-width: 63.99rem)').matches
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    const core = new THREE.Group()
    const geometryParts: THREE.Object3D[] = []
    let frameId = 0
    let isVisible = true
    let isDocumentVisible = !document.hidden
    let lastTime = 0

    camera.position.z = 6.4
    scene.add(core)

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xff9500,
      opacity: compact ? 0.23 : 0.32,
      transparent: true,
      wireframe: true,
    })
    const brightWireMaterial = new THREE.MeshBasicMaterial({
      color: 0xffb000,
      opacity: compact ? 0.18 : 0.26,
      transparent: true,
      wireframe: true,
    })

    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.48, 2), wireMaterial)
    const inner = new THREE.Mesh(new THREE.OctahedronGeometry(0.88, 2), brightWireMaterial)
    const horizontalRing = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.008, 4, 96), wireMaterial)
    const verticalRing = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.006, 4, 80), brightWireMaterial)
    const diagonalRing = new THREE.Mesh(new THREE.TorusGeometry(2.18, 0.004, 4, 100), wireMaterial)
    const particles = createParticleField(compact ? 82 : 150)

    horizontalRing.rotation.x = Math.PI / 2
    verticalRing.rotation.y = Math.PI / 2
    diagonalRing.rotation.set(0.72, 0.34, -0.26)
    core.add(shell, inner, horizontalRing, verticalRing, diagonalRing, particles)
    geometryParts.push(shell, inner, horizontalRing, verticalRing, diagonalRing, particles)

    const resize = () => {
      const width = Math.max(1, host.clientWidth)
      const height = Math.max(1, host.clientHeight)
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setPixelRatio(pixelRatio)
      renderer.setSize(width, height, false)
    }

    const render = (time: number) => {
      frameId = 0

      if (!isVisible || !isDocumentVisible) {
        return
      }

      const elapsed = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 0
      lastTime = time
      const pointer = pointerRef.current
      const smoothness = 1 - Math.pow(0.001, elapsed || 0.016)

      core.rotation.y += elapsed * 0.13
      core.rotation.x += elapsed * 0.045
      core.rotation.x += (pointer.y * -0.08 - core.rotation.x) * smoothness * 0.24
      core.rotation.z += (pointer.x * 0.06 - core.rotation.z) * smoothness * 0.2
      camera.position.x += (pointer.x * 0.22 - camera.position.x) * smoothness * 0.55
      camera.position.y += (pointer.y * -0.16 - camera.position.y) * smoothness * 0.55
      camera.lookAt(0, 0, 0)
      particles.rotation.y -= elapsed * 0.018
      particles.rotation.x += elapsed * 0.008
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(render)
    }

    const start = () => {
      if (!frameId && isVisible && isDocumentVisible) {
        frameId = window.requestAnimationFrame(render)
      }
    }

    const stop = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
        frameId = 0
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting

      if (isVisible) {
        start()
      } else {
        stop()
      }
    }, { threshold: 0.01 })

    const resizeObserver = new ResizeObserver(resize)
    const handleVisibility = () => {
      isDocumentVisible = !document.hidden

      if (isDocumentVisible) {
        start()
      } else {
        stop()
      }
    }

    renderer.setClearColor(0x000000, 0)
    renderer.domElement.className = 'hero-scene__canvas'
    host.appendChild(renderer.domElement)
    host.classList.add('hero-scene--ready')
    resizeObserver.observe(host)
    observer.observe(host)
    document.addEventListener('visibilitychange', handleVisibility, { passive: true })
    resize()
    start()

    return () => {
      stop()
      resizeObserver.disconnect()
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      geometryParts.forEach(disposeObject)
      renderer.dispose()
      renderer.domElement.remove()
      host.classList.remove('hero-scene--ready')
    }
  }, [pointerRef])

  return <div ref={hostRef} className="hero-scene" aria-hidden="true" />
}
