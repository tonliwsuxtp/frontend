// Hidden (fixed) monthly costs and break-even maths (fried mala shop).
import { INITIAL_MENUS, recipeCost } from '../menu-cost/menuCostData'

export const INITIAL_FIXED_COSTS = [
  { id: 'gas', name: 'ค่าแก๊ส', hint: 'ถังละ ~฿400 ใช้ ~1.5 ถัง/เดือน', amount: 600 },
  { id: 'utility', name: 'ค่าไฟ + น้ำ (ส่วนที่เพิ่ม)', hint: 'เทียบบิลก่อนเริ่มขาย', amount: 300 },
  { id: 'travel', name: 'ค่าเดินทางไปตลาด', hint: 'น้ำมันรถ / ค่าวิน', amount: 400 },
  { id: 'depreciation', name: 'ค่าเสื่อมอุปกรณ์', hint: 'หม้อทอด + ตะแกรง ฿3,600 ÷ 12 เดือน', amount: 300 },
  { id: 'promo', name: 'แพ็กเกจโปรโมทในแอป', hint: 'Grab ฿300/เดือน (จากตั้งค่า)', amount: 300 },
  { id: 'other', name: 'อื่น ๆ', hint: 'เช่น ถุงมือ น้ำยาล้างจาน', amount: 0 },
]

export const INITIAL_EXPECTED_SETS = 300

/** App deductions (from settings): GP incl. VAT + average per-order/campaign deduction per set. */
export const GP_RATE = 0.321
export const AVG_ORDER_DEDUCTION = 2.92

/** Month progress in the mock ("today" = 14 Nov 2569). */
export const MONTH = { label: 'พฤศจิกายน 2569', short: 'พ.ย.', daysElapsed: 14, daysInMonth: 30, soldSoFar: 149 }

const appDeduction = (price) => price * GP_RATE + AVG_ORDER_DEDUCTION

/** Per-menu full cost rows. */
export function menuRows(hiddenPerSet) {
  return INITIAL_MENUS.map((m) => {
    const ingredients = recipeCost(m.recipe)
    const deduction = appDeduction(m.price)
    const contribution = m.price - ingredients - deduction // profit before hidden costs
    return {
      id: m.id,
      name: m.name,
      price: m.price,
      ingredients,
      hidden: hiddenPerSet,
      deduction,
      contribution,
      profit: contribution - hiddenPerSet,
    }
  })
}

/** Break-even summary using the simple average contribution across menus. */
export function breakeven(fixedTotal, rows) {
  const avgContribution = rows.length ? rows.reduce((s, r) => s + r.contribution, 0) / rows.length : 0
  const sold = MONTH.soldSoFar
  const projectedSets = (sold / MONTH.daysElapsed) * MONTH.daysInMonth
  const reachable = avgContribution > 0
  const sets = reachable ? Math.ceil(fixedTotal / avgContribution) : null
  const profitBefore = sold * avgContribution
  return {
    avgContribution,
    reachable,
    sets,
    sold,
    remaining: reachable ? Math.max(0, sets - sold) : null,
    profitBefore,
    profitAfter: profitBefore - fixedTotal,
    projected: projectedSets * avgContribution - fixedTotal,
    scaleMax: Math.max(reachable ? Math.ceil(sets * 1.25) : 0, Math.ceil(projectedSets), sold, 1),
  }
}
