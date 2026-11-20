import {
  BasketOutline, BoltOutline, BoxOutline, CalculatorOutline, ChartOutline, DocOutline,
  HomeOutline, ListOutline, SettingsOutline, ShoppingBagOutline, TrendUp,
} from '../overall/Icons'
import { CHANNELS } from '../overall/mockData'

const NAV = [
  { id: 'overall', label: 'ภาพรวม', Icon: HomeOutline },
  { id: 'sales', label: 'บันทึกการขาย', Icon: ShoppingBagOutline },
  { id: 'transactions', label: 'รายการรับ-จ่าย', Icon: ListOutline },
  { id: 'ingredients', label: 'วัตถุดิบ', Icon: BasketOutline },
  { id: 'stock', label: 'สต็อก & ของเสีย', Icon: BoxOutline },
  { id: 'menu-cost', label: 'ต้นทุนเมนู', Icon: CalculatorOutline },
  { id: 'breakeven', label: 'ต้นทุนแฝง & คุ้มทุน', Icon: BoltOutline },
  { id: 'analytics', label: 'วิเคราะห์', Icon: ChartOutline },
  { id: 'tax', label: 'ภาษี', Icon: DocOutline },
]

export default function Sidebar({ active = 'overall', onNavigate, extra }) {
  return (
    <aside className="app-sidebar">
      <div className="app-brand">
        <span className="app-brand-logo"><TrendUp width={18} height={18} /></span>
        <div>
          <strong>รายได้เสริม</strong>
          <small>บัญชีรายรับรายจ่าย</small>
        </div>
      </div>

      <nav className="app-nav">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={`app-nav-item${active === id ? ' is-active' : ''}`}
            aria-current={active === id ? 'page' : undefined}
            onClick={() => onNavigate?.(id)}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {extra ?? (
        <div className="app-side-section">
          <p className="app-side-heading">ช่องทาง</p>
          <ul className="app-side-channels">
            {CHANNELS.map((c) => (
              <li key={c.id}>
                <i className="app-dot" style={{ background: c.color }} />
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button type="button" className="app-nav-item app-settings" onClick={() => onNavigate?.('settings')}>
        <SettingsOutline />
        <span>ตั้งค่า (หมวดหมู่, % GP)</span>
      </button>
    </aside>
  )
}
