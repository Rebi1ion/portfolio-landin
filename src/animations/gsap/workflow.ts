import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type WorkflowAnimationOptions = {
  reducedMotion: boolean
  onActiveStep: (index: number) => void
}

export function createWorkflowAnimations(
  root: HTMLElement,
  { reducedMotion, onActiveStep }: WorkflowAnimationOptions,
) {
  const heading = root.querySelector<HTMLElement>('.section-heading')
  const terminal = root.querySelector<HTMLElement>('.workflow-terminal')
  const steps = gsap.utils.toArray<HTMLElement>('.workflow-step', root)
  const footer = root.querySelector<HTMLElement>('.workflow-terminal__footer')
  const progress = root.querySelector<HTMLElement>('.workflow-timeline__progress')
  const stepCount = steps.length

  if (!heading || !terminal || !footer || !progress || stepCount === 0) {
    return () => undefined
  }

  if (reducedMotion) {
    progress.style.setProperty('--workflow-progress', '100%')
    onActiveStep(stepCount - 1)
    return () => undefined
  }

  let activeIndex = 0
  const context = gsap.context(() => {
    gsap.set([heading, terminal, footer], { autoAlpha: 0, y: 18 })
    gsap.set(steps, { autoAlpha: 0, y: 24 })
    progress.style.setProperty('--workflow-progress', '0%')

    gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: root,
        start: 'top 78%',
        once: true,
      },
    })
      .to(heading, { autoAlpha: 1, y: 0, duration: 0.42 })
      .to(terminal, { autoAlpha: 1, y: 0, duration: 0.38 }, '-=0.18')
      .to(steps, { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.1 }, '-=0.08')
      .to(footer, { autoAlpha: 1, y: 0, duration: 0.3 }, '-=0.18')

    ScrollTrigger.create({
      trigger: root,
      start: 'top 70%',
      end: 'bottom 68%',
      scrub: 0.65,
      onUpdate: (self) => {
        const routeProgress = Math.min(1, Math.max(0, self.progress))
        const nextIndex = Math.min(stepCount - 1, Math.floor(routeProgress * stepCount))
        progress.style.setProperty('--workflow-progress', `${routeProgress * 100}%`)

        if (nextIndex !== activeIndex) {
          activeIndex = nextIndex
          onActiveStep(nextIndex)
        }
      },
    })
  }, root)

  return () => context.revert()
}
