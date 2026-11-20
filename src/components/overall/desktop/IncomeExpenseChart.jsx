import { formatBaht } from '../dateUtils'

/** items: [{ key, label, income, expense }] */
export default function IncomeExpenseChart({ title, items, footnote }) {
  const max = Math.max(1, ...items.flatMap((i) => [i.income, i.expense]))
  const pct = (v) => `${(v / max) * 100}%`

  return (
    <section className="ovd-card ovd-panel">
      <div className="ovd-panel-head">
        <h2 className="ovd-panel-title">{title}</h2>
        <div className="ovd-legend">
          <span><i className="ovd-swatch ovd-bg-income" />รายรับ</span>
          <span><i className="ovd-swatch ovd-bg-expense" />รายจ่าย</span>
        </div>
      </div>

      <div className="ovd-chart" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map((i) => (
          <div key={i.key} className="ovd-chart-col">
            <div className="ovd-chart-bars">
              <div
                className="ovd-bar ovd-bg-income"
                style={{ height: pct(i.income) }}
                title={`${i.label} · รายรับ ${formatBaht(i.income)}`}
              />
              <div
                className="ovd-bar ovd-bg-expense"
                style={{ height: pct(i.expense) }}
                title={`${i.label} · รายจ่าย ${formatBaht(i.expense)}`}
              />
            </div>
            <span className="ovd-chart-label">{i.label}</span>
          </div>
        ))}
      </div>

      {footnote && <p className="ovd-footnote">{footnote}</p>}
    </section>
  )
}
