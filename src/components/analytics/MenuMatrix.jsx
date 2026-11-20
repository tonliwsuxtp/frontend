import { QUADRANTS } from './analyticsData'

const PAD = 14 // % padding inside the plot so dots never touch the edges

/** Scatter: x = sets sold, y = profit per set; dashed lines at the averages split 4 quadrants. */
export default function MenuMatrix({ rows, avgSold, avgProfit }) {
  const xs = rows.map((r) => r.sold).concat(avgSold)
  const ys = rows.map((r) => r.profitPerSet).concat(avgProfit)
  const [minX, maxX] = [Math.min(...xs), Math.max(...xs)]
  const [minY, maxY] = [Math.min(...ys), Math.max(...ys)]
  const scale = (v, lo, hi) => (hi === lo ? 50 : PAD + ((v - lo) / (hi - lo)) * (100 - PAD * 2))
  const x = (v) => scale(v, minX, maxX)
  const y = (v) => 100 - scale(v, minY, maxY)

  return (
    <section className="an-card">
      <h2 className="an-card-title">วิเคราะห์เมนู (30 วันล่าสุด)</h2>
      <p className="an-muted an-desc">
        แกนนอน = จำนวนที่ขาย · แกนตั้ง = กำไรต่อชุด (หลังหัก GP ค่าหักอื่นจากแอป และวัตถุดิบ) · เส้นประ = ค่าเฉลี่ย
      </p>

      <div className="an-matrix" role="img" aria-label="กราฟจำนวนขายเทียบกำไรต่อชุดของแต่ละเมนู">
        <span className="an-q an-q-tl is-promote">{QUADRANTS.promote.hint}</span>
        <span className="an-q an-q-tr is-keep">{QUADRANTS.keep.hint}</span>
        <span className="an-q an-q-bl is-cut">{QUADRANTS.cut.hint}</span>
        <span className="an-q an-q-br is-adjust">{QUADRANTS.adjust.hint}</span>

        <i className="an-avg-x" style={{ left: `${x(avgSold)}%` }} />
        <i className="an-avg-y" style={{ top: `${y(avgProfit)}%` }} />

        {rows.map((r) => {
          const left = x(r.sold)
          return (
            <div
              key={r.id}
              className={`an-dot is-${r.quadrant}${left > 70 ? ' is-flip' : ''}`}
              style={{ left: `${left}%`, top: `${y(r.profitPerSet)}%` }}
              title={`${r.name}: ขาย ${r.sold} ชุด · กำไร ฿${r.profitPerSet.toFixed(2)}/ชุด`}
            >
              <i />
              <span>{r.name}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
