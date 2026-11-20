import { formatBaht } from '../overall/dateUtils'

export default function TaxSummary({ r }) {
  const refund = r.due < 0
  const pct = Math.round(r.topRate * 100)
  return (
    <div className="tx2-stats">
      <section className="tx2-stat is-dark">
        <p className="tx2-stat-label">{refund ? 'ได้คืนภาษีตอนยื่น (ประมาณ)' : 'ต้องจ่ายเพิ่มตอนยื่นภาษี'}</p>
        <p className={`tx2-stat-value ${refund ? 'is-good' : 'is-accent'}`}>{formatBaht(r.due)}</p>
        <p className="tx2-stat-note">
          ภาษีทั้งปี {formatBaht(r.tax)} − หัก ณ ที่จ่ายแล้ว {formatBaht(r.withheldTotal)}
        </p>
      </section>

      <section className="tx2-stat">
        <p className="tx2-stat-label">ภาษีที่เพิ่มขึ้นเพราะรายได้เสริม</p>
        <p className="tx2-stat-value">{formatBaht(r.extra)}</p>
        <p className="tx2-stat-note">เทียบกับมีแค่เงินเดือน ({formatBaht(r.salaryOnlyTax)})</p>
      </section>

      <section className="tx2-stat">
        <p className="tx2-stat-label">ขั้นภาษีสูงสุดที่คุณอยู่</p>
        <p className="tx2-stat-value">{pct}%</p>
        <p className="tx2-stat-note">
          {pct ? `กำไรเพิ่มทุก ฿100 ควรกันไว้จ่ายภาษี ~฿${pct}` : 'เงินได้สุทธียังอยู่ในช่วงยกเว้นภาษี'}
        </p>
      </section>
    </div>
  )
}
