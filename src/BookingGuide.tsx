import { Check, CheckCircle2 } from 'lucide-react'
import DevicePhone from './DevicePhone'
import './booking-guide.css'

const steps = [
  {
    title: 'Найдите мойку',
    text: 'Откройте приложение: мойки рядом — на карте и в списке. Фильтры «Рядом», «Свободно сейчас» и «Кешбэк» помогают выбрать. В карточке мойки нажмите «Записаться» или «Подробнее».',
    note: 'Ближайшая запись закреплена над картой — вместе с QR для кассы.',
    detail: 'Карта → карточка мойки',
    image: 'screen-map.webp',
    alt: 'Экран «Мойки»: карта, фильтры и карточка выбранной мойки с кнопкой «Записаться»',
    caption: 'Карта и карточка мойки',
  },
  {
    title: 'Посмотрите детали',
    text: 'В карточке мойки видно, сколько постов свободно сейчас, до скольки она работает, рейтинг и основные услуги с ценами и длительностью. Ниже — отзывы гостей.',
    note: 'Бонусы копятся отдельно в каждой сети: здесь же видно, сколько их у вас в этой мойке.',
    detail: '«Подробнее» → «Записаться»',
    image: 'screen-wash.webp',
    alt: 'Карточка мойки: свободные посты, часы работы, рейтинг, бонусы сети и услуги',
    caption: 'Карточка мойки',
  },
  {
    title: 'Выберите услуги и время',
    text: 'На экране «Что и когда» выберите автомобиль, основную услугу и дополнительные опции, затем день и свободное время. Приложение учитывает длительность всех услуг и занятость постов.',
    note: 'Доступны ближайшие семь дней, у дней со свободным временем — зелёная точка. Если гараж пуст, сначала добавьте машину: марку, модель и госномер.',
    detail: 'Шаг 1 из 2 · «Продолжить»',
    image: 'screen-booking.webp',
    alt: 'Экран «Что и когда»: выбор услуги, дополнительных опций, дня и времени',
    caption: 'Услуги, день и время',
  },
  {
    title: 'Проверьте и подтвердите',
    text: 'Сверьте время, мойку, автомобиль и расчёт. Если в этой сети у вас есть бонусы, включите списание — приложение покажет сумму к оплате на месте и сколько бонусов вернётся. Нажмите «Записаться».',
    note: 'Бонусы резервируются до визита, отмена записи освобождает резерв. Итоговую сумму подтвердит сотрудник мойки.',
    detail: 'Шаг 2 из 2 · «Записаться»',
    image: 'screen-confirm.webp',
    alt: 'Экран «Проверка и оплата»: время, мойка, автомобиль, списание бонусов и расчёт',
    caption: 'Проверка и подтверждение',
  },
  {
    title: 'Приезжайте и покажите QR',
    text: 'Запись появится в разделе «Записи»: время, мойка, пост, автомобиль и сумма. На мойке нажмите «QR для кассы» — кассир отсканирует код и примет оплату.',
    note: 'Если планы поменялись, отмените запись здесь же. За два часа до визита придёт напоминание.',
    detail: '«Записи» → «QR для кассы»',
    image: 'screen-visits.webp',
    alt: 'Экран «Записи»: ближайший визит с кнопкой «QR для кассы» и следующая запись',
    caption: 'Записи и QR для кассы',
  },
  {
    title: 'Получите бонусы',
    text: 'После оплаты кешбэк приходит в кошелёк сети. Там же видно, сколько бонусов отложено под записи и когда сгорят ближайшие, абонементы и история операций.',
    note: 'Бонусами можно оплатить часть следующего визита в этой сети — в пределах лимита, который задаёт мойка.',
    detail: '«Кошелёк» → бонусы сети',
    image: 'screen-wallet.webp',
    alt: 'Экран «Кошелёк»: бонусы сети, резерв под записи, срок сгорания, абонемент и операции',
    caption: 'Кошелёк после визита',
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
            до бонусов за визит.
          </h2>
          <p>
            Шесть шагов — на каждом настоящий экран приложения. Сначала зарегистрируйтесь или
            войдите в Android-приложение LanWash.
          </p>
          <div className="booking-guide-demo">
            <CheckCircle2 size={18} />
            <span>Мойки, цены и имена на экранах — примеры.</span>
          </div>
        </div>
        <ol className="booking-guide-steps">
          {steps.map(({ title, text, note, detail, image, alt, caption }, index) => (
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
                <figure className="booking-device">
                  {/* Телефон развёрнут к тексту: справа — влево, слева — вправо. */}
                  <DevicePhone image={image} alt={alt} tilt={index % 2 === 0 ? 'left' : 'right'} />
                  <figcaption>{caption}</figcaption>
                </figure>
              </div>
            </li>
          ))}
        </ol>
        <p className="booking-guide-attribution">
          Карта на скриншотах — Яндекс Карты (
          <a href="https://yandex.ru/legal/maps_termsofuse/" target="_blank" rel="noreferrer">
            условия использования
          </a>
          ).
        </p>
      </div>
    </section>
  )
}
