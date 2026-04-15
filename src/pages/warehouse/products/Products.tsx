import { useMemo, useState } from 'react'
import { Boxes, Package, Search, SlidersHorizontal } from 'lucide-react'
import productsData from '../../../json/products.json'
import ProductRow from '../../../components/warehouse/ProductRow'

type RawProduct = {
  id: string
  name: string
  category: string
  quantity?: number
}

type Product = {
  id: string
  name: string
  category: string
  quantity: number
}

const normalizeProducts = (items: RawProduct[]): Product[] => {
  const productsMap = new Map<string, Product>()

  for (const item of items) {
    const normalizedProduct: Product = {
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: typeof item.quantity === 'number' ? item.quantity : 0,
    }

    const existing = productsMap.get(item.id)
    if (!existing) {
      productsMap.set(item.id, normalizedProduct)
      continue
    }

    // Keep the richer record when duplicates exist in the source JSON.
    if (normalizedProduct.quantity >= existing.quantity) {
      productsMap.set(item.id, normalizedProduct)
    }
  }

  return [...productsMap.values()].sort((a, b) => a.name.localeCompare(b.name))
}

const Products = () => {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const products = useMemo(
    () => normalizeProducts(productsData as RawProduct[]),
    [],
  )

  const categories = useMemo(
    () => [...new Set(products.map(product => product.category))].sort(),
    [products],
  )

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return products.filter(product => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory

      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.id.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch)

      return matchesCategory && matchesSearch
    })
  }, [products, search, selectedCategory])

  const totalUnits = useMemo(
    () => filteredProducts.reduce((sum, product) => sum + product.quantity, 0),
    [filteredProducts],
  )

  return (
    <section className='relative overflow-hidden rounded-3xl border border-stone-200/80 bg-linear-to-br from-white via-stone-50 to-stone-100 p-4 shadow-sm dark:border-stone-800/80 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900 sm:p-6 lg:p-8'>
      <div className='pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-stone-300/30 blur-3xl dark:bg-stone-700/25' />
      <div className='pointer-events-none absolute -bottom-20 -left-24 h-72 w-72 rounded-full bg-stone-200/40 blur-3xl dark:bg-stone-800/35' />
      <div className='relative z-10 space-y-6'>
        <header className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400'>
              Warehouse Inventory
            </p>
            <h1 className='mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 sm:text-3xl'>
              <span className='inline-flex h-8 w-8 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm dark:bg-stone-100 dark:text-stone-900'>
                <Package className='h-4.5 w-4.5' />
              </span>
              Products Registry
            </h1>
            <p className='mt-1 text-sm text-stone-600 dark:text-stone-400'>
              Structured inventory overview with product identity, category, and
              stock quantity.
            </p>
          </div>
        </header>

        <div className='grid gap-3 sm:grid-cols-3'>
          <article className='rounded-2xl border border-stone-300/80 bg-white/90 p-4 shadow-sm dark:border-stone-700/80 dark:bg-stone-900/85'>
            <p className='text-xs font-medium uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400'>
              Products
            </p>
            <p className='mt-1 text-2xl font-semibold text-stone-900 dark:text-stone-100'>
              {filteredProducts.length}
            </p>
          </article>

          <article className='rounded-2xl border border-stone-300/80 bg-white/90 p-4 shadow-sm dark:border-stone-700/80 dark:bg-stone-900/85'>
            <p className='text-xs font-medium uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400'>
              Categories
            </p>
            <p className='mt-1 text-2xl font-semibold text-stone-900 dark:text-stone-100'>
              {selectedCategory === 'all' ? categories.length : 1}
            </p>
          </article>

          <article className='rounded-2xl border border-stone-300/80 bg-white/90 p-4 shadow-sm dark:border-stone-700/80 dark:bg-stone-900/85'>
            <p className='text-xs font-medium uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400'>
              Units in Stock
            </p>
            <p className='mt-1 text-2xl font-semibold text-stone-900 dark:text-stone-100'>
              {totalUnits}
            </p>
          </article>
        </div>

        <div className='grid gap-3 rounded-2xl border border-stone-200/80 bg-white/80 p-3 shadow-sm backdrop-blur dark:border-stone-800/80 dark:bg-stone-900/70 sm:grid-cols-2 sm:p-4'>
          <label className='relative'>
            <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400' />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder='Search by product name, id, or category'
              className='w-full rounded-xl border border-stone-300 bg-white px-10 py-2.5 text-sm text-stone-900 shadow-sm outline-none transition-all placeholder:text-stone-400 hover:border-stone-400 focus:border-stone-700 focus:ring-4 focus:ring-stone-700/10 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:hover:border-stone-600 dark:focus:border-stone-300 dark:focus:ring-stone-300/15'
            />
          </label>

          <label className='relative'>
            <SlidersHorizontal className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400' />
            <select
              value={selectedCategory}
              onChange={event => setSelectedCategory(event.target.value)}
              className='w-full rounded-xl border border-stone-300 appearance-none bg-white px-10 py-2.5 text-sm text-stone-900 shadow-sm outline-none transition-all hover:border-stone-400 focus:border-stone-700 focus:ring-4 focus:ring-stone-700/10 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-stone-600 dark:focus:border-stone-300 dark:focus:ring-stone-300/15'
            >
              <option value='all'>All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className='overflow-hidden rounded-2xl border border-stone-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-stone-800/80 dark:bg-stone-900/80'>
          <div className='overflow-x-auto'>
            <table className='min-w-212 w-full border-collapse'>
              <thead>
                <tr className='border-b border-stone-200 bg-stone-100/90 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:border-stone-800 dark:bg-stone-900/90 dark:text-stone-400'>
                  <th className='px-4 py-3'>Product ID</th>
                  <th className='px-4 py-3'>Name</th>
                  <th className='px-4 py-3'>Category</th>
                  <th className='px-4 py-3 text-right'>Quantity</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className='px-4 py-12 text-center text-sm text-stone-500 dark:text-stone-400'
                    >
                      <div className='mx-auto flex max-w-sm flex-col items-center gap-2'>
                        <Boxes className='h-7 w-7 text-stone-400 dark:text-stone-500' />
                        <p>No products found for your current filter.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(product => (
                    <ProductRow key={product.id} product={product} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Products
