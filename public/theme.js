// Тема до первой отрисовки: cookie lanwash.theme общая с app.lanwash.ru, иначе — выбор на этом сайте.
;(function () {
  var saved = null
  var match = document.cookie.match(/(?:^|; )lanwash\.theme=(light|dark|system)/)
  if (match) saved = match[1]
  else {
    try {
      saved = localStorage.getItem('lanwash.theme')
    } catch (error) {
      // Хранилище недоступно — светлая тема по умолчанию.
    }
  }
  var dark =
    saved === 'dark' ||
    (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
})()
