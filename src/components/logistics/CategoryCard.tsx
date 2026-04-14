import { Link } from 'react-router'
import { Tag, Pencil, Trash2 } from 'lucide-react'
import type { Category } from '../../types/category.types'

type Props = {
  category: Category
  onRequestDelete: (category: Category) => void
}

const CategoryCard = ({ category, onRequestDelete }: Props) => {
  return (
    <article
      className='group relative flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white/85 p-5
     shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-stone-800/80 dark:bg-stone-900/80'
    >
      <div
        className='pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-stone-200/55 blur-3xl transition-opacity
       duration-300 group-hover:opacity-100 dark:bg-stone-700/35'
      />

      <div className='relative z-10 flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between gap-2'>
          <div
            className='inline-flex items-center gap-2 rounded-full border border-stone-300 bg-stone-100 px-2.5 py-1 text-xs
           font-medium uppercase tracking-wide text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300'
          >
            <Tag className='h-3.5 w-3.5' />
            Category
          </div>
          <div
            className='flex items-center gap-1.5 opacity-0 transition-opacity
           duration-200 focus-within:opacity-100 group-hover:opacity-100'
          >
            <Link
              to={`/logistics/categories/edit/${category.id}`}
              className='inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-300 bg-white
               text-stone-600 shadow-sm transition-all hover:border-stone-400 hover:text-stone-900 dark:border-stone-700
                dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-600 dark:hover:text-stone-100'
              aria-label={`Edit ${category.name}`}
              title='Edit category'
            >
              <Pencil className='h-3.5 w-3.5' />
            </Link>
            <button
              type='button'
              onClick={() => onRequestDelete(category)}
              className='inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50
               text-red-600 shadow-sm transition-all hover:border-red-300 hover:bg-red-100 dark:border-red-900/70
                dark:bg-red-950/40 dark:text-red-400 dark:hover:border-red-800 dark:hover:bg-red-900/50'
              aria-label={`Delete ${category.name}`}
              title='Delete category'
            >
              <Trash2 className='h-3.5 w-3.5' />
            </button>
          </div>
        </div>

        <div className='flex-1'>
          <h3 className='line-clamp-2 text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100'>
            {category.name}
          </h3>
          <p className='mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400'>
            {category.type}
          </p>
        </div>
      </div>
    </article>
  )
}

export default CategoryCard
