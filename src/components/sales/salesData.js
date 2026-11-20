// Mock configuration for the sales page — will come from Settings / Menu cost / Stock pages later.

/** Delivery apps and their deductions. gpRate already includes VAT (30% × 1.07 = 32.1%). */
export const APPS = [
  { id: 'grab', name: 'Grab', label: 'GP 30% + VAT', gpRate: 0.321, discountPerOrder: 5 },
  { id: 'lineman', name: 'LINE MAN', label: 'GP 30% + VAT', gpRate: 0.321, discountPerOrder: 0 },
  { id: 'shopeefood', name: 'ShopeeFood', label: 'GP 30% + VAT', gpRate: 0.321, discountPerOrder: 0 },
]

/**
 * Ingredients in stock (fried mala skewer shop). `low` = warning threshold.
 * Values are the stock *before* the pre-filled sample order, so it shows every status colour.
 */
export const INITIAL_STOCK = {
  pork: { name: 'หมูสามชั้น', unit: 'ก.', qty: 360, low: 300 },
  meatball: { name: 'ลูกชิ้นรวม', unit: 'ลูก', qty: 200, low: 50 },
  sausage: { name: 'ไส้กรอก', unit: 'ชิ้น', qty: 60, low: 20 },
  enoki: { name: 'เห็ดเข็มทอง', unit: 'ก.', qty: 400, low: 250 },
  fishTofu: { name: 'เต้าหู้ปลา', unit: 'ชิ้น', qty: 40, low: 15 },
  mala: { name: 'ผงหม่าล่า', unit: 'ก.', qty: 500, low: 100 },
  oil: { name: 'น้ำมันทอด', unit: 'มล.', qty: 3000, low: 1000 },
  box: { name: 'กล่อง + ไม้เสียบ', unit: 'ชุด', qty: 40, low: 50 },
}

/** Menus (sets of skewers) with price, cost per set (ingredients + packaging) and recipe per set. */
export const MENUS = [
  {
    id: 'mixed', name: 'ชุดหม่าล่าทอดรวม 10 ไม้', short: 'หม่าล่ารวม', price: 60, cost: 31.63,
    recipe: { pork: 60, meatball: 3, sausage: 2, enoki: 30, fishTofu: 2, mala: 8, oil: 40, box: 1 },
  },
  {
    id: 'porkbelly', name: 'ชุดหมูสามชั้นทอด', short: 'หมูสามชั้น', price: 55, cost: 31.24,
    recipe: { pork: 120, mala: 8, oil: 40, box: 1 },
  },
  {
    id: 'balls', name: 'ชุดลูกชิ้น + ไส้กรอก', short: 'ลูกชิ้น + ไส้กรอก', price: 55, cost: 26.8,
    recipe: { meatball: 5, sausage: 4, mala: 6, oil: 30, box: 1 },
  },
  {
    id: 'veggie', name: 'ชุดผักทอดหม่าล่า', short: 'ผักทอด', price: 45, cost: 24.72,
    recipe: { enoki: 80, fishTofu: 3, mala: 6, oil: 30, box: 1 },
  },
]

/** Sales already recorded (sample). */
export const INITIAL_SALES = [
  { id: 's1', date: '2026-11-14', time: '11:40', items: 'หม่าล่ารวม × 6, หมูสามชั้น × 4', app: 'Grab', sales: 580, profit: 69 },
  { id: 's2', date: '2026-11-14', time: '12:15', items: 'ลูกชิ้น + ไส้กรอก × 3', app: 'ShopeeFood', sales: 165, profit: 32 },
  { id: 's3', date: '2026-11-14', time: '17:30', items: 'หม่าล่ารวม × 3', app: 'LINE MAN', sales: 180, profit: 18 },
]

export const DEFAULT_SALE_DATE = '2026-11-14'

/** Everything the system will record for the current order. */
export function calculateSale({ app, quantities, orders, stock }) {
  const lines = MENUS.filter((m) => quantities[m.id] > 0).map((m) => ({ menu: m, qty: quantities[m.id] }))
  const plates = lines.reduce((s, l) => s + l.qty, 0)
  const sales = lines.reduce((s, l) => s + l.qty * l.menu.price, 0)
  const cost = lines.reduce((s, l) => s + l.qty * l.menu.cost, 0)
  const gp = sales * app.gpRate
  const discount = plates ? app.discountPerOrder * orders : 0
  const profit = sales - gp - discount - cost

  const usage = {}
  for (const { menu, qty } of lines) {
    for (const [id, amount] of Object.entries(menu.recipe)) usage[id] = (usage[id] ?? 0) + amount * qty
  }
  const stockLines = Object.entries(usage).map(([id, used]) => {
    const item = stock[id]
    const left = item.qty - used
    const status = left <= 0 ? 'out' : left < item.low ? 'low' : 'ok'
    return { id, ...item, used, left, status }
  })

  return { lines, plates, sales, cost, gp, discount, profit, stockLines }
}
