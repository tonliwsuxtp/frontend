import { useEffect, useState } from 'react'
import Overall from './components/overall'
import Sales from './components/sales'

const PAGES = {
  overall: Overall,
  sales: Sales,
}

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
  const navigate = (id) => {
    if (!PAGES[id]) return
    window.location.hash = id
    window.scrollTo(0, 0)
  }

  const Page = PAGES[page]
  return <Page onNavigate={navigate} onAdd={() => navigate('sales')} />
}

export default App
