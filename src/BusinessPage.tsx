import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Car,
  ChartNoAxesCombined,
  Check,
  ClipboardCheck,
  FileDown,
  Gift,
  MapPin,
  ScanLine,
  Settings2,
  ShieldCheck,
  Smartphone,
  UsersRound,
  Wallet,
} from 'lucide-react'
import './business.css'
import DevicePhone from './DevicePhone'

type BusinessPageProps = {
  onApply: () => void
  onDownload: () => void
  clientUrl: string
}

const formats = [
  {
    icon: Car,
    title: 'Классическая мойка',
    description: 'Услуги, автомобиль и время выбираются до визита.',
    detail:
      'Запись учитывает длительность выбранных услуг и дополнений. Команда видит записи на сегодня, сверяет автомобиль и подтверждает расчёт после обслуживания. У филиалов одного владельца — общие правила бонусной программы.',
  },
]

const processes = [
  {
    icon: ClipboardCheck,
    role: 'Владелец → администратор',
    title: 'Заявка и проверка бизнеса',
    description:
      'Владелец заполняет анкету на сайте или в приложении «LanWash Бизнес»: название, адрес, число постов, услуги с ценами и длительностью, логотип и фото мойки. Заявка уходит на проверку.',
    result:
      'После проверки мойка публикуется для клиентов. Если данных не хватает, владелец видит причину и может подать анкету заново.',
  },
  {
    icon: Settings2,
    role: 'Владелец',
    title: 'Настройка точек и услуг',
    description:
      'В списке своих моек проверяете адрес, число постов и статус публикации. Для услуг меняете цену и доступность: отключённая услуга больше не предлагается в новых записях.',
    result:
      'Для сети задаёте кешбэк, срок жизни бонусов и допустимую долю списания. Ранее созданная запись сохраняет согласованные услуги, стоимость, автомобиль и условия лояльности.',
  },
  {
    icon: UsersRound,
    role: 'Владелец → сотрудник',
    title: 'Команда и права доступа',
    description:
      'Создаёте сотрудникам отдельные учётные записи и закрепляете их за мойками. Кассир работает с записями, QR-кодами клиентов и подтверждением оплаты.',
    result:
      'Каждая роль получает свой рабочий экран. При необходимости владелец отключает доступ сотрудника; настройки лояльности остаются в управлении владельца.',
  },
  {
    icon: CalendarDays,
    role: 'Клиент → мойка',
    title: 'Запись клиента',
    description:
      'Клиент выбирает автомобиль, услуги и свободное время, затем получает QR записи. Слот учитывает длительность услуг и занятость постов.',
    result:
      'Записи попадают в список на сегодня. Для клиента доступна одна активная запись; её состояние сохраняется после перезапуска приложения.',
  },
  {
    icon: Wallet,
    role: 'Сотрудник → клиент',
    title: 'Работа, расчёт и бонусы',
    description:
      'Сотрудник открывает запись из списка на сегодня или сканирует QR. Проверяет автомобиль, услуги, денежную сумму и списание бонусов, затем отдельно подтверждает получение оплаты.',
    result:
      'Запись становится завершённой, а расчёт фиксируется один раз. Кешбэк считается с денежной части. Для абонемента подтверждается посещение; заявки по чекам проверяются отдельно.',
  },
  {
    icon: ChartNoAxesCombined,
    role: 'Владелец',
    title: 'Аналитика и контроль операций',
    description:
      'Смотрите выручку, посещения, число клиентов и средний чек за последние 30 дней. Рядом — график посещений, свободные посты и ожидаемые записи сети.',
    result:
      'Находите клиента по имени или телефону, проверяете его посещения, оплаченные суммы и бонусы. Журнал можно фильтровать по типу операции и сохранить в CSV.',
  },
]

const tools = [
  {
    icon: MapPin,
    title: 'Несколько точек в одной сети',
    text: 'У каждого филиала свои услуги, цены, посты и карточка на карте. Владелец добавляет точки и настраивает каталог, а администратор рассматривает заявки и управляет публикацией.',
  },
  {
    icon: CalendarDays,
    title: 'Очередь и записи',
    text: 'Список на сегодня показывает ожидаемые, завершённые и отменённые визиты. Сотрудник видит время, пост, автомобиль и услуги. Отмена освобождает слот, а завершение требует подтверждения расчёта.',
  },
  {
    icon: ScanLine,
    title: 'QR записи',
    text: 'Клиент получает QR после выбора времени. На кассе сотрудник сканирует код, сверяет автомобиль и услуги и подтверждает оплату — запись завершается без бумажных журналов.',
  },
  {
    icon: ClipboardCheck,
    title: 'Проверка чеков',
    text: 'Клиент прикладывает фото чека к заявке. Сотрудник сверяет данные и принимает или отклоняет начисление. Решение и бонусная операция сохраняются в истории.',
  },
  {
    icon: Gift,
    title: 'Посещения по абонементу',
    text: 'Клиент выбирает подходящий абонемент для записи. Сотрудник подтверждает использование, после чего уменьшается остаток посещений. На такую мойку новый кешбэк не начисляется.',
  },
  {
    icon: FileDown,
    title: 'Журнал и экспорт',
    text: 'Начисления, списания, платежи и истечение бонусов видны отдельными операциями. CSV содержит дату, тип, сумму, клиента, мойку и описание; файл сохраняется через системный диалог Android.',
  },
]

