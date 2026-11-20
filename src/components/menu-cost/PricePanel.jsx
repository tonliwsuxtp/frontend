import { CHANNELS, channelProfit, priceForMargin } from './menuCostData'
import { price as baht } from '../ingredients/format'

const TARGETS = [0.2, 0.3, 0.4]

export default function PricePanel({ price, onPriceChange, channelId, onChannelChange, cost }) {
  const ch = CHANNELS.find((c) => c.id === channelId)
  const p = Number(price) || 0
  const r = channelProfit(p, cost, ch)

  return (
    <div className="mc-col">
      <section className="mc-card">
        <div className="mc-price-row">
          <span className="mc-strong">ราคาขาย</span>
          <div className="mc-price-stepper">
            <button type="button" className="mc-step" onClick={() => onPriceChange(Math.max(0, p - 5))} aria-label="ลดราคา 5 บาท">−</button>
            <label className="mc-price-value">
              <span>฿</span>
              <input
                type="number"
                min="0"
                step="1"
                value={price}
                onChange={(e) => onPriceChange(e.target.value)}
                aria-label="ราคาขาย"
              />
            </label>
            <button type="button" className="mc-step" onClick={() => onPriceChange(p + 5)} aria-label="เพิ่มราคา 5 บาท">+</button>
          </div>
        </div>

        <p className="mc-strong mc-label">ขายผ่าน (หัก GP)</p>
        <div className="mc-channels" role="radiogroup" aria-label="ขายผ่าน">
          {CHANNELS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={channelId === c.id}
              className={`mc-channel${channelId === c.id ? ' is-active' : ''}`}
              onClick={() => onChannelChange(c.id)}
            >
              <strong>{c.name}</strong>
              <small>{c.label}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="mc-dark">
        <div className="mc-dark-head">
          <span>กำไรต่อชุด</span>
          <strong className={r.profit < 0 ? 'is-loss' : ''}>
            {r.profit < 0 && '−'}
            {baht(Math.abs(r.profit), 2)}
          </strong>
        </div>
        <dl className="mc-dark-rows">
          <div><dt>ราคาขาย</dt><dd>{baht(p)}</dd></div>
          <div><dt>หัก GP {(ch.gpRate * 100).toFixed(1)}%</dt><dd>−{baht(r.gp, 2)}</dd></div>
          {ch.otherNote && (
            <div><dt>ค่าหักอื่น ({ch.otherNote})</dt><dd>−{baht(r.other, 2)}</dd></div>
          )}
          <div><dt>ต้นทุนวัตถุดิบ + แพ็ก</dt><dd>−{baht(cost, 2)}</dd></div>
          <div className="mc-dark-margin"><dt>อัตรากำไร (จากราคาขาย)</dt><dd>{r.margin.toFixed(1)}%</dd></div>
        </dl>

        <div className="mc-suggest">
          <p>ราคาแนะนำ ถ้าอยากได้กำไร</p>
          <div className="mc-suggest-grid">
            {TARGETS.map((m) => {
              const s = priceForMargin(cost, ch, m)
              return (
                <button
                  key={m}
                  type="button"
                  className="mc-suggest-item"
                  disabled={s === null}
                  onClick={() => s !== null && onPriceChange(s)}
                  title={s === null ? undefined : `ตั้งราคาเป็น ฿${s}`}
                >
                  <small>กำไร {m * 100}%</small>
                  <strong>{s === null ? '—' : baht(s)}</strong>
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
