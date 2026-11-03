import { useState } from 'react'

export default function CookieNotice() {
  const [visible, setVisible] = useState(() => localStorage.getItem('lanwash.cookie-notice') !== 'accepted')
  if (!visible) return null

  function accept() {
    localStorage.setItem('lanwash.cookie-notice', 'accepted')
    setVisible(false)
  }

  return (
    <aside className="cookie-notice" aria-label="Использование cookie">
      <div>
        <strong>Использование cookie</strong>
        <p>Используем cookie для корректной работы сайта и сохранения настроек. Без рекламы и аналитики. Подробнее — <a href="privacy.html">в Политике конфиденциальности</a>.</p>
      </div>
      <button type="button" onClick={accept}>Понятно</button>
    </aside>
  )
}
