import { useState } from 'react'
import { KINDS, WASTE_REASONS, realCost, wasteValue } from './stockData'
import { isoToShort, num, price } from './format'

export default function WasteForm({ items, waste, onSave }) {
  const [itemId, setItemId] = useState('enoki')
  const [qty, setQty] = useState('100')
  const [reason, setReason] = useState(WASTE_REASONS[0])

  const item = items.find((i) => i.id === itemId)
  const unit = KINDS[item.kind].small
  const q = Number(qty)
  const tooMuch = q > item.qty
  const valid = q > 0 && !tooMuch
  const value = q > 0 ? q * realCost(item) : 0

  function handleSubmit(e) {
    e.preventDefault()
    if (!valid) return
    onSave({ itemId, qty: q, reason })
    setQty('')
  }

  return (
    <form className="st-card st-waste" onSubmit={handleSubmit}>
      <h2 className="st-card-title">บันทึกของเสีย</h2>

      <div className="st-row-2">
        <label className="st-field">
          <span>วัตถุดิบ</span>
          <select className="st-input" value={itemId} onChange={(e) => setItemId(e.target.value)}>
            {items.map((i) => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
        </label>
        <label className="st-field">
          <span>ปริมาณ ({unit})</span>
          <input
            className="st-input"
            type="number"
            min="0"
            step="any"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            aria-invalid={tooMuch}
          />
        </label>
      </div>
      {tooMuch && (
        <p className="st-error st-small">
          มากกว่าคงเหลือ ({num(item.qty)} {unit})
        </p>
      )}

      <div className="st-pills" role="radiogroup" aria-label="สาเหตุ">
        {WASTE_REASONS.map((r) => (
          <button
            key={r}
            type="button"
            role="radio"
            aria-checked={reason === r}
            className={`st-pill${reason === r ? ' is-active' : ''}`}
            onClick={() => setReason(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="st-waste-submit">
        <span>
          มูลค่าที่เสีย <strong className="st-neg">{price(value, 2)}</strong>
        </span>
        <button type="submit" className="st-btn" disabled={!valid}>บันทึกของเสีย</button>
      </div>

      <ul className="st-waste-list">
        {waste.map((w) => {
          const it = items.find((i) => i.id === w.itemId)
          return (
            <li key={w.id}>
              <span>
                {isoToShort(w.date)} · {it.name} {num(w.qty)} {KINDS[it.kind].small}{' '}
                <span className="st-muted">({w.reason})</span>
              </span>
              <strong className="st-neg">−{price(w.value ?? wasteValue(w, items), 2)}</strong>
            </li>
          )
        })}
      </ul>
    </form>
  )
}
