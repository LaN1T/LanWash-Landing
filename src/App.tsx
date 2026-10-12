import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Car,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  Gift,
  MapPin,
  Menu,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Wallet,
  X,
  ChartNoAxesCombined,
  Layers3,
} from 'lucide-react'
import { siteConfig } from './config'
import BusinessPage from './BusinessPage'
import BookingGuide from './BookingGuide'

type ModalType = 'download' | 'business' | 'preview' | 'register' | null
const asset = (path: string) => import.meta.env.BASE_URL + path
const allScreens = [
  {
    id: 'map',
    name: 'Мойки рядом',
    image: 'app-map.webp',
    icon: MapPin,
    title: 'Хорошая мойка — рядом.',
    text: 'Выберите точку на карте, посмотрите услуги и свободные посты. Классическая, самообслуживание или всё сразу.',
  },
  {
    id: 'wallet',
    name: 'Бонусы и визиты',
    image: 'app-wallet.webp',
    icon: Wallet,
    title: 'Каждый визит возвращает выгоду.',
    text: 'Бонусы вашей сети, записи и история посещений — в одном месте. Без пластиковых карт и забытых купонов.',
  },
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
    'Классические мойки с записью, самообслуживание с запуском сессии по QR и комбинированные точки.',
  ],
  [
    'Как зарегистрироваться?',
    'Установите Android-приложение и на экране входа выберите «Создать аккаунт». Укажите имя, телефон и пароль, подтвердите пароль и согласие на обработку данных. После регистрации откроется карта.',
  ],
  [
    'Как работают бонусы?',
    'Бонусы доступны в пределах одной сети. Размер кешбэка, срок действия и максимальная бонусная часть оплаты указаны в приложении. Кешбэк начисляется с денежной части оплаты.',
  ],
  [
    'Можно ли записаться на сайте?',
    'Запись на сайте появится позже. Кнопка «Записаться на сайте — скоро» ведёт на lanwash.ru. Сейчас сценарий записи можно пройти в Android-приложении.',
  ],
  [
    'На каких устройствах работает приложение?',
    'На смартфонах с Android 8.0 и выше. Есть светлая и тёмная темы. Сейчас доступен автономный демонстрационный прототип: данные хранятся на устройстве, платежи моделируются.',
  ],
]

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <a
      className={'brand' + (inverse ? ' brand-inverse' : '')}
      href="#top"
      aria-label="LanWash — на главную"
    >
      <span className="brand-mark">
        <img src={asset('images/logo-white.png')} alt="" width="34" height="34" />
      </span>
      <span>
        LanWash<span className="brand-period">.</span>
      </span>
    </a>
  )
}

function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
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
        className={'modal' + (wide ? ' modal-wide' : '')}
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

function BusinessForm() {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget).entries())
    const digits = String(data.phone).replace(/\D/g, '')
    if (digits.length < 10 || digits.length > 12) {
      setError('Проверьте номер телефона.')
      return
    }
    try {
      localStorage.setItem('lanwash-business-draft', JSON.stringify(data))
      setSaved(true)
    } catch {
      setError('Не удалось сохранить заявку в браузере. Попробуйте ещё раз.')
    }
  }
  if (saved)
    return (
      <div className="form-success" role="status">
        <span className="success-icon">
          <CheckCircle2 size={34} />
        </span>
        <h3>Заявка сохранена</h3>
        <p>
          Это демонстрационная форма. Данные сохранены только в вашем браузере; связь с командой
          появится после запуска.
        </p>
        <button className="button button-quiet" type="button" onClick={() => setSaved(false)}>
          Заполнить ещё раз
        </button>
      </div>
    )
  return (
    <form className="lead-form" onSubmit={submit}>
      <p className="modal-description">
        Расскажите немного о вашей мойке. Пока это демо-форма — отправка команде ещё не подключена.
      </p>
      <label>
        Ваше имя
        <input
          name="name"
          placeholder="Как к вам обращаться"
          minLength={2}
          required
          autoComplete="name"
        />
      </label>
      <label>
        Название мойки
        <input
          name="business"
          placeholder="Название или сеть"
          minLength={2}
          required
          autoComplete="organization"
        />
      </label>
      <div className="form-row">
        <label>
          Телефон
          <input
            name="phone"
            type="tel"
            placeholder="+7 999 000-00-00"
            required
            autoComplete="tel"
            onChange={() => setError('')}
          />
        </label>
        <label>
          Формат мойки
          <select name="format">
            <option>Классическая</option>
            <option>Самообслуживание</option>
            <option>Комбинированная</option>
          </select>
        </label>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button button-primary" type="submit">
        Сохранить демо-заявку <ArrowRight size={19} />
      </button>
      <span className="form-note">
        <ShieldCheck size={16} /> Данные остаются на этом устройстве
      </span>
    </form>
  )
}

