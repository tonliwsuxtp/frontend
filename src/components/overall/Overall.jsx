import { useMemo, useState } from 'react'
import DesktopOverall from './desktop/DesktopOverall'
import MobileOverall from './mobile/MobileOverall'
import useMediaQuery from './useMediaQuery'
import { DATA_END, getSummary, getTaxEstimate, periodRange } from './mockData'
import { shiftDate } from './dateUtils'

export const DESKTOP_QUERY = '(min-width: 900px)'

/**
 * Overview page. Desktop layout is the default; screens narrower than 900px
 * get the phone layout. Both share the same state and data.
 */
export default function Overall({ initialDate = DATA_END, onAdd, onNavigate, onQuickAction }) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const [period, setPeriod] = useState('month')
  const [date, setDate] = useState(initialDate)

  const summary = useMemo(() => getSummary(period, date), [period, date])
  const canNext = periodRange(period, date)[1] <= DATA_END

  const props = {
    period,
    onPeriodChange: setPeriod,
    date,
    onPrev: () => setDate((d) => shiftDate(period, d, -1)),
    onNext: () => setDate((d) => {
      const next = shiftDate(period, d, 1)
      return next > DATA_END ? DATA_END : next
    }),
    canNext,
    summary,
    tax: getTaxEstimate(date),
    onAdd,
    onNavigate,
    onQuickAction,
  }

  return isDesktop ? <DesktopOverall {...props} /> : <MobileOverall {...props} />
}
