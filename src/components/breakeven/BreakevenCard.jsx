import { MONTH } from './breakevenData'
import { price } from '../ingredients/format'

const signed = (n) => `${n < 0 ? '−' : ''}${price(Math.abs(Math.round(n)), 0)}`
const num = (n) => n.toLocaleString('en-US')

export default function BreakevenCard({ fixedTotal, be }) {
  const pct = (v) => `${Math.min(100, (v / be.scaleMax) * 100)}%`
  const reached = be.reachable && be.sold >= be.sets

  return (
    <section className="be-dark">
      <div className="be-dark-top">
        <div>
          <p className="be-dark-label">จุดคุ้มทุนเดือนนี้</p>
          <p className="be-dark-big">{be.reachable ? `${num(be.sets)} ชุด` : 'ไม่ถึง'}</p>
          <p className="be-dark-sub">
            {be.reachable
              ? `ต้นทุนแฝง ${price(fixedTotal, 0)} ÷ กำไรเฉลี่ยต่อชุด ${price(be.avgContribution, 2)}`
              : 'กำไรเฉลี่ยต่อชุดติดลบ ขายเพิ่มก็ไม่คุ้มทุน ลองปรับราคาหรือสูตร'}
          </p>
        </div>
        <div className="be-dark-right">
          <p className="be-dark-label">ขายแล้ว (1–{MONTH.daysElapsed} {MONTH.short})</p>
          <p className={`be-dark-big ${reached ? 'is-good' : 'is-accent'}`}>{num(be.sold)} ชุด</p>
          <p className="be-dark-sub">
            {!be.reachable ? '' : reached ? 'คุ้มทุนแล้ว 🎉' : `ขาดอีก ${num(be.remaining)} ชุด`}
          </p>
        </div>
      </div>

      <div className="be-progress" role="img" aria-label={`ขายแล้ว ${be.sold} จาก ${be.sets ?? '-'} ชุด`}>
        <span className={`be-progress-fill${reached ? ' is-good' : ''}`} style={{ width: pct(be.sold) }} />
        {be.reachable && <i className="be-progress-mark" style={{ left: pct(be.sets) }} />}
      </div>
      <div className="be-progress-scale">
        <span>0</span>
        <span>เส้นขาว = จุดคุ้มทุน</span>
        <span>{num(be.scaleMax)} ชุด</span>
      </div>

      <div className="be-dark-stats">
        <div>
          <small>กำไรก่อนหักต้นทุนแฝง</small>
          <strong className={be.profitBefore < 0 ? 'is-loss' : ''}>{signed(be.profitBefore)}</strong>
        </div>
        <div>
          <small>หักต้นทุนแฝงแล้ว</small>
          <strong className={be.profitAfter < 0 ? 'is-loss' : 'is-good'}>{signed(be.profitAfter)}</strong>
        </div>
        <div>
          <small>คาดการณ์ทั้งเดือน</small>
          <strong className={be.projected < 0 ? 'is-loss' : 'is-good'}>{signed(be.projected)}</strong>
        </div>
      </div>
    </section>
  )
}