export default function App() {
  const isBusiness = siteConfig.audience === 'business'
  const screens = isBusiness ? allScreens.slice(2) : allScreens.slice(0, 2)
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
  const [time, setTime] = useState('14:00')
  const [scrolled, setScrolled] = useState(false)
  const active = screens[screen]
  const total = service === 'full' ? 1500 : 800
  const bonus = useBonus ? Math.floor(total * 0.3) : 0
  const cash = total - bonus
  const money = (amount: number) => new Intl.NumberFormat('ru-RU').format(amount) + ' ₽'
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
          <Brand />
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
                <button
                  className="button button-primary button-large"
                  onClick={() => open('download')}
                >
                  Скачать для Android <ArrowUpRight size={20} />
                </button>
                <button
                  className="button button-quiet button-large"
                  onClick={() => open('register')}
                >
                  Зарегистрироваться <ArrowRight size={19} />
                </button>
                <a className="button button-outline button-large" href={siteConfig.bookingUrl}>
                  Записаться на сайте <span className="soon-badge">Скоро</span>{' '}
                  <ArrowUpRight size={18} />
                </a>
                <a className="text-link" href="#booking">
                  Как записаться <ArrowDown size={18} />
                </a>
              </div>
              <div className="hero-compatibility">
                <Smartphone size={18} />
                <span>Android 8.0+</span>
                <span className="tiny-divider" />
                <span>Демонстрационная версия</span>
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
                  className="phone phone-hero"
                  onClick={() => {
                    setScreen(0)
                    open('preview')
                  }}
                  aria-label="Открыть экран карты LanWash"
                >
                  <img
                    src={asset('images/app-map.webp')}
                    alt="Реальный экран карты демонстрационного приложения LanWash"
                    width={640}
                    height={1387}
                    fetchPriority="high"
                  />
                  <span className="phone-speaker" aria-hidden="true" />
                </button>
                <div className="floating-wallet">
                  <div className="floating-heading">
                    <span className="mini-icon">
                      <Wallet size={17} />
                    </span>
                    <span>Бонусы сети</span>
                    <span className="live-dot" />
                  </div>
                  <strong>
                    1 240 <span>₽</span>
                  </strong>
                  <span className="floating-caption">Следующая мойка выгоднее</span>
                </div>
                <div className="floating-booking">
                  <div className="booking-check">
                    <Check size={19} />
                  </div>
                  <div>
                    <strong>Запись подтверждена</strong>
                    <span>Сегодня, 14:00 · Комплексная</span>
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
              <span className="formats-label">ОДНО ПРИЛОЖЕНИЕ — ВСЕ ФОРМАТЫ</span>
              <span>
                <Car size={21} /> Классическая мойка
              </span>
              <span>
                <ScanLine size={21} /> Самообслуживание
              </span>
              <span>
                <Layers3 size={21} /> Комбинированная
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
          <section className="app-section" id="app">
            <div className="container app-grid">
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
                    className="phone phone-gallery"
                    onClick={() => open('preview')}
                    aria-label={'Увеличить: ' + active.name}
                  >
                    <img
                      key={active.id}
                      src={asset('images/' + active.image)}
                      alt={active.name + ' — экран демо LanWash'}
                      width={640}
                      height={1387}
                      loading="lazy"
                    />
                    <span className="phone-speaker" aria-hidden="true" />
                  </button>
                  <span className="gallery-index">
                    0{screen + 1}
                    <span>/ 02</span>
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
                <p className="gallery-note">Реальные экраны автономного демо</p>
              </div>
              <div className="app-copy">
                <span className="eyebrow">ЗНАКОМИТЬСЯ ПРОЩЕ В ДЕЛЕ</span>
                <h2>
                  Всё понятно.
                  <br />
                  <span className="muted-text">С первого визита.</span>
                </h2>
                <div className="screen-options" id="screen-description" role="tabpanel">
                  {screens.map((item, index) => (
                    <button
                      className={'screen-option' + (screen === index ? ' selected' : '')}
                      key={item.id}
                      onClick={() => setScreen(index)}
                      aria-pressed={screen === index}
                    >
                      <span className="option-icon">
                        <item.icon size={21} />
                      </span>
                      <span>
                        <strong>{item.name}</strong>
                        {screen === index && <span className="option-detail">{item.text}</span>}
                      </span>
                      <ChevronRight size={20} />
                    </button>
                  ))}
                </div>
                <div className="app-detail-note">
                  <ShieldCheck size={18} />
                  <span>Карта, бонусы и визиты в одном приложении.</span>
                </div>
              </div>
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
                Бонусы остаются в кошельке сети. Потратьте их на следующей мойке любого филиала этой
                сети.
              </p>
              <ul className="check-list">
                <li>
                  <Check size={18} /> Общий кошелёк для филиалов сети
                </li>
                <li>
                  <Check size={18} /> Прозрачная история начислений и списаний
                </li>
                <li>
                  <Check size={18} /> Срок действия бонусов виден заранее
                </li>
              </ul>
              <div className="small-note">
                <Gift size={19} />
                <span>Правила и размер кешбэка устанавливает мойка</span>
              </div>
            </div>
            <div className="booking-demo">
              <div className="demo-top">
                <span>ВАШ СЛЕДУЮЩИЙ ВИЗИТ</span>
                <span className="demo-label">Пример</span>
              </div>
              <div className="demo-wash">
                <span className="feature-icon">
                  <Car size={25} />
                </span>
                <div>
                  <strong>Чистый город · Арбат</strong>
                  <span>Выберите услугу и время</span>
                </div>
              </div>
              <div className="service-toggle" role="group" aria-label="Услуга в примере">
                <button
                  className={service === 'basic' ? 'active' : ''}
                  onClick={() => setService('basic')}
                >
                  Базовая <span>800 ₽</span>
                </button>
                <button
                  className={service === 'full' ? 'active' : ''}
                  onClick={() => setService('full')}
                >
                  Комплексная <span>1 500 ₽</span>
                </button>
              </div>
              <div className="demo-times" role="group" aria-label="Время в примере">
                {['10:00', '14:00', '18:00'].map((slot) => (
                  <button
                    className={time === slot ? 'active' : ''}
                    aria-pressed={time === slot}
                    onClick={() => setTime(slot)}
                    key={slot}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <label className="bonus-toggle">
                <span>
                  <strong>Оплатить часть бонусами</strong>
                  <span>До 30% чека в этом примере</span>
                </span>
                <input
                  type="checkbox"
                  role="switch"
                  checked={useBonus}
                  onChange={(event) => setUseBonus(event.target.checked)}
                />
                <span className="switch-visual" aria-hidden="true" />
              </label>
              <div className="demo-total">
                <span>К оплате</span>
                <strong>{money(cash)}</strong>
              </div>
              <div className="demo-bonus">
                <span>Бонусами: {money(bonus)}</span>
                <span>
                  <Gift size={15} /> +{Math.floor(cash * 0.1)} бонусов
                </span>
              </div>
              <div className="demo-calculation-note">
                В примере кешбэк 10% начисляется с денежной части оплаты. Это расчёт, не настоящая
                запись.
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
              <button className="button button-white button-large" onClick={() => open('download')}>
                <Download size={19} /> Попробовать LanWash <ArrowUpRight size={19} />
              </button>
            </div>
            <img
              src={asset('images/logo-white.png')}
              alt=""
              className="cta-watermark"
              aria-hidden="true"
              loading="lazy"
            />
          </section>
        </main>
      )}
      <footer className="container site-footer">
        <div className="footer-top">
          <div>
            <Brand />
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
            <span>БУДЕМ НА СВЯЗИ</span>
            <strong>{siteConfig.contactStatus}</strong>
            <span className="placeholder-tag">Скоро</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 LanWash</span>
          <span>Демонстрационный прототип · Android</span>
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
            Карта © OpenStreetMap contributors <ArrowUpRight size={12} />
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
            <p>Демонстрационная версия для Android 8.0 и выше.</p>
            {siteConfig.downloadUrl ? (
              <a className="button button-primary" href={siteConfig.downloadUrl}>
                <Download size={18} /> Скачать APK
              </a>
            ) : (
              <div className="download-placeholder">
                <Download size={20} />
                <div>
                  <strong>Ссылка на скачивание появится здесь</strong>
                  <span>Пока готовим доступ к сборке</span>
                </div>
              </div>
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
              <li>Установите LanWash и на экране входа нажмите «Создать аккаунт».</li>
              <li>Укажите имя, телефон и пароль. Повторите пароль.</li>
              <li>
                Подтвердите согласие на обработку персональных данных и нажмите
                «Зарегистрироваться».
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
        <Modal key={modal} title="LanWash для вашей мойки" onClose={closeModal}>
          <BusinessForm />
        </Modal>
      )}
      {modal === 'preview' && (
        <Modal key={modal} title="Приложение изнутри" onClose={closeModal} wide>
          <div className="preview-grid">
            <img
              src={asset('images/' + active.image)}
              alt={active.name + ' — увеличенный экран LanWash'}
              width={640}
              height={1387}
            />
            <div>
              <span className="eyebrow">ДЕМОНСТРАЦИОННЫЙ ПРОТОТИП</span>
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
              <p className="preview-note">
                Данные на скриншотах демонстрационные. Платежи и оборудование моделируются.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
