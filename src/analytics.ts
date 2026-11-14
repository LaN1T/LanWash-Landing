/*
 * Яндекс Метрика — только после согласия посетителя.
 *
 * Пока в этом браузере нет отметки «Разрешить», счётчик не загружается: ни tag.js, ни запросов
 * к mc.yandex.ru, ни cookie _ym_*. Отказ тоже запоминается — плашка больше не появляется.
 * Что собирается и как отказаться, описано в privacy.html (раздел «Cookie») и consent.html#analytics;
 * при изменении настроек счётчика обновите эти документы.
 */

import { readStorage, writeStorage } from './storage'

export type AnalyticsChoice = 'granted' | 'denied'

const counterId = 114175626
const tagUrl = `https://mc.yandex.ru/metrika/tag.js?id=${counterId}`
const choiceKey = 'lanwash.analytics-consent'
// Прежняя плашка («Понятно») сообщала только о необходимых cookie — согласием на Метрику она не была.
const legacyNoticeKey = 'lanwash.cookie-notice'
// Выбор действует 12 месяцев, затем спрашиваем снова. Столько же живёт cookie _ym_uid.
const choiceLifetime = 365 * 24 * 60 * 60 * 1000

type Ym = ((...args: unknown[]) => void) & { a?: unknown[]; l?: number }
declare global {
  interface Window {
    ym?: Ym
  }
}

export function readChoice(): AnalyticsChoice | null {
  try {
    const saved: unknown = JSON.parse(readStorage(choiceKey) || 'null')
    if (!saved || typeof saved !== 'object') return null
    const { value, at } = saved as { value?: unknown; at?: unknown }
    if (value !== 'granted' && value !== 'denied') return null
    if (typeof at !== 'number' || Date.now() - at > choiceLifetime) return null
    return value
  } catch {
    return null
  }
}

let started = false

export function saveChoice(value: AnalyticsChoice) {
  writeStorage(choiceKey, JSON.stringify({ value, at: Date.now() }))
  writeStorage(legacyNoticeKey, null)
  if (value === 'granted') {
    startMetrika()
    return
  }
  clearMetrikaData()
  // Загруженный tag.js выключить нельзя — перезагружаем страницу уже без него.
  if (started) window.location.reload()
}

export function startMetrika() {
  if (started) return
  started = true
  const ym: Ym =
    window.ym ||
    function () {
      // Как в официальном коде счётчика: вызовы копятся, пока не загрузится tag.js.
      ;(ym.a = ym.a || []).push(arguments)
    }
  ym.l = Date.now()
  window.ym = ym
  ym(counterId, 'init', {
    ssr: true,
    // Вебвизор выключен: не записываются экран, ввод в поля, телефоны, пароли, QR и анкета.
    webvisor: false,
    // Карта кликов — координаты нажатий, без текста полей.
    clickmap: true,
    // Переходы по внешним ссылкам и скачивания: RuStore, app.lanwash.ru, почта поддержки.
    trackLinks: true,
    accurateTrackBounce: true,
    // Теги Яндекс Тег Менеджера не подключаются: в страницу не попадёт код из интерфейса Метрики.
    disableYtm: true,
    // ecommerce и params не передаём: товаров на сайте нет, а данные анкеты — личные.
  })
  const script = document.createElement('script')
  script.async = true
  script.src = tagUrl
  document.head.appendChild(script)
}

/** Удаляет cookie и записи Метрики на домене сайта (список — yandex.ru/support/metrica/general/cookie-usage.html). */
function clearMetrikaData() {
  const host = window.location.hostname
  const domains = ['']
  const parts = host.split('.')
  for (let i = 0; i < parts.length - 1; i++) domains.push(';domain=.' + parts.slice(i).join('.'))
  for (const item of document.cookie.split('; ')) {
    const name = item.split('=')[0]
    if (!name.startsWith('_ym')) continue
    for (const domain of domains) {
      document.cookie = `${name}=;path=/;max-age=0${domain}`
    }
  }
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('_ym') || key.startsWith('ytm_') || key === 'zz') {
        localStorage.removeItem(key)
      }
    }
  } catch {
    // Хранилище недоступно — удалять нечего.
  }
}
