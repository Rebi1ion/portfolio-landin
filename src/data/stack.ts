export type StackItem = {
  name: string
  marker: '+' | '*'
}

export type StackGroup = {
  id: string
  title: string
  items: readonly StackItem[]
}

export const stackGroups: readonly StackGroup[] = [
  {
    id: 'backend',
    title: 'BACKEND',
    items: [
      { name: 'Python', marker: '+' },
      { name: 'Aiogram 3.x', marker: '*' },
      { name: 'FastAPI', marker: '*' },
      { name: 'Django / Flask', marker: '*' },
      { name: 'SQLAlchemy', marker: '*' },
    ],
  },
  {
    id: 'frontend-mini-apps',
    title: 'FRONTEND / MINI APPS',
    items: [
      { name: 'React', marker: '+' },
      { name: 'JS / TS', marker: '*' },
      { name: 'HTML / CSS', marker: '*' },
      { name: 'Telegram Web Apps', marker: '*' },
    ],
  },
  {
    id: 'parsing',
    title: 'ПАРСИНГ',
    items: [
      { name: 'Playwright', marker: '+' },
      { name: 'Selenium', marker: '*' },
      { name: 'BeautifulSoup4', marker: '*' },
      { name: 'Requests', marker: '*' },
      { name: 'Telethon / Pyrogram', marker: '*' },
    ],
  },
  {
    id: 'databases',
    title: 'БАЗЫ ДАННЫХ',
    items: [
      { name: 'PostgreSQL', marker: '+' },
      { name: 'SQLite', marker: '*' },
      { name: 'Redis', marker: '*' },
      { name: 'MongoDB / MySQL', marker: '*' },
    ],
  },
  {
    id: 'integrations',
    title: 'ИНТЕГРАЦИИ',
    items: [
      { name: 'Интеграции с API', marker: '+' },
      { name: 'Платёжные API (platega.io, ЮKassa)', marker: '*' },
      { name: 'WebSockets', marker: '*' },
      { name: 'Сторонние REST API', marker: '*' },
    ],
  },
  {
    id: 'infrastructure',
    title: 'ИНФРАСТРУКТУРА',
    items: [
      { name: 'Docker / Docker Compose', marker: '+' },
      { name: 'Linux', marker: '*' },
      { name: 'Git', marker: '*' },
      { name: 'Nginx', marker: '*' },
      { name: 'Деплой на VPS', marker: '*' },
    ],
  },
]
