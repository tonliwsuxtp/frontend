import { KINDS } from './stockData'

export { price, isoToShort } from '../ingredients/format'

export const num = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 2 })

/** "640 ก." */
export const amount = (n, item) => `${num(n)} ${KINDS[item.kind].small}`

/** Cost per small unit: 3 decimals for grams/ml, 2 for pieces. */
export const unitCostDigits = (item) => (item.kind === 'count' ? 2 : 3)
