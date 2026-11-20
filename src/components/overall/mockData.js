// Mock data — every figure on the page is aggregated from these generated transactions,
// so all cards stay consistent. Replace getDayTransactions() with real API data later.

export const CHANNELS = [
  { id: 'tiktok', name: 'นายหน้า TikTok', short: 'TikTok', color: '#18181b' },
  { id: 'shopee', name: 'นายหน้า Shopee', short: 'Shopee', color: '#d2502a' },
  { id: 'delivery', name: 'ขายของ Delivery', short: 'Delivery', color: '#6a44c8' },
]

export const DELIVERY_APPS = ['Grab', 'LINE MAN', 'ShopeeFood']

export const INCOME_CATEGORIES = { sales: 'ยอดขาย', commission: 'ค่าคอมมิชชั่น' }
export const EXPENSE_CATEGORIES = ['วัตถุดิบ', 'ค่า GP', 'ค่าโปรโมท/แคมเปญ', 'ค่าโฆษณา', 'บรรจุภัณฑ์']

/** The last day that has data ("today" in the mock). */
export const DATA_END = new Date(2026, 10, 14)

const GP_RATE = 0.321 // GP 30% + VAT 7%
const MENU = ['ข้าวกะเพราหมูสับ', 'ข้าวผัดหมู', 'ข้าวไข่เจียวหมูสับ', 'ผัดซีอิ๊วหมู']
const INGREDIENTS = ['ซื้อหมูสับ 2 กก.', 'ซื้อผักและเครื่องปรุง', 'ซื้อไข่ไก่ 2 แผง', 'ซื้อข้าวสาร 5 กก.']

export const toKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function seeded(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 10000) / 10000
}

const tx = (date, n, title, channel, category, amount, app) => ({
  id: `${toKey(date)}-${n}`,
  date,
  title,
  channel,
  app,
  category,
  amount, // + income, - expense
})

// Hand-written day matching the design mock-up (income 1,140 · expense 688).
function fixedNov14(date) {
  return [
    tx(date, 0, 'ซื้อกล่องและถุง', 'delivery', 'บรรจุภัณฑ์', -60),
    tx(date, 1, 'ค่าคอมมิชชั่น', 'tiktok', 'ค่าคอมมิชชั่น', 180),
    tx(date, 2, 'ค่า GP 30% + VAT · 16 ออร์เดอร์', 'delivery', 'ค่า GP', -308, 'Grab'),
    tx(date, 3, 'ขายข้าวกะเพราหมูสับ × 16', 'delivery', 'ยอดขาย', 960, 'Grab'),
    tx(date, 4, 'ซื้อหมูสับ 2 กก.', 'delivery', 'วัตถุดิบ', -320),
  ]
}

function generateDay(date) {
  const key = toKey(date)
  const r = (tag) => seeded(key + tag)
  const pick = (arr, tag) => arr[Math.floor(r(tag) * arr.length)]
  const list = []
  let n = 0
  const add = (...args) => list.push(tx(date, n++, ...args))

  if (r('tt') < 0.7) add('ค่าคอมมิชชั่น', 'tiktok', 'ค่าคอมมิชชั่น', 40 + Math.round(r('tta') * 16) * 10)
  if (r('sp') < 0.4) add('ค่าคอมมิชชั่น', 'shopee', 'ค่าคอมมิชชั่น', 20 + Math.round(r('spa') * 10) * 10)
  if (r('ad') < 0.15) add('ค่าโฆษณา Shopee', 'shopee', 'ค่าโฆษณา', 50 + Math.round(r('ada') * 10) * 10)

  let sales = 0
  let orders = 0
  DELIVERY_APPS.forEach((app, i) => {
    const max = [10, 7, 5][i]
    const count = Math.floor(r(`o${app}`) * max)
    if (!count) return
    const amount = count * 60
    sales += amount
    orders += count
    add(`ค่า GP 30% + VAT · ${count} ออร์เดอร์`, 'delivery', 'ค่า GP', -Math.round(amount * GP_RATE), app)
    add(`ขาย${pick(MENU, `m${app}`)} × ${count}`, 'delivery', 'ยอดขาย', amount, app)
    if (r(`p${app}`) < 0.12) add(`ส่วนลดแคมเปญ ${app}`, 'delivery', 'ค่าโปรโมท/แคมเปญ', -(30 + Math.round(r(`pa${app}`) * 8) * 10), app)
  })
  if (orders && r('pk') < 0.5) add('ซื้อกล่องและถุง', 'delivery', 'บรรจุภัณฑ์', -orders * 4)
  if (sales) add(pick(INGREDIENTS, 'ing'), 'delivery', 'วัตถุดิบ', -Math.round((sales * (0.38 + r('ingr') * 0.12)) / 10) * 10)

  return list
}

const dayCache = new Map()

/** Transactions of one day, oldest first. */
export function getDayTransactions(date) {
  if (date > DATA_END) return []
  const key = toKey(date)
  if (!dayCache.has(key)) {
    dayCache.set(key, key === '2026-11-14' ? fixedNov14(new Date(date)) : generateDay(new Date(date)))
  }
  return dayCache.get(key)
}

/** [start, end) of the period that contains `date`. */
export function periodRange(period, date) {
  const y = date.getFullYear()
  const m = date.getMonth()
  if (period === 'day') return [new Date(y, m, date.getDate()), new Date(y, m, date.getDate() + 1)]
  if (period === 'month') return [new Date(y, m, 1), new Date(y, m + 1, 1)]
  return [new Date(y, 0, 1), new Date(y + 1, 0, 1)]
}

const summaryCache = new Map()

/** Aggregated figures for the period containing `date`. period: 'day' | 'month' | 'year' */
export function getSummary(period, date) {
  const [start, end] = periodRange(period, date)
  const cacheKey = `${period}:${toKey(start)}`
  if (summaryCache.has(cacheKey)) return summaryCache.get(cacheKey)

  const s = {
    income: 0,
    expense: 0,
    commission: 0,
    sales: 0,
    channels: Object.fromEntries(CHANNELS.map((c) => [c.id, { income: 0, expense: 0 }])),
    categories: Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c, 0])),
    apps: Object.fromEntries(DELIVERY_APPS.map((a) => [a, { sales: 0, gp: 0 }])),
    transactions: [],
  }

  for (let d = new Date(start); d < end && d <= DATA_END; d.setDate(d.getDate() + 1)) {
    for (const t of getDayTransactions(d)) {
      s.transactions.push(t)
      const ch = s.channels[t.channel]
      if (t.amount >= 0) {
        s.income += t.amount
        ch.income += t.amount
        if (t.category === INCOME_CATEGORIES.commission) s.commission += t.amount
        else s.sales += t.amount
        if (t.app) s.apps[t.app].sales += t.amount
      } else {
        const v = -t.amount
        s.expense += v
        ch.expense += v
        s.categories[t.category] += v
        if (t.app && t.category === 'ค่า GP') s.apps[t.app].gp += v
      }
    }
  }
  s.profit = s.income - s.expense
  summaryCache.set(cacheKey, s)
  return s
}

/** Estimated additional tax for the year (mock). */
export function getTaxEstimate() {
  return 329
}
