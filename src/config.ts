export const siteConfig = {
  downloadUrl: import.meta.env.VITE_ANDROID_DOWNLOAD_URL?.trim() || null,
  clientUrl: import.meta.env.VITE_CLIENT_SITE_URL?.trim() || '?audience=clients',
  businessUrl: import.meta.env.VITE_BUSINESS_SITE_URL?.trim() || '?audience=business',
  bookingUrl: 'https://lanwash.ru',
  // Сервер LanWash: анкета подключения мойки отправляется в его API.
  apiUrl: (import.meta.env.VITE_API_URL?.trim() || 'https://lanwash.ru').replace(/\/+$/, ''),
  audience:
    new URLSearchParams(window.location.search).get('audience') === 'business'
      ? 'business'
      : new URLSearchParams(window.location.search).get('audience') === 'clients'
        ? 'clients'
        : import.meta.env.VITE_SITE_AUDIENCE === 'business'
          ? 'business'
          : 'clients',
  rustoreUrl:
    import.meta.env.VITE_RUSTORE_URL?.trim() || 'https://www.rustore.ru/catalog/app/ru.lanwash.app',
  // «LanWash Бизнес» — отдельное приложение для владельцев, кассиров и администратора.
  businessRustoreUrl:
    import.meta.env.VITE_BUSINESS_RUSTORE_URL?.trim() ||
    'https://www.rustore.ru/catalog/app/ru.lanwash.business',
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL?.trim() || 'support@lanwash.ru',
  ageRating: '0+',
}
