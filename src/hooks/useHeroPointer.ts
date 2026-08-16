import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { gsap } from 'gsap'

export type HeroPointerPosition = {
  x: number
  y: number
}

type DepthController = {
  depth: number
  element: HTMLElement
  moveX: (value: number) => void
  moveY: (value: number) => void
}

export function useHeroPointer(rootRef: RefObject<HTMLElement | null>, disabled: boolean) {
  const pointerRef = useRef<HeroPointerPosition>({ x: 0, y: 0 })

  useEffect(() => {
    const root = rootRef.current
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 64rem)').matches

    if (!root || disabled || !finePointer) {
      pointerRef.current = { x: 0, y: 0 }
      root?.style.setProperty('--mouse-x', '50%')
      root?.style.setProperty('--mouse-y', '48%')
      return
    }

    const controllers: DepthController[] = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-depth]')).map((element) => ({
      depth: Number(element.dataset.heroDepth ?? 1),
      element,
      moveX: gsap.quickTo(element, 'x', { duration: 0.6, ease: 'power3.out' }),
      moveY: gsap.quickTo(element, 'y', { duration: 0.6, ease: 'power3.out' }),
    }))

    let bounds = root.getBoundingClientRect()
    let frameId = 0
    let clientX = bounds.left + bounds.width / 2
    let clientY = bounds.top + bounds.height / 2

    const renderPointer = () => {
      frameId = 0
      const relativeX = Math.min(1, Math.max(0, (clientX - bounds.left) / bounds.width))
      const relativeY = Math.min(1, Math.max(0, (clientY - bounds.top) / bounds.height))
      const normalizedX = relativeX * 2 - 1
      const normalizedY = relativeY * 2 - 1

      pointerRef.current.x = normalizedX
      pointerRef.current.y = normalizedY
      root.style.setProperty('--mouse-x', `${(relativeX * 100).toFixed(2)}%`)
      root.style.setProperty('--mouse-y', `${(relativeY * 100).toFixed(2)}%`)

      controllers.forEach(({ depth, moveX, moveY }) => {
        moveX(normalizedX * depth)
        moveY(normalizedY * depth)
      })
    }

    const schedulePointer = (event: PointerEvent) => {
      clientX = event.clientX
      clientY = event.clientY

      if (!frameId) {
        frameId = window.requestAnimationFrame(renderPointer)
      }
    }

    const handlePointerEnter = (event: PointerEvent) => {
      bounds = root.getBoundingClientRect()
      root.classList.add('hero-section--pointer-active')
      schedulePointer(event)
    }

    const handlePointerLeave = () => {
      root.classList.remove('hero-section--pointer-active')
      pointerRef.current.x = 0
      pointerRef.current.y = 0
      root.style.setProperty('--mouse-x', '50%')
      root.style.setProperty('--mouse-y', '48%')
      controllers.forEach(({ moveX, moveY }) => {
        moveX(0)
        moveY(0)
      })
    }

    const handleResize = () => {
      bounds = root.getBoundingClientRect()
    }

    root.addEventListener('pointerenter', handlePointerEnter, { passive: true })
    root.addEventListener('pointermove', schedulePointer, { passive: true })
    root.addEventListener('pointerleave', handlePointerLeave, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }

      root.removeEventListener('pointerenter', handlePointerEnter)
      root.removeEventListener('pointermove', schedulePointer)
      root.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('resize', handleResize)
      root.classList.remove('hero-section--pointer-active')
      controllers.forEach(({ element }) => gsap.killTweensOf(element))
    }
  }, [disabled, rootRef])

  return pointerRef
}
