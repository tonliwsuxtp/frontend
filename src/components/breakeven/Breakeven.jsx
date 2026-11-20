import { useMemo, useState } from 'react'
import AppShell from '../layout/AppShell'
import BottomNav from '../overall/mobile/BottomNav'
import FixedCostForm from './FixedCostForm'
import BreakevenCard from './BreakevenCard'
import FullCostTable from './FullCostTable'
import { INITIAL_EXPECTED_SETS, INITIAL_FIXED_COSTS, MONTH, breakeven, menuRows } from './breakevenData'
import './breakeven.css'

/** "ต้นทุนแฝง & คุ้มทุน" — monthly fixed costs spread per set, and the month's break-even point. */
export default function Breakeven({ onNavigate }) {
  const [costs, setCosts] = useState(INITIAL_FIXED_COSTS)
  const [expectedSets, setExpectedSets] = useState(INITIAL_EXPECTED_SETS)

  const total = costs.reduce((s, c) => s + (Number(c.amount) || 0), 0)
  const expected = Number(expectedSets) || 0
  const hiddenPerSet = expected > 0 ? total / expected : null

  const rows = useMemo(() => menuRows(hiddenPerSet ?? 0), [hiddenPerSet])
  const be = useMemo(() => breakeven(total, rows), [total, rows])

  const setCost = (id, amount) => setCosts((prev) => prev.map((c) => (c.id === id ? { ...c, amount } : c)))

  return (
    <AppShell active="breakeven" onNavigate={onNavigate}>
      <main className="be-page">
        <header>
          <h1 className="be-title">ต้นทุนแฝง &amp; จุดคุ้มทุน</h1>
          <p className="be-subtitle">
            ค่าใช้จ่ายรายเดือนที่ไม่ได้อยู่ในสูตร เฉลี่ยลงต่อชุด · {MONTH.label} · ข้อมูลตัวอย่าง
          </p>
        </header>

        <div className="be-layout">
          <FixedCostForm
            costs={costs}
            onCostChange={setCost}
            total={total}
            expectedSets={expectedSets}
            onExpectedChange={setExpectedSets}
            hiddenPerSet={hiddenPerSet}
          />
          <div className="be-col">
            <BreakevenCard fixedTotal={total} be={be} />
            <FullCostTable rows={rows} />
          </div>
        </div>
      </main>

      <div className="be-mobile-nav">
        <BottomNav active="breakeven" onChange={onNavigate} />
      </div>
    </AppShell>
  )
}
