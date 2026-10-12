import type { ReactNode } from 'react'
import {
  ArrowLeft,
  CalendarDays,
  Car,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Gift,
  MapPin,
  Search,
  Signal,
  UserRound,
  Wifi,
} from 'lucide-react'
import './booking-guide.css'

const asset = (path: string) => import.meta.env.BASE_URL + path

function Phone({ title, children }: { title: string; children: ReactNode }) {
  return (
    <figure className="booking-phone-example">
      <div className="booking-phone" aria-hidden="true">
        <div className="booking-phone-status">
          <span>9:41</span>
          <span>
            <Signal size={13} />
            <Wifi size={13} />
            <span className="booking-battery" />
          </span>
        </div>
        <div className="booking-phone-screen">{children}</div>
        <div className="booking-phone-home" />
      </div>
      <figcaption>Пример экрана · {title}</figcaption>
    </figure>
  )
}

function ScreenHeader({ step }: { step: 1 | 2 | 3 }) {
  return (
    <>
      <div className="booking-screen-heading">
        <ArrowLeft size={18} />
        <span>Запись на мойку</span>
      </div>
      <div className="booking-screen-step">
        Шаг {step} из 3 · {step === 1 ? 'Услуги' : step === 2 ? 'Время' : 'Подтверждение'}
      </div>
      <div className="booking-screen-progress">
        <span style={{ width: `${(step / 3) * 100}%` }} />
      </div>
      <div className="booking-screen-wash">Блеск · Петровка</div>
    </>
  )
}

function ScreenAction({ children }: { children: ReactNode }) {
  return (
    <div className="booking-screen-action">
      {children}
      <ChevronRight size={16} />
    </div>
  )
}

function SelectRow({
  label,
  price,
  selected = false,
  square = false,
}: {
  label: string
  price: string
  selected?: boolean
  square?: boolean
}) {
  return (
    <div className={'booking-select-row' + (selected ? ' is-selected' : '')}>
      <span className={'booking-choice' + (square ? ' is-square' : '')}>
        {selected && <Check size={12} />}
      </span>
      <span>
        {label}
        <small>{price}</small>
      </span>
    </div>
  )
}

function MapScreen() {
  return (
    <Phone title="выбор мойки">
      <div className="booking-map-heading">
        <strong>Мойки рядом</strong>
        <span>Москва · 3 мойки</span>
      </div>
      <div className="booking-search">
        <Search size={15} />
        Название или адрес
      </div>
      <div className="booking-map-filters">
        <span>Все</span>
        <span className="is-selected">Классические</span>
      </div>
      <div className="booking-map-preview">
        <img src={asset('images/app-map.webp')} alt="" />
        <div className="booking-map-pin">
          <MapPin size={23} />
        </div>
        <span className="booking-map-credit">© OpenStreetMap contributors</span>
      </div>
      <div className="booking-wash-card">
        <div className="booking-wash-card-top">
          <strong>Блеск · Петровка</strong>
          <span>4,9 ★</span>
        </div>
        <p>Классическая мойка</p>
        <div className="booking-wash-card-meta">
          <Clock3 size={12} />
          08:00–22:00<span>от 800 ₽</span>
        </div>
        <ScreenAction>Записаться</ScreenAction>
      </div>
      <div className="booking-screen-nav">
        <span>
          <CalendarDays size={18} />
          Записи
        </span>
        <span className="is-selected">
          <MapPin size={18} />
          Карта
        </span>
        <span>
          <UserRound size={18} />
          Профиль
        </span>
      </div>
    </Phone>
  )
}

function ServicesScreen() {
  return (
    <Phone title="услуги и автомобиль">
      <ScreenHeader step={1} />
      <div className="booking-screen-label">Автомобиль</div>
      <div className="booking-car">
        <Car size={20} />
        <span>
          Toyota Camry<small>Т437КК · 797</small>
        </span>
        <ChevronDown size={15} />
      </div>
      <div className="booking-screen-label">Выберите услугу</div>
      <SelectRow label="Базовая мойка" price="800 ₽ · 40 минут" selected />
      <SelectRow label="Комплексная мойка" price="1 500 ₽ · 70 минут" />
      <div className="booking-screen-label">Дополнительные услуги</div>
      <SelectRow label="Чернение шин" price="300 ₽ · 10 минут" selected square />
      <SelectRow label="Пылесос салона" price="200 ₽ · 15 минут" square />
      <div className="booking-services-total">
        <span>Итого</span>
        <strong>1 100 ₽</strong>
      </div>
      <ScreenAction>Далее</ScreenAction>
    </Phone>
  )
}

