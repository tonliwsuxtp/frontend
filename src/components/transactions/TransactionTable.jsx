import { CHANNELS } from '../overall/mockData'
import { formatBaht, formatShortDate } from '../overall/dateUtils'

const channelById = Object.fromEntries(CHANNELS.map((c) => [c.id, c]))
const FILTERS = [{ id: 'all', label: 'ทั้งหมด' }, ...CHANNELS.map((c) => ({ id: c.id, label: c.short }))]

const toDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export default function TransactionTable({ rows, search, onSearchChange, channel, onChannelChange }) {
  const income = rows.reduce((s, t) => s + Math.max(0, t.amount), 0)
  const expense = rows.reduce((s, t) => s + Math.max(0, -t.amount), 0)

  return (
    <section className="tx-card tx-list">
      <div className="tx-toolbar">
        <input
          type="search"
          className="tx-input tx-search"
          placeholder="ค้นหารายการ..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="ค้นหารายการ"
        />
        <div className="tx-pills" role="radiogroup" aria-label="กรองตามช่องทาง">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={channel === f.id}
              className={`tx-pill${channel === f.id ? ' is-active' : ''}`}
              onClick={() => onChannelChange(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tx-table-wrap">
        <table className="tx-table">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>รายการ</th>
              <th>ช่องทาง</th>
              <th>หมวดหมู่</th>
              <th className="tx-num">จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => {
              const ch = channelById[t.channel]
              return (
                <tr key={t.id}>
                  <td className="tx-muted">{formatShortDate(toDate(t.date))}</td>
                  <td>{t.title}</td>
                  <td>
                    <span className="tx-channel">
                      <i style={{ background: ch.color }} />
                      {ch.short}
                    </span>
                  </td>
                  <td className="tx-muted">{t.category}</td>
                  <td className={`tx-num tx-strong ${t.amount < 0 ? 'tx-neg' : 'tx-pos'}`}>
                    {formatBaht(t.amount, { signed: true })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {rows.length === 0 && <p className="tx-empty">ไม่พบรายการ</p>}
      </div>

      <footer className="tx-footer">
        <span>{rows.length} รายการ</span>
        <span>
          รวมรับ <strong className="tx-pos">{formatBaht(income)}</strong> · รวมจ่าย{' '}
          <strong className="tx-neg">{formatBaht(expense)}</strong>
        </span>
      </footer>
    </section>
  )
}
