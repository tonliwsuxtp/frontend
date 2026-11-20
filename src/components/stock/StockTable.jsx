import { KINDS, realCost, stockStatus } from './stockData'
import { amount, price, unitCostDigits } from './format'

export default function StockTable({ items }) {
  return (
    <section className="st-card">
      <h2 className="st-card-title">วัตถุดิบคงเหลือ</h2>
      <div className="st-table-wrap">
        <table className="st-table">
          <thead>
            <tr>
              <th>วัตถุดิบ</th>
              <th className="st-num">ราคาซื้อ</th>
              <th className="st-num">% ใช้ได้</th>
              <th className="st-num">ต้นทุนจริง</th>
              <th className="st-num">คงเหลือ</th>
              <th className="st-num">จุดสั่งซื้อ</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const k = KINDS[item.kind]
              const status = stockStatus(item)
              return (
                <tr key={item.id}>
                  <td className="st-strong">{item.name}</td>
                  <td className="st-num st-muted">
                    {price(item.price)} / {k.main}
                  </td>
                  <td className="st-num">{Math.round(item.yield * 1000) / 10}%</td>
                  <td className="st-num st-strong">
                    {price(realCost(item), unitCostDigits(item))} / {k.small}
                  </td>
                  <td className="st-num">{amount(item.qty, item)}</td>
                  <td className="st-num st-muted">&lt; {amount(item.reorder, item)}</td>
                  <td>
                    <span className={`st-badge is-${status.id}`}>{status.label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
