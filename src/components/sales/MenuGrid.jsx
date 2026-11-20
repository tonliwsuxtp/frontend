import Stepper from './Stepper'
import { MENUS } from './salesData'
import { money } from './format'

export default function MenuGrid({ quantities, onChange }) {
  return (
    <div className="sl-menus">
      {MENUS.map((m) => {
        const q = quantities[m.id] ?? 0
        return (
          <section key={m.id} className={`sl-card sl-menu${q > 0 ? ' is-selected' : ''}`}>
            <h3 className="sl-menu-name">{m.name}</h3>
            <p className="sl-menu-meta">
              ราคา {money(m.price, { whole: true })} · ต้นทุน {money(m.cost)}
            </p>
            <Stepper value={q} onChange={(v) => onChange(m.id, v)} variant="primary" label={m.name} size="lg" />
          </section>
        )
      })}
    </div>
  )
}
