import { useEffect, useState } from 'react'

const eventName = 'myr:catalog-updated'
type PriceMap = Record<number, number>
let prices: PriceMap = {}
let pending: Promise<void> | null = null
function refresh() {
  if (!pending) pending = fetch('/api/catalog').then((r) => r.ok ? r.json() : null).then((data) => { if (data?.products) { prices = Object.fromEntries(data.products.map((p: { id: number; price: number }) => [p.id, p.price])); window.dispatchEvent(new Event(eventName)) } }).catch(() => {}).finally(() => { pending = null })
  return pending
}
export function useCatalogPrice(id: number, fallback: number) {
  const [price, setPrice] = useState(() => prices[id] ?? fallback)
  useEffect(() => {
    const sync = () => setPrice(prices[id] ?? fallback)
    const onUpdate = () => { void refresh().then(sync) }
    window.addEventListener(eventName, onUpdate); void refresh().then(sync)
    return () => window.removeEventListener(eventName, onUpdate)
  }, [id, fallback])
  return price
}
