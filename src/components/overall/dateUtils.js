export const toBuddhistYear = (date) => date.getFullYear() + 543

export const SHORT_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
const LONG_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]

export const PERIOD_TABS = [
  { id: 'day', label: 'รายวัน' },
  { id: 'month', label: 'รายเดือน' },
  { id: 'year', label: 'รายปี' },
]

/** "วันนี้" / "เดือนนี้" / "ปีนี้" */
export const PERIOD_SUFFIX = { day: 'วันนี้', month: 'เดือนนี้', year: 'ปีนี้' }

export const formatShortDate = (date) => `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`

export function formatPeriodLabel(period, date) {
  if (period === 'day') return `${formatShortDate(date)} ${toBuddhistYear(date)}`
  if (period === 'month') return `${LONG_MONTHS[date.getMonth()]} ${toBuddhistYear(date)}`
  return `พ.ศ. ${toBuddhistYear(date)}`
}

/** Short label used under the chart bars. */
export function formatBarLabel(period, date) {
  if (period === 'day') return String(date.getDate())
  if (period === 'month') return SHORT_MONTHS[date.getMonth()]
  return String(toBuddhistYear(date))
}

const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()

/** Move `date` by `step` units of `period`, keeping the day of month where possible. */
export function shiftDate(period, date, step) {
  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()
  if (period === 'day') return new Date(y, m, d + step)
  if (period === 'month') return new Date(y, m + step, Math.min(d, daysInMonth(y, m + step)))
  return new Date(y + step, m, Math.min(d, daysInMonth(y + step, m)))
}

export const formatNumber = (n) => Math.abs(Math.round(n)).toLocaleString('en-US')

/** Signed number, e.g. "+1,140" / "-688". */
export const formatSigned = (n, sign = n < 0 ? '-' : '+') => `${sign}${formatNumber(n)}`

/** Baht amount, e.g. "฿2,309", "+฿180", "−฿320". */
export function formatBaht(n, { signed = false } = {}) {
  const sign = n < 0 ? '−' : signed ? '+' : ''
  return `${sign}฿${formatNumber(n)}`
}
