import { price } from './format'

export default function StockSummary({ stockValue, lowItems, wasteMonth }) {
  return (
    <div className="st-stats">
      <section className="st-stat">
        <p className="st-stat-label">มูลค่าสต็อกคงเหลือ</p>
        <p className="st-stat-value">{price(Math.round(stockValue), 0)}</p>
      </section>

      <section className={`st-stat${lowItems.length ? ' is-warn' : ''}`}>
        <p className="st-stat-label">ใกล้หมด ต้องซื้อเพิ่ม</p>
        <p className="st-stat-value">{lowItems.length} รายการ</p>
        <p className="st-stat-note">
          {lowItems.length ? lowItems.map((i) => i.name).join(', ') : 'สต็อกพอใช้ทุกรายการ'}
        </p>
      </section>

      <section className="st-stat">
        <p className="st-stat-label">ของเสียเดือนนี้</p>
        <p className="st-stat-value st-neg">{price(wasteMonth.value, 2)}</p>
        <p className="st-stat-note">{wasteMonth.count} ครั้ง · บันทึกเป็นรายจ่ายแล้ว</p>
      </section>
    </div>
  )
}
