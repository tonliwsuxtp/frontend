import { useMemo } from 'react'
import PeriodTabs from './PeriodTabs'
import DateNavigator from './DateNavigator'
import ProfitCard from './ProfitCard'
import TrendChart from './TrendChart'
import ChannelBreakdown from './ChannelBreakdown'
import QuickActions from './QuickActions'
import TaxCard from './TaxCard'
import BottomNav from './BottomNav'
import { PlusIcon } from '../Icons'
import { getSummary } from '../mockData'
import { formatBarLabel, formatPeriodLabel, shiftDate, toBuddhistYear } from '../dateUtils'
import './mobile.css'

/** Phone layout (< 900px). */
export default function MobileOverall({
  period, onPeriodChange, date, onPrev, onNext, canNext, summary, tax, onAdd, onNavigate, onQuickAction,
}) {
  // Last 7 periods ending at the selected one.
  const trend = useMemo(
    () =>
      Array.from({ length: 7 }, (_, idx) => {
        const d = shiftDate(period, date, idx - 6)
        const s = getSummary(period, d)
        return { key: d.toISOString(), label: formatBarLabel(period, d), income: s.income, expense: s.expense }
      }),
    [period, date],
  )

  return (
    <div className="ov-root ov-page">
      <main className="ov-content">
        <PeriodTabs value={period} onChange={onPeriodChange} />
        <DateNavigator label={formatPeriodLabel(period, date)} onPrev={onPrev} onNext={onNext} canNext={canNext} />
        <ProfitCard period={period} income={summary.income} expense={summary.expense} />
        <TrendChart period={period} items={trend} />
        <ChannelBreakdown channels={summary.channels} />
        <QuickActions onSelect={onQuickAction} />
        <TaxCard buddhistYear={toBuddhistYear(date)} amount={tax} />
      </main>

      <button type="button" className="ov-fab" aria-label="เพิ่มรายการ" onClick={onAdd}>
        <PlusIcon width={26} height={26} />
      </button>

      <BottomNav active="overall" onChange={onNavigate} />
    </div>
  )
}
