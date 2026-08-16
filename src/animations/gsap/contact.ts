import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type ContactAnimationOptions = { reducedMotion: boolean }

export function createContactAnimations(root: HTMLElement, { reducedMotion }: ContactAnimationOptions) {
  if (reducedMotion) return () => undefined
  const chrome = root.querySelector<HTMLElement>('.contact-terminal__chrome')
  const body = root.querySelector<HTMLElement>('.contact-terminal__body')
  const footer = root.querySelector<HTMLElement>('.contact-terminal__footer')
  const content = gsap.utils.toArray<HTMLElement>('.contact-terminal__body > *', root)
  const context = gsap.context(() => {
    gsap.set([chrome, body, footer], { opacity: 0, y: 12 })
    gsap.set(content, { opacity: 0, y: 8 })
    gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: { trigger: root, start: 'top 88%', once: true },
    })
      .to(chrome, { opacity: 1, y: 0, duration: 0.3 })
      .to(body, { opacity: 1, y: 0, duration: 0.2 }, '-=0.12')
      .to(content, { opacity: 1, y: 0, duration: 0.35, stagger: 0.08 }, '-=0.08')
      .to(footer, { opacity: 1, y: 0, duration: 0.25 }, '-=0.16')
  }, root)
  return () => context.revert()
}
