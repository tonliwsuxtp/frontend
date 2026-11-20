import { useMemo, useState } from 'react'
import AppShell from '../layout/AppShell'
import BottomNav from '../overall/mobile/BottomNav'
import TaxSummary from './TaxSummary'
import TaxInputs from './TaxInputs'
import TaxSteps from './TaxSteps'
import TaxBrackets from './TaxBrackets'
import TaxTodo from './TaxTodo'
import { DEFAULT_INPUTS, TAX_YEARS, computeTax, sideIncome } from './taxCalc'
import { formatShortDate } from '../overall/dateUtils'
import './tax.css'

/** "ภาษี" — personal income tax estimate: salary (entered) + side income (from recorded transactions). */
export default function Tax({ onNavigate }) {
  const [year, setYear] = useState(TAX_YEARS[0].year)
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)

  const side = useMemo(() => sideIncome(year), [year])
  const r = useMemo(() => computeTax(inputs, side), [inputs, side])

  return (
    <AppShell active="tax" onNavigate={onNavigate}>
      <main className="tx2-page">
        <header className="tx2-header">
          <div>
            <h1 className="tx2-title">ภาษีเงินได้บุคคลธรรมดา (ประมาณการ)</h1>
            <p className="tx2-subtitle">
              รายได้เสริมดึงจากรายการที่คุณบันทึก
              {side.partialUntil && ` (ถึง ${formatShortDate(side.partialUntil)})`} · ข้อมูลตัวอย่าง
            </p>
          </div>
          <label className="tx2-year">
            <span>ปีภาษี</span>
            <select className="tx2-input" value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {TAX_YEARS.map((y) => (
                <option key={y.year} value={y.year}>{y.label}</option>
              ))}
            </select>
          </label>
        </header>

        <TaxSummary r={r} />

        <div className="tx2-layout">
          <TaxInputs inputs={inputs} onChange={setInputs} r={r} />
          <div className="tx2-col">
            <TaxSteps r={r} side={side} />
            <TaxBrackets r={r} />
          </div>
        </div>

        <TaxTodo year={year} side={side} r={r} />
      </main>

      <div className="tx2-mobile-nav">
        <BottomNav active="tax" onChange={onNavigate} />
      </div>
    </AppShell>
  )
}
