/** "เมนูของฉัน" — sidebar section on desktop, horizontal chips on phones. */
export default function MenuList({ menus, selectedId, onSelect, onAdd, variant = 'sidebar' }) {
  if (variant === 'chips') {
    return (
      <nav className="mc-chips" aria-label="เมนูของฉัน">
        {menus.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`mc-chip${m.id === selectedId ? ' is-active' : ''}`}
            onClick={() => onSelect(m.id)}
          >
            {m.name}
          </button>
        ))}
        <button type="button" className="mc-chip mc-chip-add" onClick={onAdd}>+ เพิ่มเมนู</button>
      </nav>
    )
  }

  return (
    <div className="mc-side">
      <p className="mc-side-heading">เมนูของฉัน</p>
      <ul>
        {menus.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              className={`mc-side-item${m.id === selectedId ? ' is-active' : ''}`}
              aria-current={m.id === selectedId ? 'true' : undefined}
              onClick={() => onSelect(m.id)}
            >
              {m.name}
            </button>
          </li>
        ))}
        <li>
          <button type="button" className="mc-side-item mc-side-add" onClick={onAdd}>+ เพิ่มเมนู</button>
        </li>
      </ul>
    </div>
  )
}
