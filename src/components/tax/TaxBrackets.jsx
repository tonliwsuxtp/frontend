import { formatBaht } from '../overall/dateUtils'

const range = (b) =>
  b.to === Infinity
    ? `เกิน ${b.from.toLocaleString('en-US')}`
    : `${b.from === 0 ? 0 : (b.from + 1).toLocaleString('en-US')} – ${b.to.toLocaleString('en-US')}`

export default function TaxBrackets({ r }) {
  return (
    <section className="tx2-card">
      <h2 className="tx2-card-title">ภาษีขั้นบันได</h2>
      <div className="tx2-table-wrap">
        <table className="tx2-table tx2-brackets">
          <thead>
            <tr>
              <th>เงินได้สุทธิ</th>
              <th className="tx2-num">อัตรา</th>
              <th className="tx2-num">ส่วนที่อยู่ในขั้นนี้</th>
              <th className="tx2-num">ภาษี</th>
            </tr>
          </thead>
          <tbody>
            {r.progressive.rows.map((b) => {
              const active = b.portion > 0
              return (
                <tr key={b.from} className={active ? 'is-active' : 'is-idle'}>
                  <td>{range(b)}</td>
                  <td className="tx2-num">{b.rate ? `${b.rate * 100}%` : 'ยกเว้น'}</td>
                  <td className="tx2-num">{active ? formatBaht(b.portion) : '—'}</td>
                  <td className="tx2-num tx2-strong">{active ? formatBaht(b.tax) : '—'}</td>
                </tr>
              )
            })}
            <tr className="tx2-total-row">
              <td colSpan={3}>ภาษีทั้งปี</td>
              <td className="tx2-num">{formatBaht(r.tax)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="tx2-muted tx2-small tx2-note">
        {r.minTaxApplies
          ? `เงินได้ที่ไม่ใช่เงินเดือนเกิน 1 ล้าน ต้องเทียบวิธี 0.5% (${formatBaht(r.minTax)}) แล้วเสียจำนวนที่มากกว่า`
          : 'เงินได้ที่ไม่ใช่เงินเดือนยังไม่ถึง 1 ล้าน จึงไม่ต้องเทียบวิธี 0.5%'}
      </p>
    </section>
  )
}
