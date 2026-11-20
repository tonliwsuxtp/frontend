import { CHANNELS } from '../overall/mockData'

const channelName = Object.fromEntries(CHANNELS.map((c) => [c.id, c.name]))
const cell = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`

/** Download rows as a CSV that Excel opens with Thai text intact (UTF-8 BOM). */
export function exportTransactionsCsv(rows, filename = 'รายการรับ-จ่าย.csv') {
  const header = ['วันที่', 'รายการ', 'ช่องทาง', 'หมวดหมู่', 'ประเภท', 'จำนวนเงิน', 'รับ/จ่ายเป็น', 'หมายเหตุ']
  const lines = rows.map((t) =>
    [t.date, t.title, channelName[t.channel], t.category, t.amount < 0 ? 'รายจ่าย' : 'รายรับ', t.amount, t.method, t.note]
      .map(cell)
      .join(','),
  )
  const blob = new Blob(['﻿' + [header.map(cell).join(','), ...lines].join('\r\n')], {
    type: 'text/csv;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
