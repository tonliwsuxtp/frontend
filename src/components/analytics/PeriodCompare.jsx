import { useMemo } from 'react'
import { CHANNELS } from '../overall/mockData'
import { formatBaht } from '../overall/dateUtils'
import { comparePeriods } from './analyticsData'

const MODES = [
  { id: 'month', label: 'เทียบเดือนก่อน' },
  { id: 'year', label: 'เทียบปีก่อน' },
]

const pctChange = (now, before) => (before ? ((now - before) / before) * 100 : null)

function insight(cur, prev) {
  const incomeGrowth = pctChange(cur.income, prev.income)
  const expenseGrowth = pctChange(cur.expense, prev.expense)
  const marginNow = cur.income ? Math.round((cur.profit / cur.income) * 100) : 0
  const marginBefore = prev.income ? Math.round((prev.profit / prev.income) * 100) : 0
  if (incomeGrowth === null || expenseGrowth === null) return null

  const drivers = Object.keys(cur.categories)
    .map((k) => [k, cur.categories[k] - (prev.categories[k] ?? 0)])
    .filter(([, d]) => d > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k]) => k)

  if (expenseGrowth > incomeGrowth) {
    return `รายจ่ายเพิ่มเร็วกว่ารายรับ${drivers.length ? ` (ส่วนใหญ่จาก${drivers.join('และ')})` : ''} อัตรากำไรจึง${
      marginNow < marginBefore ? `ลดจาก ${marginBefore}% เหลือ ${marginNow}%` : `อยู่ที่ ${marginNow}%`
    }`
  }
  return `รายรับเพิ่มเร็วกว่ารายจ่าย อัตรากำไร${
    marginNow > marginBefore ? `เพิ่มจาก ${marginBefore}% เป็น ${marginNow}%` : `อยู่ที่ ${marginNow}%`
  }`
}

export default function PeriodCompare({ mode, onModeChange }) {
  const data = useMemo(() => comparePeriods(mode), [mode])
  const { cur, prev } = data

  const rows = [
    { id: 'income', label: 'รายรับ', prev: prev.income, cur: cur.income, money: true },
    { id: 'expense', label: 'รายจ่าย', prev: prev.expense, cur: cur.expense, money: true, upIsBad: true },
    { id: 'profit', label: 'กำไร', prev: prev.profit, cur: cur.profit, money: true },
    { id: 'sets', label: 'จำนวนชุดที่ขาย', prev: prev.sets, cur: cur.sets },
    ...CHANNELS.map((c) => ({ id: c.id, label: c.name, prev: prev.channels[c.id], cur: cur.channels[c.id], money: true })),
  ]
  const moneyMax = Math.max(1, ...rows.filter((r) => r.money).flatMap((r) => [r.prev, r.cur]))
  const setsMax = Math.max(1, cur.sets, prev.sets)
  const fmt = (r, v) => (r.money ? `${v < 0 ? '−' : ''}${formatBaht(v)}` : v.toLocaleString('en-US'))
  const note = insight(cur, prev)

  return (
    <section className="an-card">
      <div className="an-card-head">
        <h2 className="an-card-title">เปรียบเทียบช่วงเวลา</h2>
        <div className="an-segment" role="radiogroup" aria-label="เทียบกับ">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={mode === m.id}
              className={`an-segment-btn${mode === m.id ? ' is-active' : ''}`}
              onClick={() => onModeChange(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <p className="an-muted an-desc">
        {data.curFull} เทียบกับ {data.prevFull} (จำนวนวันเท่ากัน เทียบกันได้ตรง ๆ)
      </p>

      <div className="an-table-wrap">
        <table className="an-table an-compare">
          <thead>
            <tr>
              <th>รายการ</th>
              <th className="an-num">{data.prevLabel}</th>
              <th className="an-num">{data.curLabel}</th>
              <th className="an-num">เปลี่ยนแปลง</th>
              <th className="an-bars-col" aria-label="กราฟเปรียบเทียบ" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const change = pctChange(r.cur, r.prev)
              const up = change > 0
              const good = change === null || change === 0 ? null : r.upIsBad ? !up : up
              const max = r.money ? moneyMax : setsMax
              return (
                <tr key={r.id}>
                  <td className="an-strong">{r.label}</td>
                  <td className="an-num an-muted">{fmt(r, r.prev)}</td>
                  <td className="an-num an-strong">{fmt(r, r.cur)}</td>
                  <td className={`an-num an-strong ${good === null ? 'an-muted' : good ? 'an-pos' : 'an-neg'}`}>
                    {change === null ? '—' : `${up ? '▲' : change < 0 ? '▼' : ''} ${Math.abs(change).toFixed(1)}%`}
                  </td>
                  <td className="an-bars-col">
                    <div className="an-bars">
                      <span className="an-bar is-prev" style={{ width: `${(Math.max(0, r.prev) / max) * 100}%` }} />
                      <span className="an-bar is-cur" style={{ width: `${(Math.max(0, r.cur) / max) * 100}%` }} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="an-foot">
        {note && <p className="an-muted">{note}</p>}
        <div className="an-legend">
          <span><i className="an-bar is-prev" />{data.prevLabel}</span>
          <span><i className="an-bar is-cur" />{data.curLabel}</span>
        </div>
      </div>
    </section>
  )
}
