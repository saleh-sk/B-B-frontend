type ProductRowItem = {
  id: string
  name: string
  category: string
  quantity: number
}

type ProductRowProps = {
  product: ProductRowItem
}

const ProductRow = ({ product }: ProductRowProps) => {
  const isLowStock = product.quantity <= 8

  return (
    <tr className='border-b border-stone-200/80 text-sm text-stone-700 transition-colors hover:bg-stone-50/90 dark:border-stone-800/80 dark:text-stone-300 dark:hover:bg-stone-800/40'>
      <td className='px-4 py-3.5 font-mono text-xs font-semibold tracking-wide text-stone-600 dark:text-stone-400'>
        {product.id}
      </td>
      <td className='px-4 py-3.5 font-medium text-stone-900 dark:text-stone-100'>
        {product.name}
      </td>
      <td className='px-4 py-3.5'>
        <span className='inline-flex rounded-full border border-stone-300 bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300'>
          {product.category}
        </span>
      </td>
      <td className='px-4 py-3.5 text-right'>
        <span
          className={`inline-flex min-w-14 items-center justify-center rounded-lg px-2.5 py-1 text-xs font-semibold ${
            isLowStock
              ? 'border border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-800/80 dark:bg-amber-900/40 dark:text-amber-300'
              : 'border border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-900/80 dark:bg-emerald-900/40 dark:text-emerald-300'
          }`}
        >
          {product.quantity}
        </span>
      </td>
    </tr>
  )
}

export default ProductRow
