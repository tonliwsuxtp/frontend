import { qty } from './format'

export default function StockDeduction({ stockLines, onOpenStock }) {
  const warnings = stockLines.filter((s) => s.status !== 'ok')

  return (
    <section className="sl-card">
      <h2 className="sl-card-title sl-card-title-lg">ตัดสต็อก</h2>

      {stockLines.length === 0 ? (
        <p className="sl-empty">เลือกเมนูเพื่อดูวัตถุดิบที่จะถูกตัด</p>
      ) : (
        <ul className="sl-stock">
          {stockLines.map((s) => (
            <li key={s.id}>
              <span>{s.name}</span>
              <span className="sl-muted">
                −{qty(s.used)} {s.unit}
              </span>
              <strong className={`sl-stock-left is-${s.status}`}>
                {s.left < 0 ? `ขาด ${qty(-s.left)} ${s.unit}` : `เหลือ ${qty(s.left)} ${s.unit}`}
              </strong>
            </li>
          ))}
        </ul>
      )}

      {warnings.length > 0 && (
        <p className="sl-warning">
          ใกล้หมด: {warnings.map((w) => w.name).join(', ')} ·{' '}
          <button type="button" className="sl-inline-link" onClick={onOpenStock}>
            ไปหน้าสต็อก
          </button>
        </p>
      )}
    </section>
  )
}
