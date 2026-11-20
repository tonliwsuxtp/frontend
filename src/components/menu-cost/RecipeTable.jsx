import { useState } from 'react'
import { INGREDIENT_PRICES, ingredientById, lineCost, recipeCost } from './menuCostData'
import { price } from '../ingredients/format'

const unitDigits = (unit) => (unit === 'ชุด' ? 2 : 3)

export default function RecipeTable({ recipe, onChange }) {
  const [adding, setAdding] = useState(false)
  const available = INGREDIENT_PRICES.filter((i) => !recipe.some((l) => l.ingredientId === i.id))

  const setQty = (id, qty) => onChange(recipe.map((l) => (l.ingredientId === id ? { ...l, qty } : l)))
  const remove = (id) => onChange(recipe.filter((l) => l.ingredientId !== id))
  const add = (id) => {
    onChange([...recipe, { ingredientId: id, qty: 0 }])
    setAdding(false)
  }

  return (
    <section className="mc-card">
      <div className="mc-card-head">
        <h2 className="mc-card-title">สูตร (แก้ปริมาณได้)</h2>
        <span className="mc-muted mc-small">ราคาดึงจากหน้าวัตถุดิบ</span>
      </div>

      <div className="mc-table-wrap">
        <table className="mc-table">
          <thead>
            <tr>
              <th>วัตถุดิบ</th>
              <th className="mc-num">ราคาต่อหน่วย</th>
              <th className="mc-num">ปริมาณที่ใช้</th>
              <th className="mc-num">ต้นทุน</th>
              <th aria-label="ลบ" />
            </tr>
          </thead>
          <tbody>
            {recipe.map((l) => {
              const ing = ingredientById[l.ingredientId]
              return (
                <tr key={l.ingredientId}>
                  <td className="mc-strong">{ing.name}</td>
                  <td className="mc-num mc-muted">
                    {price(ing.unitPrice, unitDigits(ing.unit))} / {ing.unit}
                  </td>
                  <td className="mc-num">
                    <span className="mc-qty">
                      <input
                        className="mc-input mc-qty-input"
                        type="number"
                        min="0"
                        step="any"
                        value={l.qty}
                        onChange={(e) => setQty(l.ingredientId, e.target.value)}
                        aria-label={`ปริมาณ${ing.name}`}
                      />
                      <span className="mc-unit">{ing.unit}</span>
                    </span>
                  </td>
                  <td className="mc-num mc-strong">{price(lineCost(l), 2)}</td>
                  <td>
                    <button type="button" className="mc-remove" onClick={() => remove(l.ingredientId)} aria-label={`ลบ${ing.name}`}>
                      ×
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {recipe.length === 0 && <p className="mc-empty">ยังไม่มีวัตถุดิบในสูตร</p>}
      </div>

      <div className="mc-recipe-foot">
        {adding ? (
          <select className="mc-input mc-add-select" autoFocus defaultValue="" onChange={(e) => e.target.value && add(e.target.value)} onBlur={() => setAdding(false)}>
            <option value="" disabled>เลือกวัตถุดิบ…</option>
            {available.map((i) => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
        ) : (
          <button type="button" className="mc-dashed" onClick={() => setAdding(true)} disabled={!available.length}>
            + เพิ่มวัตถุดิบในสูตร
          </button>
        )}
        <strong className="mc-total">ต้นทุนรวม {price(recipeCost(recipe), 2)} / ชุด</strong>
      </div>
    </section>
  )
}
