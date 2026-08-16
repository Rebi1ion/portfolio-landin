import { useEffect } from 'react'
import type { RefObject } from 'react'
import { gsap } from 'gsap'

function createClickPulse(element: HTMLElement, event: MouseEvent) {
  const bounds = element.getBoundingClientRect()
  const hasPointerCoordinates = event.clientX !== 0 || event.clientY !== 0
  const x = hasPointerCoordinates ? event.clientX - bounds.left : bounds.width / 2
  const y = hasPointerCoordinates ? event.clientY - bounds.top : bounds.height / 2
  const pulse = document.createElement('span')

  pulse.className = 'terminal-button__pulse'
  pulse.setAttribute('aria-hidden', 'true')
  pulse.style.left = `${x}px`
  pulse.style.top = `${y}px`
  element.appendChild(pulse)

  gsap.fromTo(
    pulse,
    { autoAlpha: 0.75, scale: 0 },
    {
      autoAlpha: 0,
      scale: 1,
      duration: 0.52,
      ease: 'power2.out',
      onComplete: () => pulse.remove(),
    },
  )
}

export function useMagnetic(rootRef: RefObject<HTMLElement | null>, disabled: boolean) {
  useEffect(() => {
    const root = rootRef.current
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 64rem)').matches

    if (!root || disabled || !finePointer) {
      return
    }

    const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-magnetic="true"]'))
    const cleanups = elements.map((element) => {
      const moveX = gsap.quickTo(element, 'x', { duration: 0.35, ease: 'power3.out' })
      const moveY = gsap.quickTo(element, 'y', { duration: 0.35, ease: 'power3.out' })
      let bounds = element.getBoundingClientRect()

      const handlePointerEnter = () => {
        bounds = element.getBoundingClientRect()
        element.classList.add('terminal-button--magnetic-active')
      }

      const handlePointerMove = (event: PointerEvent) => {
        const localX = event.clientX - bounds.left
        const localY = event.clientY - bounds.top
        const offsetX = localX - bounds.width / 2
        const offsetY = localY - bounds.height / 2

        element.style.setProperty('--cta-x', `${localX}px`)
        element.style.setProperty('--cta-y', `${localY}px`)
        moveX(offsetX * 0.16)
        moveY(offsetY * 0.18)
      }

      const handlePointerLeave = () => {
        element.classList.remove('terminal-button--magnetic-active')
        element.style.setProperty('--cta-x', '50%')
        element.style.setProperty('--cta-y', '50%')
        moveX(0)
        moveY(0)
      }

      const handleClick = (event: MouseEvent) => createClickPulse(element, event)

      element.addEventListener('pointerenter', handlePointerEnter, { passive: true })
      element.addEventListener('pointermove', handlePointerMove, { passive: true })
      element.addEventListener('pointerleave', handlePointerLeave, { passive: true })
      element.addEventListener('click', handleClick)

      return () => {
        element.removeEventListener('pointerenter', handlePointerEnter)
        element.removeEventListener('pointermove', handlePointerMove)
        element.removeEventListener('pointerleave', handlePointerLeave)
        element.removeEventListener('click', handleClick)
        gsap.killTweensOf(element)
      }
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [disabled, rootRef])
}
