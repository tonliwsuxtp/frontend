import { CHANNELS, DELIVERY_APPS } from '../mockData'
import { formatBaht } from '../dateUtils'

export default function ChannelProfit({ channels, apps }) {
  const rows = CHANNELS.map((c) => ({ ...c, ...channels[c.id], net: channels[c.id].income - channels[c.id].expense }))
  const positiveTotal = rows.reduce((sum, r) => sum + Math.max(0, r.net), 0)

  return (
    <section className="ovd-card ovd-panel">
      <h2 className="ovd-panel-title">กำไรแยกตามช่องทาง</h2>

      <ul className="ovd-channels">
        {rows.map((r) => (
          <li key={r.id} className="ovd-channel">
            <i className="ovd-dot" style={{ background: r.color }} />
            <div className="ovd-channel-info">
              <strong>{r.name}</strong>
              <small>
                รับ {formatBaht(r.income)} · จ่าย {formatBaht(r.expense)}
              </small>
            </div>
            <span className={r.net < 0 ? 'ovd-neg' : 'ovd-pos'}>{formatBaht(r.net, { signed: true })}</span>
          </li>
        ))}
      </ul>

      <div className="ovd-ratio" role="img" aria-label="สัดส่วนกำไรตามช่องทาง">
        {positiveTotal > 0 &&
          rows
            .filter((r) => r.net > 0)
            .map((r) => (
              <span
                key={r.id}
                style={{ flexGrow: r.net, background: r.color }}
                title={`${r.name} ${Math.round((r.net / positiveTotal) * 100)}%`}
              />
            ))}
      </div>
      <p className="ovd-footnote ovd-footnote-tight">สัดส่วนกำไรตามช่องทาง</p>

      <div className="ovd-apps">
        <h3>ขายของ Delivery แยกตามแอป</h3>
        {DELIVERY_APPS.map((a) => (
          <div key={a} className="ovd-app-row">
            <span>{a}</span>
            <span className="ovd-muted">
              ขาย {formatBaht(apps[a].sales)} · GP {formatBaht(apps[a].gp)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
