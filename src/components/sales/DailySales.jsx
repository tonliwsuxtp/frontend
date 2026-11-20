import { money } from './format'

export default function DailySales({ title, rows }) {
  return (
    <section className="sl-card">
      <h2 className="sl-card-title sl-card-title-lg">{title}</h2>
      {rows.length === 0 ? (
        <p className="sl-empty">ยังไม่มีการขายในวันนี้</p>
      ) : (
        <div className="sl-table-wrap">
          <table className="sl-table">
            <thead>
              <tr>
                <th>เวลา</th>
                <th>รายการ</th>
                <th>ช่องทาง</th>
                <th className="sl-num">ยอดขาย</th>
                <th className="sl-num">กำไร</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="sl-muted">{r.time}</td>
                  <td>{r.items}</td>
                  <td>{r.app}</td>
                  <td className="sl-num">{money(r.sales, { whole: true })}</td>
                  <td className={`sl-num sl-strong ${r.profit < 0 ? 'sl-neg' : 'sl-pos'}`}>
                    {money(r.profit, { sign: r.profit < 0 ? '−' : '+', whole: true })}
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
