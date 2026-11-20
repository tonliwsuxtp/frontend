import { useEffect, useState } from 'react'
import Overall from './components/overall'
import Sales from './components/sales'
import Transactions from './components/transactions'
import Ingredients from './components/ingredients'
import Stock from './components/stock'
import MenuCost from './components/menu-cost'

const PAGES = {
  overall: Overall,
  sales: Sales,
  transactions: Transactions,
  ingredients: Ingredients,
  stock: Stock,
  'menu-cost': MenuCost,
}

// Phone bottom-nav ids that point at a differently named page.
const ALIASES = { cost: 'menu-cost' }

// Current page lives in the URL hash (#sales) so refresh / back button keep it.
const pageFromHash = () => {
  const id = window.location.hash.slice(1)
  return PAGES[id] ? id : 'overall'
}

function App() {
  const [page, setPage] = useState(pageFromHash)

  useEffect(() => {
    const onHashChange = () => setPage(pageFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Pages that aren't built yet are ignored for now.
  const navigate = (target) => {
    const id = ALIASES[target] ?? target
    if (!PAGES[id]) return
    window.location.hash = id
    window.scrollTo(0, 0)
  }

  const Page = PAGES[page]
  return <Page onNavigate={navigate} onAdd={() => navigate('sales')} />
}

export default App
