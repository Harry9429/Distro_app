import { useState } from 'react'
import { useCart } from '../contexts/CartContext'

const PRODUCT_IMG_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Crect fill='%23e5e7eb' width='160' height='160'/%3E%3C/svg%3E"

type StockStatus = 'in_stock' | 'out_of_stock' | 'low_stock'

type Product = {
  id: string
  sku: string
  name: string
  yourPrice: string
  marketPrice: string
  image: string
  stockStatus: StockStatus
  lowStockCount?: number
  category: 'topicals' | 'drinks'
}

const EYE_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const DUMMY_PRODUCTS: Product[] = [
  { id: '1', sku: 'PAT-234', name: 'CBD Patch', yourPrice: '$10.00', marketPrice: '$18.00', image: PRODUCT_IMG_PLACEHOLDER, stockStatus: 'in_stock', category: 'topicals' },
  { id: '2', sku: 'PAT-234', name: 'CBD Salve', yourPrice: '$10.00', marketPrice: '$18.00', image: PRODUCT_IMG_PLACEHOLDER, stockStatus: 'in_stock', category: 'topicals' },
  { id: '3', sku: 'PAT-234', name: 'CBD Bath Salts', yourPrice: '$10.00', marketPrice: '$18.00', image: PRODUCT_IMG_PLACEHOLDER, stockStatus: 'in_stock', category: 'topicals' },
  { id: '4', sku: 'PAT-234', name: 'CBD Body Lotion', yourPrice: '$10.00', marketPrice: '$18.00', image: PRODUCT_IMG_PLACEHOLDER, stockStatus: 'in_stock', category: 'topicals' },
  { id: '5', sku: 'PAT-234', name: 'CBD Suppositories', yourPrice: '$10.00', marketPrice: '$18.00', image: PRODUCT_IMG_PLACEHOLDER, stockStatus: 'out_of_stock', category: 'topicals' },
  { id: '6', sku: 'PAT-234', name: 'CBD Lotion', yourPrice: '$10.00', marketPrice: '$18.00', image: PRODUCT_IMG_PLACEHOLDER, stockStatus: 'low_stock', lowStockCount: 2, category: 'topicals' },
  { id: '7', sku: 'PAT-234', name: 'CBD Water', yourPrice: '$10.00', marketPrice: '$18.00', image: PRODUCT_IMG_PLACEHOLDER, stockStatus: 'in_stock', category: 'drinks' },
  { id: '8', sku: 'PAT-234', name: 'CBD Tea', yourPrice: '$10.00', marketPrice: '$18.00', image: PRODUCT_IMG_PLACEHOLDER, stockStatus: 'in_stock', category: 'drinks' },
  { id: '9', sku: 'PAT-234', name: 'CBD Energy Drink', yourPrice: '$10.00', marketPrice: '$18.00', image: PRODUCT_IMG_PLACEHOLDER, stockStatus: 'in_stock', category: 'drinks' },
]

const CATEGORY_LABELS: Record<Product['category'], string> = {
  topicals: 'CBD Topicals',
  drinks: 'CBD Drinks',
}

