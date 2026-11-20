import { price } from '../ingredients/format'

export default function FixedCostForm({ costs, onCostChange, total, expectedSets, onExpectedChange, hiddenPerSet }) {
  return (
    <section className="be-card">
      <h2 className="be-card-title">ต้นทุนแฝงต่อเดือน</h2>

      <ul className="be-costs">
        {costs.map((c) => (
          <li key={c.id}>
            <label htmlFor={`be-${c.id}`}>
              <span>{c.name}</span>
              <small>{c.hint}</small>
            </label>
            <input
              id={`be-${c.id}`}
              className="be-input"
              type="number"
              min="0"
              step="any"
              value={c.amount}
              onChange={(e) => onCostChange(c.id, e.target.value)}
            />
          </li>
        ))}
      </ul>

      <div className="be-total">
        <span>รวมต่อเดือน</span>
        <strong>{price(total, 0)}</strong>
      </div>

      <label className="be-expected">
        <span>คาดว่าขายได้ต่อเดือน (ชุด)</span>
        <input
          className="be-input"
          type="number"
          min="0"
          step="1"
          value={expectedSets}
          onChange={(e) => onExpectedChange(e.target.value)}
        />
      </label>

      <div className="be-per-set">
        <span>ต้นทุนแฝงต่อชุด</span>
        <strong>{hiddenPerSet === null ? '—' : price(hiddenPerSet, 2)}</strong>
      </div>
    </section>
  )
}
