import { CHANNELS, channelProfit, deductionText } from './menuCostData'
import { price as baht } from '../ingredients/format'

export default function ChannelCompare({ price, cost, channelId }) {
  const p = Number(price) || 0
  return (
    <section className="mc-card">
      <h2 className="mc-card-title">เทียบกำไรทุกช่องทาง ที่ราคา {baht(p)}</h2>
      <div className="mc-table-wrap">
        <table className="mc-table">
          <thead>
            <tr>
              <th>ช่องทาง</th>
              <th className="mc-num">GP + ค่าหักอื่น</th>
              <th className="mc-num">เงินที่ได้</th>
              <th className="mc-num">กำไร/ชุด</th>
              <th className="mc-num">อัตรากำไร</th>
            </tr>
          </thead>
          <tbody>
            {CHANNELS.map((ch) => {
              const r = channelProfit(p, cost, ch)
              return (
                <tr key={ch.id} className={ch.id === channelId ? 'is-selected' : undefined}>
                  <td>{ch.name}</td>
                  <td className="mc-num">{deductionText(ch)}</td>
                  <td className="mc-num">{baht(r.net, 2)}</td>
                  <td className={`mc-num mc-strong ${r.profit < 0 ? 'mc-neg' : 'mc-pos'}`}>
                    {r.profit < 0 && '−'}
                    {baht(Math.abs(r.profit), 2)}
                  </td>
                  <td className="mc-num">{r.margin.toFixed(1)}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
