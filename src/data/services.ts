export type ServiceGroup = {
  id: string
  title: string
  tone: 'positive' | 'negative'
  items: readonly string[]
}

export const serviceGroups: readonly ServiceGroup[] = [
  {
    id: 'build',
    title: 'РАЗРАБОТАЮ',
    tone: 'positive',
    items: [
      'Telegram-боты любой сложности: визитки, магазины, боты поддержки, реферальные системы, интеграции с API',
      'Telegram Mini Apps: современные интерфейсы внутри Telegram с подключённым бэкендом',
      'Парсеры и скрейперы: сбор данных с любых сайтов, маркетплейсов, соцсетей — выгрузка в Excel / Google Sheets / БД / Telegram',
      'Скрипты автоматизации: рутинные задачи, авторегеры, чекеры, рассыльщики',
      'Fullstack-решения: веб-приложения, админ-панели для бизнеса, API',
    ],
  },
  {
    id: 'boundaries',
    title: 'НЕ БЕРУСЬ',
    tone: 'negative',
    items: [
      'Скам, фишинг, малварь, чернуха — даже не пишите',
      'Огромные Enterprise-проекты и CRM-системы с нуля — не беру задачи, требующие отдельной команды',
      'Проекты без чёткого понимания, чего вы хотите',
    ],
  },
]
