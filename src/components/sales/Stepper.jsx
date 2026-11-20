/** − value + control. variant "primary" makes the + button solid blue. */
export default function Stepper({ value, onChange, min = 0, max = 999, variant, label, size = 'md' }) {
  return (
    <div className={`sl-stepper sl-stepper-${size}`}>
      <button
        type="button"
        className="sl-step-btn"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`ลด${label ?? ''}`}
      >
        −
      </button>
      <span className="sl-step-value" aria-live="polite">{value}</span>
      <button
        type="button"
        className={`sl-step-btn${variant === 'primary' ? ' is-primary' : ''}`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`เพิ่ม${label ?? ''}`}
      >
        +
      </button>
    </div>
  )
}
