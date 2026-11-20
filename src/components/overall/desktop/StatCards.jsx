import { ArrowRight } from '../Icons'
import { PERIOD_SUFFIX, formatBaht, toBuddhistYear } from '../dateUtils'

export default function StatCards({ period, date, summary, tax, onTaxDetail }) {
  const { income, expense, profit, commission, sales, categories } = summary
  const margin = income > 0 ? Math.round((profit / income) * 100) : null
  const topExpenses = Object.entries(categories)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)

  return (
    <div className="ovd-stats">
      <section className="ovd-stat ovd-stat-dark">
        <p className="ovd-stat-label">กำไรสุทธิ{PERIOD_SUFFIX[period]}</p>
        <p className="ovd-stat-value">{formatBaht(profit)}</p>
        <p className={`ovd-stat-note ${profit < 0 ? 'is-loss' : 'is-gain'}`}>
          {margin === null ? 'ยังไม่มีรายรับ' : `อัตรากำไร ${margin}% ของรายรับ`}
        </p>
      </section>

      <section className="ovd-stat">
        <p className="ovd-stat-label">รายรับ</p>
        <p className="ovd-stat-value ovd-pos">{formatBaht(income)}</p>
        <p className="ovd-stat-note">
          ค่าคอม {formatBaht(commission)} · ยอดขาย {formatBaht(sales)}
        </p>
      </section>

      <section className="ovd-stat">
        <p className="ovd-stat-label">รายจ่าย</p>
        <p className="ovd-stat-value ovd-neg">{formatBaht(expense)}</p>
        <p className="ovd-stat-note">
          {topExpenses.length ? topExpenses.map(([k, v]) => `${k} ${formatBaht(v)}`).join(' · ') : 'ไม่มีรายจ่าย'}
        </p>
      </section>

      <section className="ovd-stat ovd-stat-tax">
        <p className="ovd-stat-label">ภาษีที่ต้องจ่ายเพิ่ม (ประมาณการปี {toBuddhistYear(date)})</p>
        <p className="ovd-stat-value">{formatBaht(tax)}</p>
        <button type="button" className="ovd-link" onClick={onTaxDetail}>
          ดูวิธีคำนวณ <ArrowRight width={14} height={14} />
        </button>
      </section>
    </div>
  )
}
