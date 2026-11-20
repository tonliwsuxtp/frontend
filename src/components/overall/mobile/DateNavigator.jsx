import { ChevronLeft, ChevronRight } from '../Icons'

export default function DateNavigator({ label, onPrev, onNext, canNext = true }) {
  return (
    <div className="ov-datenav">
      <button type="button" className="ov-icon-btn" onClick={onPrev} aria-label="ก่อนหน้า">
        <ChevronLeft />
      </button>
      <h1 className="ov-datenav-label">{label}</h1>
      <button type="button" className="ov-icon-btn" onClick={onNext} disabled={!canNext} aria-label="ถัดไป">
        <ChevronRight />
      </button>
    </div>
  )
}
