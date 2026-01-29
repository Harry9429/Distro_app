import { useMemo, useState } from 'react'

const PRODUCT_IMG_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23e5e7eb' width='80' height='80' rx='8'/%3E%3C/svg%3E"

const CHART_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']

const INVOICES = [
  { date: 'March, 01, 2020', orderId: '#MS-415646', amount: '$180' },
  { date: 'February, 15, 2020', orderId: '#MS-415647', amount: '$220' },
  { date: 'February, 01, 2020', orderId: '#MS-415648', amount: '$195' },
]

const SKU_CARDS = [
  { sku: 'PAT-234', name: 'CBD Water', amountSpent: '$3450', monthlyOrders: '345 items', change: '+250%', positive: true, image: PRODUCT_IMG_PLACEHOLDER },
  { sku: 'PAT-235', name: 'CBD Oil', amountSpent: '$2100', monthlyOrders: '210 items', change: '-60%', positive: false, image: PRODUCT_IMG_PLACEHOLDER },
  { sku: 'PAT-236', name: 'CBD Gummies', amountSpent: '$1890', monthlyOrders: '189 items', change: '+120%', positive: true, image: PRODUCT_IMG_PLACEHOLDER },
  { sku: 'PAT-237', name: 'CBD Cream', amountSpent: '$980', monthlyOrders: '98 items', change: '-15%', positive: false, image: PRODUCT_IMG_PLACEHOLDER },
]

const CHART_WIDTH = 400
const CHART_HEIGHT = 120
const CHART_PADDING_TOP = 10
const CHART_PADDING_BOTTOM = 10
const PLOT_HEIGHT = CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM

/** Build SVG path and area from values; returns { linePath, areaPath, points } for dynamic chart */
function buildChartPaths(
  values: number[],
  width: number = CHART_WIDTH,
  height: number = PLOT_HEIGHT,
  paddingTop: number = CHART_PADDING_TOP,
  _paddingBottom: number = CHART_PADDING_BOTTOM
) {
  if (values.length === 0) return { linePath: '', areaPath: '', points: [] as { x: number; y: number }[] }
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const n = values.length
  const stepX = n > 1 ? width / (n - 1) : width
  const points: { x: number; y: number }[] = values.map((val, i) => {
    const x = i * stepX
    const y = paddingTop + (1 - (val - min) / range) * height
    return { x, y }
  })
  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : ` L ${p.x},${p.y}`)).join('')
  const areaPath = `${linePath} L ${width},${CHART_HEIGHT} L 0,${CHART_HEIGHT} Z`
  return { linePath, areaPath, points }
}

