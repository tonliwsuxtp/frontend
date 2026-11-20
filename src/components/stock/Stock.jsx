import { useMemo, useState } from 'react'
import AppShell from '../layout/AppShell'
import BottomNav from '../overall/mobile/BottomNav'
import StockSummary from './StockSummary'
import StockTable from './StockTable'
import YieldCalculator from './YieldCalculator'
import WasteForm from './WasteForm'
import { INITIAL_ITEMS, INITIAL_WASTE, TODAY, realCost, stockStatus, wasteValue } from './stockData'
import './stock.css'

// Waste value is frozen at the time it's recorded, so later yield/price changes don't rewrite history.
const initialWaste = INITIAL_WASTE.map((w) => ({ ...w, value: wasteValue(w, INITIAL_ITEMS) }))

/** "สต็อก & ของเสีย" — remaining stock, yield-adjusted cost and waste log. */
export default function Stock({ onNavigate }) {
  const [items, setItems] = useState(INITIAL_ITEMS)
  const [waste, setWaste] = useState(initialWaste)

  const stockValue = useMemo(() => items.reduce((s, i) => s + i.qty * realCost(i), 0), [items])
  const lowItems = items.filter((i) => stockStatus(i).id !== 'ok')
  const wasteMonth = useMemo(() => {
    const month = TODAY.slice(0, 7)
    const list = waste.filter((w) => w.date.startsWith(month))
    return { count: list.length, value: list.reduce((s, w) => s + w.value, 0) }
  }, [waste])

  function applyYield(id, value) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, yield: value } : i)))
  }

  function addWaste({ itemId, qty, reason }) {
    const item = items.find((i) => i.id === itemId)
    setWaste((prev) => [
      { id: `w${Date.now()}`, date: TODAY, itemId, qty, reason, value: qty * realCost(item) },
      ...prev,
    ])
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, qty: Math.max(0, i.qty - qty) } : i)))
  }

  return (
    <AppShell active="stock" onNavigate={onNavigate}>
      <main className="st-page">
        <header>
          <h1 className="st-title">สต็อก &amp; ของเสีย</h1>
          <p className="st-subtitle">
            คงเหลือ = ซื้อมา − ใช้ตามสูตร − ของเสีย · ต้นทุนคิดจาก % ที่ใช้ได้จริง · ข้อมูลตัวอย่าง
          </p>
        </header>

        <StockSummary stockValue={stockValue} lowItems={lowItems} wasteMonth={wasteMonth} />
        <StockTable items={items} />

        <div className="st-bottom">
          <YieldCalculator items={items} onApply={applyYield} />
          <WasteForm items={items} waste={waste} onSave={addWaste} />
        </div>
      </main>

      <div className="st-mobile-nav">
        <BottomNav active="stock" onChange={onNavigate} />
      </div>
    </AppShell>
  )
}
