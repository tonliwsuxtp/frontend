// Mock stock data (fried mala shop). Replace with API data later.

/** Unit labels per kind: `main` = purchase unit, `small` = stock unit, `per` = small units in one main unit. */
export const KINDS = {
  weight: { main: 'กก.', small: 'ก.', per: 1000 },
  volume: { main: 'ลิตร', small: 'มล.', per: 1000 },
  count: { main: 'ชุด', small: 'ชุด', per: 1 },
}

/**
 * price  = purchase price per main unit
 * yield  = usable fraction after trimming/washing (0–1)
 * qty    = remaining stock in small units
 * reorder = warn when qty falls below this
 */
export const INITIAL_ITEMS = [
  { id: 'pork', name: 'หมูสามชั้น', kind: 'weight', price: 160, yield: 0.95, qty: 640, reorder: 1000 },
  { id: 'meatball', name: 'ลูกชิ้นรวม', kind: 'weight', price: 95, yield: 1, qty: 1800, reorder: 1000 },
  { id: 'sausage', name: 'ไส้กรอก', kind: 'weight', price: 130, yield: 1, qty: 900, reorder: 500 },
  { id: 'enoki', name: 'เห็ดเข็มทอง', kind: 'weight', price: 80, yield: 0.7, qty: 120, reorder: 200 },
  { id: 'fishtofu', name: 'เต้าหู้ปลา', kind: 'weight', price: 85, yield: 1, qty: 700, reorder: 300 },
  { id: 'mala', name: 'ผงหม่าล่า', kind: 'weight', price: 450, yield: 1, qty: 350, reorder: 100 },
  { id: 'oil', name: 'น้ำมันทอด', kind: 'volume', price: 54, yield: 0.85, qty: 4000, reorder: 2000 },
  { id: 'box', name: 'กล่อง + ไม้เสียบ', kind: 'count', price: 2.5, yield: 1, qty: 40, reorder: 50 },
]

export const WASTE_REASONS = ['เหี่ยว/เน่า', 'หมดอายุ', 'แตก/ทำพลาด', 'ลูกค้าคืน']

export const INITIAL_WASTE = [
  { id: 'w1', date: '2026-11-13', itemId: 'enoki', qty: 200, reason: 'เหี่ยว/เน่า' },
  { id: 'w2', date: '2026-11-10', itemId: 'pork', qty: 150, reason: 'หมดอายุ' },
  { id: 'w3', date: '2026-11-05', itemId: 'box', qty: 4, reason: 'แตก/ทำพลาด' },
]

/** "Today" in the mock. */
export const TODAY = '2026-11-14'

/** Real cost per small unit, accounting for yield. */
export const realCost = (item) => item.price / KINDS[item.kind].per / item.yield

export function stockStatus(item) {
  if (item.qty <= 0) return { id: 'out', label: 'หมด' }
  if (item.qty < item.reorder) return { id: 'low', label: 'ใกล้หมด' }
  return { id: 'ok', label: 'พอใช้' }
}

export const wasteValue = (entry, items) => {
  const item = items.find((i) => i.id === entry.itemId)
  return item ? entry.qty * realCost(item) : 0
}
