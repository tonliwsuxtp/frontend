import Stepper from './Stepper'
import { APPS } from './salesData'

export default function ChannelPicker({ appId, onAppChange, orders, onOrdersChange }) {
  return (
    <section className="sl-card">
      <h2 className="sl-card-title">ขายผ่าน</h2>
      <div className="sl-apps" role="radiogroup" aria-label="ขายผ่าน">
        {APPS.map((a) => (
          <button
            key={a.id}
            type="button"
            role="radio"
            aria-checked={appId === a.id}
            className={`sl-app${appId === a.id ? ' is-active' : ''}`}
            onClick={() => onAppChange(a.id)}
          >
            <strong>{a.name}</strong>
            <small>{a.label}</small>
          </button>
        ))}
      </div>

      <div className="sl-orders">
        <span>
          จำนวนออร์เดอร์ <small>(ใช้คิดค่าหักต่อออร์เดอร์)</small>
        </span>
        <Stepper value={orders} onChange={onOrdersChange} min={1} label="จำนวนออร์เดอร์" size="sm" />
      </div>
    </section>
  )
}
