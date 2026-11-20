const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true }

export const HomeIcon = (p) => (
  <svg {...base} {...p}><path d="M12 3 2 11.5h3V21h5.5v-6h3v6H19v-9.5h3z" /></svg>
)
export const PlusCircleIcon = (p) => (
  <svg {...base} {...p}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z" /></svg>
)
export const BagIcon = (p) => (
  <svg {...base} {...p}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zm6 11a5 5 0 0 1-5-5h2a3 3 0 0 0 6 0h2a5 5 0 0 1-5 5M5.1 5l1.9-2h10l1.9 2z" /></svg>
)
export const CalculatorIcon = (p) => (
  <svg {...base} {...p}><path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm1 3h10v4H7zm0 7h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" /></svg>
)
export const DocIcon = (p) => (
  <svg {...base} {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 7V3.5L18.5 9zM8 13h8v2H8zm0 4h8v2H8z" /></svg>
)
export const ReceiptIcon = (p) => (
  <svg {...base} {...p}><path d="M3 4h18v12H3zm2 2v8h6V6zm8 1v2h6V7zm0 4v2h6v-2zM2 18h20v2H2z" /></svg>
)
export const BoxIcon = (p) => (
  <svg {...base} {...p}><path d="m12 2 9 5v10l-9 5-9-5V7zm0 2.3L6.1 7.6 12 11l5.9-3.4zM5 9.3v6.5l6 3.4v-6.5zm14 0-6 3.4v6.5l6-3.4z" /></svg>
)
export const BoltIcon = (p) => (
  <svg {...base} {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
)
export const SignalIcon = (p) => (
  <svg {...base} {...p}><path d="M3 18h3v3H3zm5-4h3v7H8zm5-4h3v11h-3zm5-5h3v16h-3z" /></svg>
)
export const ChevronLeft = (p) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...p}><path d="m15 5-7 7 7 7" /></svg>
)
export const ChevronRight = (p) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...p}><path d="m9 5 7 7-7 7" /></svg>
)
export const PlusIcon = (p) => (
  <svg {...base} {...p}><path d="M10.5 3h3v7.5H21v3h-7.5V21h-3v-7.5H3v-3h7.5z" /></svg>
)

/* ---------- Outline icons (desktop sidebar) ---------- */
const Outline = ({ children, ...p }) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden {...p}>
    {children}
  </svg>
)

export const HomeOutline = (p) => (
  <Outline {...p}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></Outline>
)
export const ShoppingBagOutline = (p) => (
  <Outline {...p}><path d="M6 7h12l-1 14H7z" /><path d="M9 7V5a3 3 0 0 1 6 0v2" /></Outline>
)
export const ListOutline = (p) => (
  <Outline {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></Outline>
)
export const BasketOutline = (p) => (
  <Outline {...p}><path d="M4 10h16l-1.5 10h-13z" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></Outline>
)
export const BoxOutline = (p) => (
  <Outline {...p}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></Outline>
)
export const CalculatorOutline = (p) => (
  <Outline {...p}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 7h6M9 11h.01M12 11h.01M15 11h.01M9 14h.01M12 14h.01M15 14h.01M9 17h.01M12 17h.01M15 17h.01" /></Outline>
)
export const BoltOutline = (p) => (
  <Outline {...p}><path d="M13 3 5 14h6l-1 7 8-11h-6z" /></Outline>
)
export const ChartOutline = (p) => (
  <Outline {...p}><path d="M3 21h18M6 17v-5M10 17V8M14 17v-7M18 17V5" /></Outline>
)
export const DocOutline = (p) => (
  <Outline {...p}><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" /><path d="M14 3v5h5M9 15l2 2 4-4" /></Outline>
)
export const SettingsOutline = (p) => (
  <Outline {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" /></Outline>
)
export const TrendUp = (p) => (
  <Outline {...p}><path d="m4 16 5-5 4 4 7-7M15 8h5v5" /></Outline>
)
export const ArrowRight = (p) => (
  <Outline {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Outline>
)
