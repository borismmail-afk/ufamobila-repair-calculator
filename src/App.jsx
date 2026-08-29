import { useMemo, useState } from 'react'
import './App.css'

const devices = [
  { id: 'phone', label: 'Смартфон', base: 900 },
  { id: 'tablet', label: 'Планшет', base: 1300 },
  { id: 'laptop', label: 'Ноутбук', base: 2200 },
]

const brands = [
  { id: 'apple', label: 'Apple', multiplier: 1.35 },
  { id: 'samsung', label: 'Samsung', multiplier: 1.2 },
  { id: 'xiaomi', label: 'Xiaomi', multiplier: 1 },
  { id: 'other', label: 'Другой бренд', multiplier: 0.95 },
]

const repairs = [
  { id: 'screen', label: 'Замена дисплея', price: 4200, days: 2 },
  { id: 'battery', label: 'Замена аккумулятора', price: 1900, days: 1 },
  { id: 'charge', label: 'Ремонт разъема зарядки', price: 2400, days: 1 },
  { id: 'cleaning', label: 'Диагностика и чистка', price: 800, days: 1 },
]

const urgencyOptions = [
  { id: 'standard', label: 'Обычный срок', extra: 0, daysShift: 0 },
  { id: 'fast', label: 'Срочно', extra: 900, daysShift: -1 },
]

const extraServices = [
  { id: 'glass', label: 'Защитное стекло', price: 600 },
  { id: 'backup', label: 'Резервная копия данных', price: 700 },
  { id: 'courier', label: 'Курьер по Уфе', price: 500 },
]

const formatPrice = (value) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)

const telegramUser = 'BorM2'

function App() {
  const [deviceId, setDeviceId] = useState(devices[0].id)
  const [brandId, setBrandId] = useState(brands[2].id)
  const [repairId, setRepairId] = useState(repairs[0].id)
  const [urgencyId, setUrgencyId] = useState(urgencyOptions[0].id)
  const [selectedExtras, setSelectedExtras] = useState([])

  const estimate = useMemo(() => {
    const device = devices.find((item) => item.id === deviceId)
    const brand = brands.find((item) => item.id === brandId)
    const repair = repairs.find((item) => item.id === repairId)
    const urgency = urgencyOptions.find((item) => item.id === urgencyId)
    const extras = extraServices.filter((item) =>
      selectedExtras.includes(item.id),
    )

    const extrasPrice = extras.reduce((sum, item) => sum + item.price, 0)
    const workPrice = Math.round((device.base + repair.price) * brand.multiplier)
    const total = workPrice + extrasPrice + urgency.extra
    const days = Math.max(1, repair.days + urgency.daysShift)

    return { brand, days, device, extras, repair, total, urgency }
  }, [brandId, deviceId, repairId, selectedExtras, urgencyId])

  const toggleExtra = (extraId) => {
    setSelectedExtras((current) =>
      current.includes(extraId)
        ? current.filter((id) => id !== extraId)
        : [...current, extraId],
    )
  }

  const consultationText = useMemo(() => {
    const extrasText = estimate.extras.length
      ? estimate.extras.map((item) => item.label).join(', ')
      : 'без дополнительных услуг'

    return [
      'Здравствуйте! Хочу уточнить стоимость ремонта.',
      `Устройство: ${estimate.device.label}`,
      `Бренд: ${estimate.brand.label}`,
      `Работа: ${estimate.repair.label}`,
      `Дополнительно: ${extrasText}`,
      `Срок: ${estimate.days} день`,
      `Предварительная цена: ${formatPrice(estimate.total)}`,
    ].join('\n')
  }, [estimate])

  const telegramUrl = `https://t.me/${telegramUser}`

  return (
    <main className="app-shell">
      <section className="intro">
        <div>
          <p className="eyebrow">UfaMobila</p>
          <h1>Калькулятор ремонта техники</h1>
          <p className="intro-text">
            Быстро посчитайте ориентировочную стоимость ремонта и срок
            выполнения для клиента перед обращением в сервис.
          </p>
        </div>
        <div className="service-preview" aria-label="Сервисный центр">
          <div className="phone-visual">
            <span></span>
            <strong>Диагностика</strong>
            <small>15 минут</small>
          </div>
          <div className="preview-copy">
            <span>Уфа</span>
            <strong>Ремонт телефонов, планшетов и ноутбуков</strong>
          </div>
        </div>
      </section>

      <section className="calculator" aria-label="Калькулятор ремонта">
        <form className="controls">
          <fieldset>
            <legend>Тип устройства</legend>
            <div className="segmented">
              {devices.map((device) => (
                <button
                  className={device.id === deviceId ? 'active' : ''}
                  key={device.id}
                  onClick={() => setDeviceId(device.id)}
                  type="button"
                >
                  {device.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label>
            Бренд
            <select value={brandId} onChange={(event) => setBrandId(event.target.value)}>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Что нужно сделать
            <select
              value={repairId}
              onChange={(event) => setRepairId(event.target.value)}
            >
              {repairs.map((repair) => (
                <option key={repair.id} value={repair.id}>
                  {repair.label}
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend>Срок</legend>
            <div className="segmented">
              {urgencyOptions.map((urgency) => (
                <button
                  className={urgency.id === urgencyId ? 'active' : ''}
                  key={urgency.id}
                  onClick={() => setUrgencyId(urgency.id)}
                  type="button"
                >
                  {urgency.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Дополнительно</legend>
            <div className="extras">
              {extraServices.map((service) => (
                <label className="extra-row" key={service.id}>
                  <input
                    checked={selectedExtras.includes(service.id)}
                    onChange={() => toggleExtra(service.id)}
                    type="checkbox"
                  />
                  <span>{service.label}</span>
                  <strong>{formatPrice(service.price)}</strong>
                </label>
              ))}
            </div>
          </fieldset>
        </form>

        <aside className="estimate">
          <p className="eyebrow">Предварительный расчет</p>
          <strong className="price">{formatPrice(estimate.total)}</strong>
          <p className="deadline">Срок: {estimate.days} день</p>

          <dl>
            <div>
              <dt>Устройство</dt>
              <dd>{estimate.device.label}</dd>
            </div>
            <div>
              <dt>Бренд</dt>
              <dd>{estimate.brand.label}</dd>
            </div>
            <div>
              <dt>Работа</dt>
              <dd>{estimate.repair.label}</dd>
            </div>
            <div>
              <dt>Срочность</dt>
              <dd>{estimate.urgency.label}</dd>
            </div>
          </dl>

          <a className="cta" href={telegramUrl} rel="noreferrer" target="_blank">
            Написать в Telegram
          </a>
          <p className="contact-copy">{consultationText}</p>
          <p className="note">
            Итоговая цена зависит от модели, наличия запчастей и состояния
            устройства после диагностики.
          </p>
        </aside>
      </section>
    </main>
  )
}

export default App