const loyalty = [
  [
    'Кошелёк сети',
    'Бонусы доступны на мойках одного владельца. Балансы разных владельцев независимы — бонусы одной сети не расходуются в другой.',
  ],
  [
    'Денежная часть оплаты',
    'Кешбэк начисляется только на сумму, оплаченную деньгами. На списанные бонусы и посещения по абонементу новый кешбэк не начисляется.',
  ],
  [
    'Лимит и резерв',
    'Владелец задаёт процент чека, который можно покрыть бонусами. Выбранные при записи бонусы резервируются, чтобы их нельзя было одновременно потратить в другом визите. При отмене резерв освобождается.',
  ],
  [
    'Срок действия',
    'Бонусы имеют срок жизни. При списании первыми используются те, которые истекут раньше; просроченные бонусы перестают быть доступными.',
  ],
  [
    'Правила конкретного визита',
    'Процент кешбэка, срок бонусов и лимит списания сохраняются в момент создания записи. Поздняя смена настроек не меняет условия уже начатого визита.',
  ],
]

const roles = [
  {
    icon: Smartphone,
    title: 'Клиент',
    text: 'Выбирает мойку, записывается на услуги, использует бонусы и абонементы, хранит автомобили, чеки и историю визитов.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Владелец',
    text: 'Добавляет точки, настраивает услуги и лояльность, создаёт и отключает сотрудников, просматривает клиентов, выручку и журнал операций.',
  },
  {
    icon: ScanLine,
    title: 'Сотрудник',
    text: 'Работает с записями своей мойки, сканирует QR, подтверждает оплату или использование абонемента и рассматривает заявки по чекам.',
  },
  {
    icon: ShieldCheck,
    title: 'Администратор',
    text: 'Одобряет или отклоняет заявки с указанием причины, публикует и скрывает точки, рассматривает жалобы и отмечает их решёнными.',
  },
]

const faq = [
  [
    'Можно ли подключить работающую мойку уже сейчас?',
    'Да. Нажмите «Подключить мойку» и заполните анкету: название и адрес, число постов, услуги с ценами и длительностью, логотип и фото. После проверки мойка сразу появится у клиентов — обновлять приложение не нужно.',
  ],
  [
    'Что происходит после проверки?',
    'Мойка появляется на карте и в списке приложения с вашими услугами и ценами. Для входа в «LanWash Бизнес» в заявке появятся логин — телефон из анкеты — и временный пароль. Если данных не хватает, в заявке будет указана причина отказа, и анкету можно подать заново.',
  ],
  [
    'Можно ли управлять сетью из нескольких моек?',
    'Да. Филиалы одного владельца объединяет бонусный кошелёк клиента. Услуги, цены, посты и сотрудники привязаны к соответствующим мойкам.',
  ],
  [
    'Как устроено время записи?',
    'Клиент выбирает день на ближайшую неделю и доступное время с шагом один час, с 08:00 до 22:00. Проверка учитывает длительность основной услуги и дополнений, число постов и пересечение с другими визитами.',
  ],
  [
    'Когда начисляются бонусы за запись?',
    'После обслуживания сотрудник отдельно подтверждает получение денежной суммы, указанной в записи. Тогда запись становится завершённой и начисляется кешбэк по сохранённым условиям. Повторное подтверждение не создаёт второе начисление. Для посещения по абонементу кешбэка нет.',
  ],
  [
    'Какие данные видит сотрудник?',
    'Рабочий экран сотрудника показывает записи закреплённой мойки и необходимые для обслуживания данные: время, пост, автомобиль, услуги и сумму. Здесь же доступны заявки по чекам. Управление сетью и настройка лояльности доступны владельцу, заявки и публикация точек — администратору.',
  ],
  [
    'Как проходит оплата?',
    'Клиент оплачивает визит на кассе мойки. Кассир сканирует QR записи и подтверждает оплату в приложении, после этого клиенту начисляется кешбэк. Онлайн в приложении оплачиваются только абонементы, если сеть их продаёт, — банковской картой через ЮKassa.',
  ],
]

