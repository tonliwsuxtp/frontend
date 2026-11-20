import { useMemo } from 'react'
import AppShell from '../../layout/AppShell'
import Toolbar from './Toolbar'
import StatCards from './StatCards'
import IncomeExpenseChart from './IncomeExpenseChart'
import ChannelProfit from './ChannelProfit'
import RecentTransactions from './RecentTransactions'
import ExpenseCategories from './ExpenseCategories'
import { PlusIcon } from '../Icons'
import { DATA_END, getSummary } from '../mockData'
import { SHORT_MONTHS, formatBaht, formatShortDate, shiftDate, toBuddhistYear } from '../dateUtils'
import './desktop.css'

/**
 * Chart data for the selected period:
 *  - day:   the 7 days ending at the selected day
 *  - month: every day of the month (up to the last day with data)
 *  - year:  every month of the year (up to the last month with data)
 */
function buildChart(period, date) {
  const y = date.getFullYear()
  const m = date.getMonth()
  let unit
  let dates

  if (period === 'day') {
    unit = 'day'
    dates = Array.from({ length: 7 }, (_, i) => shiftDate('day', date, i - 6))
  } else if (period === 'month') {
    unit = 'day'
    const last = new Date(y, m + 1, 0)
    const end = last > DATA_END ? DATA_END : last
    dates = end < new Date(y, m, 1) ? [] : Array.from({ length: end.getDate() }, (_, i) => new Date(y, m, i + 1))
  } else {
    unit = 'month'
    const endMonth = y < DATA_END.getFullYear() ? 11 : y > DATA_END.getFullYear() ? -1 : DATA_END.getMonth()
    dates = Array.from({ length: endMonth + 1 }, (_, i) => new Date(y, i, 1))
  }

  const items = dates.map((d) => {
    const s = getSummary(unit, d)
    return {
      key: d.toISOString(),
      label: unit === 'day' ? String(d.getDate()) : SHORT_MONTHS[d.getMonth()],
      income: s.income,
      expense: s.expense,
      date: d,
    }
  })

  const first = items[0]?.date
  const lastItem = items.at(-1)?.date
  let title = 'รายรับ vs รายจ่าย'
  if (period === 'day') title += ' 7 วันล่าสุด'
  else if (period === 'month' && first)
    title += ` รายวัน (${first.getDate()}–${lastItem.getDate()} ${SHORT_MONTHS[m]})`
  else if (period === 'year' && first)
    title += ` รายเดือน (${SHORT_MONTHS[0]}–${SHORT_MONTHS[lastItem.getMonth()]} ${toBuddhistYear(date)})`

  let footnote = null
  if (items.length) {
    const avg = items.reduce((sum, i) => sum + i.income - i.expense, 0) / items.length
    const periodEnd = unit === 'day' ? lastItem : new Date(y, lastItem.getMonth() + 1, 0)
    const through = periodEnd > DATA_END ? DATA_END : periodEnd
    footnote = `ข้อมูลถึงวันที่ ${formatShortDate(through)} · เฉลี่ยกำไร${unit === 'day' ? 'วัน' : 'เดือน'}ละ ${formatBaht(avg)}`
  }

  return { title, items, footnote }
}

/** Desktop layout (≥ 900px). */
export default function DesktopOverall({
  period, onPeriodChange, date, onPrev, onNext, canNext, summary, tax, onAdd, onNavigate,
}) {
  const chart = useMemo(() => buildChart(period, date), [period, date])

  return (
    <AppShell active="overall" onNavigate={onNavigate}>
      <main className="ovd-page ovd-main">
        <header className="ovd-header">
          <div>
            <h1 className="ovd-title">ภาพรวม</h1>
            <p className="ovd-subtitle">ข้อมูลที่คุณกรอกเอง · ข้อมูลตัวอย่าง</p>
          </div>
          <button type="button" className="ovd-primary-btn" onClick={onAdd}>
            <PlusIcon width={16} height={16} />
            บันทึกรายการ
          </button>
        </header>

        <Toolbar
          period={period}
          onPeriodChange={onPeriodChange}
          date={date}
          onPrev={onPrev}
          onNext={onNext}
          canNext={canNext}
        />

        <StatCards period={period} date={date} summary={summary} tax={tax} onTaxDetail={() => onNavigate?.('tax')} />

        <div className="ovd-grid">
          <IncomeExpenseChart title={chart.title} items={chart.items} footnote={chart.footnote} />
          <ChannelProfit channels={summary.channels} apps={summary.apps} />
          <RecentTransactions transactions={summary.transactions} onViewAll={() => onNavigate?.('transactions')} />
          <ExpenseCategories period={period} categories={summary.categories} />
        </div>
      </main>
    </AppShell>
  )
}
