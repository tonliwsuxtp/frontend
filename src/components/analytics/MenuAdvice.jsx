import { QUADRANTS } from './analyticsData'
import { price } from '../ingredients/format'

const ORDER = { keep: 0, adjust: 1, promote: 2, cut: 3 }

export default function MenuAdvice({ rows }) {
  const sorted = [...rows].sort((a, b) => ORDER[a.quadrant] - ORDER[b.quadrant] || b.sold - a.sold)
  return (
    <section className="an-card">
      <h2 className="an-card-title">คำแนะนำรายเมนู</h2>
      <ul className="an-advice">
        {sorted.map((r) => (
          <li key={r.id}>
            <div className="an-advice-head">
              <strong>{r.name}</strong>
              <span className={`an-badge is-${r.quadrant}`}>{QUADRANTS[r.quadrant].label}</span>
            </div>
            <p className="an-muted an-small">
              ขาย {r.sold} ชุด · กำไร {price(r.profitPerSet, 2)}/ชุด · รวม {price(Math.round(r.total), 0)}
            </p>
            <p className="an-small">{r.advice}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
