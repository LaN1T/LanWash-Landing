export const siteConfig = {
  downloadUrl: import.meta.env.VITE_ANDROID_DOWNLOAD_URL?.trim() || null,
  clientUrl: import.meta.env.VITE_CLIENT_SITE_URL?.trim() || '?audience=clients',
  businessUrl: import.meta.env.VITE_BUSINESS_SITE_URL?.trim() || '?audience=business',
  bookingUrl: 'https://lanwash.ru',
  audience:
    new URLSearchParams(window.location.search).get('audience') === 'business'
      ? 'business'
      : new URLSearchParams(window.location.search).get('audience') === 'clients'
        ? 'clients'
        : import.meta.env.VITE_SITE_AUDIENCE === 'business'
          ? 'business'
          : 'clients',
  appSourceUrl: 'https://github.com/mixelka75/LanWash-Android',
  contactStatus: 'Контакты появятся скоро',
}
