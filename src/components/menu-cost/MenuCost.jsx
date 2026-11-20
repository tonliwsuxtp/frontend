import { useEffect, useState } from 'react'
import AppShell from '../layout/AppShell'
import BottomNav from '../overall/mobile/BottomNav'
import MenuList from './MenuList'
import RecipeTable from './RecipeTable'
import PricePanel from './PricePanel'
import ChannelCompare from './ChannelCompare'
import { CHANNELS, INITIAL_MENUS, recipeCost } from './menuCostData'
import './menuCost.css'

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

/** "ต้นทุนเมนู" — recipe cost per set, profit per channel and suggested prices. */
export default function MenuCost({ onNavigate }) {
  const [menus, setMenus] = useState(INITIAL_MENUS)
  const [selectedId, setSelectedId] = useState(INITIAL_MENUS[0].id)
  const [draft, setDraft] = useState(INITIAL_MENUS[0]) // edits stay here until "บันทึกสูตร"
  const [channelId, setChannelId] = useState(CHANNELS[0].id)
  const [message, setMessage] = useState('')

  const saved = menus.find((m) => m.id === selectedId)
  const dirty = !same(draft, saved)
  const cost = recipeCost(draft.recipe)

  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(''), 2500)
    return () => clearTimeout(t)
  }, [message])

  function confirmDiscard() {
    return !dirty || window.confirm('สูตรนี้มีการแก้ไขที่ยังไม่บันทึก ต้องการทิ้งการแก้ไขหรือไม่?')
  }

  function selectMenu(id) {
    if (id === selectedId || !confirmDiscard()) return
    setSelectedId(id)
    setDraft(menus.find((m) => m.id === id))
  }

  // Copy skips the discard prompt: the unsaved edits move into the copy.
  function createMenu(base, { keepEdits = false } = {}) {
    if (!keepEdits && !confirmDiscard()) return
    const menu = { ...base, id: `m${Date.now()}` }
    setMenus((prev) => [...prev, menu])
    setSelectedId(menu.id)
    setDraft(menu)
    return menu
  }

  function save() {
    if (!draft.name.trim()) {
      setMessage('กรุณาตั้งชื่อเมนู')
      return
    }
    const next = { ...draft, name: draft.name.trim(), price: Number(draft.price) || 0 }
    setMenus((prev) => prev.map((m) => (m.id === selectedId ? next : m)))
    setDraft(next)
    setMessage('บันทึกสูตรแล้ว')
  }

  const update = (patch) => setDraft((d) => ({ ...d, ...patch }))
  const listProps = {
    menus: menus.map((m) => (m.id === selectedId ? { ...m, name: draft.name || m.name } : m)),
    selectedId,
    onSelect: selectMenu,
    onAdd: () => createMenu({ name: 'เมนูใหม่', price: 50, recipe: [] }),
  }

  return (
    <AppShell active="menu-cost" onNavigate={onNavigate} sidebarExtra={<MenuList {...listProps} />}>
      <main className="mc-page">
        <MenuList {...listProps} variant="chips" />

        <header className="mc-header">
          <div className="mc-heading">
            <p className="mc-muted mc-small">
              ต้นทุนเมนู · ต่อ 1 ชุด · ข้อมูลตัวอย่าง{dirty && <span className="mc-dirty"> · ยังไม่บันทึก</span>}
            </p>
            <input
              className="mc-title"
              value={draft.name}
              onChange={(e) => update({ name: e.target.value })}
              aria-label="ชื่อเมนู"
              placeholder="ชื่อเมนู"
            />
          </div>
          <div className="mc-actions">
            <span className="mc-message" role="status">{message}</span>
            <button
              type="button"
              className="mc-btn-outline"
              onClick={() => {
                if (createMenu({ ...draft, name: `${draft.name} (สำเนา)` }, { keepEdits: true })) setMessage('คัดลอกสูตรแล้ว')
              }}
            >
              คัดลอกสูตร
            </button>
            <button type="button" className="mc-btn" onClick={save} disabled={!dirty}>บันทึกสูตร</button>
          </div>
        </header>

        <div className="mc-layout">
          <div className="mc-col">
            <RecipeTable recipe={draft.recipe} onChange={(recipe) => update({ recipe })} />
            <ChannelCompare price={draft.price} cost={cost} channelId={channelId} />
          </div>
          <PricePanel
            price={draft.price}
            onPriceChange={(price) => update({ price })}
            channelId={channelId}
            onChannelChange={setChannelId}
            cost={cost}
          />
        </div>
      </main>

      <div className="mc-mobile-nav">
        <BottomNav active="cost" onChange={onNavigate} />
      </div>
    </AppShell>
  )
}
