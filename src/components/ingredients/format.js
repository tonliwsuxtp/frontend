import { SHORT_MONTHS } from '../overall/dateUtils'

/** ฿160 / ฿2.50 — drops decimals for whole numbers. */
export function price(n, digits) {
  const d = digits ?? (Number.isInteger(Math.round(n * 100) / 100) ? 0 : 2)
  return `฿${n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })}`
}

export const isoToShort = (iso) => {
  const [, m, d] = iso.split('-').map(Number)
  return `${d} ${SHORT_MONTHS[m - 1]}`
}

/** { arrow, text, tone } for a % change. */
export function changeInfo(change) {
  if (change === null) return { arrow: '', text: '—', tone: 'muted' }
  const rounded = Math.round(change * 10) / 10
  if (rounded > 0) return { arrow: '▲', text: `${rounded.toFixed(1)}%`, tone: 'up' }
  if (rounded < 0) return { arrow: '▼', text: `${Math.abs(rounded).toFixed(1)}%`, tone: 'down' }
  return { arrow: '—', text: '0%', tone: 'muted' }
}
