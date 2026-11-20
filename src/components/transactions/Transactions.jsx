import { useMemo, useState } from 'react'
import AppShell from '../layout/AppShell'
import BottomNav from '../overall/mobile/BottomNav'
import TransactionTable from './TransactionTable'
import TransactionForm from './TransactionForm'
import { INITIAL_TRANSACTIONS } from './transactionsData'
import { exportTransactionsCsv } from './exportCsv'
import './transactions.css'

/** "รายการรับ-จ่าย" — all channels in one list, with a form to add income/expense manually. */
export default function Transactions({ onNavigate }) {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS)
  const [search, setSearch] = useState('')
  const [channel, setChannel] = useState('all')

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return transactions
      .filter((t) => channel === 'all' || t.channel === channel)
      .filter((t) => !q || [t.title, t.category, t.note].some((v) => v?.toLowerCase().includes(q)))
      .sort((a, b) => b.date.localeCompare(a.date)) // newest first; stable for same day
  }, [transactions, search, channel])

  return (
    <AppShell active="transactions" onNavigate={onNavigate}>
      <main className="tx-page">
        <header className="tx-header">
          <div>
            <h1 className="tx-title">รายการรับ-จ่าย</h1>
            <p className="tx-subtitle">ทุกช่องทางในที่เดียว · ข้อมูลตัวอย่าง</p>
          </div>
          <button type="button" className="tx-outline-btn" onClick={() => exportTransactionsCsv(rows)} disabled={!rows.length}>
            Export Excel
          </button>
        </header>

        <div className="tx-layout">
          <TransactionTable
            rows={rows}
            search={search}
            onSearchChange={setSearch}
            channel={channel}
            onChannelChange={setChannel}
          />
          <TransactionForm onSubmit={(t) => setTransactions((prev) => [t, ...prev])} />
        </div>
      </main>

      <div className="tx-mobile-nav">
        <BottomNav active="transactions" onChange={onNavigate} />
      </div>
    </AppShell>
  )
}
