// Menu cost data (fried mala shop). Ingredient unit prices come from the ingredients page data
// ("ราคาเฉลี่ย 3 ครั้งล่าสุด"), so both pages agree.
import { INITIAL_INGREDIENTS, ingredientStats } from '../ingredients/ingredientsData'

const SMALL_UNIT = {
  weight: { label: 'ก.', per: 1000 },
  volume: { label: 'มล.', per: 1000 },
  count: { label: 'ชุด', per: 1 },
}

/** [{ id, name, unit, unitPrice }] — price per stock unit (gram / ml / set). */
export const INGREDIENT_PRICES = INITIAL_INGREDIENTS.map((ing) => {
  const u = SMALL_UNIT[ing.kind]
  return { id: ing.id, name: ing.name, unit: u.label, unitPrice: (ingredientStats(ing).avg3 ?? 0) / u.per }
})

export const ingredientById = Object.fromEntries(INGREDIENT_PRICES.map((i) => [i.id, i]))

/**
 * Delivery channels.
 * gpRate: GP incl. VAT · fixed: baht per order (shop-funded discount) · extraRate: extra % of price.
 */
export const CHANNELS = [
  { id: 'grab', name: 'Grab', label: 'GP 30% + VAT + ฿5', gpRate: 0.321, fixed: 5, extraRate: 0, otherNote: 'ร้านร่วมจ่ายส่วนลด ฿5/ออร์เดอร์' },
  { id: 'lineman', name: 'LINE MAN', label: 'GP 30% + VAT + 5%', gpRate: 0.321, fixed: 0, extraRate: 0.05, otherNote: 'ค่าบริการเพิ่ม 5%' },
  { id: 'shopeefood', name: 'ShopeeFood', label: 'GP 30% + VAT', gpRate: 0.321, fixed: 0, extraRate: 0, otherNote: null },
]

/** Short "GP + ค่าหักอื่น" text, e.g. "32.1% + ฿5". */
export function deductionText(ch) {
  const parts = [`${(ch.gpRate * 100).toFixed(1)}%`]
  if (ch.fixed) parts.push(`฿${ch.fixed}`)
  if (ch.extraRate) parts.push(`${ch.extraRate * 100}%`)
  return parts.join(' + ')
}

const line = (ingredientId, qty) => ({ ingredientId, qty })

export const INITIAL_MENUS = [
  {
    id: 'mixed', name: 'ชุดหม่าล่าทอดรวม 10 ไม้', price: 60,
    recipe: [line('pork', 60), line('meatball', 60), line('sausage', 40), line('enoki', 30), line('fishtofu', 40), line('mala', 8), line('oil', 40), line('box', 1)],
  },
  {
    id: 'porkbelly', name: 'ชุดหมูสามชั้นทอด', price: 55,
    recipe: [line('pork', 120), line('mala', 8), line('oil', 40), line('box', 1)],
  },
  {
    id: 'balls', name: 'ชุดลูกชิ้น + ไส้กรอก', price: 55,
    recipe: [line('meatball', 100), line('sausage', 80), line('mala', 6), line('oil', 30), line('box', 1)],
  },
  {
    id: 'veggie', name: 'ชุดผักทอดหม่าล่า', price: 45,
    recipe: [line('enoki', 100), line('fishtofu', 60), line('mala', 6), line('oil', 30), line('box', 1)],
  },
]

export const lineCost = (l) => (Number(l.qty) || 0) * (ingredientById[l.ingredientId]?.unitPrice ?? 0)
export const recipeCost = (recipe) => recipe.reduce((s, l) => s + lineCost(l), 0)

/** Profit of one set sold through `ch` at `price` with ingredient cost `cost`. */
export function channelProfit(price, cost, ch) {
  const gp = price * ch.gpRate
  const other = ch.fixed + price * ch.extraRate
  const net = price - gp - other
  const profit = net - cost
  return { gp, other, net, profit, margin: price > 0 ? (profit / price) * 100 : 0 }
}

/** Lowest whole-baht price that reaches `margin` (0–1) on this channel; null if impossible. */
export function priceForMargin(cost, ch, margin) {
  const denom = 1 - ch.gpRate - ch.extraRate - margin
  return denom > 0 ? Math.ceil((cost + ch.fixed) / denom) : null
}
