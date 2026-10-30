import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Copy,
  Download,
  ImagePlus,
  LoaderCircle,
  Minus,
  Plus,
  Send,
  Store,
  Trash2,
  X,
} from 'lucide-react'
import { siteConfig } from './config'

/*
 * Анкета подключения мойки — те же шаги и правила, что в «LanWash Бизнес» (WashApplicationForm.kt).
 * Заявка уходит в POST /v1/wash-applications без входа. Статус сервер отдаёт по id заявки,
 * поэтому id сохраняются в этом браузере — так же приложение хранит их на телефоне.
 */

type Status = 'PENDING' | 'APPROVED' | 'REJECTED'
type Application = {
  id: string
  washName: string
  address: string
  phone: string
  status: Status
  rejectionReason: string
  temporaryPassword: string
  existingOwnerId: string | null
  createdAt: number
}
type ServiceDraft = {
  key: number
  extra: boolean
  name: string
  price: string
  duration: string
  description: string
}
type Picture = { key: number; blob: Blob; url: string; mediaId?: string }

const storageKey = 'lanwash.wash-applications'
const steps = ['Мойка', 'Услуги и цены', 'Оформление и фото', 'Контакты и проверка']
const maxPhotos = 10
const statusLabel: Record<Status, string> = {
  PENDING: 'На проверке',
  APPROVED: 'Одобрена',
  REJECTED: 'Отклонена',
}

let nextKey = 1
const newService = (): ServiceDraft => ({
  key: nextKey++,
  extra: false,
  name: '',
  price: '',
  duration: '40',
  description: '',
})

const length = (value: string) => [...value.trim()].length
const durationText = (minutes: number) => {
  const hours = Math.floor(minutes / 60),
    rest = minutes % 60
  if (!hours) return rest + ' мин'
  return rest ? `${hours} ч ${rest} мин` : hours + ' ч'
}
const money = (amount: number) => new Intl.NumberFormat('ru-RU').format(amount) + ' ₽'
const serviceValid = (service: ServiceDraft) => {
  const price = Number(service.price),
    duration = Number(service.duration)
  return (
    length(service.name) >= 2 &&
    length(service.name) <= 60 &&
    Number.isInteger(price) &&
    price >= 1 &&
    price <= 100_000 &&
    Number.isInteger(duration) &&
    duration >= 5 &&
    duration <= 480
  )
}
const phoneDigits = (value: string) => {
  let digits = value.replace(/\D/g, '')
  const hasMaskPrefix = value.trimStart().startsWith('+7')
  if ((hasMaskPrefix || digits.length > 10) && (digits[0] === '7' || digits[0] === '8')) {
    digits = digits.slice(1)
  }
  return digits.slice(0, 10)
}
const phoneText = (digits: string) => {
  if (!digits) return ''
  const part = (from: number, to: number) => digits.slice(from, to)
  let text = '+7 (' + part(0, 3)
  if (digits.length > 3) text += ') ' + part(3, 6)
  if (digits.length > 6) text += '-' + part(6, 8)
  if (digits.length > 8) text += '-' + part(8, 10)
  return text
}
const displayPhone = (phone: string) => phoneText(phoneDigits(phone)) || phone

function readIds(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}
function saveIds(ids: string[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(ids))
  } catch {
    // Без хранилища статус виден до закрытия окна.
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(siteConfig.apiUrl + path, init)
  } catch {
    throw new Error('Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.')
  }
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(
      typeof body?.error === 'string' ? body.error : 'Сервер не принял запрос. Попробуйте ещё раз.',
    )
  }
  return body as T
}

