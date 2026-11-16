import { readChoice, saveChoice } from './analytics'
import type { AnalyticsChoice } from './analytics'

const doc = (path: string) => import.meta.env.BASE_URL + path

/**
 * Плашка выбора: необходимые cookie работают всегда, Яндекс Метрика — только после «Разрешить».
 * Появляется, пока выбора нет, и по кнопке «Настройки cookie» в футере.
 */
export default function CookieNotice({ onClose }: { onClose: () => void }) {
  const current = readChoice()

  function choose(value: AnalyticsChoice) {
    // Сначала закрываем (это убирает #cookie-settings из адреса): отказ после согласия
    // перезагружает страницу, и плашка не должна открыться снова.
    onClose()
    saveChoice(value)
  }

  return (
    <aside className="cookie-notice" aria-labelledby="cookie-notice-title">
      <div>
        <strong id="cookie-notice-title">Cookie и Яндекс Метрика</strong>
        <p>
          Необходимые cookie запоминают тему и ваш выбор. Если разрешите, подключим Яндекс Метрику:
          она считает посещения и клики, но не записывает то, что вы вводите.{' '}
          <a href={doc('privacy.html#cookies')}>Подробнее</a> ·{' '}
          <a href={doc('consent.html#analytics')}>текст согласия</a>
        </p>
        {current && (
          <p className="cookie-current">
            Сейчас аналитика {current === 'granted' ? 'разрешена' : 'отключена'}.
          </p>
        )}
      </div>
      <div className="cookie-actions">
        <button type="button" className="cookie-allow" onClick={() => choose('granted')}>
          Разрешить
        </button>
        <button type="button" className="cookie-deny" onClick={() => choose('denied')}>
          Отказаться
        </button>
      </div>
    </aside>
  )
}
