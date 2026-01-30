import React, { useMemo, useState } from 'react'
import './adminOrdersPage.css'

type ProductRow = {
  id: string
  name: string
  sku: string
  price: string
  discount: string
  wholesalePrice: string
  status: 'live' | 'paused'
  image: string
}

const PRODUCT_ROWS: ProductRow[] = [
  { id: '1', name: 'CBD Patch', sku: 'PAT-234', price: '$20', discount: '50%', wholesalePrice: '$10', status: 'live', image: 'https://via.placeholder.com/40x40' },
  { id: '2', name: 'CBD Salve', sku: 'PAT-234', price: '$30', discount: '40%', wholesalePrice: '$12', status: 'live', image: 'https://via.placeholder.com/40x40' },
  { id: '3', name: 'CBD Bath Salts', sku: 'PAT-234', price: '$20', discount: '50%', wholesalePrice: '$10', status: 'live', image: 'https://via.placeholder.com/40x40' },
  { id: '4', name: 'CBD Body Lotion', sku: 'PAT-234', price: '$10', discount: '30%', wholesalePrice: '$10', status: 'live', image: 'https://via.placeholder.com/40x40' },
  { id: '5', name: 'CBD Suppository', sku: 'PAT-234', price: '$20', discount: '40%', wholesalePrice: '$20', status: 'paused', image: 'https://via.placeholder.com/40x40' },
  { id: '6', name: 'CBD Body Lotion', sku: 'PAT-234', price: '$30', discount: '50%', wholesalePrice: '$15', status: 'live', image: 'https://via.placeholder.com/40x40' },
  { id: '7', name: 'CBD Living Water', sku: 'PAT-234', price: '$20', discount: '50%', wholesalePrice: '$10', status: 'live', image: 'https://via.placeholder.com/40x40' },
  { id: '8', name: 'CBD Sparkling Water Black Cherry', sku: 'PAT-234', price: '$20', discount: '30%', wholesalePrice: '$20', status: 'paused', image: 'https://via.placeholder.com/40x40' },
  { id: '9', name: 'CBD Sparkling Water Mango Guava', sku: 'PAT-234', price: '$20', discount: '50%', wholesalePrice: '$10', status: 'live', image: 'https://via.placeholder.com/40x40' },
]

const PAGE_SIZE = 10
const TOTAL_ITEMS = 1000

export default function DistributorsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const selectedCount = useMemo(() => Object.values(selected).filter(Boolean).length, [selected])
  const allSelected = selectedCount === PRODUCT_ROWS.length && PRODUCT_ROWS.length > 0

  const toggleAll = () => {
    if (allSelected) {
      setSelected({})
    } else {
      setSelected(Object.fromEntries(PRODUCT_ROWS.map((r) => [r.id, true])))
    }
  }

  const toggleRow = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const start = (page - 1) * PAGE_SIZE + 1
  const end = Math.min(page * PAGE_SIZE, TOTAL_ITEMS)

  return (
    <div className="content-area distributors-products-page">
      <div className="dist-products-toolbar">
        <div className="dist-products-search">
          <input
            type="search"
            className="dist-products-search-input"
            placeholder="Order #, Buyer name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search"
          />
          <span className="dist-products-search-icon" aria-hidden>🔍</span>
        </div>
        <div className="dist-products-filters">
          <button type="button" className="dist-products-filter-btn">Filter by Quantity</button>
          <button type="button" className="dist-products-filter-btn">Category</button>
        </div>
      </div>

      <div className="dist-products-table">
        <div className="dist-products-header-row">
          <div className="dist-products-col dist-products-col--product">Product ▾</div>
          <div className="dist-products-col">SKU ▾</div>
          <div className="dist-products-col">Price ▾</div>
          <div className="dist-products-col">Discount ▾</div>
          <div className="dist-products-col">Wholesale Price ▾</div>
          <div className="dist-products-col">Status ▾</div>
          <div className="dist-products-col">Action ▾</div>
        </div>
        {PRODUCT_ROWS.map((row) => (
          <div key={row.id} className="dist-products-row">
            <div className="dist-products-col dist-products-col--product">
              <input type="checkbox" checked={!!selected[row.id]} onChange={() => toggleRow(row.id)} />
              <img src={row.image} alt="" className="dist-products-thumb" />
              <span className="dist-products-name">{row.name}</span>
            </div>
            <div className="dist-products-col">{row.sku}</div>
            <div className="dist-products-col">
              {row.price}
              <button type="button" className="dist-products-edit" aria-label="Edit price">✎</button>
            </div>
            <div className="dist-products-col">{row.discount}</div>
            <div className="dist-products-col">{row.wholesalePrice}</div>
            <div className="dist-products-col">
              <span className={`dist-products-status ${row.status}`}>{row.status === 'live' ? 'Live' : 'Paused'}</span>
            </div>
            <div className="dist-products-col">
              <button type="button" className="dist-products-view-btn">View</button>
            </div>
          </div>
        ))}
      </div>

      <div className="dist-products-actions">
        <label className="dist-products-select-all">
          <input type="checkbox" checked={allSelected} onChange={toggleAll} />
          Select All
        </label>
        <span className="dist-products-selected">{selectedCount} products selected</span>
        <button type="button" className="dist-products-link">Clear selection</button>
        <button type="button" className="dist-products-link">Set Price</button>
        <button type="button" className="dist-products-link">Active All</button>
        <button type="button" className="dist-products-link">Pause All</button>
        <button type="button" className="dist-products-remove">Remove</button>
      </div>

      <div className="dist-products-pagination">
        <span className="dist-products-pagination-info">Showing {start}-{end} of {TOTAL_ITEMS}</span>
        <div className="dist-products-pagination-controls">
          <button type="button" className="dist-products-page-btn">‹</button>
          {[1,2,3,4,5,6,7,8,9,10].map((n) => (
            <button key={n} type="button" className={`dist-products-page-num ${page === n ? 'active' : ''}`} onClick={() => setPage(n)}>{n}</button>
          ))}
          <button type="button" className="dist-products-page-btn">›</button>
        </div>
      </div>
    </div>
  )
}
