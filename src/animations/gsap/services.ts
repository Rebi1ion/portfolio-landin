import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type ServicesAnimationOptions = {
  reducedMotion: boolean
}

export function createServicesAnimations(root: HTMLElement, { reducedMotion }: ServicesAnimationOptions) {
  const heading = root.querySelector<HTMLElement>('.section-heading')
  const meta = root.querySelector<HTMLElement>('.services-terminal-meta')
  const cards = gsap.utils.toArray<HTMLElement>('.service-card', root)
  const markers = gsap.utils.toArray<HTMLElement>('.terminal-list__marker', root)
  const secondaryText = gsap.utils.toArray<HTMLElement>('.service-item__text', root)
  const statuses = gsap.utils.toArray<HTMLElement>('.service-card__status', root)

  if (reducedMotion) {
    return () => undefined
  }

  const cleanups: Array<() => void> = []
  const context = gsap.context(() => {
    gsap.set([heading, meta], { autoAlpha: 0, y: 12 })
    gsap.set(cards, { autoAlpha: 0, y: 24 })
    gsap.set(markers, { autoAlpha: 0, scale: 0.6, transformOrigin: 'center center' })
    gsap.set(secondaryText, { autoAlpha: 0, y: 7 })
    gsap.set(statuses, { autoAlpha: 0, x: -6 })

    const timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: root,
        start: 'top 78%',
        once: true,
      },
    })

    timeline
      .to(heading, { autoAlpha: 1, y: 0, duration: 0.42 })
      .to(meta, { autoAlpha: 1, y: 0, duration: 0.3 }, '-=0.2')
      .to(cards, { autoAlpha: 1, y: 0, duration: 0.54, stagger: 0.14 }, '-=0.06')
      .to(markers, { autoAlpha: 1, scale: 1, duration: 0.24, stagger: 0.08, ease: 'back.out(1.8)' }, '-=0.24')
      .to(secondaryText, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.035 }, '-=0.14')
      .to(statuses, { autoAlpha: 1, x: 0, duration: 0.25, stagger: 0.12 }, '-=0.2')

    if (window.matchMedia('(pointer: fine)').matches) {
      cards.forEach((card) => {
        const liftTo = gsap.quickTo(card, 'y', { duration: 0.28, ease: 'power2.out' })
        let bounds = card.getBoundingClientRect()

        const handlePointerEnter = () => {
          liftTo(-3)
        }
        const handlePointerMove = (event: PointerEvent) => {
          const x = ((event.clientX - bounds.left) / bounds.width) * 100
          const y = ((event.clientY - bounds.top) / bounds.height) * 100

          card.style.setProperty('--pointer-x', `${x}%`)
          card.style.setProperty('--pointer-y', `${y}%`)
        }
        const handlePointerLeave = () => {
          card.style.setProperty('--pointer-x', '50%')
          card.style.setProperty('--pointer-y', '50%')
          liftTo(0)
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
