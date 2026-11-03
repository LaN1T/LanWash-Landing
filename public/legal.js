;(() => {
  const root = document.documentElement
  const saved = document.cookie.split('; ').find((item) => item.startsWith('lanwash.theme='))?.split('=')[1]
  const initial = saved || localStorage.getItem('lanwash.theme') || 'light'
  root.dataset.theme = initial === 'dark' ? 'dark' : 'light'

  function setTheme(theme) {
    root.dataset.theme = theme
    localStorage.setItem('lanwash.theme', theme)
    const domain = window.location.hostname.endsWith('lanwash.ru') ? ';domain=.lanwash.ru' : ''
    document.cookie = `lanwash.theme=${theme};path=/;max-age=31536000;SameSite=Lax${domain};Secure`
    const button = document.getElementById('legal-theme-toggle')
    if (button) {
      button.textContent = theme === 'dark' ? 'Светлая' : 'Тёмная'
      button.setAttribute('aria-label', theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему')
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('legal-theme-toggle')
    if (!button) return
    button.hidden = false
    setTheme(root.dataset.theme)
    button.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'))
  })
})()
