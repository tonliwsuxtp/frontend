import { useEffect, useState } from 'react'
import { PURCHASE_DATE, UNIT_KINDS, mainUnit, percentChange, purchaseBefore, unitPrice } from './ingredientsData'
import { changeInfo, price } from './format'

export default function PurchaseForm({ ingredients, selectedId, onSelect, onSave }) {
  const ing = ingredients.find((i) => i.id === selectedId)
  const kind = UNIT_KINDS[ing.kind]

  const [store, setStore] = useState('')
  const [qty, setQty] = useState('2')
  const [unitId, setUnitId] = useState(kind.units[0].id)
  const [total, setTotal] = useState('320')
  const [asExpense, setAsExpense] = useState(true)
  const [saved, setSaved] = useState('')

  useEffect(() => {
    if (!saved) return
    const t = setTimeout(() => setSaved(''), 3000)
    return () => clearTimeout(t)
  }, [saved])

  function changeIngredient(id) {
    const next = ingredients.find((i) => i.id === id)
    onSelect(id)
    setUnitId(UNIT_KINDS[next.kind].units[0].id)
  }

  const unit = kind.units.find((u) => u.id === unitId) ?? kind.units[0]
  const qtyMain = Number(qty) * unit.factor
  const totalNum = Number(total)
  const valid = qtyMain > 0 && totalNum > 0
  const perMain = valid ? totalNum / qtyMain : null

  const prev = purchaseBefore(ing, PURCHASE_DATE)
  const prevPrice = prev ? unitPrice(prev) : null
  const change = valid && prevPrice ? changeInfo(percentChange(perMain, prevPrice)) : null

  function handleSubmit(e) {
    e.preventDefault()
    if (!valid) return
    onSave(ing.id, { date: PURCHASE_DATE, store: store.trim() || 'ไม่ระบุร้าน', qty: qtyMain, total: totalNum })
    setSaved(
      asExpense
        ? `บันทึกแล้ว · เพิ่มรายจ่ายวัตถุดิบ ${price(totalNum)} ช่องทาง Delivery`
        : 'บันทึกแล้ว',
    )
    setStore('')
    setQty('')
    setTotal('')
  }

  return (
    <form className="ig-card ig-form" onSubmit={handleSubmit}>
      <h2 className="ig-card-title">บันทึกการซื้อ</h2>

      <label className="ig-field">
        <span>วัตถุดิบ</span>
        <select className="ig-input" value={selectedId} onChange={(e) => changeIngredient(e.target.value)}>
          {ingredients.map((i) => (
            <option key={i.id} value={i.id}>{i.name}</option>
          ))}
        </select>
      </label>

      <label className="ig-field">
        <span>ร้าน / แหล่งที่ซื้อ</span>
        <input
          className="ig-input"
          placeholder="เช่น ตลาดสด, ห้างค้าส่ง"
          value={store}
          onChange={(e) => setStore(e.target.value)}
        />
      </label>

      <div className="ig-row">
        <label className="ig-field">
          <span>{ing.kind === 'count' ? 'จำนวน' : ing.kind === 'volume' ? 'ปริมาณ' : 'น้ำหนัก'}</span>
          <input className="ig-input" type="number" inputMode="decimal" min="0" step="any" value={qty} onChange={(e) => setQty(e.target.value)} />
        </label>
        <label className="ig-field">
          <span>หน่วย</span>
          <select className="ig-input" value={unit.id} onChange={(e) => setUnitId(e.target.value)} disabled={kind.units.length === 1}>
            {kind.units.map((u) => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        </label>
        <label className="ig-field">
          <span>ราคาที่จ่าย</span>
          <input className="ig-input" type="number" inputMode="decimal" min="0" step="any" value={total} onChange={(e) => setTotal(e.target.value)} />
        </label>
      </div>

      <div className="ig-preview">
        <div className="ig-preview-prices">
          <div>
            <small>ราคาต่อ {mainUnit(ing)}</small>
            <strong>{perMain === null ? '—' : price(perMain, 2)}</strong>
          </div>
          {kind.small && (
            <div>
              <small>ราคาต่อ {kind.small}</small>
              <strong>{perMain === null ? '—' : price(perMain / 1000, 3)}</strong>
            </div>
          )}
        </div>
        {change && (
          <p className={`ig-preview-note is-${change.tone}`}>
            {change.tone === 'up' && `▲ แพงขึ้น ${change.text} จากครั้งก่อน`}
            {change.tone === 'down' && `▼ ถูกลง ${change.text} จากครั้งก่อน`}
            {change.tone === 'muted' && 'ราคาเท่ากับครั้งก่อน'} ({price(prevPrice)} / {mainUnit(ing)})
          </p>
        )}
        {!valid && <p className="ig-preview-note is-muted">กรอก{ing.kind === 'count' ? 'จำนวน' : 'น้ำหนัก'}และราคาเพื่อคำนวณราคาต่อหน่วย</p>}
      </div>

      <label className="ig-check">
        <input type="checkbox" checked={asExpense} onChange={(e) => setAsExpense(e.target.checked)} />
        <span>บันทึกเป็นรายจ่าย “วัตถุดิบ” ช่องทาง Delivery อัตโนมัติ</span>
      </label>

      <button type="submit" className="ig-submit" disabled={!valid}>บันทึกการซื้อ</button>
      <p className="ig-saved" role="status">{saved}</p>
    </form>
  )
}
