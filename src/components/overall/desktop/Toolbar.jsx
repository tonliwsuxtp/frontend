import { ChevronLeft, ChevronRight } from '../Icons'
import { PERIOD_TABS, formatPeriodLabel } from '../dateUtils'

export default function Toolbar({ period, onPeriodChange, date, onPrev, onNext, canNext }) {
  return (
    <section className="ovd-card ovd-toolbar">
      <div className="ovd-tabs" role="tablist">
        {PERIOD_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={period === t.id}
            className={`ovd-tab${period === t.id ? ' is-active' : ''}`}
            onClick={() => onPeriodChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="ovd-datenav">
        <button type="button" className="ovd-square-btn" onClick={onPrev} aria-label="ก่อนหน้า">
          <ChevronLeft width={18} height={18} />
        </button>
        <span className="ovd-datenav-label">{formatPeriodLabel(period, date)}</span>
        <button type="button" className="ovd-square-btn" onClick={onNext} disabled={!canNext} aria-label="ถัดไป">
          <ChevronRight width={18} height={18} />
        </button>
      </div>
    </section>
  )
}
