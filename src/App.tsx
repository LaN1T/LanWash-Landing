import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  CalendarDays,
  Car,
  Check,
  ChevronRight,
  CircleCheck,
  ClipboardCheck,
  Clock,
  Download,
  FileText,
  Gift,
  History,
  Mail,
  MapPin,
  Menu,
  Moon,
  Sun,
  QrCode,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Store,
  UserRound,
  Wallet,
  X,
  ChartNoAxesCombined,
} from 'lucide-react'
import { siteConfig } from './config'
import ApplyForm from './ApplyForm'
import BusinessPage from './BusinessPage'
import BookingGuide from './BookingGuide'
import DevicePhone from './DevicePhone'

type ModalType = 'download' | 'business' | 'preview' | 'register' | null
type ThemeChoice = 'light' | 'dark'
const asset = (path: string) => import.meta.env.BASE_URL + path
function initialTheme(): ThemeChoice {
  const saved = localStorage.getItem('lanwash.theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
// Все клиентские экраны в порядке сценария: от карты до профиля. Снимки 720 × 1560 (экран A17).
const clientScreens = [
  {
    id: 'map',
    name: 'Мойки рядом',
    image: 'screen-map.webp',
    icon: MapPin,
    title: 'Мойки рядом — на карте.',
    text: 'Карта и список моек с фильтрами «Рядом», «Свободно сейчас» и «Кешбэк». Ближайшая запись и её QR закреплены над картой.',
  },
  {
    id: 'wash',
    name: 'Карточка мойки',
    image: 'screen-wash.webp',
    icon: Store,
    title: 'Всё о мойке — до записи.',
    text: 'Свободные посты, часы работы, рейтинг, ваши бонусы в этой сети и основные услуги с ценами и длительностью.',
  },
  {
    id: 'booking',
    name: 'Что и когда',
    image: 'screen-booking.webp',
    icon: CalendarDays,
    title: 'Услуги, день и время.',
    text: 'Основная услуга, дополнения и свободное время на ближайшую неделю. Приложение учитывает длительность услуг и занятость постов.',
  },
  {
    id: 'confirm',
    name: 'Проверка и оплата',
    image: 'screen-confirm.webp',
    icon: ClipboardCheck,
    title: 'Расчёт виден заранее.',
    text: 'Время, мойка, автомобиль и сумма к оплате на месте. Если в сети есть бонусы, часть визита можно оплатить ими.',
  },
  {
    id: 'booked',
    name: 'Вы записаны',
    image: 'screen-booked.webp',
    icon: CircleCheck,
    title: 'Запись подтверждена.',
    text: 'Детали визита и кнопка «Показать QR для кассы». За два часа до визита придёт напоминание.',
  },
  {
    id: 'visits',
    name: 'Записи',
    image: 'screen-visits.webp',
    icon: CalendarCheck,
    title: 'Ближайший визит под рукой.',
    text: 'Активные записи и история: время, мойка, пост, автомобиль и сумма. Здесь же маршрут и отмена записи.',
  },
  {
    id: 'qr',
    name: 'QR для кассы',
    image: 'screen-qr.webp',
    icon: QrCode,
    title: 'Кассиру — один QR.',
    text: 'Сотрудник сканирует код записи и подтверждает оплату. Бонусы начисляются после подтверждения визита.',
  },
  {
    id: 'wallet',
    name: 'Кошелёк',
    image: 'screen-wallet.webp',
    icon: Wallet,
    title: 'Бонусы каждой сети — отдельно.',
    text: 'Баланс, лимит списания и кешбэк сети, бонусы, которые скоро сгорят, и абонементы.',
  },
  {
    id: 'operations',
    name: 'Операции',
    image: 'screen-operations.webp',
    icon: History,
    title: 'Каждое начисление на виду.',
    text: 'Оплаты визитов и начисления бонусов по датам. Если бонусы не начислились, отправьте чек на проверку сотруднику.',
  },
  {
    id: 'profile',
    name: 'Профиль',
    image: 'screen-profile.webp',
    icon: UserRound,
    title: 'Аккаунт и автомобили.',
    text: 'Личный QR для кассы, ваши машины, имя, телефон и смена пароля.',
  },
]
const heroScreen = clientScreens.findIndex((item) => item.id === 'booked')
const businessScreens = [
  {
    id: 'business',
    name: 'Для владельца',
    image: 'app-business.webp',
    icon: ChartNoAxesCombined,
    title: 'Вся сеть под контролем.',
    text: 'Выручка, посещения, услуги и команда. Понятный обзор того, что происходит на ваших мойках.',
  },
  {
    id: 'team',
    name: 'Для команды',
    image: 'app-team.webp',
    icon: ScanLine,
    title: 'Сотруднику — только нужное.',
    text: 'Записи на сегодня, QR клиента и подтверждение оплаты. Один визит — одно начисление бонусов.',
  },
]
const twoDigits = (value: number) => String(value).padStart(2, '0')
const benefits = [
  {
    icon: MapPin,
    title: 'Найдите свою мойку',
    text: 'Точки рядом, часы работы, услуги и цены. Всё видно до поездки.',
    number: '01',
  },
  {
    icon: CalendarDays,
    title: 'Приезжайте вовремя',
    text: 'Выберите автомобиль, услугу и удобное время. Дальше — просто приезжайте.',
    number: '02',
  },
  {
    icon: Wallet,
    title: 'Возвращайтесь с выгодой',
    text: 'Получайте кешбэк бонусами и используйте их на следующем визите.',
    number: '03',
  },
]
const faq = [
  [
    'Что такое LanWash?',
    'Приложение для Android: выберите автомойку, запишитесь на услуги, пользуйтесь бонусами и смотрите историю посещений.',
  ],
  [
    'Какие мойки поддерживаются?',
    'Классические мойки с записью: выбираете автомобиль, услуги и удобное время, а на месте вас уже ждут.',
  ],
  [
    'Как зарегистрироваться?',
    'Установите Android-приложение и на экране входа откройте вкладку «Зарегистрироваться». Укажите имя, телефон и пароль, повторите пароль, отметьте согласие на обработку данных и нажмите «Создать аккаунт». После регистрации откроется карта.',
  ],
  [
    'Как работают бонусы?',
    'Бонусы доступны в пределах одной сети. Размер кешбэка, срок действия и максимальная бонусная часть оплаты указаны в приложении. Кешбэк начисляется с денежной части оплаты.',
  ],
  [
    'Можно ли записаться на сайте?',
    'Да. Кнопка «Записаться на сайте» открывает веб-приложение app.lanwash.ru. Можно войти в тот же аккаунт, выбрать мойку, услуги и время.',
  ],
  [
    'На каких устройствах работает приложение?',
    'На смартфонах с Android 8.0 и выше. Есть светлая и тёмная темы. Приложение бесплатное, скачать его можно в RuStore.',
  ],
  [
    'Как оплатить визит?',
    'Визит оплачивается на кассе мойки, уже с учётом бонусов: кассир сканирует QR записи и подтверждает оплату, после этого начисляется кешбэк. Если мойка продаёт абонементы, абонемент можно оплатить в приложении банковской картой через ЮKassa.',
  ],
  [
    'Где хранятся мои данные?',
    'Аккаунт, автомобили, записи и бонусы хранятся на сервере LanWash в России, на телефоне — копия для быстрого запуска и напоминаний. Мойка, куда вы записались, видит имя, телефон и автомобиль. Подробнее — в политике конфиденциальности.',
  ],
]

function Brand({ business = false }: { business?: boolean }) {
  return (
    <a
      className="brand"
      href="#top"
      aria-label={business ? 'LanWash Бизнес — на главную' : 'LanWash — на главную'}
    >
      <span className="brand-mark">
        <img src={asset('images/logo-white.png')} alt="" width="34" height="34" />
      </span>
      <span>
        LanWash<span className="brand-period">.</span>
        {business && 'Бизнес'}
      </span>
    </a>
  )
}

function Modal({
  title,
  onClose,
  children,
  wide = false,
  className = '',
}: {
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const prior = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ref.current?.querySelector<HTMLButtonElement>('button')?.focus()
    function keyboard(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const nodes = [
        ...(ref.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input, select, textarea',
        ) || []),
      ].filter((node) => node.offsetParent !== null)
      const first = nodes[0],
        last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', keyboard)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', keyboard)
      prior?.focus()
    }
  }, [onClose])
  return createPortal(
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={ref}
        className={'modal' + (wide ? ' modal-wide' : '') + (className ? ' ' + className : '')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-top">
          <h2 id="modal-title">{title}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Закрыть окно">
            <X size={23} />
          </button>
        </div>
        {children}
      </section>
    </div>,
    document.body,
  )
}

