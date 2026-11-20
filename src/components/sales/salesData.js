// Mock configuration for the sales page — will come from Settings / Menu cost / Stock pages later.

/** Delivery apps and their deductions. gpRate already includes VAT (30% × 1.07 = 32.1%). */
export const APPS = [
  { id: 'grab', name: 'Grab', label: 'GP 30% + VAT', gpRate: 0.321, discountPerOrder: 5 },
  { id: 'lineman', name: 'LINE MAN', label: 'GP 30% + VAT', gpRate: 0.321, discountPerOrder: 0 },
  { id: 'shopeefood', name: 'ShopeeFood', label: 'GP 30% + VAT', gpRate: 0.321, discountPerOrder: 0 },
]

/**
 * Ingredients in stock. `low` = warning threshold.
 * Values are the stock *before* today's sample entry, so the first order empties หมูสับ like the design.
 */
export const INITIAL_STOCK = {
  pork: { name: 'หมูสับ', unit: 'ก.', qty: 720, low: 300 },
  rice: { name: 'ข้าวสาร', unit: 'ก.', qty: 6200, low: 1000 },
  basil: { name: 'ใบกะเพรา', unit: 'ก.', qty: 120, low: 50 },
  chili: { name: 'พริก + กระเทียม', unit: 'ก.', qty: 300, low: 80 },
  egg: { name: 'ไข่ไก่', unit: 'ฟอง', qty: 30, low: 10 },
  tofu: { name: 'เต้าหู้ไข่', unit: 'หลอด', qty: 10, low: 3 },
  box: { name: 'กล่อง + ช้อน', unit: 'ชุด', qty: 40, low: 50 },
}

/** Menus with price, cost per plate (ingredients + packaging) and recipe per plate. */
export const MENUS = [
  {
    id: 'kaprao', name: 'ข้าวกะเพราหมูสับ', short: 'กะเพราหมูสับ', price: 60, cost: 31.63,
    recipe: { pork: 120, rice: 100, basil: 15, chili: 10, box: 1 },
  },
  {
    id: 'friedrice', name: 'ข้าวผัดหมู', short: 'ข้าวผัดหมู', price: 55, cost: 31.24,
    recipe: { pork: 100, rice: 120, egg: 1, chili: 5, box: 1 },
  },
  {
    id: 'omelette', name: 'ข้าวไข่เจียวหมูสับ', short: 'ไข่เจียวหมูสับ', price: 55, cost: 26.8,
    recipe: { pork: 60, rice: 100, egg: 2, box: 1 },
  },
  {
    id: 'soup', name: 'ต้มจืดเต้าหู้หมูสับ', short: 'ต้มจืดเต้าหู้', price: 45, cost: 24.72,
    recipe: { pork: 80, tofu: 1, box: 1 },
  },
]

/** Sales already recorded (sample). */
export const INITIAL_SALES = [
  { id: 's1', date: '2026-11-14', time: '11:40', items: 'กะเพราหมูสับ × 6, ข้าวผัดหมู × 4', app: 'Grab', sales: 580, profit: 69 },
  { id: 's2', date: '2026-11-14', time: '12:15', items: 'ไข่เจียวหมูสับ × 3', app: 'ShopeeFood', sales: 165, profit: 32 },
  { id: 's3', date: '2026-11-14', time: '17:30', items: 'กะเพราหมูสับ × 3', app: 'LINE MAN', sales: 180, profit: 18 },
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
