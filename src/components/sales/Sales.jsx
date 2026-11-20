import { useEffect, useMemo, useState } from 'react'
import AppShell from '../layout/AppShell'
import BottomNav from '../overall/mobile/BottomNav'
import ChannelPicker from './ChannelPicker'
import MenuGrid from './MenuGrid'
import SaleSummary from './SaleSummary'
import StockDeduction from './StockDeduction'
import DailySales from './DailySales'
import { APPS, DEFAULT_SALE_DATE, INITIAL_SALES, INITIAL_STOCK, MENUS, calculateSale } from './salesData'
import { SHORT_MONTHS } from '../overall/dateUtils'
import './sales.css'

const emptyQuantities = () => Object.fromEntries(MENUS.map((m) => [m.id, 0]))

function dayTitle(isoDate) {
  if (isoDate === DEFAULT_SALE_DATE) return 'ขายวันนี้'
  const [, m, d] = isoDate.split('-').map(Number)
  return `ขายวันที่ ${d} ${SHORT_MONTHS[m - 1]}`
}

/** "บันทึกการขาย" — record a delivery sale; income, GP, stock and cost are derived automatically. */
export default function Sales({ onNavigate }) {
  const [saleDate, setSaleDate] = useState(DEFAULT_SALE_DATE)
  const [appId, setAppId] = useState('grab')
  const [orders, setOrders] = useState(4)
  // Pre-filled sample order so the page shows how the summary works.
  const [quantities, setQuantities] = useState({ ...emptyQuantities(), kaprao: 6 })
  const [stock, setStock] = useState(INITIAL_STOCK)
  const [sales, setSales] = useState(INITIAL_SALES)
  const [savedMessage, setSavedMessage] = useState('')

  const app = APPS.find((a) => a.id === appId)
  const calc = useMemo(() => calculateSale({ app, quantities, orders, stock }), [app, quantities, orders, stock])
  const dayRows = sales.filter((s) => s.date === saleDate)

  useEffect(() => {
    if (!savedMessage) return
    const t = setTimeout(() => setSavedMessage(''), 2500)
    return () => clearTimeout(t)
  }, [savedMessage])

  function handleSave() {
    if (!calc.plates) return
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    setSales((prev) => [
      ...prev,
      {
        id: `s${Date.now()}`,
        date: saleDate,
        time,
        items: calc.lines.map((l) => `${l.menu.short} × ${l.qty}`).join(', '),
        app: app.name,
        sales: calc.sales,
        profit: Math.round(calc.profit),
      },
    ])
    setStock((prev) => {
      const next = { ...prev }
      for (const s of calc.stockLines) next[s.id] = { ...next[s.id], qty: Math.max(0, s.left) }
      return next
    })
    setQuantities(emptyQuantities())
    setOrders(1)
    setSavedMessage(`บันทึกแล้ว · ${app.name} ${calc.plates} จาน`)
  }

  return (
    <AppShell active="sales" onNavigate={onNavigate}>
      <main className="sl-page">
        <header className="sl-header">
          <div>
            <h1 className="sl-title">บันทึกการขาย</h1>
            <p className="sl-subtitle">
              กดครั้งเดียว ระบบบันทึกรายรับ ค่า GP ตัดสต็อก และต้นทุนให้อัตโนมัติ · ข้อมูลตัวอย่าง
            </p>
          </div>
          <label className="sl-date">
            <span>วันที่ขาย</span>
            <input type="date" value={saleDate} onChange={(e) => e.target.value && setSaleDate(e.target.value)} />
          </label>
        </header>

        <div className="sl-layout">
          <div className="sl-col">
            <div className="sl-area-channel">
              <ChannelPicker appId={appId} onAppChange={setAppId} orders={orders} onOrdersChange={setOrders} />
            </div>
            <div className="sl-area-menus">
              <MenuGrid quantities={quantities} onChange={(id, v) => setQuantities((q) => ({ ...q, [id]: v }))} />
            </div>
            <div className="sl-area-table">
              <DailySales title={dayTitle(saleDate)} rows={dayRows} />
            </div>
          </div>

          <aside className="sl-col">
            <div className="sl-area-summary">
              <SaleSummary app={app} orders={orders} calc={calc} onEditDeductions={() => onNavigate?.('settings')} />
            </div>
            <div className="sl-area-stock">
              <StockDeduction stockLines={calc.stockLines} onOpenStock={() => onNavigate?.('stock')} />
            </div>
            <div className="sl-area-save">
              <button type="button" className="sl-save" onClick={handleSave} disabled={!calc.plates}>
                บันทึกการขาย
              </button>
              <p className="sl-saved" role="status">{savedMessage}</p>
            </div>
          </aside>
        </div>
      </main>

      <div className="sl-mobile-nav">
        <BottomNav active="sales" onChange={onNavigate} />
      </div>
    </AppShell>
  )
}
