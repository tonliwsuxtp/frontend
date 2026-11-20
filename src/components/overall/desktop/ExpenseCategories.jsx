import { PERIOD_SUFFIX, formatBaht } from '../dateUtils'

export default function ExpenseCategories({ period, categories }) {
  const rows = Object.entries(categories).sort((a, b) => b[1] - a[1])
  const max = Math.max(1, ...rows.map(([, v]) => v))

  return (
    <section className="ovd-card ovd-panel">
      <h2 className="ovd-panel-title">รายจ่ายแยกหมวด{PERIOD_SUFFIX[period]}</h2>
      <ul className="ovd-cats">
        {rows.map(([name, value]) => (
          <li key={name}>
            <div className="ovd-cat-row">
              <span>{name}</span>
              <strong>{formatBaht(value)}</strong>
            </div>
            <div className="ovd-track">
              <span style={{ width: `${(value / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
