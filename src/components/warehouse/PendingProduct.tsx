import { Package, Tag } from 'lucide-react'
import { useState } from 'react'

export type PendingPricingItem = {
  id: string
  name: string
  category: string
}

export type PricingValues = {
  cost: number
  price: number
  profitPerUnit: number
}

type PendingProductProps = {
  item: PendingPricingItem
  onSave: (productId: string, values: PricingValues) => void
}

const inputClassName =
  'w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 hover:border-stone-400 focus:border-stone-700 focus:ring-4 focus:ring-stone-700/10 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:hover:border-stone-600 dark:focus:border-stone-300 dark:focus:ring-stone-300/15'

const PendingProduct = ({ item, onSave }: PendingProductProps) => {
  const [cost, setCost] = useState('')
  const [price, setPrice] = useState('')
  const [profitPerUnit, setProfitPerUnit] = useState('')

  const submitPricing = () => {
    const costValue = Number(cost)
    const priceValue = Number(price)
    const profitValue = Number(profitPerUnit)

    if (!cost || !price || !profitPerUnit) {
      return
    }

    onSave(item.id, {
      cost: costValue,
      price: priceValue,
      profitPerUnit: profitValue,
    })
  }

  return (
    <article
      className='group relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white/85 p-5 shadow-sm
     transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-stone-800/80 dark:bg-stone-900/80'
    >
      <div className='pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-stone-200/50 blur-3xl dark:bg-stone-700/25' />

      <div className='relative z-10 space-y-4'>
        <header className='space-y-2'>
          <div className='flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400'>
            <span className='inline-flex items-center gap-1 rounded-full border border-stone-300 bg-stone-100 px-2.5 py-1 font-medium dark:border-stone-700 dark:bg-stone-800'>
              <Tag className='h-3.5 w-3.5' />
              {item.category}
            </span>
            <span className='inline-flex items-center gap-1 rounded-full border border-stone-300 bg-stone-100 px-2.5 py-1 font-medium dark:border-stone-700 dark:bg-stone-800'>
              ID: {item.id}
            </span>
          </div>

          <h2 className='flex items-center gap-2 text-lg font-semibold text-stone-900 dark:text-stone-100'>
            <Package className='h-4.5 w-4.5 text-stone-600 dark:text-stone-300' />
            {item.name}
          </h2>
        </header>

        <div className='grid gap-3 md:grid-cols-3'>
          <label className='block'>
            <span className='mb-1.5 ml-1 inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400'>
              Cost
            </span>
            <input
              type='number'
              min='0'
              step='0.01'
              value={cost}
              onChange={event => setCost(event.target.value)}
              placeholder='0.00'
              className={inputClassName}
            />
          </label>

          <label className='block'>
            <span className='mb-1.5 ml-1 inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400'>
              Price
            </span>
            <input
              type='number'
              min='0'
              step='0.01'
              value={price}
              onChange={event => setPrice(event.target.value)}
              placeholder='0.00'
              className={inputClassName}
            />
          </label>

          <label className='block'>
            <span className='mb-1.5 ml-1 inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400'>
              Profit / unit
            </span>
            <input
              type='number'
              min='0'
              step='0.01'
              value={profitPerUnit}
              onChange={event => setProfitPerUnit(event.target.value)}
              placeholder='0.00'
              className={inputClassName}
            />
          </label>
        </div>

        <button
          type='button'
          onClick={submitPricing}
          className='inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition
           hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-stone-900/20 dark:bg-stone-100 dark:text-stone-900
            dark:hover:bg-stone-200 dark:focus:ring-stone-100/30'
        >
          Save Pricing
        </button>
      </div>
    </article>
  )
}

export default PendingProduct
