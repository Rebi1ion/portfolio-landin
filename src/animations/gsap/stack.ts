import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type StackAnimationOptions = {
  reducedMotion: boolean
}

export function createStackAnimations(root: HTMLElement, { reducedMotion }: StackAnimationOptions) {
  const cards = gsap.utils.toArray<HTMLElement>('.stack-card', root)
  const items = gsap.utils.toArray<HTMLElement>('.stack-item', root)
  const markers = gsap.utils.toArray<HTMLElement>('.stack-item__marker', root)

  if (reducedMotion) {
    return () => undefined
  }

  const cleanups: Array<() => void> = []
  const context = gsap.context(() => {
    gsap.set(cards, { autoAlpha: 0, y: 20, transformPerspective: 900 })
    gsap.set(items, { autoAlpha: 0, x: -8 })
    gsap.set(markers, { scale: 0.65, transformOrigin: 'center center' })

    const timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: root,
        start: 'top 76%',
        once: true,
      },
    })

    timeline
      .to(cards, { autoAlpha: 1, y: 0, duration: 0.56, stagger: 0.1 })
      .to(items, { autoAlpha: 1, x: 0, duration: 0.32, stagger: 0.035 }, '-=0.22')
      .to(markers, { scale: 1, duration: 0.22, stagger: 0.035, ease: 'back.out(2)' }, '<')

    const supportsFinePointer = window.matchMedia('(pointer: fine)')

    if (supportsFinePointer.matches) {
      cards.forEach((card) => {
        const rotateXTo = gsap.quickTo(card, 'rotationX', { duration: 0.36, ease: 'power2.out' })
        const rotateYTo = gsap.quickTo(card, 'rotationY', { duration: 0.36, ease: 'power2.out' })
        const scaleXTo = gsap.quickTo(card, 'scaleX', { duration: 0.36, ease: 'power2.out' })
        const scaleYTo = gsap.quickTo(card, 'scaleY', { duration: 0.36, ease: 'power2.out' })
        let bounds = card.getBoundingClientRect()

        const handlePointerEnter = () => {
          bounds = card.getBoundingClientRect()
          scaleXTo(1.012)
          scaleYTo(1.012)
        }
        const handlePointerMove = (event: PointerEvent) => {
          const x = ((event.clientX - bounds.left) / bounds.width) * 100
          const y = ((event.clientY - bounds.top) / bounds.height) * 100
          const rotateY = (x - 50) * 0.08
          const rotateX = (50 - y) * 0.08

          card.style.setProperty('--pointer-x', `${x}%`)
          card.style.setProperty('--pointer-y', `${y}%`)
          rotateXTo(rotateX)
          rotateYTo(rotateY)
        }
        const handlePointerLeave = () => {
          card.style.setProperty('--pointer-x', '50%')
          card.style.setProperty('--pointer-y', '50%')
          rotateXTo(0)
          rotateYTo(0)
          scaleXTo(1)
          scaleYTo(1)
        }

        const handleResize = () => { bounds = card.getBoundingClientRect() }

        card.addEventListener('pointerenter', handlePointerEnter)
        card.addEventListener('pointermove', handlePointerMove)
        card.addEventListener('pointerleave', handlePointerLeave)
        window.addEventListener('resize', handleResize, { passive: true })
        cleanups.push(() => {
          card.removeEventListener('pointerenter', handlePointerEnter)
          card.removeEventListener('pointermove', handlePointerMove)
          card.removeEventListener('pointerleave', handlePointerLeave)
          window.removeEventListener('resize', handleResize)
          gsap.killTweensOf(card)
        })
      })
    }
  }, root)

  return () => {
    cleanups.forEach((cleanup) => cleanup())
    context.revert()
  }
}
