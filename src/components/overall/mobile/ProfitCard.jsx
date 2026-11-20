import { formatNumber, formatSigned } from '../dateUtils'

const TITLES = { day: 'กำไรสุทธิวันนี้', month: 'กำไรสุทธิเดือนนี้', year: 'กำไรสุทธิปีนี้' }

export default function ProfitCard({ period, income, expense }) {
  const profit = income - expense
  return (
    <section className="ov-profit">
      <p className="ov-profit-title">{TITLES[period]}</p>
      <p className={`ov-profit-value${profit < 0 ? ' is-loss' : ''}`}>
        {profit < 0 && '-'}
        {formatNumber(profit)}
      </p>
      <div className="ov-profit-stats">
        <div className="ov-profit-stat">
          <span>รายรับ</span>
          <strong className="ov-text-income">{formatSigned(income, '+')}</strong>
        </div>
        <div className="ov-profit-stat">
          <span>รายจ่าย</span>
          <strong className="ov-text-expense">{formatSigned(expense, '-')}</strong>
        </div>
      </div>
    </section>
  )
}
