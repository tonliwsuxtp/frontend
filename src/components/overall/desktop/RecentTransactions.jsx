import { CHANNELS } from '../mockData'
import { formatBaht, formatShortDate } from '../dateUtils'

const channelShort = Object.fromEntries(CHANNELS.map((c) => [c.id, c.short]))

export default function RecentTransactions({ transactions, limit = 4, onViewAll }) {
  const recent = transactions.slice(-limit).reverse()

  return (
    <section className="ovd-card ovd-panel">
      <div className="ovd-panel-head">
        <h2 className="ovd-panel-title">รายการล่าสุด</h2>
        <button type="button" className="ovd-link" onClick={onViewAll}>ดูทั้งหมด</button>
      </div>

      {recent.length === 0 ? (
        <p className="ovd-empty">ยังไม่มีรายการในช่วงนี้</p>
      ) : (
        <div className="ovd-table-wrap">
          <table className="ovd-table">
            <thead>
              <tr>
                <th>วันที่</th>
                <th>รายการ</th>
                <th>ช่องทาง</th>
                <th>หมวดหมู่</th>
                <th className="ovd-num">จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((t) => (
                <tr key={t.id}>
                  <td className="ovd-muted">{formatShortDate(t.date)}</td>
                  <td>{t.title}</td>
                  <td>{t.app ?? channelShort[t.channel]}</td>
                  <td className="ovd-muted">{t.category}</td>
                  <td className={`ovd-num ovd-strong ${t.amount < 0 ? 'ovd-neg' : 'ovd-pos'}`}>
                    {formatBaht(t.amount, { signed: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
