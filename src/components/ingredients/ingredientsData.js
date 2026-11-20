// Mock purchase history (fried mala shop). Every price on the page is derived from it.

/** Units by kind. `factor` converts to the main unit (first entry). */
export const UNIT_KINDS = {
  weight: { units: [{ id: 'kg', label: 'กก.', factor: 1 }, { id: 'g', label: 'กรัม', factor: 0.001 }], small: 'กรัม' },
  volume: { units: [{ id: 'l', label: 'ลิตร', factor: 1 }, { id: 'ml', label: 'มล.', factor: 0.001 }], small: 'มล.' },
  count: { units: [{ id: 'set', label: 'ชุด', factor: 1 }], small: null },
}

const p = (date, store, qty, total) => ({ date, store, qty, total }) // qty in main unit

export const INITIAL_INGREDIENTS = [
  {
    id: 'pork', name: 'หมูสามชั้น', kind: 'weight',
    purchases: [p('2026-10-20', 'ตลาดสด', 2, 290), p('2026-10-27', 'ตลาดสด', 2, 300), p('2026-11-03', 'ตลาดสด', 2, 310), p('2026-11-08', 'ตลาดสด', 2, 300), p('2026-11-14', 'ตลาดสด', 2, 320)],
  },
  {
    id: 'meatball', name: 'ลูกชิ้นรวม', kind: 'weight',
    purchases: [p('2026-10-25', 'ห้างค้าส่ง', 3, 285), p('2026-11-01', 'ห้างค้าส่ง', 3, 285), p('2026-11-09', 'ห้างค้าส่ง', 3, 285)],
  },
  {
    id: 'sausage', name: 'ไส้กรอก', kind: 'weight',
    purchases: [p('2026-10-28', 'ห้างค้าส่ง', 2, 240), p('2026-11-04', 'ห้างค้าส่ง', 2, 250), p('2026-11-11', 'ห้างค้าส่ง', 2, 260)],
  },
  {
    id: 'enoki', name: 'เห็ดเข็มทอง', kind: 'weight',
    purchases: [p('2026-10-30', 'ตลาดสด', 1, 70), p('2026-11-06', 'ตลาดสด', 1, 90), p('2026-11-13', 'ตลาดสด', 1, 80)],
  },
  {
    id: 'fishtofu', name: 'เต้าหู้ปลา', kind: 'weight',
    purchases: [p('2026-11-02', 'ห้างค้าส่ง', 1, 85), p('2026-11-10', 'ห้างค้าส่ง', 1, 85)],
  },
  {
    id: 'mala', name: 'ผงหม่าล่า', kind: 'weight',
    purchases: [p('2026-10-15', 'ร้านเครื่องเทศ', 0.5, 210), p('2026-11-05', 'ร้านเครื่องเทศ', 0.5, 225)],
  },
  {
    id: 'oil', name: 'น้ำมันทอด', kind: 'volume',
    purchases: [p('2026-10-28', 'ห้างค้าส่ง', 5, 260), p('2026-11-07', 'ห้างค้าส่ง', 5, 250), p('2026-11-13', 'ห้างค้าส่ง', 5, 270)],
  },
  {
    id: 'box', name: 'กล่อง + ไม้เสียบ', kind: 'count',
    purchases: [p('2026-11-01', 'ร้านบรรจุภัณฑ์', 100, 250), p('2026-11-12', 'ร้านบรรจุภัณฑ์', 100, 250)],
  },
]

/** "Today" in the mock — purchases are recorded on this date. */
export const PURCHASE_DATE = '2026-11-14'

export const mainUnit = (ing) => UNIT_KINDS[ing.kind].units[0].label
export const unitPrice = (purchase) => purchase.total / purchase.qty

const pct = (now, before) => (before ? ((now - before) / before) * 100 : null)

/** Latest price, previous price, average of last 3, % change and last purchase. */
export function ingredientStats(ing) {
  const list = ing.purchases
  const last = list.at(-1)
  const prev = list.at(-2)
  const last3 = list.slice(-3)
  const latest = last ? unitPrice(last) : null
  return {
    latest,
    previous: prev ? unitPrice(prev) : null,
    avg3: last3.length ? last3.reduce((s, x) => s + unitPrice(x), 0) / last3.length : null,
    change: prev ? pct(latest, unitPrice(prev)) : null,
    last,
  }
}

/** Latest purchase strictly before `date` (used as "ครั้งก่อน" in the purchase preview). */
export function purchaseBefore(ing, date) {
  return ing.purchases.filter((x) => x.date < date).at(-1) ?? null
}

export { pct as percentChange }
