import { useEffect, useState } from 'react'
import { CHANNELS } from '../overall/mockData'
import { DEFAULT_DATE, EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from './transactionsData'

const categoriesFor = (type) => (type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES)

export default function TransactionForm({ onSubmit }) {
  const [type, setType] = useState('income')
  const [amount, setAmount] = useState('')
  const [channel, setChannel] = useState(CHANNELS[0].id)
  const [category, setCategory] = useState(INCOME_CATEGORIES[0])
  const [date, setDate] = useState(DEFAULT_DATE)
  const [method, setMethod] = useState(PAYMENT_METHODS[0])
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')

  useEffect(() => {
    if (!saved) return
    const t = setTimeout(() => setSaved(''), 2500)
    return () => clearTimeout(t)
  }, [saved])

  function changeType(next) {
    setType(next)
    setCategory(categoriesFor(next)[0])
  }

  function handleSubmit(e) {
    e.preventDefault()
    const value = Number(amount)
    if (!(value > 0)) {
      setError('กรุณากรอกจำนวนเงินมากกว่า 0')
      return
    }
    onSubmit({
      id: `t${Date.now()}`,
      date,
      title: note.trim() || category,
      note: note.trim(),
      channel,
      category,
      amount: type === 'income' ? value : -value,
      method,
    })
    setAmount('')
    setNote('')
    setError('')
    setSaved('บันทึกแล้ว')
  }

  return (
    <form className="tx-card tx-form" onSubmit={handleSubmit} noValidate>
      <h2 className="tx-card-title">บันทึกรายการใหม่</h2>

      <div className="tx-segment" role="radiogroup" aria-label="ประเภท">
        {[
          ['income', 'รายรับ'],
          ['expense', 'รายจ่าย'],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={type === id}
            className={`tx-segment-btn${type === id ? ' is-active' : ''}`}
            onClick={() => changeType(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="tx-field">
        <span>จำนวนเงิน (บาท)</span>
        <input
          className="tx-input tx-amount"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
            setError('')
          }}
          aria-invalid={!!error}
        />
        {error && <small className="tx-error">{error}</small>}
      </label>

      <div className="tx-row">
        <label className="tx-field">
          <span>ช่องทาง</span>
          <select className="tx-input" value={channel} onChange={(e) => setChannel(e.target.value)}>
            {CHANNELS.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="tx-field">
          <span>หมวดหมู่</span>
          <select className="tx-input" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categoriesFor(type).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="tx-row">
        <label className="tx-field">
          <span>วันที่</span>
          <input className="tx-input" type="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />
        </label>
        <label className="tx-field">
          <span>รับ/จ่ายเป็น</span>
          <select className="tx-input" value={method} onChange={(e) => setMethod(e.target.value)}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="tx-field">
        <span>หมายเหตุ</span>
        <textarea
          className="tx-input tx-textarea"
          rows={3}
          placeholder="เช่น รอบค่าคอม 1–7 พ.ย."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>

      <button type="submit" className="tx-submit">บันทึก</button>
      <p className="tx-saved" role="status">{saved}</p>
    </form>
  )
}
