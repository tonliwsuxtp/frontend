// Analytics data. Period figures come from the same generated transactions as the overview page;
// menu costs come from the menu-cost page, so all pages agree.
import { CHANNELS, DATA_END, EXPENSE_CATEGORIES, getDayTransactions } from '../overall/mockData'
import { INITIAL_MENUS, ingredientById, lineCost, recipeCost } from '../menu-cost/menuCostData'
import { SHORT_MONTHS, toBuddhistYear } from '../overall/dateUtils'

const SET_PRICE = 60 // delivery sale lines in the mock are priced per 60-baht set

/** Totals for [start, end] inclusive. */
function summarizeRange(start, end) {
  const s = {
    income: 0,
    expense: 0,
    sets: 0,
    channels: Object.fromEntries(CHANNELS.map((c) => [c.id, 0])),
    categories: Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c, 0])),
  }
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    for (const t of getDayTransactions(d)) {
      if (t.amount >= 0) {
        s.income += t.amount
        s.channels[t.channel] += t.amount
        if (t.category === 'ยอดขาย') s.sets += Math.round(t.amount / SET_PRICE)
      } else {
        s.expense -= t.amount
        s.categories[t.category] -= t.amount
      }
    }
  }
  s.profit = s.income - s.expense
  return s
}

const rangeLabel = (start, end) =>
  `${start.getDate()}–${end.getDate()} ${SHORT_MONTHS[end.getMonth()]}`

/**
 * Month-to-date vs the same days of the previous month / same month last year.
 * mode: 'month' | 'year'
 */
export function comparePeriods(mode, end = DATA_END) {
  const curStart = new Date(end.getFullYear(), end.getMonth(), 1)
  const shift = (d) =>
    mode === 'month' ? new Date(d.getFullYear(), d.getMonth() - 1, d.getDate()) : new Date(d.getFullYear() - 1, d.getMonth(), d.getDate())
  const prevStart = shift(curStart)
  const prevEnd = shift(end)

  const cur = summarizeRange(curStart, end)
  const prev = summarizeRange(prevStart, prevEnd)

  return {
    curLabel: rangeLabel(curStart, end),
    prevLabel: rangeLabel(prevStart, prevEnd),
    curFull: `${rangeLabel(curStart, end)} ${toBuddhistYear(end)}`,
    prevFull: `${rangeLabel(prevStart, prevEnd)} ${toBuddhistYear(prevEnd)}`,
    cur,
    prev,
  }
}

/* ---------------- Menu analysis (last 30 days) ---------------- */

const GP_RATE = 0.321
const AVG_ORDER_DEDUCTION = 2.92

/** Sets sold per menu in the last 30 days (mock). */
const SOLD_30D = { mixed: 70, porkbelly: 50, balls: 29, veggie: 8 }

export const QUADRANTS = {
  keep: { label: 'เก็บไว้', hint: 'ขายดี + กำไรดี → เก็บไว้' },
  adjust: { label: 'ปรับราคา/สูตร', hint: 'ขายดี + กำไรน้อย → ปรับราคา/สูตร' },
  promote: { label: 'โปรโมทเพิ่ม', hint: 'ขายน้อย + กำไรดี → โปรโมทเพิ่ม' },
  cut: { label: 'พิจารณาตัด', hint: 'ขายน้อย + กำไรน้อย → พิจารณาตัด' },
}

function adviceText(quadrant, menu) {
  if (quadrant === 'keep') return 'ตัวทำเงินหลัก รักษาคุณภาพและราคาไว้ ใช้เป็นเมนูแนะนำบนแอป'
  if (quadrant === 'promote') return 'กำไรดีแต่คนสั่งน้อย ลองถ่ายรูปใหม่ หรือทำโปรคู่กับเมนูขายดี'
  if (quadrant === 'cut') return 'ขายน้อยและกำไรต่ำ ตัดออกจะลดสต็อกที่ต้องถือ'
  const priciest = [...menu.recipe].sort((a, b) => lineCost(b) - lineCost(a))[0]
  const name = priciest ? ingredientById[priciest.ingredientId].name : 'วัตถุดิบ'
  return `ขายดีแต่กำไรต่ำ ลองขึ้นราคา ฿5 หรือลดปริมาณ${name} (วัตถุดิบที่แพงที่สุดในสูตร) แล้วดูยอดขาย`
}

/** [{ id, name, sold, profitPerSet, total, quadrant, advice }] + averages used for the quadrant split. */
export function menuAnalysis() {
  const rows = INITIAL_MENUS.map((m) => {
    const profitPerSet = m.price - m.price * GP_RATE - AVG_ORDER_DEDUCTION - recipeCost(m.recipe)
    const sold = SOLD_30D[m.id] ?? 0
    return { id: m.id, name: m.name, menu: m, sold, profitPerSet, total: sold * profitPerSet }
  })
  const avgSold = rows.reduce((s, r) => s + r.sold, 0) / rows.length
  const avgProfit = rows.reduce((s, r) => s + r.profitPerSet, 0) / rows.length
  for (const r of rows) {
    const highSales = r.sold >= avgSold
    const highProfit = r.profitPerSet >= avgProfit
    r.quadrant = highSales ? (highProfit ? 'keep' : 'adjust') : highProfit ? 'promote' : 'cut'
    r.advice = adviceText(r.quadrant, r.menu)
  }
  return { rows, avgSold, avgProfit }
}

/* ---------------- Affiliate products (นายหน้า) ---------------- */

export const AFFILIATE_MONTH = 'พ.ย. 2569'

export const AFFILIATE_PRODUCTS = [
  { id: 'a1', name: 'หม้อทอดไร้น้ำมัน (คลิปรีวิว)', platform: 'tiktok', category: 'เครื่องใช้ในบ้าน', commission: 620, ads: 0 },
  { id: 'a2', name: 'ครีมกันแดด', platform: 'tiktok', category: 'ความงาม', commission: 410, ads: 0 },
  { id: 'a3', name: 'แบตสำรอง', platform: 'tiktok', category: 'แก็ดเจ็ต', commission: 220, ads: 0 },
  { id: 'a4', name: 'แก้วเก็บความเย็น', platform: 'shopee', category: 'เครื่องใช้ในบ้าน', commission: 240, ads: 100 },
  { id: 'a5', name: 'กระเป๋าผ้า', platform: 'shopee', category: 'แฟชั่น', commission: 380, ads: 250 },
]

/** Ads should return at least this much commission per ฿1. */
export const MIN_AD_RETURN = 2
