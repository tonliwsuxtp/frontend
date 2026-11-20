import { AVG_ORDER_DEDUCTION, GP_RATE } from './breakevenData'
import { price } from '../ingredients/format'

const money = (n) => `${n < 0 ? '−' : ''}${price(Math.abs(n), 2)}`

export default function FullCostTable({ rows }) {
  return (
    <section className="be-card">
      <h2 className="be-card-title">ต้นทุนเต็มต่อชุด (รวมต้นทุนแฝง)</h2>
      <div className="be-table-wrap">
        <table className="be-table">
          <thead>
            <tr>
              <th>เมนู</th>
              <th className="be-num">ราคา</th>
              <th className="be-num">วัตถุดิบ</th>
              <th className="be-num">+ แฝง</th>
              <th className="be-num">GP + ค่าหักแอป</th>
              <th className="be-num">กำไรจริง/ชุด</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td className="be-num">{price(r.price)}</td>
                <td className="be-num">{price(r.ingredients, 2)}</td>
                <td className="be-num be-hidden">{price(r.hidden, 2)}</td>
                <td className="be-num">{price(r.deduction, 2)}</td>
                <td className={`be-num be-strong ${r.profit < 0 ? 'be-neg' : 'be-pos'}`}>{money(r.profit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="be-note">
        GP 30% + VAT 7% = {(GP_RATE * 100).toFixed(1)}% ของยอดขาย + ค่าหักต่อออร์เดอร์/แคมเปญเฉลี่ย{' '}
        {price(AVG_ORDER_DEDUCTION, 2)} ต่อชุด (ดึงจากหน้าตั้งค่า)
      </p>
    </section>
  )
}