function TimeScreen() {
  const days = ['Сегодня', 'Завтра', 'Послезавтра']
  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
  return (
    <Phone title="день и свободное время">
      <ScreenHeader step={2} />
      <div className="booking-screen-label">Выберите день</div>
      <div className="booking-days">
        {days.map((day, index) => (
          <span className={index === 1 ? 'is-selected' : ''} key={day}>
            {day}
          </span>
        ))}
      </div>
      <div className="booking-selected-day">
        <CalendarDays size={19} />
        <span>
          Выбранный день<small>Завтра</small>
        </span>
      </div>
      <div className="booking-screen-label">Свободное время</div>
      <div className="booking-times">
        {times.map((time) => (
          <span
            className={time === '12:00' ? 'is-selected' : time === '09:00' ? 'is-unavailable' : ''}
            key={time}
          >
            {time}
          </span>
        ))}
      </div>
      <div className="booking-time-note">
        <Clock3 size={15} />
        <p>
          Мойка займёт 50 минут
          <br />
          <span>Базовая мойка + чернение шин</span>
        </p>
      </div>
      <ScreenAction>Далее</ScreenAction>
      <div className="booking-screen-back">Назад</div>
    </Phone>
  )
}

function ConfirmationScreen() {
  return (
    <Phone title="проверка и подтверждение">
      <ScreenHeader step={3} />
      <div className="booking-screen-label booking-screen-label-large">Подтвердите запись</div>
      <div className="booking-summary">
        <strong>Базовая мойка</strong>
        <p>Чернение шин</p>
        <div>
          <CalendarDays size={16} />
          <span>Завтра · 12:00</span>
        </div>
        <div>
          <Car size={16} />
          <span>Toyota Camry · Т437КК797</span>
        </div>
        <div>
          <Clock3 size={16} />
          <span>50 минут</span>
        </div>
        <div className="booking-summary-total">
          <span>Итого</span>
          <strong>1 100 ₽</strong>
        </div>
      </div>
      <div className="booking-payment">
        <Gift size={18} />
        <span>
          Списать бонусы<small>По правилам сети</small>
        </span>
        <span className="booking-bonus-switch" />
      </div>
      <div className="booking-pay-total">
        <span>К оплате на мойке</span>
        <strong>1 100 ₽</strong>
      </div>
      <div className="booking-confirm-note">Бонусы при списании резервируются до визита.</div>
      <ScreenAction>Подтвердить запись</ScreenAction>
      <div className="booking-screen-back">Назад</div>
    </Phone>
  )
}

function ExampleQr() {
  // An illustrative pattern, intentionally not a scannable customer credential.
  const modules = Array.from({ length: 25 * 25 }, (_, index) => {
    const x = index % 25
    const y = Math.floor(index / 25)
    const inFinder = (originX: number, originY: number) =>
      x >= originX && x < originX + 8 && y >= originY && y < originY + 8
    if (inFinder(0, 0) || inFinder(17, 0) || inFinder(0, 17)) return null
    return (x * 13 + y * 7 + x * y) % 11 < 5 ? (
      <rect key={index} x={x} y={y} width="1" height="1" />
    ) : null
  })
  return (
    <svg viewBox="-2 -2 29 29" className="booking-example-qr" aria-hidden="true">
      <rect x="-2" y="-2" width="29" height="29" fill="white" />
      <g fill="#182330">
        {modules}
        {[
          [0, 0],
          [18, 0],
          [0, 18],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="7" height="7" />
            <rect x={x + 1} y={y + 1} width="5" height="5" fill="white" />
            <rect x={x + 2} y={y + 2} width="3" height="3" />
          </g>
        ))}
      </g>
    </svg>
  )
}

function VisitScreen() {
  return (
    <Phone title="запись и QR-код">
      <div className="booking-screen-heading">
        <ArrowLeft size={18} />
        <span>Детали записи</span>
      </div>
      <div className="booking-success">
        <CheckCircle2 size={35} />
        <strong>Вы записаны</strong>
        <span>Ожидается</span>
      </div>
      <div className="booking-visit-summary">
        <strong>Блеск · Петровка</strong>
        <p>Завтра · 12:00</p>
        <small>Базовая мойка · Чернение шин</small>
        <b>1 100 ₽</b>
      </div>
      <div className="booking-qr-card">
        <strong>Показать QR-код</strong>
        <ExampleQr />
        <span>Покажите код на мойке</span>
      </div>
      <div className="booking-screen-cancel">К моим записям</div>
    </Phone>
  )
}

