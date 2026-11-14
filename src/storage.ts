// localStorage может быть недоступен (приватный режим, запрет cookie для сайта) — тогда сайт
// работает дальше, а сохранённое живёт до закрытия страницы.
export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // Без хранилища выбор действует до закрытия страницы.
  }
}
