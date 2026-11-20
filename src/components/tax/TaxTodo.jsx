import { formatBaht } from '../overall/dateUtils'
import { PND94_THRESHOLD, VAT_THRESHOLD } from './taxCalc'

export default function TaxTodo({ year, side, r }) {
  const be = year + 543
  const mustFile94 = side.halfYearSales > PND94_THRESHOLD
  const vatBase = side.sales + side.commission
  const vatPct = (vatBase / VAT_THRESHOLD) * 100

  const items = [
    {
      tag: 'ภาษีครึ่งปี · ภ.ง.ด.94',
      title: `ยื่นภายใน 30 ก.ย. ${be}`,
      body: mustFile94
        ? `ต้องยื่น (ม.ค.–มิ.ย. รายได้ขายของ ${formatBaht(side.halfYearSales)} เกิน ${PND94_THRESHOLD.toLocaleString('en-US')})`
        : `ปีนี้ไม่ต้องยื่น (ม.ค.–มิ.ย. รายได้ขายของ ${formatBaht(side.halfYearSales)} ไม่เกิน ${PND94_THRESHOLD.toLocaleString('en-US')})`,
      warn: mustFile94,
    },
    {
      tag: 'ภาษีทั้งปี · ภ.ง.ด.90',
      title: `1 ม.ค. – 31 มี.ค. ${be + 1}`,
      body: 'มีรายได้หลายประเภท ใช้แบบ ภ.ง.ด.90 (ไม่ใช่ 91)',
    },
    {
      tag: 'VAT',
      title: `${vatPct.toFixed(1)}% ของเพดาน ฿1.8 ล้าน`,
      body: 'ยอดขายถึง 1.8 ล้าน/ปี ต้องจด VAT ภายใน 30 วัน',
      warn: vatPct >= 80,
    },
    {
      tag: 'เอกสาร',
      title: r.method === 'actual' ? 'แนบใบเสร็จทุกรายจ่าย' : 'เก็บใบเสร็จไว้เผื่อตรวจ',
      body:
        r.method === 'actual'
          ? 'ถ้าหักค่าใช้จ่ายตามจริง ต้องมีหลักฐาน'
          : 'ใช้เหมา 60% ไม่ต้องแนบ แต่ถ้าเปลี่ยนเป็นตามจริงต้องมีหลักฐาน',
    },
  ]

  return (
    <section className="tx2-card">
      <h2 className="tx2-card-title">ปฏิทินและสิ่งที่ต้องทำ</h2>
      <div className="tx2-todo">
        {items.map((it) => (
          <div key={it.tag} className={`tx2-todo-item${it.warn ? ' is-warn' : ''}`}>
            <small>{it.tag}</small>
            <strong>{it.title}</strong>
            <p>{it.body}</p>
          </div>
        ))}
      </div>
      <p className="tx2-muted tx2-small tx2-note">
        ตัวเลขนี้เป็นการประมาณการจากข้อมูลที่บันทึก ไม่ใช่คำแนะนำทางภาษี ควรตรวจสอบกับกรมสรรพากรหรือผู้เชี่ยวชาญก่อนยื่นจริง
      </p>
    </section>
  )
}
