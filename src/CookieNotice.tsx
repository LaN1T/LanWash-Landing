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
        <strong>Только нужные cookie</strong>
        <p>Запоминаем тему и помогаем аккаунту работать. Без рекламы и трекеров. Подробнее — <a href="privacy.html">в Политике</a>.</p>
      </div>
      <button type="button" onClick={accept}>Понятно</button>
    </aside>
  )
}
