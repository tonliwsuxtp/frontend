import { money } from './format'

export default function SaleSummary({ app, orders, calc, onEditDeductions }) {
  const { plates, sales, gp, discount, cost, profit } = calc
  const gpPercent = (app.gpRate * 100).toFixed(1)

  return (
    <section className="sl-card">
      <h2 className="sl-card-title sl-card-title-lg">ระบบจะบันทึกให้</h2>
      <dl className="sl-summary">
        <div>
          <dt>รายรับ · ยอดขาย {plates} ชุด</dt>
          <dd className="sl-pos">{money(sales, { sign: '+', whole: true })}</dd>
        </div>
        <div>
          <dt>รายจ่าย · ค่า GP {gpPercent}%</dt>
          <dd className="sl-neg">{money(gp, { sign: '−' })}</dd>
        </div>
        {app.discountPerOrder > 0 && (
          <div>
            <dt>
              รายจ่าย · ร้านร่วมจ่ายส่วนลด {money(app.discountPerOrder, { whole: true })} × {orders} ออร์เดอร์
            </dt>
            <dd className="sl-neg">{money(discount, { sign: '−' })}</dd>
          </div>
        )}
        <div>
          <dt>ต้นทุนวัตถุดิบ + แพ็ก (ตามสูตร)</dt>
          <dd className="sl-neg">{money(cost, { sign: '−' })}</dd>
        </div>
        <div className="sl-summary-total">
          <dt>กำไรขั้นต้น</dt>
          <dd className={profit < 0 ? 'sl-neg' : 'sl-pos'}>{money(profit, { sign: profit < 0 ? '−' : '' })}</dd>
        </div>
      </dl>
      <p className="sl-note">
        ค่าหักแบบรายเดือน (เช่น แพ็กเกจโปรโมท) บันทึกเป็นรายจ่ายแยกต้นเดือนอัตโนมัติ ·{' '}
        <button type="button" className="sl-inline-link" onClick={onEditDeductions}>
          แก้รายการหักในตั้งค่า
        </button>
      </p>
    </section>
  )
}
