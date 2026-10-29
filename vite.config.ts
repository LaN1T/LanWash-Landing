import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const audience = loadEnv(mode, '.', 'VITE_').VITE_SITE_AUDIENCE
  return {
    // Относительные пути: dist можно положить в любую папку любого статического хостинга.
    // GitHub Pages собирается с --base=/LanWash-Site/ (pnpm build:pages), CLI перекрывает это значение.
    base: './',
    plugins: [
      react(),
      {
        name: 'audience-metadata',
        transformIndexHtml(html) {
          if (audience !== 'business') return html
          return html
            .replaceAll(
              'LanWash — чистая машина. Выгода рядом.',
              'LanWash для бизнеса — управление мойкой и лояльностью',
            )
            .replace(
              'LanWash — мойки рядом, удобная запись и бонусы за каждый визит. Зарегистрируйтесь в Android-приложении LanWash.',
              'Процессы автомойки: записи, посты, касса, команда, бонусы и аналитика в LanWash.',
            )
            .replace(
              'Выбирайте мойку, планируйте визиты и пользуйтесь бонусами. Всё в одном приложении.',
              'Управляйте автомойками, услугами, визитами и лояльностью в одном приложении.',
            )
        },
      },
    ],
  }
})
