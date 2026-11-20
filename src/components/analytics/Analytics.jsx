import { useMemo, useState } from 'react'
import AppShell from '../layout/AppShell'
import BottomNav from '../overall/mobile/BottomNav'
import PeriodCompare from './PeriodCompare'
import MenuMatrix from './MenuMatrix'
import MenuAdvice from './MenuAdvice'
import AffiliateTable from './AffiliateTable'
import { menuAnalysis } from './analyticsData'
import './analytics.css'

/** "วิเคราะห์" — period comparison, menu engineering matrix and affiliate product performance. */
export default function Analytics({ onNavigate }) {
  const [mode, setMode] = useState('month')
  const menus = useMemo(() => menuAnalysis(), [])

  return (
    <AppShell active="analytics" onNavigate={onNavigate}>
      <main className="an-page">
        <header>
          <h1 className="an-title">วิเคราะห์</h1>
          <p className="an-subtitle">
            เปรียบเทียบช่วงเวลา · เมนูไหนควรเก็บ/ปรับ · สินค้านายหน้าตัวไหนทำเงิน · ข้อมูลตัวอย่าง
          </p>
        </header>

        <PeriodCompare mode={mode} onModeChange={setMode} />

        <div className="an-menu-grid">
          <MenuMatrix rows={menus.rows} avgSold={menus.avgSold} avgProfit={menus.avgProfit} />
          <MenuAdvice rows={menus.rows} />
        </div>

        <AffiliateTable />
      </main>

      <div className="an-mobile-nav">
        <BottomNav active="analytics" onChange={onNavigate} />
      </div>
    </AppShell>
  )
}
