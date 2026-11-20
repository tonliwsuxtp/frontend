import { ingredientStats, mainUnit } from './ingredientsData'
import { changeInfo, isoToShort, price } from './format'

export default function PriceTable({ ingredients, selectedId, onSelect }) {
  return (
    <section className="ig-card">
      <div className="ig-card-head">
        <h2 className="ig-card-title">ราคาวัตถุดิบ</h2>
        <span className="ig-muted ig-small">ต้นทุนเมนูใช้ “ราคาเฉลี่ย 3 ครั้งล่าสุด”</span>
      </div>

      <div className="ig-table-wrap">
        <table className="ig-table">
          <thead>
            <tr>
              <th>วัตถุดิบ</th>
              <th className="ig-num">ล่าสุด</th>
              <th className="ig-num">เฉลี่ย 3 ครั้ง</th>
              <th className="ig-num">เปลี่ยนแปลง</th>
              <th>ซื้อล่าสุด</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ing) => {
              const s = ingredientStats(ing)
              const c = changeInfo(s.change)
              const unit = mainUnit(ing)
              return (
                <tr
                  key={ing.id}
                  className={ing.id === selectedId ? 'is-selected' : undefined}
                  onClick={() => onSelect(ing.id)}
                  title="ดูราคาย้อนหลัง"
                >
                  <td className="ig-strong">{ing.name}</td>
                  <td className="ig-num">{s.latest === null ? '—' : `${price(s.latest)} / ${unit}`}</td>
                  <td className="ig-num ig-strong">{s.avg3 === null ? '—' : `${price(s.avg3)} / ${unit}`}</td>
                  <td className={`ig-num ig-change is-${c.tone}`}>
                    {c.arrow} {c.text}
                  </td>
                  <td className="ig-muted">{s.last ? `${isoToShort(s.last.date)} · ${s.last.store}` : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