const steps = [
  {
    title: 'Найдите мойку с записью',
    text: 'Откройте карту в приложении и выберите классическую или комбинированную мойку. В карточке проверьте адрес, часы работы и стоимость услуг, затем нажмите «Записаться».',
    note: 'Для мойки самообслуживания используется другой сценарий: запуск сессии по QR-коду на посту.',
    detail: 'Карта → карточка мойки → «Записаться»',
    screen: MapScreen,
  },
  {
    title: 'Выберите услуги и автомобиль',
    text: 'Отметьте основную услугу, добавьте нужные опции и выберите автомобиль из раздела «Мои машины». Если гараж пуст, сначала добавьте машину: укажите марку и госномер. Нажмите «Далее».',
    note: 'Дополнительные услуги меняют и стоимость, и продолжительность визита. В примере базовая мойка с чернением шин занимает 50 минут.',
    detail: 'Первый шаг записи · услуги + машина',
    screen: ServicesScreen,
  },
  {
    title: 'Подберите свободное время',
    text: 'Выберите день, а затем один из доступных интервалов. Приложение учитывает продолжительность всех выбранных услуг. Если на этот день нет подходящего времени, попробуйте другую дату.',
    note: 'В демонстрационной версии доступны ближайшие семь дней. Недоступные часы нельзя выбрать. Нажмите «Далее», когда найдёте подходящее время.',
    detail: 'Второй шаг записи · день + время',
    screen: TimeScreen,
  },
  {
    title: 'Проверьте запись и подтвердите',
    text: 'Сверьте мойку, услуги, автомобиль, время и итоговую сумму. Если в этой сети доступны бонусы, включите «Списать бонусы» и выберите сумму: приложение покажет остаток к оплате. Для исправлений вернитесь назад, затем нажмите «Подтвердить запись».',
    note: 'Бонусы резервируются до посещения; отмена записи освобождает резерв. Денежная часть оплачивается на мойке. В текущем прототипе платежи демонстрационные.',
    detail: 'Третий шаг записи · проверка + подтверждение',
    screen: ConfirmationScreen,
  },
  {
    title: 'Приезжайте и покажите QR',
    text: 'После подтверждения откроется экран успешной записи. Нажмите «Показать QR-код» или позже найдите визит в разделе «Записи». Приезжайте к выбранному времени и покажите QR на мойке.',
    note: 'Если планы поменялись, отмените ожидающую запись в её карточке. После завершения оплаченного визита можно оставить отзыв.',
    detail: 'Успешная запись → «Показать QR-код»',
    screen: VisitScreen,
  },
]

export default function BookingGuide() {
  return (
    <section id="booking" className="booking-guide section" aria-labelledby="booking-guide-title">
      <div className="container">
        <div className="booking-guide-intro">
          <span className="eyebrow">
            <span className="status-dot" />
            ЗАПИСЬ В ПРИЛОЖЕНИИ
          </span>
          <h2 id="booking-guide-title">
            От выбора мойки
            <br />
            до готовой записи.
          </h2>
          <p>
            Пять понятных шагов — с примером экрана на каждом. Сначала зарегистрируйтесь или войдите
            в Android-приложение LanWash.
          </p>
          <div className="booking-guide-demo">
            <CheckCircle2 size={18} />
            <span>Инструкция по демонстрационной версии. Экраны и цены приведены для примера.</span>
          </div>
        </div>
        <ol className="booking-guide-steps">
          {steps.map(({ title, text, note, detail, screen: Screen }, index) => (
            <li className="booking-guide-step" key={title}>
              <div className="booking-guide-copy">
                <span className="booking-guide-number">{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <div className="booking-guide-note">{note}</div>
                <div className="booking-guide-detail">
                  <Check size={16} />
                  <span>{detail}</span>
                </div>
              </div>
              <div className={'booking-guide-visual booking-guide-visual-' + (index + 1)}>
                <Screen />
              </div>
            </li>
          ))}
        </ol>
        <p className="booking-guide-attribution">
          Карта в примере:{' '}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
            © OpenStreetMap contributors
          </a>
          .
        </p>
      </div>
    </section>
  )
}