export default function BusinessPage({ onApply, onDownload, clientUrl }: BusinessPageProps) {
  return (
    <main id="main" className="biz-main">
      <section className="biz-hero container" id="top">
        <div className="biz-hero-copy">
          <span className="eyebrow">
            <span className="status-dot" /> LANWASH ДЛЯ БИЗНЕСА
          </span>
          <h1>
            Каждый визит.
            <br />
            <span>Вся мойка.</span>
            <br />В одной системе.
          </h1>
          <p className="biz-lead">
            Записи, посты, команда и бонусная программа — в одном приложении. Управляйте своей
            мойкой или сетью и понимайте, что происходит на каждом этапе визита.
          </p>
          <div className="biz-actions">
            <button className="button button-primary button-large" type="button" onClick={onApply}>
              Подключить мойку <ArrowUpRight size={20} />
            </button>
            <a className="text-link" href="#processes">
              Как устроена работа <ArrowDown size={18} />
            </a>
          </div>
          <p className="biz-hero-note">
            <Smartphone size={17} /> Android 8.0+ · бесплатно в RuStore
          </p>
          <a className="biz-client-link text-link" href={clientUrl}>
            Посмотреть приложение для клиентов <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="biz-hero-visual">
          <div className="biz-visual-heading">
            <span>ВАША СЕТЬ. ВАША КОМАНДА.</span>
            <span className="status-dot" />
          </div>
          <div className="biz-phones">
            <figure className="biz-phone biz-phone-owner">
              <DevicePhone
                image="app-business.webp"
                alt="Экран владельца в LanWash Бизнес: выручка, визиты и загрузка постов"
                priority
              />
              <figcaption>Обзор владельца</figcaption>
            </figure>
            <figure className="biz-phone biz-phone-team">
              <DevicePhone
                image="app-team.webp"
                alt="Экран кассира в LanWash Бизнес: записи на сегодня и приём оплаты"
                tilt="right"
                priority
              />
              <figcaption>Рабочий экран сотрудника</figcaption>
            </figure>
          </div>
          <p className="biz-visual-caption">Реальные экраны приложения</p>
        </div>
      </section>

      <section className="biz-formats-section" id="formats">
        <div className="container">
          <div className="biz-section-intro">
            <span className="eyebrow">ОТ ОДНОЙ ТОЧКИ ДО СЕТИ</span>
            <h2>
              Классический формат.
              <br />
              Понятный сценарий работы.
            </h2>
          </div>
          <div className="biz-format-grid">
            {formats.map((format) => (
              <article className="biz-format-card" key={format.title}>
                <span className="feature-icon">
                  <format.icon size={26} strokeWidth={1.7} />
                </span>
                <h3>{format.title}</h3>
                <p className="biz-format-summary">{format.description}</p>
                <p>{format.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section container" id="processes">
        <div className="section-heading biz-heading">
          <div>
            <span className="eyebrow">РАБОТА ПО ШАГАМ</span>
            <h2>
              От заявки до
              <br />
              <span className="blue-text">подтверждённого визита.</span>
            </h2>
          </div>
          <p>
            Кто выполняет действие, что происходит дальше
            <br className="desktop-break" /> и где сохраняется результат.
          </p>
        </div>
        <ol className="biz-process-list">
          {processes.map((process, index) => (
            <li className="biz-process" key={process.title}>
              <span className="biz-step-number" aria-label={'Шаг ' + (index + 1)}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="biz-process-copy">
                <span className="biz-role-label">
                  <process.icon size={17} />
                  {process.role}
                </span>
                <h3>{process.title}</h3>
                <p>{process.description}</p>
              </div>
              <div className="biz-process-result">
                <Check size={18} />
                <p>{process.result}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="biz-process-footnote">
          Эта последовательность реализована в приложении LanWash для Android.
        </p>
      </section>

      <section className="biz-tools-section" id="tools">
        <div className="container">
          <div className="section-heading biz-heading">
            <div>
              <span className="eyebrow">ПОВСЕДНЕВНЫЕ ЗАДАЧИ</span>
              <h2>
                Детали, из которых
                <br />
                складывается рабочий день.
              </h2>
            </div>
            <p>
              Откройте нужную точку, найдите визит,
              <br className="desktop-break" /> проверьте расчёт и сохраните результат.
            </p>
          </div>
          <div className="biz-tools-grid">
            {tools.map((tool) => (
              <article className="biz-tool-card" key={tool.title}>
                <span className="biz-tool-icon">
                  <tool.icon size={24} strokeWidth={1.7} />
                </span>
                <h3>{tool.title}</h3>
                <p>{tool.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section container biz-loyalty" id="loyalty">
        <div className="biz-loyalty-copy">
          <span className="eyebrow">ПРАВИЛА ВАШЕЙ СЕТИ</span>
          <h2>
            Лояльность,
            <br />
            <span className="blue-text">которую можно проверить.</span>
          </h2>
          <p className="biz-section-description">
            Настройте условия один раз и проследите каждое начисление. Баланс складывается из
            операций, а клиент видит доступные бонусы и историю.
          </p>
          <dl className="biz-loyalty-rules">
            {loyalty.map(([title, description]) => (
              <div key={title}>
                <dt>
                  <Check size={17} />
                  {title}
                </dt>
                <dd>{description}</dd>
              </div>
            ))}
          </dl>
        </div>
        <aside className="biz-loyalty-example" aria-label="Пример расчёта бонусов">
          <span className="biz-example-label">ПРИМЕР, А НЕ ТАРИФ</span>
          <span className="biz-example-icon">
            <Gift size={34} strokeWidth={1.5} />
          </span>
          <h3>
            Кешбэк с той суммы,
            <br />
            которая оплачена деньгами.
          </h3>
          <p>Для этого примера сеть установила кешбэк 10% и лимит списания 20% чека.</p>
          <dl className="biz-calculation">
            <div>
              <dt>Стоимость услуги</dt>
              <dd>1 200 ₽</dd>
            </div>
            <div>
              <dt>Списано бонусами</dt>
              <dd>200</dd>
            </div>
            <div className="biz-calculation-total">
              <dt>Денежная часть</dt>
              <dd>1 000 ₽</dd>
            </div>
            <div className="biz-calculation-cashback">
              <dt>Начисление после оплаты</dt>
              <dd>+100 бонусов</dd>
            </div>
          </dl>
          <p className="biz-calculation-note">
            200 бонусов укладываются в лимит 240. Кешбэк: 1 000 × 10% = 100. Повторное подтверждение
            этой оплаты не создаёт новое начисление.
          </p>
        </aside>
      </section>

      <section className="biz-roles-section" id="roles">
        <div className="container">
          <div className="section-heading biz-heading">
            <div>
              <span className="eyebrow">ЧЕТЫРЕ РОЛИ</span>
              <h2>
                Каждому — свой
                <br />
                участок работы.
              </h2>
            </div>
            <p>
              Рабочий экран зависит от роли и точки.
              <br className="desktop-break" /> В журнале видны клиент, сумма и время операции.
            </p>
          </div>
          <div className="biz-roles-grid">
            {roles.map((role) => (
              <article className="biz-role-card" key={role.title}>
                <role.icon size={27} strokeWidth={1.7} />
                <h3>{role.title}</h3>
                <p>{role.text}</p>
              </article>
            ))}
          </div>
          <div className="biz-moderation-note">
            <ShieldCheck size={22} />
            <p>
              <strong>Новая точка проходит модерацию.</strong> Владелец создаёт заявку,
              администратор проверяет её и управляет публикацией мойки. Жалобы доступны в отдельном
              списке: можно прочитать обращение и отметить его решённым.
            </p>
          </div>
        </div>
      </section>

      <section className="container biz-demo-section" aria-labelledby="biz-demo-title">
        <div className="biz-demo-copy">
          <span className="eyebrow">ПОДКЛЮЧЕНИЕ</span>
          <h2 id="biz-demo-title">
            Подключите мойку
            <br />к LanWash.
          </h2>
          <p>
            Заполните анкету — администратор проверит адрес, фото и услуги и опубликует мойку.
            Клиенты увидят её на карте, смогут записаться и оплатить визит на кассе со скидкой
            бонусами.
          </p>
        </div>
        <div className="biz-demo-actions">
          <button className="button button-white button-large" type="button" onClick={onDownload}>
            Скачать в RuStore <ArrowUpRight size={19} />
          </button>
          <button
            className="button biz-button-outline button-large"
            type="button"
            onClick={onApply}
          >
            Подключить мойку <ArrowRight size={19} />
          </button>
          <span>Статус заявки появится в окне анкеты</span>
        </div>
      </section>

      <section className="section container biz-faq" id="faq">
        <div className="biz-section-intro">
          <span className="eyebrow">ВОПРОСЫ ПЕРЕД ЗНАКОМСТВОМ</span>
          <h2>
            Как это работает
            <br />
            для вашей мойки.
          </h2>
        </div>
        <div className="biz-faq-list">
          {faq.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span className="biz-faq-sign" aria-hidden="true" />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  )
}