export default function ProductsPage() {
  const cart = useCart()
  const [search, setSearch] = useState('')
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(DUMMY_PRODUCTS.filter((p) => p.stockStatus === 'in_stock' || p.stockStatus === 'low_stock').map((p) => [p.id, p.stockStatus === 'low_stock' ? Math.min(2, p.lowStockCount ?? 2) : 40]))
  )

  const updateQty = (id: string, delta: number) => {
    const p = DUMMY_PRODUCTS.find((x) => x.id === id)
    if (!p) return
    const max = p.stockStatus === 'low_stock' ? (p.lowStockCount ?? 0) : 999
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(max, (prev[id] ?? 0) + delta)),
    }))
  }

  const topicals = DUMMY_PRODUCTS.filter((p) => p.category === 'topicals')
  const drinks = DUMMY_PRODUCTS.filter((p) => p.category === 'drinks')

  return (
    <div className="content-area products-page">
      <header className="products-header">
        <div className="products-header-left">
          <button type="button" className="products-dropdown-trigger" aria-haspopup="listbox">
            Products <span className="products-dropdown-caret" aria-hidden="true">▼</span>
          </button>
        </div>
        <div className="products-search-wrap">
          <svg className="products-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            className="products-search-input"
            placeholder="Order #, Buyer name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search orders or buyers"
          />
        </div>
        <div className="products-filters">
          <button type="button" className="products-filter-btn" aria-haspopup="listbox">
            Filter by Quantity <span aria-hidden="true">▼</span>
          </button>
          <button type="button" className="products-filter-btn" aria-haspopup="listbox">
            Category <span aria-hidden="true">▼</span>
          </button>
        </div>
      </header>

      <section className="products-section">
        <h2 className="products-section-title">{CATEGORY_LABELS.topicals}</h2>
        <div className="products-grid">
          {topicals.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              quantity={quantities[p.id] ?? 0}
              onQtyChange={(delta) => updateQty(p.id, delta)}
              onAddToOrder={() => cart.addItem({ id: p.id, name: p.name, sku: p.sku, yourPrice: p.yourPrice, image: p.image }, quantities[p.id] ?? 0)}
            />
          ))}
        </div>
      </section>

      <section className="products-section">
        <h2 className="products-section-title">{CATEGORY_LABELS.drinks}</h2>
        <div className="products-grid">
          {drinks.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              quantity={quantities[p.id] ?? 0}
              onQtyChange={(delta) => updateQty(p.id, delta)}
              onAddToOrder={() => cart.addItem({ id: p.id, name: p.name, sku: p.sku, yourPrice: p.yourPrice, image: p.image }, quantities[p.id] ?? 0)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function ProductCard({
  product,
  quantity,
  onQtyChange,
  onAddToOrder,
}: {
  product: Product
  quantity: number
  onQtyChange: (delta: number) => void
  onAddToOrder: () => void
}) {
  const { sku, name, yourPrice, marketPrice, image, stockStatus, lowStockCount } = product
  const maxQty = stockStatus === 'low_stock' ? (lowStockCount ?? 0) : 999

  return (
    <div className="products-card">
      <div className="products-card-image-wrap">
        <img src={image} alt="" className="products-card-image" />
        <button type="button" className="products-card-eye" aria-label="View product">
          {EYE_ICON}
        </button>
      </div>
      <div className="products-card-sku">SKU: {sku}</div>
      <div className="products-card-name">{name}</div>
      <div className="products-card-pricing">
        <span className="products-card-your-price">Your Price: {yourPrice}</span>
        <span className="products-card-market-price">{marketPrice}</span>
      </div>
      <div className="products-card-actions">
        {stockStatus === 'out_of_stock' && (
          <button type="button" className="products-btn products-btn-out" disabled>
            Out of Stock
          </button>
        )}
        {stockStatus === 'low_stock' && (
          <button type="button" className="products-btn products-btn-low">
            Only {lowStockCount ?? 0} Left
          </button>
        )}
        {stockStatus === 'in_stock' && (
          <>
            <div className="products-qty-wrap">
              <button
                type="button"
                className="products-qty-btn"
                onClick={() => onQtyChange(-1)}
                disabled={quantity <= 0}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="number"
                className="products-qty-input"
                value={quantity}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10)
                  if (!Number.isNaN(v)) onQtyChange(v - quantity)
                }}
                min={0}
                max={maxQty}
                aria-label={`Quantity for ${name}`}
              />
              <button
                type="button"
                className="products-qty-btn"
                onClick={() => onQtyChange(1)}
                disabled={quantity >= maxQty}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button type="button" className="products-btn products-btn-add" onClick={onAddToOrder}>
              Add to Order
            </button>
          </>
        )}
      </div>
    </div>
  )
}
