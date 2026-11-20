import { mainUnit, unitPrice } from './ingredientsData'
import { isoToShort } from './format'

const fmt = (n) => (Number.isInteger(Math.round(n * 100) / 100) ? String(Math.round(n)) : n.toFixed(2))

/** Last `limit` purchase prices of one ingredient; the latest bar is highlighted. */
export default function PriceHistoryChart({ ingredient, limit = 5 }) {
  const items = ingredient.purchases.slice(-limit).map((x, i) => ({ key: `${x.date}-${i}`, date: x.date, value: unitPrice(x) }))
  const max = Math.max(1, ...items.map((i) => i.value))

  return (
    <section className="ig-card">
      <h2 className="ig-card-title">
        ราคา{ingredient.name}ย้อนหลัง (บาท/{mainUnit(ingredient)})
      </h2>
      <div className="ig-chart" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((it, idx) => {
          const latest = idx === items.length - 1
          return (
            <div key={it.key} className={`ig-chart-col${latest ? ' is-latest' : ''}`}>
              <div className="ig-chart-track">
                <span className="ig-chart-value">{fmt(it.value)}</span>
                <div className="ig-chart-bar" style={{ height: `${(it.value / max) * 100}%` }} />
              </div>
              <span className="ig-chart-label">{isoToShort(it.date)}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
