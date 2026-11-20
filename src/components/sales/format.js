/** ฿ with 2 decimals, e.g. "฿115.56". Whole numbers can drop decimals with { whole: true }. */
export function money(n, { sign = '', whole = false } = {}) {
  const abs = Math.abs(n)
  const digits = whole && Number.isInteger(abs) ? 0 : 2
  return `${sign}฿${abs.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`
}

export const qty = (n) => n.toLocaleString('en-US')
