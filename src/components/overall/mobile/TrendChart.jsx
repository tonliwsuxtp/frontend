import { formatNumber } from '../dateUtils'

const TITLES = { day: '7 วันล่าสุด', month: '7 เดือนล่าสุด', year: '7 ปีล่าสุด' }

/** items: [{ key, label, income, expense }] */
export default function TrendChart({ period, items }) {
  const max = Math.max(1, ...items.flatMap((i) => [i.income, i.expense]))
  const pct = (v) => `${(v / max) * 100}%`

  return (
    <section className="ov-card">
      <div className="ov-chart-head">
        <h2 className="ov-card-title">{TITLES[period]}</h2>
        <div className="ov-legend">
          <span><i className="ov-swatch ov-bg-income" />รายรับ</span>
          <span><i className="ov-swatch ov-bg-expense" />รายจ่าย</span>
        </div>
      </div>

      <div className="ov-chart">
        {items.map((i) => (
          <div key={i.key} className="ov-chart-col">
            <div className="ov-chart-bars">
              <div
                className="ov-bar ov-bg-income"
                style={{ height: pct(i.income) }}
                title={`รายรับ ${formatNumber(i.income)}`}
              />
              <div
                className="ov-bar ov-bg-expense"
                style={{ height: pct(i.expense) }}
                title={`รายจ่าย ${formatNumber(i.expense)}`}
              />
            </div>
            <span className="ov-chart-label">{i.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
