import { useMemo, useState } from 'react'
import { Layers3, Tags, TriangleAlert, X } from 'lucide-react'
import { toast } from 'sonner'
import categoriesData from '../../../json/categories.json'
import CategoryCard from '../../../components/logistics/CategoryCard'
import type { Category } from '../../../types/category.types'

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const storedCategories = localStorage.getItem('categories')

    if (!storedCategories) {
      return categoriesData as Category[]
    }

    try {
      const parsed = JSON.parse(storedCategories) as Category[]
      return parsed.length ? parsed : (categoriesData as Category[])
    } catch {
      return categoriesData as Category[]
    }
  })

  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  )

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories],
  )

  const handleDeleteCategory = () => {
    if (!categoryToDelete) return

    const updatedCategories = categories.filter(
      category => category.id !== categoryToDelete.id,
    )
    setCategories(updatedCategories)
    localStorage.setItem('categories', JSON.stringify(updatedCategories))
    toast.success(`Category "${categoryToDelete.name}" has been deleted.`)
    setCategoryToDelete(null)
  }

  return (
    <section className='relative overflow-hidden rounded-3xl border border-stone-200/80 bg-linear-to-br from-white via-stone-50 to-stone-100 p-4 shadow-sm dark:border-stone-800/80 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900 sm:p-6 lg:p-8'>
      <div className='pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-stone-300/30 blur-3xl dark:bg-stone-700/25' />
      <div className='pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-stone-200/40 blur-3xl dark:bg-stone-800/35' />

      <div className='relative z-10 space-y-6'>
        <header className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400'>
              Category Management
            </p>
            <h1 className='mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 sm:text-3xl'>
              <span className='inline-flex h-8 w-8 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm dark:bg-stone-100 dark:text-stone-900'>
                <Tags className='h-4.5 w-4.5' />
              </span>
              Categories
            </h1>
            <p className='mt-1 text-sm text-stone-600 dark:text-stone-400'>
              Structured overview of all logistics categories and their types.
            </p>
          </div>

          <div className='rounded-xl border border-stone-300 bg-white/90 px-4 py-2.5 text-sm shadow-sm dark:border-stone-700 dark:bg-stone-900/80'>
            <span className='text-stone-500 dark:text-stone-400'>
              Total Categories:
            </span>{' '}
            <span className='font-semibold text-stone-900 dark:text-stone-100'>
              {sortedCategories.length}
            </span>
          </div>
        </header>

        {sortedCategories.length === 0 ? (
          <div className='flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/70 px-6 text-center dark:border-stone-700 dark:bg-stone-900/50'>
            <Layers3 className='h-10 w-10 text-stone-400 dark:text-stone-500' />
            <p className='mt-3 text-sm font-medium text-stone-700 dark:text-stone-300'>
              No categories available.
            </p>
            <p className='mt-1 text-sm text-stone-500 dark:text-stone-400'>
              Add your first category to start organizing products.
            </p>
          </div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {sortedCategories.map(category => (
              <CategoryCard
                key={category.id}
                category={category}
                onRequestDelete={setCategoryToDelete}
              />
            ))}
          </div>
        )}
      </div>

      {categoryToDelete && (
        <div className='absolute inset-0 z-30 flex items-center justify-center bg-stone-950/55 p-4 backdrop-blur-xs'>
          <div className='w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-700 dark:bg-stone-900'>
            <div className='flex items-start justify-between gap-3'>
              <div className='flex items-start gap-3'>
                <div className='mt-0.5 rounded-lg bg-red-100 p-2 text-red-700 dark:bg-red-900/40 dark:text-red-300'>
                  <TriangleAlert className='h-5 w-5' />
                </div>
                <div>
                  <h2 className='text-lg font-semibold text-stone-900 dark:text-stone-100'>
                    Delete Category
                  </h2>
                  <p className='mt-1 text-sm text-stone-600 dark:text-stone-400'>
                    Are you sure you want to delete the segment "
                    <span className='font-medium text-stone-900 dark:text-stone-300'>
                      {categoryToDelete.name}
                    </span>
                    "? This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type='button'
                onClick={() => setCategoryToDelete(null)}
                className='rounded-lg p-1.5 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100'
                aria-label='Close confirmation modal'
              >
                <X className='h-4 w-4' />
              </button>
            </div>

            <div className='mt-6 flex justify-end gap-2'>
              <button
                type='button'
                onClick={() => setCategoryToDelete(null)}
                className='rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleDeleteCategory}
                className='rounded-xl border border-red-300 bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 dark:border-red-800 dark:bg-red-700 dark:hover:bg-red-600'
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Categories
