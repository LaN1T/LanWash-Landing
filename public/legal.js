;(() => {
  const root = document.documentElement
  const cookieTheme = document.cookie.split('; ').find((item) => item.startsWith('lanwash.theme='))?.split('=')[1]
  const saved = cookieTheme || localStorage.getItem('lanwash.theme')
  const dark = saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  root.dataset.theme = dark ? 'dark' : 'light'

  const icons = {
    sun: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></svg>',
    moon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>',
  }

  function setTheme(theme) {
    root.dataset.theme = theme
    localStorage.setItem('lanwash.theme', theme)
    const domain = window.location.hostname.endsWith('lanwash.ru') ? ';domain=.lanwash.ru' : ''
    document.cookie = `lanwash.theme=${theme};path=/;max-age=31536000;SameSite=Lax${domain};Secure`
    const button = document.getElementById('legal-theme-toggle')
    if (button) {
      button.innerHTML = theme === 'dark' ? icons.sun : icons.moon
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
