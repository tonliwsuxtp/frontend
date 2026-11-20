import { useState } from 'react'
import AppShell from '../layout/AppShell'
import BottomNav from '../overall/mobile/BottomNav'
import PurchaseForm from './PurchaseForm'
import PriceTable from './PriceTable'
import PriceHistoryChart from './PriceHistoryChart'
import { INITIAL_INGREDIENTS } from './ingredientsData'
import './ingredients.css'

/** "วัตถุดิบ" — record ingredient purchases; unit prices feed the menu cost page. */
export default function Ingredients({ onNavigate }) {
  const [ingredients, setIngredients] = useState(INITIAL_INGREDIENTS)
  const [selectedId, setSelectedId] = useState(INITIAL_INGREDIENTS[0].id)
  const selected = ingredients.find((i) => i.id === selectedId)

  function addPurchase(id, purchase) {
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, purchases: [...i.purchases, purchase] } : i)),
    )
  }

  return (
    <AppShell active="ingredients" onNavigate={onNavigate}>
      <main className="ig-page">
        <header>
          <h1 className="ig-title">วัตถุดิบ</h1>
          <p className="ig-subtitle">
            บันทึกน้ำหนักและราคาที่ซื้อ ระบบคำนวณราคาต่อหน่วยไว้ใช้คิดต้นทุนเมนู · ข้อมูลตัวอย่าง
          </p>
        </header>

        <div className="ig-layout">
          <PurchaseForm ingredients={ingredients} selectedId={selectedId} onSelect={setSelectedId} onSave={addPurchase} />
          <div className="ig-col">
            <PriceTable ingredients={ingredients} selectedId={selectedId} onSelect={setSelectedId} />
            <PriceHistoryChart ingredient={selected} />
          </div>
        </div>
      </main>

      <div className="ig-mobile-nav">
        <BottomNav active="ingredients" onChange={onNavigate} />
      </div>
    </AppShell>
  )
}
