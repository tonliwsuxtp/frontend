import { formatBaht } from '../overall/dateUtils'
import { SOCIAL_SECURITY_CAP } from './taxCalc'

function Field({ label, value, onChange, wide }) {
  return (
    <label className={`tx2-field${wide ? ' is-wide' : ''}`}>
      <span>{label}</span>
      <input className="tx2-input" type="number" min="0" step="any" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

export default function TaxInputs({ inputs, onChange, r }) {
  const set = (key) => (value) => onChange({ ...inputs, [key]: value })
  const best = r.actual >= r.flat ? r.actual : r.flat
  const methods = [
    { id: 'best', label: 'เลือกให้คุ้มสุด', amount: best },
    { id: 'flat', label: 'เหมา 60%', amount: r.flat },
    { id: 'actual', label: 'ตามจริง', amount: r.actual },
  ]

  return (
    <section className="tx2-card">
      <h2 className="tx2-card-title">ข้อมูลที่ต้องกรอกเอง</h2>
      <div className="tx2-fields">
        <Field label="เงินเดือนทั้งปี (จากงานประจำ) — บาท" value={inputs.salary} onChange={set('salary')} wide />
        <Field label="ภาษีที่บริษัทหักไว้ทั้งปี" value={inputs.withheld} onChange={set('withheld')} />
        <Field label="ภาษีหัก ณ ที่จ่ายอื่น (ใบ 50 ทวิ)" value={inputs.otherWithheld} onChange={set('otherWithheld')} />
        <Field label={`ประกันสังคม (สูงสุด ${SOCIAL_SECURITY_CAP.toLocaleString('en-US')})`} value={inputs.socialSecurity} onChange={set('socialSecurity')} />
        <Field label="ลดหย่อนอื่น ๆ รวม" value={inputs.otherDeductions} onChange={set('otherDeductions')} />
      </div>
      <p className="tx2-muted tx2-small">
        ลดหย่อนอื่น ๆ เช่น ประกันชีวิต ประกันสุขภาพ SSF/RMF ค่าลดหย่อนบิดามารดา ใส่เป็นยอดรวม
      </p>

      <h3 className="tx2-section-title">วิธีหักค่าใช้จ่าย “ขายของ Delivery” (40(8))</h3>
      <div className="tx2-methods" role="radiogroup" aria-label="วิธีหักค่าใช้จ่าย">
        {methods.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={inputs.method === m.id}
            className={`tx2-method${inputs.method === m.id ? ' is-active' : ''}`}
            onClick={() => set('method')(m.id)}
          >
            <span>{m.label}</span>
            <strong>{formatBaht(m.amount)}</strong>
          </button>
        ))}
      </div>
      <p className="tx2-muted tx2-small">
        รายจ่ายจริงที่บันทึกไว้ (วัตถุดิบ + บรรจุภัณฑ์ + GP + โปรโมท) {formatBaht(r.actual)} เทียบกับเหมา 60% ={' '}
        {formatBaht(r.flat)}
        {inputs.method === 'best' && ` → ใช้${r.method === 'actual' ? 'ตามจริง' : 'เหมา 60%'}`}
      </p>
    </section>
  )
}
