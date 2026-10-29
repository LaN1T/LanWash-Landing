import './device-phone.css'

const asset = (path: string) => import.meta.env.BASE_URL + path

type Tilt = 'left' | 'right' | 'none'

/**
 * Samsung Galaxy A17: светлая рамка, чёрное стекло с тонкими полями, каплевидный вырез Infinity-U
 * по центру верхней кромки, кнопки громкости и питания на правом торце.
 * Экран 1080 × 2340 (19,5 : 9) — скриншот в пропорции 720 × 1560. Более высокий снимок обрезается
 * снизу, по полосе жестов. Скриншот наклоняется вместе с корпусом, вырез всегда поверх него.
 */
export default function DevicePhone({
  image,
  alt,
  tilt = 'left',
  className = '',
  priority = false,
}: {
  image: string
  alt: string
  tilt?: Tilt
  className?: string
  priority?: boolean
}) {
  return (
    <span className={`device device-tilt-${tilt} ${className}`.trim()}>
      <span className="device-body">
        {/* Торец виден при наклоне: при повороте влево — правый, с кнопками; вправо — левый, гладкий. */}
        {tilt !== 'none' && (
          <span className="device-edge" aria-hidden="true">
            {tilt === 'left' && (
              <span className="device-keys">
                <span className="device-key device-key-volume" />
                <span className="device-key device-key-power" />
              </span>
            )}
          </span>
        )}
        <span className="device-glass">
          <span className="device-screen">
            <img
              src={asset('images/' + image)}
              alt={alt}
              width={720}
              height={1560}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              decoding="async"
            />
            <svg className="device-notch" viewBox="0 0 100 34" aria-hidden="true" focusable="false">
              <path
                d="M0 0H100C88.5 0 84 2.6 80.4 9.4C75.2 19.6 63.7 28.8 50 28.8C36.3 28.8 24.8 19.6 19.6 9.4C16 2.6 11.5 0 0 0Z"
                fill="#0b0c0e"
              />
              <circle cx="50" cy="13.6" r="6.4" fill="#14171c" />
              <circle cx="50" cy="13.6" r="3.2" fill="#1d2633" />
              <circle cx="48.6" cy="12.2" r="1" fill="#ffffff" opacity="0.22" />
            </svg>
          </span>
        </span>
      </span>
    </span>
  )
}
