import { useEffect, useMemo, useState } from 'react'
import { BadgeDollarSign, Clock3, ListChecks } from 'lucide-react'
import { toast } from 'sonner'
import pendingPricingData from '../../json/pending-pricing.json'
import PendingProduct, {
  type PendingPricingItem,
  type PricingValues,
} from '../../components/warehouse/PendingProduct'

type PricedProductRecord = PendingPricingItem &
  PricingValues & {
    pricedAt: string
  }

const PendingPricing = () => {
  const [pendingProducts, setPendingProducts] = useState<PendingPricingItem[]>(
    () => {
      const storedPendingProducts = localStorage.getItem('pending-pricing')

      if (!storedPendingProducts) {
        return pendingPricingData as PendingPricingItem[]
      }

      try {
        const parsed = JSON.parse(storedPendingProducts) as PendingPricingItem[]
        return parsed.length
          ? parsed
          : (pendingPricingData as PendingPricingItem[])
      } catch {
        return pendingPricingData as PendingPricingItem[]
      }
    },
  )

  useEffect(() => {
    localStorage.setItem('pending-pricing', JSON.stringify(pendingProducts))
  }, [pendingProducts])

  const pendingCount = pendingProducts.length

  const sortedPendingProducts = useMemo(
    () => [...pendingProducts].sort((a, b) => a.name.localeCompare(b.name)),
    [pendingProducts],
  )

  const handleSavePricing = (productId: string, values: PricingValues) => {
    if (values.cost < 0 || values.price < 0 || values.profitPerUnit < 0) {
      toast.error('Cost, price, and profit per unit must be zero or greater.')
      return
    }

    const pricedProduct = pendingProducts.find(
      product => product.id === productId,
    )
    if (!pricedProduct) {
      toast.error('Product not found in pending list.')
      return
    }

    const pricedProductsRaw = localStorage.getItem('priced-products')
    let pricedProducts: PricedProductRecord[] = []

    if (pricedProductsRaw) {
      try {
        pricedProducts = JSON.parse(pricedProductsRaw) as PricedProductRecord[]
      } catch {
        pricedProducts = []
      }
    }

    const updatedPricedProducts: PricedProductRecord[] = [
      ...pricedProducts,
      {
        ...pricedProduct,
        ...values,
        pricedAt: new Date().toISOString(),
      },
    ]

    localStorage.setItem(
      'priced-products',
      JSON.stringify(updatedPricedProducts),
    )

    const updatedPendingList = pendingProducts.filter(
      product => product.id !== productId,
    )

    setPendingProducts(updatedPendingList)
    toast.success(`Pricing saved for "${pricedProduct.name}".`)
  }

  return (
    <section
      className='relative overflow-hidden rounded-3xl border border-stone-200/80 bg-linear-to-br from-white via-stone-50
     to-stone-100 p-4 shadow-sm dark:border-stone-800/80 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900 sm:p-6 lg:p-8'
    >
      <div className='pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-stone-300/35 blur-3xl dark:bg-stone-700/25' />
      <div className='pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-stone-200/40 blur-3xl dark:bg-stone-800/35' />

      <div className='relative z-10 space-y-6'>
        <header className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400'>
              Warehouse Control
            </p>
            <h1 className='mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 sm:text-3xl'>
              <span className='inline-flex h-8 w-8 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm dark:bg-stone-100 dark:text-stone-900'>
                <BadgeDollarSign className='h-4.5 w-4.5' />
              </span>
              Pending Pricing
            </h1>
            <p className='mt-1 text-sm text-stone-600 dark:text-stone-400'>
              Enter cost, price, and profit per unit for products awaiting admin
              pricing approval.
            </p>
          </div>

          <div className='rounded-xl border border-stone-300 bg-white/90 px-4 py-2.5 text-sm shadow-sm dark:border-stone-700 dark:bg-stone-900/80'>
            <span className='inline-flex items-center gap-1.5 text-stone-500 dark:text-stone-400'>
              <Clock3 className='h-4 w-4' />
              Waiting
            </span>
            <p className='mt-1 text-lg font-semibold text-stone-900 dark:text-stone-100'>
              {pendingCount}
            </p>
          </div>
        </header>

        {sortedPendingProducts.length ? (
          <div className='grid gap-4'>
            {sortedPendingProducts.map(product => (
              <PendingProduct
                key={product.id}
                item={product}
                onSave={handleSavePricing}
              />
            ))}
          </div>
        ) : (
          <div className='flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/70 px-6 text-center dark:border-stone-700 dark:bg-stone-900/50'>
            <ListChecks className='h-10 w-10 text-stone-400 dark:text-stone-500' />
            <p className='mt-3 text-sm font-medium text-stone-700 dark:text-stone-300'>
              No products waiting for pricing.
            </p>
            <p className='mt-1 text-sm text-stone-500 dark:text-stone-400'>
              New products added by warehouse employees will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default PendingPricing
