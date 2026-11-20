import { BoltIcon, BoxIcon, ReceiptIcon, SignalIcon } from '../Icons'

const ACTIONS = [
  { id: 'menu', label: 'ขายเมนู', Icon: ReceiptIcon },
  { id: 'stock', label: 'สต็อก', Icon: BoxIcon },
  { id: 'breakeven', label: 'คุ้มทุน', Icon: BoltIcon },
  { id: 'analytics', label: 'วิเคราะห์', Icon: SignalIcon },
]

export default function QuickActions({ onSelect }) {
  return (
    <nav className="ov-actions">
      {ACTIONS.map(({ id, label, Icon }) => (
        <button key={id} type="button" className="ov-action" onClick={() => onSelect?.(id)}>
          <Icon width={18} height={18} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
