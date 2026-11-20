import { CHANNELS } from '../overall/mockData'
import { formatBaht } from '../overall/dateUtils'
import { AFFILIATE_MONTH, AFFILIATE_PRODUCTS, MIN_AD_RETURN } from './analyticsData'

const channelById = Object.fromEntries(CHANNELS.map((c) => [c.id, c]))

export default function AffiliateTable() {
  const rows = AFFILIATE_PRODUCTS.map((p) => ({ ...p, profit: p.commission - p.ads, ret: p.ads ? p.commission / p.ads : null }))
  const totalCommission = rows.reduce((s, r) => s + r.commission, 0)
  const totalAds = rows.reduce((s, r) => s + r.ads, 0)

  const byCategory = {}
  for (const r of rows) byCategory[r.category] = (byCategory[r.category] ?? 0) + r.commission
  const [topCategory, topValue] = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0] ?? []

  return (
    <section className="an-card">
      <div className="an-card-head an-aff-head">
        <div>
          <h2 className="an-card-title">นายหน้า: สินค้า/คลิปไหนทำเงิน ({AFFILIATE_MONTH})</h2>
          <p className="an-muted an-desc">ตอนบันทึกค่าคอม ใส่ชื่อสินค้าหรือคลิป และค่าโฆษณาที่ใช้ (ถ้ามี)</p>
        </div>
        <div className="an-aff-totals">
          <div>
            <small>ค่าคอมรวม</small>
            <strong className="an-pos">{formatBaht(totalCommission)}</strong>
          </div>
          <div>
            <small>ค่าโฆษณารวม</small>
            <strong className="an-neg">{formatBaht(totalAds)}</strong>
          </div>
        </div>
      </div>

      <div className="an-table-wrap">
        <table className="an-table">
          <thead>
            <tr>
              <th>สินค้า / คลิป</th>
              <th>แพลตฟอร์ม</th>
              <th>หมวด</th>
              <th className="an-num">ค่าคอม</th>
              <th className="an-num">ค่าโฆษณา</th>
              <th className="an-num">กำไร</th>
              <th className="an-num">ได้คืนต่อโฆษณา ฿1</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const ch = channelById[r.platform]
              return (
                <tr key={r.id}>
                  <td className="an-strong">{r.name}</td>
                  <td>
                    <span className="an-channel">
                      <i style={{ background: ch.color }} />
                      {ch.short}
                    </span>
                  </td>
                  <td className="an-muted">{r.category}</td>
                  <td className="an-num">{formatBaht(r.commission)}</td>
                  <td className="an-num an-muted">{r.ads ? formatBaht(r.ads) : '—'}</td>
                  <td className={`an-num an-strong ${r.profit < 0 ? 'an-neg' : 'an-pos'}`}>
                    {r.profit < 0 && '−'}
                    {formatBaht(r.profit)}
                  </td>
                  <td className={`an-num an-strong ${r.ret === null ? 'an-muted an-normal' : r.ret >= MIN_AD_RETURN ? 'an-pos' : 'an-neg'}`}>
                    {r.ret === null ? 'ไม่ใช้โฆษณา' : `฿${r.ret.toFixed(2)}`}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {topCategory && (
        <p className="an-muted an-small an-note">
          สินค้าหมวด{topCategory}ทำค่าคอมได้มากที่สุด ({Math.round((topValue / totalCommission) * 100)}% ของค่าคอมทั้งหมด) ·
          โฆษณาที่ได้คืนไม่ถึง ฿{MIN_AD_RETURN} ต่อ ฿1 ควรหยุดหรือปรับคลิป
        </p>
      )}
    </section>
  )
}
