import { formatNumber } from '../dateUtils'

export default function TaxCard({ buddhistYear, amount }) {
  return (
    <section className="ov-tax">
      <p className="ov-tax-title">ภาษีที่ต้องจ่ายเพิ่ม (ประมาณการปี {buddhistYear})</p>
      <p className="ov-tax-value">{formatNumber(amount)}</p>
    </section>
  )
}
