import { BagIcon, CalculatorIcon, DocIcon, HomeIcon, PlusCircleIcon } from '../Icons'

const ITEMS = [
  { id: 'overall', label: 'ภาพรวม', Icon: HomeIcon },
  { id: 'sales', label: 'บันทึก', Icon: PlusCircleIcon },
  { id: 'ingredients', label: 'วัตถุดิบ', Icon: BagIcon },
  { id: 'cost', label: 'ต้นทุน', Icon: CalculatorIcon },
  { id: 'tax', label: 'ภาษี', Icon: DocIcon },
]

export default function BottomNav({ active = 'overall', onChange }) {
  return (
    <nav className="ov-bottomnav">
      {ITEMS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className={`ov-bottomnav-item${active === id ? ' is-active' : ''}`}
          aria-current={active === id ? 'page' : undefined}
          onClick={() => onChange?.(id)}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
