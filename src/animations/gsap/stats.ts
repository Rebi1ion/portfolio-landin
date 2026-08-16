import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type StatsAnimationOptions = { reducedMotion: boolean }

function counterParts(value: string) {
  if (value === '24/7') return { start: 0, end: 24, format: (n: number) => `${n}/7` }
  const match = value.match(/^(\D*)(\d+)(\D*)$/)
  if (!match) return null
  const [, prefix, digits, suffix] = match
  return { start: 0, end: Number(digits), format: (n: number) => `${prefix}${n}${suffix}` }
}

export function createStatsAnimations(root: HTMLElement, { reducedMotion }: StatsAnimationOptions) {
  const panels = gsap.utils.toArray<HTMLElement>('.stat-panel', root)
  const values = gsap.utils.toArray<HTMLElement>('.stat-panel__value', root)
  const chrome = root.querySelector<HTMLElement>('.stats-terminal')

  if (reducedMotion) return () => undefined

  const context = gsap.context(() => {
    gsap.set(chrome, { opacity: 0, y: 10 })
    gsap.set(panels, { opacity: 0, y: 18 })
    const timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: { trigger: root, start: 'top 80%', once: true },
    })
    timeline.to(chrome, { opacity: 1, y: 0, duration: 0.35 })
      .to(panels, { opacity: 1, y: 0, duration: 0.45, stagger: 0.1 }, '-=0.12')

    values.forEach((element) => {
      const value = element.closest<HTMLElement>('.stat-panel')?.dataset.statValue
      const parts = value ? counterParts(value) : null
      if (!parts) return
      const counter = { value: parts.start }
      gsap.fromTo(counter, { value: parts.start }, {
        value: parts.end,
        duration: 0.72,
        delay: 0.35,
        ease: 'power2.out',
        snap: { value: 1 },
        scrollTrigger: { trigger: root, start: 'top 80%', once: true },
        onUpdate: () => { element.textContent = parts.format(counter.value) },
        immediateRender: false,
      })
    })
  }, root)

  return () => context.revert()
}
