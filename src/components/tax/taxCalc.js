// Thai personal income tax estimate (ภาษีเงินได้บุคคลธรรมดา) for salary + side income.
// Side income is pulled from the same transactions as the overview page.
import { DATA_END, getDayTransactions, getSummary } from '../overall/mockData'

export const TAX_YEARS = [
  { year: 2026, label: '2569 (ยื่น ม.ค.–มี.ค. 2570)' },
  { year: 2025, label: '2568 (ยื่น ม.ค.–มี.ค. 2569)' },
]

export const DEFAULT_INPUTS = {
  salary: 360000,
  withheld: 2050,
  otherWithheld: 0,
  socialSecurity: 9000,
  otherDeductions: 0,
  method: 'best', // 'best' | 'flat' | 'actual'
}

export const PERSONAL_ALLOWANCE = 60000
export const SOCIAL_SECURITY_CAP = 9000
export const EMPLOYMENT_RATE = 0.5 // 40(1)+40(2): 50% ...
export const EMPLOYMENT_CAP = 100000 // ... capped at ฿100,000 combined
export const FLAT_RATE_40_8 = 0.6 // 40(8) food sales: flat 60%
export const MIN_TAX_THRESHOLD = 1000000 // compare with 0.5% method when non-salary income ≥ 1M
export const VAT_THRESHOLD = 1800000
export const PND94_THRESHOLD = 60000 // half-year 40(5)–(8) income that requires filing (single)

export const BRACKETS = [
  { from: 0, to: 150000, rate: 0 },
  { from: 150000, to: 300000, rate: 0.05 },
  { from: 300000, to: 500000, rate: 0.1 },
  { from: 500000, to: 750000, rate: 0.15 },
  { from: 750000, to: 1000000, rate: 0.2 },
  { from: 1000000, to: 2000000, rate: 0.25 },
  { from: 2000000, to: 5000000, rate: 0.3 },
  { from: 5000000, to: Infinity, rate: 0.35 },
]

/** Side income for the tax year from recorded transactions. */
export function sideIncome(year) {
  const s = getSummary('year', new Date(year, 0, 1))
  let halfYearSales = 0
  for (let d = new Date(year, 0, 1); d < new Date(year, 6, 1) && d <= DATA_END; d.setDate(d.getDate() + 1)) {
    for (const t of getDayTransactions(d)) if (t.category === 'ยอดขาย') halfYearSales += t.amount
  }
  return {
    commission: s.commission, // 40(2) TikTok + Shopee
    sales: s.sales, // 40(8) delivery food sales
    actualExpense: s.channels.delivery.expense, // ingredients + packaging + GP + promos
    halfYearSales,
    partialUntil: year === DATA_END.getFullYear() ? DATA_END : null,
  }
}

export function progressiveTax(net) {
  const rows = BRACKETS.map((b) => {
    const portion = Math.max(0, Math.min(net, b.to) - b.from)
    return { ...b, portion, tax: portion * b.rate }
  })
  return { rows, total: rows.reduce((s, r) => s + r.tax, 0) }
}

const n = (v) => Math.max(0, Number(v) || 0)

export function computeTax(inputs, side) {
  const salary = n(inputs.salary)
  const deductionsOther = n(inputs.otherDeductions)
  const socialSecurity = Math.min(n(inputs.socialSecurity), SOCIAL_SECURITY_CAP)
  const allowances = PERSONAL_ALLOWANCE + socialSecurity + deductionsOther

  const employmentIncome = salary + side.commission
  const employmentDeduction = Math.min(employmentIncome * EMPLOYMENT_RATE, EMPLOYMENT_CAP)

  const flat = side.sales * FLAT_RATE_40_8
  const actual = side.actualExpense
  const method = inputs.method === 'best' ? (actual >= flat ? 'actual' : 'flat') : inputs.method
  const salesDeduction = method === 'actual' ? Math.min(actual, side.sales) : flat

  const net = Math.max(0, employmentIncome - employmentDeduction + side.sales - salesDeduction - allowances)
  const progressive = progressiveTax(net)

  const nonSalaryIncome = side.commission + side.sales
  const minTaxApplies = nonSalaryIncome >= MIN_TAX_THRESHOLD
  const minTax = nonSalaryIncome * 0.005
  const tax = minTaxApplies && minTax > 5000 ? Math.max(progressive.total, minTax) : progressive.total

  const salaryOnlyNet = Math.max(0, salary - Math.min(salary * EMPLOYMENT_RATE, EMPLOYMENT_CAP) - allowances)
  const salaryOnlyTax = progressiveTax(salaryOnlyNet).total

  const withheldTotal = n(inputs.withheld) + n(inputs.otherWithheld)
  const topRow = [...progressive.rows].reverse().find((r) => r.portion > 0)

  return {
    salary,
    employmentIncome,
    employmentDeduction,
    flat,
    actual,
    method,
    salesDeduction,
    allowances,
    socialSecurity,
    net,
    progressive,
    minTaxApplies,
    minTax,
    tax,
    salaryOnlyTax,
    extra: tax - salaryOnlyTax,
    withheldTotal,
    due: tax - withheldTotal,
    topRate: topRow?.rate ?? 0,
  }
}

/** Amount still to pay at filing with the default inputs (used by the overview card). */
export function estimateTaxDue(year = DATA_END.getFullYear()) {
  return Math.max(0, Math.round(computeTax(DEFAULT_INPUTS, sideIncome(year)).due))
}