export default function AnalyticsPage() {
  const [spendingTimeframe, setSpendingTimeframe] = useState<'yearly' | 'monthly' | 'weekly'>('monthly')
  const [skuTimeframe, setSkuTimeframe] = useState<'yearly' | 'monthly' | 'weekly'>('monthly')
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(5)

  // Dynamic spending data per timeframe (can be replaced with API later)
  const spendingData = useMemo(() => {
    const base = [3200, 3500, 3800, 4100, 4500, 4892, 4600, 4400, 4200, 4000]
    if (spendingTimeframe === 'yearly') return base.map((v) => v * 12)
    if (spendingTimeframe === 'weekly') return base.map((v) => Math.round(v / 4))
    return base
  }, [spendingTimeframe])

  const chartPaths = useMemo(
    () => buildChartPaths(spendingData, CHART_WIDTH, PLOT_HEIGHT, CHART_PADDING_TOP, CHART_PADDING_BOTTOM),
    [spendingData]
  )

  const selectedIndex = hoveredMonthIndex ?? 5
  const tooltipValue = spendingData[selectedIndex] ?? 0
  const selectedPoint = chartPaths.points[selectedIndex]
  const totalSpending = spendingData.reduce((a, b) => a + b, 0)
  const totalFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(totalSpending)

  return (
    <div className="content-area analytics-page">
      <h2 className="section-title analytics-section-title">Quick Overview</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Orders Placed</div>
          <div className="stat-value">12.4k</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Amount Spent</div>
          <div className="stat-value">$205k</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Order Payment</div>
          <div className="stat-value">$3550</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">In Transit Order</div>
          <div className="stat-value">4</div>
        </div>
      </div>

      <section className="analytics-orders-section">
        <div className="analytics-orders-header">
          <button type="button" className="analytics-orders-title" aria-haspopup="listbox">
            Orders <span className="analytics-caret" aria-hidden>▼</span>
          </button>
          <div className="analytics-orders-toolbar">
            <div className="analytics-search">
              <svg className="analytics-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input type="text" className="analytics-search-input" placeholder="Order #, Buyer name" />
            </div>
            <button type="button" className="analytics-filter-btn">Filter by Quantity</button>
            <button type="button" className="analytics-filter-btn">Category</button>
          </div>
        </div>

        <div className="analytics-spending-invoices-row">
          <div className="analytics-spending-card">
            <div className="analytics-spending-header">
              <span className="analytics-spending-label">Spending</span>
              <div className="analytics-timeframe-pills">
                <button type="button" className={`analytics-timeframe-btn${spendingTimeframe === 'yearly' ? ' active' : ''}`} onClick={() => setSpendingTimeframe('yearly')}>Yearly</button>
                <button type="button" className={`analytics-timeframe-btn${spendingTimeframe === 'monthly' ? ' active' : ''}`} onClick={() => setSpendingTimeframe('monthly')}>Monthly</button>
                <button type="button" className={`analytics-timeframe-btn${spendingTimeframe === 'weekly' ? ' active' : ''}`} onClick={() => setSpendingTimeframe('weekly')}>Weekly</button>
              </div>
            </div>
            <div className="analytics-chart-wrap">
              <svg className="analytics-chart" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e5e5e5" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#f8f8f8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {chartPaths.areaPath && <path fill="url(#chartFill)" d={chartPaths.areaPath} />}
                {chartPaths.linePath && <path fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d={chartPaths.linePath} />}
                {selectedPoint && (
                  <>
                    <line x1={selectedPoint.x} y1={selectedPoint.y} x2={selectedPoint.x} y2={CHART_HEIGHT} stroke="#000" strokeWidth="1.5" />
                    <circle cx={selectedPoint.x} cy={selectedPoint.y} r="5" fill="#000" />
                  </>
                )}
              </svg>
              {selectedPoint && (
                <div
                  className="analytics-chart-tooltip"
                  style={{
                    left: `${(selectedPoint.x / CHART_WIDTH) * 100}%`,
                    top: `${(selectedPoint.y / CHART_HEIGHT) * 100}%`,
                    transform: 'translate(-50%, -100%) translateY(-8px)',
                  }}
                >
                  <span className="analytics-chart-tooltip-text">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(tooltipValue)}
                  </span>
                </div>
              )}
            </div>
            <div className="analytics-chart-months">
              {CHART_MONTHS.map((m, i) => (
                <span
                  key={m}
                  className={`analytics-month-pill${i === selectedIndex ? ' active' : ''}`}
                  onMouseEnter={() => setHoveredMonthIndex(i)}
                  onMouseLeave={() => setHoveredMonthIndex(5)}
                  onFocus={() => setHoveredMonthIndex(i)}
                  onBlur={() => setHoveredMonthIndex(5)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${m}, ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(spendingData[i] ?? 0)}`}
                >
                  {m}
                </span>
              ))}
            </div>
            <div className="analytics-spending-total">
              <span className="analytics-total-amount">{totalFormatted}</span>
              <span className="analytics-total-hint">This is $54.00 less than last month</span>
            </div>
          </div>

          <div className="analytics-invoices-card">
            <div className="analytics-invoices-header">
              <h3 className="analytics-invoices-title">Invoices</h3>
              <button type="button" className="analytics-view-all-btn">VIEW ALL</button>
            </div>
            <div className="analytics-invoices-inner">
            <ul className="analytics-invoices-list">
              {INVOICES.map((inv, i) => (
                <li key={i} className="analytics-invoice-row">
                  <div className="analytics-invoice-left">
                    <span className="analytics-invoice-date">{inv.date}</span>
                    <span className="analytics-invoice-id">{inv.orderId}</span>
                  </div>
                  <span className="analytics-invoice-amount">{inv.amount}</span>
                  <button type="button" className="analytics-invoice-pdf" aria-label="Download PDF">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M12 18v-6" />
                      <path d="M9 15h6" />
                    </svg>
                    <span>PDF</span>
                  </button>
                </li>
              ))}
            </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="analytics-sku-section">
        <div className="analytics-sku-header">
          <h3 className="analytics-sku-title">SKU Spend</h3>
          <div className="analytics-timeframe-pills">
            <button type="button" className={`analytics-timeframe-btn${skuTimeframe === 'yearly' ? ' active' : ''}`} onClick={() => setSkuTimeframe('yearly')}>Yearly</button>
            <button type="button" className={`analytics-timeframe-btn${skuTimeframe === 'monthly' ? ' active' : ''}`} onClick={() => setSkuTimeframe('monthly')}>Monthly</button>
            <button type="button" className={`analytics-timeframe-btn${skuTimeframe === 'weekly' ? ' active' : ''}`} onClick={() => setSkuTimeframe('weekly')}>Weekly</button>
          </div>
        </div>
        <div className="analytics-sku-grid">
          {SKU_CARDS.map((card, i) => (
            <div key={i} className="analytics-sku-card">
              <div className="analytics-sku-card-top">
                <div className="analytics-sku-img-wrap">
                  <img src={card.image} alt="" className="analytics-sku-img" />
                  <button type="button" className="analytics-sku-eye" aria-label="View">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
                <div className="analytics-sku-info">
                  <span className="analytics-sku-sku">SKU: {card.sku}</span>
                  <span className="analytics-sku-name">{card.name}</span>
                  <span className="analytics-sku-amount">Amount Spent: {card.amountSpent}</span>
                  <span className="analytics-sku-orders">Monthly Orders: {card.monthlyOrders}</span>
                  <span className={`analytics-sku-change${card.positive ? ' positive' : ' negative'}`}>{card.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