function RustoreButton({ className = 'button button-primary' }: { className?: string }) {
  const href =
    siteConfig.audience === 'business' ? siteConfig.businessRustoreUrl : siteConfig.rustoreUrl
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      <Download size={19} /> Скачать в RuStore <ArrowUpRight size={18} />
    </a>
  )
}

export default function App() {
  const isBusiness = siteConfig.audience === 'business'
  const screens = isBusiness ? businessScreens : clientScreens
  const navItems = isBusiness
    ? [
        ['#processes', 'Как работает'],
        ['#tools', 'Возможности'],
        ['#loyalty', 'Лояльность'],
        [siteConfig.clientUrl, 'Для клиентов'],
        ['#faq', 'Вопросы'],
      ]
    : [
        ['#features', 'Возможности'],
        ['#booking', 'Как записаться'],
        [siteConfig.businessUrl, 'Для бизнеса'],
        ['#faq', 'Вопросы'],
      ]
  useEffect(() => {
    const title = isBusiness
      ? 'LanWash для бизнеса — управление мойкой и лояльностью'
      : 'LanWash — чистая машина. Выгода рядом.'
    const description = isBusiness
      ? 'Процессы автомойки: записи, посты, касса, команда, бонусы и аналитика в LanWash.'
      : 'Мойки рядом, пошаговая запись, бонусы и история посещений. Зарегистрируйтесь в Android-приложении LanWash.'
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
  }, [isBusiness])
  const [modal, setModal] = useState<ModalType>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [screen, setScreen] = useState(0)
  const [service, setService] = useState<'basic' | 'full'>('full')
  const [useBonus, setUseBonus] = useState(true)
  const [bonusAmount, setBonusAmount] = useState(450)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<ThemeChoice>(initialTheme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('lanwash.theme', theme)
  }, [theme])
  const bookingHref = `${siteConfig.bookingUrl}?theme=${theme}`
  const active = screens[screen] ?? screens[0]
  // Пример кошелька: 1 240 бонусов, списание до 30% чека, кешбэк 10% с денежной части.
  const balance = 1240
  const total = service === 'full' ? 1500 : 800
  const maxBonus = Math.min(balance, Math.floor(total * 0.3))
  const bonus = useBonus ? Math.min(bonusAmount, maxBonus) : 0
  const bonusPercent = maxBonus > 0 ? (bonus / maxBonus) * 100 : 0
  const cash = total - bonus
  const cashback = Math.floor(cash * 0.1)
  const number = (amount: number) => new Intl.NumberFormat('ru-RU').format(amount)
  const money = (amount: number) => number(amount) + ' ₽'
  // Анкету подключения мойки не закрываем молча, если в ней уже что-то заполнено.
  const applyDirty = useRef(false)
  const setApplyDirty = useCallback((dirty: boolean) => {
    applyDirty.current = dirty
  }, [])
  const closeApply = useCallback(() => {
    if (applyDirty.current && !window.confirm('Закрыть анкету? Заполненное не сохранится.')) return
    applyDirty.current = false
    setModal(null)
  }, [])
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeMenu)
    return () => window.removeEventListener('keydown', closeMenu)
  }, [])
  const closeModal = useCallback(() => setModal(null), [])
  function open(type: ModalType) {
    setMenuOpen(false)
    setModal(type)
  }
  return (
    <>
      <a className="skip-link" href="#main">
        К содержанию
      </a>
      <header className={'site-header' + (scrolled ? ' is-scrolled' : '')}>
        <div className="container header-inner">
          <Brand business={isBusiness} />
          <nav
            aria-label="Основная навигация"
            className={'main-nav' + (menuOpen ? ' is-open' : '')}
            id="navigation"
          >
            {navItems.map(([href, text]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {text}
              </a>
            ))}
            <button
              className="button button-primary nav-download"
              type="button"
              onClick={() => open('download')}
            >
              Скачать <ArrowUpRight size={17} />
            </button>
            <button
              className="theme-toggle icon-button"
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </nav>
          <button
            className="menu-toggle icon-button"
            type="button"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
            aria-controls="navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {isBusiness ? (
        <BusinessPage
          onApply={() => open('business')}
          onDownload={() => open('download')}
          clientUrl={siteConfig.clientUrl}
        />
      ) : (
        <main id="main">
          <section className="hero container" id="top">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="status-dot" /> МОЙКА В ВАШЕМ РИТМЕ
              </div>
              <h1>
                Чистая машина.
                <br />
                <span>Выгода рядом.</span>
              </h1>
              <p className="hero-description">
                Выбирайте мойку, планируйте визиты и пользуйтесь бонусами. Всё, что нужно вашему
                автомобилю, — в одном приложении.
              </p>
              <div className="hero-actions">
                <RustoreButton className="button button-primary button-large" />
                <a className="button button-outline button-large" href={bookingHref}>
                  Записаться на сайте <ArrowUpRight size={18} />
                </a>
                <a className="text-link" href="#booking">
                  Как записаться <ArrowDown size={18} />
                </a>
              </div>
              <div className="hero-compatibility">
                <Smartphone size={18} />
                <span>Android 8.0+</span>
                <span className="tiny-divider" />
                <span>Бесплатно в RuStore</span>
              </div>
              <div className="hero-bottom">
                <span>
                  Меньше ожидания.
                  <br />
                  <strong>Больше приятных поездок.</strong>
                </span>
                <a href="#booking">
                  Запись шаг за шагом <ArrowDown size={17} />
                </a>
              </div>
            </div>
            <div className="hero-visual">
              <div className="visual-stage">
                <span className="visual-word" aria-hidden="true">
                  GO CLEAN.
                </span>
                <div className="orbit orbit-one" aria-hidden="true" />
                <div className="orbit orbit-two" aria-hidden="true" />
                <span className="visual-coordinate coordinate-left" aria-hidden="true">
                  55.7558° N
                </span>
                <span className="visual-coordinate coordinate-right" aria-hidden="true">
                  37.6173° E
                </span>
                <button
                  className="phone-hero"
                  onClick={() => {
                    setScreen(heroScreen)
                    open('preview')
                  }}
                  aria-label="Увеличить экран «Вы записаны»"
                >
                  <DevicePhone
                    image="screen-booked.webp"
                    alt="Экран «Вы записаны» в LanWash: время визита, мойка, автомобиль, услуга и кнопка QR для кассы"
                    priority
                  />
                </button>
                <div className="floating-wallet">
                  <div className="floating-heading">
                    <span className="mini-icon">
                      <Wallet size={17} strokeWidth={1.7} />
                    </span>
                    <span>Бонусы сети</span>
                  </div>
                  <strong>
                    1 240 <span>бонусов</span>
                  </strong>
                  <span className="floating-caption">Следующая мойка выгоднее</span>
                </div>
                <div className="floating-booking">
                  <div className="booking-check">
                    <Gift size={18} strokeWidth={1.7} />
                  </div>
                  <div>
                    <strong>+150 бонусов</strong>
                    <span>Кешбэк после оплаты визита</span>
                  </div>
                </div>
                <div className="visual-footer">
                  <span>
                    ВАША МОЙКА.
                    <br />
                    ВСЕГДА ПОД РУКОЙ.
                  </span>
                  <span className="visual-arrow">
                    <ArrowUpRight size={24} />
                  </span>
                </div>
              </div>
            </div>
          </section>
          <div className="formats-strip">
            <div className="container formats-inner">
              <span className="formats-label">КЛАССИЧЕСКАЯ МОЙКА С ЗАПИСЬЮ</span>
              <span>
                <Car size={21} /> Выбираете услуги и удобное время
              </span>
            </div>
          </div>
          <section className="section container" id="features">
            <div className="section-heading">
              <div>
                <span className="eyebrow">БЕЗ ЛИШНИХ ДЕЙСТВИЙ</span>
                <h2>
                  Удобно до, во время
                  <br />и после мойки.
                </h2>
              </div>
              <p>
                Забота об автомобиле не должна
                <br className="desktop-break" /> превращаться в отдельный план на день.
              </p>
            </div>
            <div className="benefit-grid">
              {benefits.map((item) => (
                <article className="benefit-card" key={item.number}>
                  <div className="benefit-top">
                    <span className="feature-icon">
                      <item.icon size={27} strokeWidth={1.7} />
                    </span>
                    <span className="card-number">{item.number}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>
          <BookingGuide />
          <section className="section container loyalty-section">
            <div className="loyalty-copy">
              <span className="eyebrow">ВЫГОДА БЕЗ ПЛАСТИКОВЫХ КАРТ</span>
              <h2>
                Чаще заезжаете.
                <br />
                <span className="blue-text">Больше получаете.</span>
              </h2>
              <p>
                Кешбэк приходит в кошелёк сети после оплаты визита. Потратьте его на следующей мойке
                любого филиала этой сети — сумма к оплате видна ещё до записи.
              </p>
              <ul className="check-list">
                <li>
                  <Check size={18} /> Отдельный кошелёк для каждой сети
                </li>
                <li>
                  <Check size={18} /> Резерв под запись и бонусы, которые скоро сгорят
                </li>
                <li>
                  <Check size={18} /> Абонементы и история операций рядом с балансом
                </li>
              </ul>
              <div className="small-note">
                <Gift size={19} strokeWidth={1.7} />
                <span>Правила и размер кешбэка устанавливает мойка</span>
              </div>
            </div>
            <div
              className="loyalty-app"
              aria-label="Пример: кошелёк сети и расчёт визита в приложении"
            >
              <div className="wallet-card">
                <span className="wallet-network">Чистый город</span>
                <strong>
                  {number(balance)} <span>бонусов</span>
                </strong>
                <span className="wallet-rules">Бонусами — до 30% мойки · кешбэк 10%</span>
                <span className="wallet-chip">
                  <Clock size={14} strokeWidth={1.8} /> 340 бонусов сгорят 4 ноября
                </span>
              </div>
              <div className="calc-card">
                <div className="calc-head">
                  <strong>Расчёт визита</strong>
                  <span className="demo-label">Пример</span>
                </div>
                <div className="calc-segmented" role="group" aria-label="Услуга в примере">
                  <button aria-pressed={service === 'basic'} onClick={() => setService('basic')}>
                    Базовая <span>800 ₽</span>
                  </button>
                  <button aria-pressed={service === 'full'} onClick={() => setService('full')}>
                    Комплексная <span>1 500 ₽</span>
                  </button>
                </div>
                <label className="calc-bonus">
                  <span className="calc-bonus-icon">
                    <Gift size={19} strokeWidth={1.7} />
                  </span>
                  <span>
                    <strong>Списать до {number(maxBonus)} бонусов</strong>
                    <span>Доступно {number(balance)} · можно оплатить до 30% стоимости</span>
                  </span>
                  <input
                    type="checkbox"
                    role="switch"
                    checked={useBonus}
                    onChange={(event) => setUseBonus(event.target.checked)}
                  />
                  <span className="switch-visual" aria-hidden="true" />
                </label>
                <div className="calc-bonus-range">
                  <div>
                    <span>Списываем бонусы</span>
                    <strong>{number(bonus)}</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxBonus}
                    step="10"
                    value={bonus}
                    disabled={!useBonus}
                    aria-label="Бонусы к списанию"
                    aria-valuetext={`${bonus} бонусов`}
                    onChange={(event) => setBonusAmount(Number(event.target.value))}
                    style={{
                      background: `linear-gradient(to right, var(--blue) 0%, var(--blue) ${bonusPercent}%, var(--line) ${bonusPercent}%, var(--line) 100%)`,
                    }}
                  />
                  <div className="calc-bonus-limits" aria-hidden="true">
                    <span>0</span>
                    <span>{number(maxBonus)}</span>
                  </div>
                </div>
                <dl className="calc-lines">
                  <div>
                    <dt>{service === 'full' ? 'Комплексная мойка' : 'Базовая мойка'}</dt>
                    <dd>{money(total)}</dd>
                  </div>
                  {bonus > 0 && (
                    <div>
                      <dt>Бонусами</dt>
                      <dd>−{number(bonus)}</dd>
                    </div>
                  )}
                  <div className="calc-total">
                    <dt>К оплате на месте</dt>
                    <dd>{money(cash)}</dd>
                  </div>
                </dl>
                <span className="calc-cashback">
                  <Gift size={14} strokeWidth={1.8} /> Вернём {number(cashback)} бонусов после
                  оплаты
                </span>
              </div>
              <p className="demo-calculation-note">
                Кешбэк 10% начисляется с денежной части оплаты. Это пример расчёта, не настоящая
                запись.
              </p>
            </div>
          </section>
          <section className="app-section" id="app">
            <div className="container app-grid">
              <div className="app-copy">
                <h2>
                  Всё понятно.
                  <br />
                  <span className="muted-text">С первого визита.</span>
                </h2>
              </div>
              <div className="app-gallery">
                <div className="gallery-top">
                  <span className="gallery-label">
                    <span className="status-dot" /> ЭКРАНЫ ПРИЛОЖЕНИЯ
                  </span>
                  <button
                    className="icon-button"
                    onClick={() => open('preview')}
                    aria-label="Увеличить экран"
                  >
                    <ArrowUpRight size={23} />
                  </button>
                </div>
                <div className="gallery-phone-wrap">
                  <button
                    className="phone-gallery"
                    onClick={() => open('preview')}
                    aria-label={'Увеличить: ' + active.name}
                  >
                    <DevicePhone
                      key={active.id}
                      image={active.image}
                      alt={active.name + ' — экран приложения LanWash'}
                    />
                  </button>
                  <span className="gallery-index">
                    {twoDigits(screen + 1)}
                    <span>/ {twoDigits(screens.length)}</span>
                  </span>
                </div>
                <div className="screen-tabs" role="tablist" aria-label="Экраны приложения">
                  {screens.map((item, index) => (
                    <button
                      role="tab"
                      aria-selected={screen === index}
                      aria-controls="screen-description"
                      tabIndex={screen === index ? 0 : -1}
                      key={item.id}
                      className={screen === index ? 'active' : ''}
                      onClick={() => setScreen(index)}
                      onKeyDown={(event) => {
                        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                          event.preventDefault()
                          const next =
                            (index + (event.key === 'ArrowRight' ? 1 : -1) + screens.length) %
                            screens.length
                          setScreen(next)
                          event.currentTarget.parentElement
                            ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
                            [next]?.focus()
                        }
                      }}
                      aria-label={item.name}
                    >
                      <item.icon size={20} />
                    </button>
                  ))}
                </div>
                <div className="screen-description" id="screen-description" role="tabpanel">
                  <strong>{active.name}</strong>
                  <p>{active.text}</p>
                </div>
                <p className="gallery-note">Реальные экраны приложения</p>
              </div>
            </div>
          </section>
          <section className="section container faq-section" id="faq">
            <div className="faq-intro">
              <span className="eyebrow">ЕЩЁ ПАРА ДЕТАЛЕЙ</span>
              <h2>
                Хорошие вопросы.
                <br />
                <span className="muted-text">Простые ответы.</span>
              </h2>
              <p>Начните с регистрации в приложении.</p>
              <button className="text-link" onClick={() => open('register')}>
                Как создать аккаунт <ArrowUpRight size={18} />
              </button>
            </div>
            <div className="faq-list">
              {faq.map(([question, answer], index) => (
                <details key={question}>
                  <summary>
                    <span className="faq-number">0{index + 1}</span>
                    <span>{question}</span>
                    <ChevronRight size={21} />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>
          <section className="cta-section container">
            <div>
              <span className="eyebrow">МЕНЬШЕ ХЛОПОТ. БОЛЬШЕ ВЫГОДЫ.</span>
              <h2>
                Забота об автомобиле.
                <br />
                Теперь в вашем кармане.
              </h2>
              <RustoreButton className="button button-white button-large" />
            </div>
            <img
              src={asset('images/logo-white.png')}
              alt=""
              width={512}
              height={512}
              className="cta-watermark"
              aria-hidden="true"
              loading="lazy"
            />
          </section>
        </main>
      )}
      <section className="container support-section" id="support" aria-labelledby="support-title">
        <div>
          <span className="eyebrow">ПОДДЕРЖКА И ДОКУМЕНТЫ</span>
          <h2 id="support-title">Остались вопросы?</h2>
          <p>Напишите нам — ответим на вопросы о приложении, бонусах и подключении мойки.</p>
          <a className="button button-quiet" href={'mailto:' + siteConfig.supportEmail}>
            <Mail size={18} /> {siteConfig.supportEmail}
          </a>
        </div>
        <ul className="support-docs">
          <li>
            <a href={asset('terms.html')}>
              <FileText size={20} /> Пользовательское соглашение <ArrowUpRight size={16} />
            </a>
          </li>
          <li>
            <a href={asset('privacy.html')}>
              <ShieldCheck size={20} /> Политика конфиденциальности <ArrowUpRight size={16} />
            </a>
          </li>
        </ul>
      </section>
      <footer className="container site-footer">
        <div className="footer-top">
          <div>
            <Brand business={isBusiness} />
            <p>
              Ваша мойка. Ваша выгода.
              <br />
              Ваш LanWash.
            </p>
          </div>
          <div className="footer-nav">
            {navItems.map(([href, text]) => (
              <a key={href} href={href}>
                {text}
              </a>
            ))}
          </div>
          <div className="footer-contact">
            <span>ПОДДЕРЖКА</span>
            <strong>
              <a href={'mailto:' + siteConfig.supportEmail}>{siteConfig.supportEmail}</a>
            </strong>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 LanWash</span>
          <a href={asset('terms.html')}>Пользовательское соглашение</a>
          <a href={asset('privacy.html')}>Политика конфиденциальности</a>
          <span className="footer-platform">
            Android 8.0+
            <span className="age-badge" title="Возрастная маркировка">
              {siteConfig.ageRating}
            </span>
          </span>
          <a href="https://yandex.ru/legal/maps_termsofuse/" target="_blank" rel="noreferrer">
            Карта на скриншотах © Яндекс <ArrowUpRight size={12} />
          </a>
        </div>
      </footer>
      {modal === 'download' && (
        <Modal key={modal} title="LanWash для Android" onClose={closeModal}>
          <div className="download-content">
            <span className="download-icon">
              <Smartphone size={38} />
            </span>
            <h3>
              Чистая машина.
              <br />
              Начнём с приложения.
            </h3>
            <p>Бесплатно для Android 8.0 и выше.</p>
            <RustoreButton />
            {siteConfig.downloadUrl && (
              <a className="button button-quiet" href={siteConfig.downloadUrl}>
                <Download size={18} /> Скачать APK
              </a>
            )}
            <button className="text-link" onClick={() => setModal('preview')}>
              Пока посмотреть экраны <ArrowRight size={18} />
            </button>
          </div>
        </Modal>
      )}
      {modal === 'register' && (
        <Modal key={modal} title="Регистрация в LanWash" onClose={closeModal}>
          <div className="registration-content">
            <span className="download-icon">
              <Smartphone size={36} />
            </span>
            <h3>Создайте аккаунт в приложении</h3>
            <p>Регистрация доступна в Android-приложении LanWash.</p>
            <ol className="registration-steps">
              <li>Установите LanWash и на экране входа откройте «Зарегистрироваться».</li>
              <li>Укажите имя, телефон и пароль. Повторите пароль.</li>
              <li>
                Отметьте согласие на обработку персональных данных и нажмите «Создать аккаунт».
              </li>
            </ol>
            <p>
              После регистрации откроется карта. Добавьте автомобиль в профиле, чтобы записываться
              на мойку.
            </p>
            <button className="button button-primary" onClick={() => setModal('download')}>
              <Download size={18} /> Скачать для Android
            </button>
            <a className="text-link" href="#booking" onClick={closeModal}>
              Дальше — пошаговая запись <ArrowRight size={18} />
            </a>
          </div>
        </Modal>
      )}
      {modal === 'business' && (
        <Modal key={modal} title="Подключить мойку" onClose={closeApply} className="modal-apply">
          <ApplyForm onDirtyChange={setApplyDirty} />
        </Modal>
      )}
      {modal === 'preview' && (
        <Modal key={modal} title="Приложение изнутри" onClose={closeModal} wide>
          <div className="preview-grid">
            <DevicePhone
              key={active.id}
              className="preview-device"
              tilt="none"
              image={active.image}
              alt={active.name + ' — увеличенный экран LanWash'}
            />
            <div>
              <span className="eyebrow">ЭКРАНЫ ПРИЛОЖЕНИЯ</span>
              <h3>{active.title}</h3>
              <p>{active.text}</p>
              <div className="preview-tabs">
                {screens.map((item, index) => (
                  <button
                    className={screen === index ? 'active' : ''}
                    key={item.id}
                    onClick={() => setScreen(index)}
                  >
                    <item.icon size={18} /> {item.name}
                  </button>
                ))}
              </div>
              <p className="preview-note">Мойки, суммы и имена на скриншотах — примеры.</p>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
