import { formatBaht } from '../overall/dateUtils'
import { EMPLOYMENT_CAP, PERSONAL_ALLOWANCE } from './taxCalc'

const minus = (n) => `−${formatBaht(n)}`

export default function TaxSteps({ r, side }) {
  return (
    <section className="tx2-card">
      <h2 className="tx2-card-title">ขั้นตอนการคำนวณ</h2>
      <div className="tx2-table-wrap">
        <table className="tx2-table">
          <thead>
            <tr>
              <th>ประเภทเงินได้</th>
              <th className="tx2-num">เงินได้</th>
              <th>วิธีหักค่าใช้จ่าย</th>
              <th className="tx2-num">หักได้</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>เงินเดือน <span className="tx2-muted">40(1)</span></td>
              <td className="tx2-num">{formatBaht(r.salary)}</td>
              <td rowSpan={2} className="tx2-merged">
                เหมา 50% รวมกัน ไม่เกิน {formatBaht(EMPLOYMENT_CAP)}
              </td>
              <td rowSpan={2} className="tx2-num tx2-strong tx2-merged">{minus(r.employmentDeduction)}</td>
            </tr>
            <tr>
              <td>ค่าคอมนายหน้า TikTok + Shopee <span className="tx2-muted">40(2)</span></td>
              <td className="tx2-num">{formatBaht(side.commission)}</td>
            </tr>
            <tr>
              <td>ขายของ Delivery <span className="tx2-muted">40(8)</span></td>
              <td className="tx2-num">{formatBaht(side.sales)}</td>
              <td>{r.method === 'actual' ? 'ตามจริง (จากรายจ่ายที่บันทึก)' : 'เหมา 60%'}</td>
              <td className="tx2-num tx2-strong">{minus(r.salesDeduction)}</td>
            </tr>
            <tr>
              <td colSpan={3}>
                ค่าลดหย่อน (ส่วนตัว {formatBaht(PERSONAL_ALLOWANCE)} + ประกันสังคม + อื่น ๆ)
              </td>
              <td className="tx2-num tx2-strong">{minus(r.allowances)}</td>
            </tr>
            <tr className="tx2-total-row">
              <td colSpan={3}>เงินได้สุทธิ</td>
              <td className="tx2-num">{formatBaht(r.net)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
