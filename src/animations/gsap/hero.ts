import { gsap } from 'gsap'

type HeroIntroOptions = {
  actions: HTMLElement[]
  caret: HTMLElement
  core: HTMLElement
  descriptionLines: HTMLElement[]
  reducedMotion: boolean
  role: HTMLElement
  root: HTMLElement
  status: HTMLElement
  ticker: HTMLElement
  title: HTMLElement
  titleText: string
}

export function createHeroIntro({
  actions,
  caret,
  core,
  descriptionLines,
  reducedMotion,
  role,
  root,
  status,
  ticker,
  title,
  titleText,
}: HeroIntroOptions) {
  const revealElements = [status, role, ...descriptionLines, ticker, ...actions]

  if (reducedMotion) {
    title.textContent = titleText
    gsap.set([core, caret, ...revealElements], { clearProps: 'all' })
    root.classList.add('hero-section--ready')

    return () => root.classList.remove('hero-section--ready')
  }

  const typeProgress = { value: 0 }
  const context = gsap.context(() => {
    gsap.set(status, { autoAlpha: 0, y: -8 })
    gsap.set(core, { autoAlpha: 0, scale: 0.9 })
    gsap.set(caret, { autoAlpha: 0 })
    gsap.set(role, { autoAlpha: 0, yPercent: 105 })
    gsap.set(descriptionLines, { autoAlpha: 0, yPercent: 115 })
    gsap.set(ticker, { autoAlpha: 0, y: 10 })
    gsap.set(actions, { autoAlpha: 0, y: 14 })

    const timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => root.classList.add('hero-section--ready'),
    })

    timeline
      .to(status, { autoAlpha: 1, y: 0, duration: 0.42 }, 0)
      .to(core, { autoAlpha: 1, scale: 1, duration: 1.1, ease: 'expo.out' }, 0.05)
      .to(caret, { autoAlpha: 1, duration: 0.08 }, 0.14)
      .to(
        typeProgress,
        {
          value: 1,
          duration: 1.35,
          ease: 'none',
          onUpdate: () => {
            const visibleCharacters = Math.min(titleText.length, Math.ceil(typeProgress.value * titleText.length))
            title.textContent = titleText.slice(0, visibleCharacters)
          },
        },
        0.18,
      )
      .to(role, { autoAlpha: 1, yPercent: 0, duration: 0.48 }, 1.48)
      .to(descriptionLines, { autoAlpha: 1, yPercent: 0, duration: 0.56, stagger: 0.13 }, 1.68)
      .to(ticker, { autoAlpha: 1, y: 0, duration: 0.46 }, 2.08)
      .to(actions, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 }, 2.22)

    return () => timeline.kill()
  }, root)

  return () => {
    root.classList.remove('hero-section--ready')
    context.revert()
    title.textContent = titleText
  }
}
