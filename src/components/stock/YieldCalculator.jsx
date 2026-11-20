import { useEffect, useState } from 'react'
import { KINDS } from './stockData'
import { price } from './format'

/** Weigh before/after trimming once → yield %, saved to the ingredient for future costing. */
export default function YieldCalculator({ items, onApply }) {
  const measurable = items.filter((i) => i.kind !== 'count')
  const [itemId, setItemId] = useState(measurable[0].id)
  const [paid, setPaid] = useState('320')
  const [bought, setBought] = useState('2000')
  const [usable, setUsable] = useState('1900')
  const [saved, setSaved] = useState('')

  useEffect(() => {
    if (!saved) return
    const t = setTimeout(() => setSaved(''), 2500)
    return () => clearTimeout(t)
  }, [saved])

  const item = items.find((i) => i.id === itemId)
  const unit = KINDS[item.kind].small
  const p = Number(paid)
  const b = Number(bought)
  const u = Number(usable)
  const valid = p > 0 && b > 0 && u > 0 && u <= b
  const yieldPct = valid ? (u / b) * 100 : null
  const rawCost = valid ? p / b : null
  const realCost = valid ? p / u : null
  const underestimate = valid ? (realCost / rawCost - 1) * 100 : null

  return (
    <section className="st-card st-yield">
      <h2 className="st-card-title">คำนวณ % ใช้ได้ (Yield)</h2>
      <p className="st-muted st-small">ชั่งก่อนและหลังตัดแต่ง/ล้าง 1 ครั้ง ระบบจะจำ % ไว้ใช้กับการซื้อครั้งต่อไป</p>

      <label className="st-field">
        <span>วัตถุดิบ</span>
        <select className="st-input" value={itemId} onChange={(e) => setItemId(e.target.value)}>
          {measurable.map((i) => (
            <option key={i.id} value={i.id}>{i.name}</option>
          ))}
        </select>
      </label>

      <div className="st-row-3">
        <label className="st-field">
          <span>ราคาที่จ่าย</span>
          <input className="st-input" type="number" min="0" step="any" value={paid} onChange={(e) => setPaid(e.target.value)} />
        </label>
        <label className="st-field">
          <span>{item.kind === 'volume' ? 'ปริมาณซื้อ' : 'น้ำหนักซื้อ'} ({unit})</span>
          <input className="st-input" type="number" min="0" step="any" value={bought} onChange={(e) => setBought(e.target.value)} />
        </label>
        <label className="st-field">
          <span>ใช้ได้จริง ({unit})</span>
          <input className="st-input" type="number" min="0" step="any" value={usable} onChange={(e) => setUsable(e.target.value)} />
        </label>
      </div>

      <div className="st-dark">
        <div>
          <small>% ใช้ได้</small>
          <strong>{valid ? `${yieldPct.toFixed(1)}%` : '—'}</strong>
        </div>
        <div>
          <small>ต้นทุน/{unit === 'ก.' ? 'กรัม' : unit} (ถ้าไม่คิด)</small>
          <strong className="st-dark-muted">{valid ? price(rawCost, 3) : '—'}</strong>
        </div>
        <div>
          <small>ต้นทุนจริง/{unit === 'ก.' ? 'กรัม' : unit}</small>
          <strong className="st-dark-accent">{valid ? price(realCost, 3) : '—'}</strong>
        </div>
      </div>

      {valid ? (
        <p className="st-muted st-small">
          ถ้าไม่คิด % ใช้ได้ ต้นทุน{item.name}จะต่ำกว่าจริง {underestimate.toFixed(1)}%
        </p>
      ) : (
        <p className="st-error st-small">น้ำหนักที่ใช้ได้ต้องไม่เกินน้ำหนักที่ซื้อ และทุกช่องต้องมากกว่า 0</p>
      )}

      <div className="st-yield-actions">
        <button
          type="button"
          className="st-btn-outline"
          disabled={!valid}
          onClick={() => {
            onApply(item.id, u / b)
            setSaved(`จำ ${yieldPct.toFixed(1)}% ให้${item.name}แล้ว`)
          }}
        >
          ใช้ % นี้กับ{item.name}
        </button>
        <span className="st-saved" role="status">{saved}</span>
      </div>
    </section>
  )
}