/** Кадрирует и уменьшает фото так же, как приложение: логотип — квадрат, шапка — 16 : 9. */
async function prepareImage(file: File, mode: 'logo' | 'cover' | 'photo'): Promise<Blob> {
  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    let sx = 0,
      sy = 0,
      sw = image.naturalWidth,
      sh = image.naturalHeight
    const ratio = mode === 'logo' ? 1 : mode === 'cover' ? 16 / 9 : sw / sh
    if (sw / sh > ratio) {
      sx = (sw - sh * ratio) / 2
      sw = sh * ratio
    } else {
      sy = (sh - sw / ratio) / 2
      sh = sw / ratio
    }
    const limit = mode === 'logo' ? 512 : 1600
    const scale = Math.min(1, limit / Math.max(sw, sh))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(sw * scale)
    canvas.height = Math.round(sh * scale)
    const context = canvas.getContext('2d')
    if (!context) throw new Error()
    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error())), 'image/jpeg', 0.88),
    )
  } catch {
    throw new Error('Не удалось открыть фото. Выберите JPEG, PNG или WebP.')
  } finally {
    URL.revokeObjectURL(url)
  }
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string | null
  children: ReactNode
}) {
  return (
    <label className="apply-field">
      <span className="apply-label">{label}</span>
      {children}
      {error ? (
        <span className="apply-hint apply-hint-error">{error}</span>
      ) : (
        hint && <span className="apply-hint">{hint}</span>
      )}
    </label>
  )
}

function ApplicationCard({ application }: { application: Application }) {
  const [copied, setCopied] = useState(false)
  return (
    <article className="apply-card">
      <div className="apply-card-head">
        <span className="apply-icon">
          <Store size={20} strokeWidth={1.6} />
        </span>
        <div>
          <strong>{application.washName}</strong>
          <span>{application.address}</span>
        </div>
        <span className={'apply-status apply-status-' + application.status.toLowerCase()}>
          {statusLabel[application.status]}
        </span>
      </div>
      {application.status === 'PENDING' && (
        <p>Администратор проверяет адрес, фото и услуги. Решение появится здесь.</p>
      )}
      {application.status === 'REJECTED' && application.rejectionReason && (
        <p className="apply-reason">Причина: {application.rejectionReason}</p>
      )}
      {application.status === 'APPROVED' &&
        (application.temporaryPassword ? (
          <div className="apply-login">
            <span className="apply-label">Вход владельца в «LanWash Бизнес»</span>
            <div className="apply-login-row">
              <div>
                <span>{displayPhone(application.phone)}</span>
                <strong>{application.temporaryPassword}</strong>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Скопировать временный пароль"
                onClick={() => {
                  navigator.clipboard
                    ?.writeText(application.temporaryPassword)
                    .then(() => setCopied(true))
                    .catch(() => setCopied(false))
                }}
              >
                {copied ? <Check size={19} /> : <Copy size={19} />}
              </button>
            </div>
            <span className="apply-hint">
              Это временный пароль — смените его в профиле после первого входа.
            </span>
          </div>
        ) : (
          <p>
            Мойка подключена.{' '}
            {application.existingOwnerId
              ? 'Она появилась в вашей сети в «LanWash Бизнес».'
              : 'Войдите в «LanWash Бизнес» по номеру телефона из заявки.'}
          </p>
        ))}
    </article>
  )
}

