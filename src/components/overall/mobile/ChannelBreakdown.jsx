import { CHANNELS } from '../mockData'
import { formatNumber, formatSigned } from '../dateUtils'

export default function ChannelBreakdown({ channels }) {
  return (
    <section className="ov-card">
      <h2 className="ov-card-title">แยกตามช่องทาง</h2>
      <ul className="ov-channels">
        {CHANNELS.map((c) => {
          const { income, expense } = channels[c.id]
          const net = income - expense
          return (
            <li key={c.id} className="ov-channel">
              <i className="ov-channel-dot" style={{ background: c.color }} />
              <div className="ov-channel-info">
                <strong>{c.name}</strong>
                <small>
                  รับ {formatNumber(income)} จ่าย {formatNumber(expense)}
                </small>
              </div>
              <span className={`ov-channel-net${net < 0 ? ' is-loss' : ''}`}>{formatSigned(net)}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
