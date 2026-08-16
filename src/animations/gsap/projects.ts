import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type ProjectsAnimationOptions = {
  readonly reducedMotion: boolean
}

export function createProjectsIntro(root: HTMLElement, { reducedMotion }: ProjectsAnimationOptions) {
  if (reducedMotion) {
    return () => undefined
  }

  const heading = root.querySelector<HTMLElement>('.section-heading')
  const terminal = root.querySelector<HTMLElement>('.projects-terminal')
  const selector = root.querySelector<HTMLElement>('.projects-selector')
  const detail = root.querySelector<HTMLElement>('.project-detail')
  const ide = root.querySelector<HTMLElement>('.project-ide')
  const output = root.querySelector<HTMLElement>('.projects-output')

  const context = gsap.context(() => {
    gsap.set([heading, terminal, selector, detail, ide, output], { autoAlpha: 0, y: 18 })

    gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: root,
        start: 'top 76%',
        once: true,
      },
    })
      .to(heading, { autoAlpha: 1, y: 0, duration: 0.38 })
      .to(terminal, { autoAlpha: 1, y: 0, duration: 0.34 }, '-=0.16')
      .to(selector, { autoAlpha: 1, y: 0, duration: 0.42 }, '-=0.14')
      .to(detail, { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.22')
      .to(ide, { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.24')
      .to(output, { autoAlpha: 1, y: 0, duration: 0.3 }, '-=0.26')
  }, root)

  return () => context.revert()
}

export function createProjectLoadSequence(root: HTMLElement, { reducedMotion }: ProjectsAnimationOptions) {
  const lines = gsap.utils.toArray<HTMLElement>('.projects-terminal__line--loading', root)
  const progress = root.querySelector<HTMLElement>('.projects-terminal__progress-fill')
  const ide = root.querySelector<HTMLElement>('.project-ide')
  const output = root.querySelector<HTMLElement>('.projects-output')

  if (reducedMotion) {
    return () => undefined
  }

  const context = gsap.context(() => {
    gsap.set(lines, { autoAlpha: 0, x: -8 })
    // Keep the selected project record visible so its preview can animate in place.
    gsap.set([ide, output], { autoAlpha: 0, y: 10 })
    gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })

    gsap.timeline({ defaults: { ease: 'power2.out' } })
      .to(lines, { autoAlpha: 1, x: 0, duration: 0.16, stagger: 0.11 })
      .to(progress, { scaleX: 1, duration: 0.4, ease: 'power1.inOut' }, '-=0.08')
      .to([ide, output], { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.07 }, '-=0.08')
  }, root)

  return () => context.revert()
}

export function createProjectOpenTransition(root: HTMLElement, { reducedMotion }: ProjectsAnimationOptions) {
  if (reducedMotion) {
    return () => undefined
  }

  const command = root.querySelector<HTMLElement>('.projects-live-command')
  const button = root.querySelector<HTMLElement>('.projects-live-action')

  if (!command || !button) {
    return () => undefined
  }

  const context = gsap.context(() => {
    gsap.killTweensOf([command, button])
    gsap.fromTo(command, { autoAlpha: 0, x: -6 }, { autoAlpha: 1, x: 0, duration: 0.16, ease: 'power2.out' })
    gsap.fromTo(button, { boxShadow: '0 0 0 rgba(255, 176, 0, 0)' }, { boxShadow: '0 0 1.35rem rgba(255, 176, 0, 0.4)', duration: 0.24, yoyo: true, repeat: 1 })
  }, root)

  return () => context.revert()
}
