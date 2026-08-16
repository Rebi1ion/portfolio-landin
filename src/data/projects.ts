export type ProjectId = 'PROJECT_01' | 'PROJECT_02' | 'PROJECT_03' | 'PROJECT_04'

export type ProjectTechnology = {
  readonly name: string
  readonly context: 'site' | 'portfolio-content'
}

export type ProjectPreview = {
  readonly kind: 'live-site'
  readonly image: string
  readonly description: string
}

export type ProjectMetadata = {
  readonly publicNotes?: readonly string[]
}

export type PortfolioProject = {
  readonly id: ProjectId
  readonly name: string
  readonly url: string
  readonly category: string
  readonly description: string
  readonly technologies: readonly ProjectTechnology[]
  readonly preview?: ProjectPreview
  readonly metadata?: ProjectMetadata
}

export const projects = [
  {
    id: 'PROJECT_01',
    name: 'AKYL',
    url: 'https://akyl.vercel.app',
    category: 'Управление МЖД',
    description: 'Методология и платформа для профессионального управления многоквартирными жилыми домами.',
    technologies: [{ name: 'Next.js', context: 'site' }],
    preview: {
      kind: 'live-site',
      image: '/project-previews/akyl.jpg',
      description: 'Городской hero, схема управления МЖД и KPI-блок.',
    },
  },
  {
    id: 'PROJECT_02',
    name: 'MILISOKA',
    url: 'https://milisoka.com',
    category: 'Дизайн интерьеров и 3D-визуализация',
    description: 'Портфолио дизайнера интерьеров, среды и 3D-визуализации.',
    technologies: [
      { name: 'Next.js', context: 'site' },
      { name: '3ds Max', context: 'portfolio-content' },
      { name: 'Blender', context: 'portfolio-content' },
      { name: 'V-Ray', context: 'portfolio-content' },
    ],
    preview: {
      kind: 'live-site',
      image: '/project-previews/milisoka.jpg',
      description: 'Портретный hero и сетка интерьерных и environmental-работ.',
    },
  },
  {
    id: 'PROJECT_03',
    name: 'NULLSAINT',
    url: 'https://nullsaint.shop/en',
    category: 'Интернет-магазин украшений',
    description: 'Интернет-магазин тёмных украшений из титана.',
    technologies: [
      { name: 'Next.js', context: 'site' },
      { name: 'Supabase Storage', context: 'site' },
    ],
    preview: {
      kind: 'live-site',
      image: '/project-previews/nullsaint.jpg',
      description: 'Предметные фотографии украшений, товарная сетка и SKU-маркировка.',
    },
  },
  {
    id: 'PROJECT_04',
    name: 'VLADYOGA',
    url: 'https://vladyoga.com',
    category: 'Йога и занятия',
    description: 'Сайт преподавателя йоги с занятиями, ретритами и записью.',
    technologies: [{ name: 'Next.js', context: 'site' }],
    preview: {
      kind: 'live-site',
      image: '/project-previews/vladyoga.jpg',
      description: 'Hero-фото, фотографии практики и видеоэлементы.',
    },
  },
] as const satisfies readonly PortfolioProject[]