export default function ApplyForm({ onDirtyChange }: { onDirtyChange: (dirty: boolean) => void }) {
  const [ids, setIds] = useState<string[]>(readIds)
  const [view, setView] = useState<'list' | 'form'>(() => (readIds().length ? 'list' : 'form'))
  const [applications, setApplications] = useState<Application[] | null>(null)
  const [listError, setListError] = useState<string | null>(null)
  const [justSent, setJustSent] = useState(false)

  const [step, setStep] = useState(0)
  const [washName, setWashName] = useState('')
  const [address, setAddress] = useState('')
  const [posts, setPosts] = useState(2)
  const [description, setDescription] = useState('')
  const [services, setServices] = useState<ServiceDraft[]>(() => [newService()])
  const [logo, setLogo] = useState<Picture | null>(null)
  const [cover, setCover] = useState<Picture | null>(null)
  const [photos, setPhotos] = useState<Picture[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pictureError, setPictureError] = useState<string | null>(null)
  const body = useRef<HTMLDivElement>(null)

  const dirty = view === 'form' && (washName.trim() !== '' || address.trim() !== '')
  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange])

  useEffect(() => {
    if (view !== 'list' || !ids.length) return
    let active = true
    setListError(null)
    request<Application[]>('/v1/wash-applications?ids=' + ids.map(encodeURIComponent).join(','))
      .then((list) => {
        if (!active) return
        setApplications([...list].sort((a, b) => b.createdAt - a.createdAt))
      })
      .catch((reason: Error) => active && setListError(reason.message))
    return () => {
      active = false
    }
  }, [view, ids])

  useEffect(() => {
    body.current?.scrollTo({ top: 0 })
  }, [step, view])

  const missing: string[] = []
  if (step === 0) {
    if (length(washName) < 2) missing.push('название мойки')
    if (length(address) < 5) missing.push('адрес')
  } else if (step === 1) {
    if (!services.some((service) => !service.extra && serviceValid(service)))
      missing.push('основная услуга')
    if (services.some((service) => !serviceValid(service)))
      missing.push('название, цена или длительность у услуги')
  } else if (step === 3) {
    if (length(name) < 2) missing.push('имя')
    if (phone.length !== 10) missing.push('телефон')
    if (!consent) missing.push('согласие на обработку данных')
  }

  const updateService = (key: number, patch: Partial<ServiceDraft>) =>
    setServices((list) =>
      list.map((service) => (service.key === key ? { ...service, ...patch } : service)),
    )

  async function pick(files: FileList | null, mode: 'logo' | 'cover' | 'photo') {
    setPictureError(null)
    if (!files?.length) return
    try {
      if (mode === 'photo') {
        const room = maxPhotos - photos.length
        const added: Picture[] = []
        for (const file of [...files].slice(0, room)) {
          const blob = await prepareImage(file, 'photo')
          added.push({ key: nextKey++, blob, url: URL.createObjectURL(blob) })
        }
        setPhotos((list) => [...list, ...added])
        if (files.length > room) setPictureError(`Можно добавить не больше ${maxPhotos} фото`)
      } else {
        const blob = await prepareImage(files[0], mode)
        const picture = { key: nextKey++, blob, url: URL.createObjectURL(blob) }
        if (mode === 'logo') setLogo(picture)
        else setCover(picture)
      }
    } catch (reason) {
      setPictureError((reason as Error).message)
    }
  }

  // Загруженный файл запоминаем: при повторной отправке он не грузится второй раз.
  async function upload(picture: Picture, kind: 'logo' | 'cover' | 'application') {
    if (picture.mediaId) return picture.mediaId
    const form = new FormData()
    form.append('kind', kind)
    form.append('file', picture.blob, kind + '.jpg')
    const result = await request<{ id: string }>('/v1/media', { method: 'POST', body: form })
    picture.mediaId = result.id
    return result.id
  }

  async function submit() {
    setBusy(true)
    setError(null)
    try {
      const logoMediaId = logo ? await upload(logo, 'logo') : null
      const coverMediaId = cover ? await upload(cover, 'cover') : null
      const photoMediaIds: string[] = []
      for (const photo of photos) photoMediaIds.push(await upload(photo, 'application'))
      const application = await request<Application>('/v1/wash-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: name.trim(),
          phone: '+7' + phone,
          washName: washName.trim(),
          address: address.trim(),
          posts,
          services: services.map((service) => ({
            name: service.name.trim(),
            price: Number(service.price),
            description: service.description.trim(),
            extra: service.extra,
            durationMinutes: Number(service.duration),
          })),
          logoMediaId,
          coverMediaId,
          photoMediaIds,
          description: description.trim(),
        }),
      })
      const nextIds = [application.id, ...ids.filter((id) => id !== application.id)]
      saveIds(nextIds)
      setIds(nextIds)
      setApplications((list) => [application, ...(list || [])])
      setJustSent(true)
      setView('list')
      setStep(0)
      setWashName('')
      setAddress('')
      setPosts(2)
      setDescription('')
      setServices([newService()])
      setLogo(null)
      setCover(null)
      setPhotos([])
      setConsent(false)
    } catch (reason) {
      setError((reason as Error).message)
    } finally {
      setBusy(false)
    }
  }

  if (view === 'list') {
    return (
      <div className="apply" ref={body}>
        {justSent && (
          <div className="apply-sent">
            <span className="apply-sent-icon">
              <Check size={26} />
            </span>
            <div>
              <strong>Заявка отправлена</strong>
              <p>
                Решение и данные для входа появятся здесь — откройте «Подключить мойку» снова в этом
                браузере.
              </p>
            </div>
          </div>
        )}
        <h3 className="apply-title">Мои заявки</h3>
        <p className="apply-intro">Поданы из этого браузера.</p>
        {listError && (
          <p className="apply-error">
            <CircleAlert size={17} /> {listError}
          </p>
        )}
        {!applications && !listError && (
          <p className="apply-loading">
            <LoaderCircle size={18} className="apply-spin" /> Загружаем статус…
          </p>
        )}
        <div className="apply-cards">
          {applications?.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
        <div className="apply-actions">
          <a
            className="button button-quiet"
            href={siteConfig.businessRustoreUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Download size={18} /> «LanWash Бизнес» в RuStore
          </a>
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              setJustSent(false)
              setView('form')
            }}
          >
            <Plus size={18} /> Подключить ещё мойку
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="apply" ref={body}>
      <div className="apply-progress" aria-hidden="true">
        {steps.map((title, index) => (
          <span key={title} className={index <= step ? 'active' : ''} />
        ))}
      </div>
      <p className="apply-step">
        Шаг {step + 1} из {steps.length} · {steps[step]}
      </p>

      {step === 0 && (
        <div className="apply-stack">
          <p className="apply-intro">
            Заполните анкету — после проверки мойка появится на карте LanWash.
          </p>
          <Field label="Название мойки" hint="Так мойку увидят клиенты на карте">
            <input
              value={washName}
              maxLength={80}
              onChange={(event) => setWashName(event.target.value)}
              autoComplete="organization"
            />
          </Field>
          <Field label="Адрес" hint="Точку на карте уточнит администратор при проверке">
            <textarea
              value={address}
              maxLength={160}
              rows={2}
              onChange={(event) => setAddress(event.target.value)}
              autoComplete="street-address"
            />
          </Field>
          <div className="apply-posts">
            <div>
              <strong>Количество постов</strong>
              <span>Сколько машин моете одновременно</span>
            </div>
            <button
              type="button"
              className="apply-round"
              aria-label="Меньше постов"
              disabled={posts <= 1}
              onClick={() => setPosts(posts - 1)}
            >
              <Minus size={18} />
            </button>
            <output aria-live="polite">{posts}</output>
            <button
              type="button"
              className="apply-round"
              aria-label="Больше постов"
              disabled={posts >= 20}
              onClick={() => setPosts(posts + 1)}
            >
              <Plus size={18} />
            </button>
          </div>
          <Field label="Описание мойки" hint={`Необязательно · ${length(description)} / 500`}>
            <textarea
              value={description}
              maxLength={500}
              rows={3}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="apply-stack">
          <p className="apply-intro">
            Клиент выбирает одну основную услугу и сколько угодно дополнительных.
          </p>
          {services.map((service, index) => {
            const price = Number(service.price)
            const priceBad = service.price !== '' && !(price >= 1 && price <= 100_000)
            const duration = Number(service.duration)
            const durationBad = service.duration !== '' && !(duration >= 5 && duration <= 480)
            return (
              <fieldset className="apply-service" key={service.key}>
                <legend>Услуга {index + 1}</legend>
                {services.length > 1 && (
                  <button
                    type="button"
                    className="icon-button apply-remove"
                    aria-label={`Удалить услугу ${index + 1}`}
                    onClick={() =>
                      setServices((list) => list.filter((item) => item.key !== service.key))
                    }
                  >
                    <Trash2 size={18} strokeWidth={1.6} />
                  </button>
                )}
                <div className="apply-segmented" role="group" aria-label="Тип услуги">
                  {[
                    [false, 'Основная'],
                    [true, 'Дополнительная'],
                  ].map(([extra, label]) => (
                    <button
                      type="button"
                      key={String(extra)}
                      aria-pressed={service.extra === extra}
                      onClick={() => updateService(service.key, { extra: extra as boolean })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="apply-row">
                  <Field label="Услуга">
                    <input
                      value={service.name}
                      maxLength={60}
                      onChange={(event) => updateService(service.key, { name: event.target.value })}
                    />
                  </Field>
                  <Field label="Цена, ₽" error={priceBad ? 'От 1 до 100 000 ₽' : null}>
                    <input
                      value={service.price}
                      inputMode="numeric"
                      onChange={(event) =>
                        updateService(service.key, {
                          price: event.target.value.replace(/\D/g, '').slice(0, 6),
                        })
                      }
                    />
                  </Field>
                </div>
                <div className="apply-field">
                  <label className="apply-label" htmlFor={`service-duration-${service.key}`}>
                    Длительность
                  </label>
                  <div className="apply-duration">
                    <input
                      id={`service-duration-${service.key}`}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={3}
                      value={service.duration}
                      onChange={(event) =>
                        updateService(service.key, {
                          duration: event.target.value.replace(/\D/g, '').slice(0, 3),
                        })
                      }
                    />
                    <span>мин</span>
                  </div>
                  <span className={durationBad ? 'apply-hint apply-hint-error' : 'apply-hint'}>
                    От 5 до 480 минут
                  </span>
                </div>
                <Field
                  label="Описание услуги"
                  hint={`Необязательно · ${length(service.description)} / 120`}
                >
                  <input
                    value={service.description}
                    maxLength={120}
                    onChange={(event) =>
                      updateService(service.key, { description: event.target.value })
                    }
                  />
                </Field>
              </fieldset>
            )
          })}
          <button
            type="button"
            className="button apply-add"
            disabled={services.length >= 50}
            onClick={() => setServices((list) => [...list, newService()])}
          >
            <Plus size={18} /> Добавить услугу
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="apply-stack">
          <div className="apply-brand">
            <span className="apply-logo-preview">
              {logo ? (
                <img src={logo.url} alt="Логотип мойки" width={84} height={84} />
              ) : (
                ([...washName.trim()][0] || 'LW').toUpperCase()
              )}
            </span>
            <div>
              <strong>Логотип мойки</strong>
              <span>Кадрируем по кругу — так логотип появится на пине карты.</span>
              <div className="apply-inline">
                <label className="button button-quiet apply-file">
                  <ImagePlus size={18} /> {logo ? 'Заменить' : 'Добавить логотип'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => {
                      void pick(event.target.files, 'logo')
                      event.target.value = ''
                    }}
                  />
                </label>
                {logo && (
                  <button
                    type="button"
                    className="text-link apply-danger"
                    onClick={() => setLogo(null)}
                  >
                    Удалить
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="apply-field">
            <span className="apply-label">Фото шапки (необязательно)</span>
            <div className="apply-cover">
              {cover ? (
                <img src={cover.url} alt="Фото шапки мойки" width={1600} height={900} />
              ) : (
                <span>Фото мойки снаружи, 16 : 9</span>
              )}
            </div>
            <div className="apply-inline">
              <label className="button button-quiet apply-file">
                <ImagePlus size={18} /> {cover ? 'Заменить фото' : 'Добавить фото шапки'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    void pick(event.target.files, 'cover')
                    event.target.value = ''
                  }}
                />
              </label>
              {cover && (
                <button
                  type="button"
                  className="text-link apply-danger"
                  onClick={() => setCover(null)}
                >
                  Удалить
                </button>
              )}
            </div>
          </div>
          <div className="apply-field">
            <span className="apply-label">Фото мойки для проверки</span>
            <span className="apply-hint">
              Пост изнутри и вывеска с адресом — так проверка пройдёт быстрее. Клиенты эти фото не
              увидят.
            </span>
            <div className="apply-photos">
              {photos.map((photo, index) => (
                <span className="apply-photo" key={photo.key}>
                  <img src={photo.url} alt={`Фото ${index + 1}`} width={96} height={96} />
                  <button
                    type="button"
                    aria-label={`Удалить фото ${index + 1}`}
                    onClick={() =>
                      setPhotos((list) => list.filter((item) => item.key !== photo.key))
                    }
                  >
                    <X size={15} />
                  </button>
                </span>
              ))}
              {photos.length < maxPhotos && (
                <label className="apply-photo-add">
                  <ImagePlus size={20} strokeWidth={1.6} />
                  Добавить
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(event) => {
                      void pick(event.target.files, 'photo')
                      event.target.value = ''
                    }}
                  />
                </label>
              )}
            </div>
          </div>
          {pictureError && (
            <p className="apply-error">
              <CircleAlert size={17} /> {pictureError}
            </p>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="apply-stack">
          <h4 className="apply-subtitle">Как с вами связаться</h4>
          <div className="apply-row">
            <Field label="Ваше имя">
              <input
                value={name}
                maxLength={60}
                autoComplete="name"
                onChange={(event) => setName(event.target.value)}
              />
            </Field>
            <Field label="Телефон">
              <input
                value={phoneText(phone)}
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7 (___) ___-__-__"
                onChange={(event) => setPhone(phoneDigits(event.target.value))}
              />
            </Field>
          </div>
          <p className="apply-hint">
            После одобрения будет создан аккаунт владельца: логин — указанный телефон, временный
            пароль появится в этой заявке.
          </p>
          <h4 className="apply-subtitle">Проверьте заявку</h4>
          <dl className="apply-review">
            <div>
              <dt>{washName.trim() || '—'}</dt>
              <dd>
                {address.trim()} · {posts} {posts === 1 ? 'пост' : posts < 5 ? 'поста' : 'постов'}
              </dd>
              <button type="button" className="text-link" onClick={() => setStep(0)}>
                Изменить
              </button>
            </div>
            <div>
              <dt>Услуги: {services.length}</dt>
              <dd>
                {services
                  .map(
                    (service) =>
                      `${service.name.trim()} ${money(Number(service.price))}, ${durationText(Number(service.duration))}`,
                  )
                  .join(' · ')}
              </dd>
              <button type="button" className="text-link" onClick={() => setStep(1)}>
                Изменить
              </button>
            </div>
            <div>
              <dt>Оформление и фото</dt>
              <dd>
                {[logo && 'логотип', cover && 'шапка', `фото для проверки: ${photos.length}`]
                  .filter(Boolean)
                  .join(' · ')}
              </dd>
              <button type="button" className="text-link" onClick={() => setStep(2)}>
                Изменить
              </button>
            </div>
          </dl>
          {!photos.length && (
            <p className="apply-warning">
              <CircleAlert size={17} /> Без фото поста и вывески администратор может вернуть заявку.
            </p>
          )}
          <label className="apply-consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span>
              Согласен на обработку персональных данных в соответствии с{' '}
              <a href={import.meta.env.BASE_URL + 'privacy.html'} target="_blank" rel="noreferrer">
                политикой конфиденциальности
              </a>{' '}
              и принимаю{' '}
              <a href={import.meta.env.BASE_URL + 'terms.html'} target="_blank" rel="noreferrer">
                пользовательское соглашение
              </a>
              .
            </span>
          </label>
          {error && (
            <p className="apply-error" role="alert">
              <CircleAlert size={17} /> {error}
            </p>
          )}
        </div>
      )}

      <div className="apply-footer">
        {step > 0 ? (
          <button
            type="button"
            className="button button-quiet"
            disabled={busy}
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft size={18} /> Назад
          </button>
        ) : ids.length ? (
          <button type="button" className="button button-quiet" onClick={() => setView('list')}>
            <ArrowLeft size={18} /> Мои заявки
          </button>
        ) : (
          <span />
        )}
        {step < steps.length - 1 ? (
          <button
            type="button"
            className="button button-primary"
            disabled={missing.length > 0}
            onClick={() => setStep(step + 1)}
          >
            Далее: {steps[step + 1].toLowerCase()} <ArrowRight size={18} />
          </button>
        ) : (
          <button
            type="button"
            className="button button-primary"
            disabled={missing.length > 0 || busy}
            onClick={() => void submit()}
          >
            {busy ? (
              <>
                <LoaderCircle size={18} className="apply-spin" /> Отправляем…
              </>
            ) : (
              <>
                <Send size={18} /> Отправить заявку
              </>
            )}
          </button>
        )}
      </div>
      {missing.length > 0 && <p className="apply-missing">Осталось: {missing.join(', ')}</p>}
    </div>
  )
}
