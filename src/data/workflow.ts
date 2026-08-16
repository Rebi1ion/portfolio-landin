export type WorkflowStep = {
  number: string
  title: string
  description: string
}

export type WorkflowStage = {
  number: string
  title: string
  sourceTitle: string
  description: string
}

export const workflowSteps: readonly WorkflowStep[] = [
  {
    number: '01',
    title: 'ТЗ',
    description: 'Пишете мне в Telegram и скидываете чёткое ТЗ или максимально подробное описание задачи с примерами.',
  },
  {
    number: '02',
    title: 'ОЦЕНКА',
    description: 'Я оцениваю задачу. После согласования объёма и стоимости начинаем работу.',
  },
  {
    number: '03',
    title: 'ДЕМО',
    description: 'По завершении демонстрирую работу, передаю исходники или разворачиваю проект на вашем сервере.',
  },
  {
    number: '04',
    title: 'ОТЗЫВ',
    description: 'Вы тестируете результат и оставляете подробный отзыв с доказательствами (скриншоты) в этой теме.',
  },
]

/** Technical labels frame the approved project route without adding claims. */
export const workflowStages: readonly WorkflowStage[] = [
  {
    number: '01',
    title: 'IDEA',
    sourceTitle: workflowSteps[0].title,
    description: workflowSteps[0].description,
  },
  {
    number: '02',
    title: 'ARCHITECTURE',
    sourceTitle: workflowSteps[1].title,
    description: workflowSteps[1].description,
  },
  {
    number: '03',
    title: 'DEVELOPMENT',
    sourceTitle: workflowSteps[2].title,
    description: workflowSteps[2].description,
  },
  {
    number: '04',
    title: 'TESTING',
    sourceTitle: workflowSteps[3].title,
    description: workflowSteps[3].description,
  },
  {
    number: '05',
    title: 'DEPLOYMENT',
    sourceTitle: workflowSteps[2].title,
    description: 'По завершении демонстрирую работу, передаю исходники или разворачиваю проект на вашем сервере.',
  },
]
