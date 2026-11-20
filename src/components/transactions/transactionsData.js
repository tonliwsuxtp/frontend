// Mock data for the income/expense list (fried mala shop). Replace with API data later.

export const INCOME_CATEGORIES = ['ค่าคอมมิชชั่น', 'ยอดขาย', 'รายรับอื่นๆ']
export const EXPENSE_CATEGORIES = ['วัตถุดิบ', 'ค่า GP', 'ค่าโปรโมท/แคมเปญ', 'ค่าโฆษณา', 'บรรจุภัณฑ์', 'รายจ่ายอื่นๆ']
export const PAYMENT_METHODS = ['เงินโอน', 'เงินสด', 'หักจากแพลตฟอร์ม']

/** amount: + income, − expense. date: YYYY-MM-DD */
export const INITIAL_TRANSACTIONS = [
  { id: 't1', date: '2026-11-14', title: 'ซื้อหมูสามชั้น 2 กก.', channel: 'delivery', category: 'วัตถุดิบ', amount: -320, method: 'เงินสด' },
  { id: 't2', date: '2026-11-14', title: 'ค่าคอมมิชชั่น', channel: 'tiktok', category: 'ค่าคอมมิชชั่น', amount: 180, method: 'เงินโอน' },
  { id: 't3', date: '2026-11-13', title: 'ขายชุดหม่าล่าทอดรวม × 12 (LINE MAN)', channel: 'delivery', category: 'ยอดขาย', amount: 720, method: 'เงินโอน' },
  { id: 't4', date: '2026-11-13', title: 'ค่า GP LINE MAN 30% + VAT (12 ออร์เดอร์)', channel: 'delivery', category: 'ค่า GP', amount: -231, method: 'หักจากแพลตฟอร์ม' },
  { id: 't5', date: '2026-11-12', title: 'ซื้อกล่อง + ไม้เสียบ 100 ชุด', channel: 'delivery', category: 'บรรจุภัณฑ์', amount: -250, method: 'เงินโอน' },
  { id: 't6', date: '2026-11-10', title: 'ค่าคอม ต.ค.', channel: 'shopee', category: 'ค่าคอมมิชชั่น', amount: 620, method: 'เงินโอน' },
  { id: 't7', date: '2026-11-08', title: 'ค่าโฆษณาโปรโมตคลิป', channel: 'shopee', category: 'ค่าโฆษณา', amount: -350, method: 'เงินโอน' },
  { id: 't8', date: '2026-11-07', title: 'ค่าคอม รอบ 24–31 ต.ค.', channel: 'tiktok', category: 'ค่าคอมมิชชั่น', amount: 770, method: 'เงินโอน' },
  { id: 't9', date: '2026-11-01', title: 'แพ็กเกจโปรโมทร้าน Grab (รายเดือน)', channel: 'delivery', category: 'ค่าโปรโมท/แคมเปญ', amount: -300, method: 'หักจากแพลตฟอร์ม' },
]

export const DEFAULT_DATE = '2026-11-14'
