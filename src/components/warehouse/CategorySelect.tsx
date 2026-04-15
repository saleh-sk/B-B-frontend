import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import categoriesData from '../../json/categories.json'
import type { Category } from '../../types/category.types'

type CategorySelectProps = {
  value: number | null
  onChange: (categoryId: number | null) => void
}

const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const categories = useMemo(
    () =>
      (categoriesData as Category[])
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    [],
  )

  const selectedCategory = useMemo(
    () => categories.find(category => category.id === value) ?? null,
    [categories, value],
  )

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return categories
    }

    return categories.filter(category => {
      const haystack = `${category.name} ${category.type}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [categories, query])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) {
        return
      }

      if (containerRef.current.contains(event.target as Node)) {
        return
      }

      setIsOpen(false)
      setQuery('')
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <div ref={containerRef} className='relative'>
      <button
        type='button'
        onClick={() => setIsOpen(prev => !prev)}
        className='flex w-full items-center justify-between rounded-xl border border-stone-300 bg-white px-4 py-3 text-left text-sm
         text-stone-900 shadow-sm transition hover:border-stone-400 focus:outline-none focus:ring-4 focus:ring-stone-700/10 dark:border-stone-700
          dark:bg-stone-900 dark:text-stone-100 dark:hover:border-stone-600 dark:focus:ring-stone-300/15'
      >
        <span className='truncate'>
          {selectedCategory
            ? `${selectedCategory.name} (${selectedCategory.type})`
            : 'Select a category'}
        </span>
        <span className='ml-3 inline-flex items-center gap-1.5'>
          {selectedCategory ? (
            <button
              type='button'
              onClick={event => {
                event.stopPropagation()
                onChange(null)
                setQuery('')
              }}
              className='rounded-md p-1 text-stone-500 transition hover:bg-stone-100 hover:text-stone-700 dark:text-stone-400
               dark:hover:bg-stone-800 dark:hover:text-stone-200'
              aria-label='Clear selected category'
            >
              <X className='h-3.5 w-3.5' />
            </button>
          ) : null}
          <ChevronDown
            className={`h-4 w-4 transition ${isOpen ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {isOpen ? (
        <div
          className='absolute z-30 mt-2 w-full rounded-xl border border-stone-200 bg-white p-2 shadow-lg dark:border-stone-700
         dark:bg-stone-900'
        >
          <div className='relative'>
            <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400' />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder='Search categories'
              className='w-full rounded-lg border border-stone-300 bg-white py-2.5 pl-9 pr-3 text-sm text-stone-900 outline-none transition
               placeholder:text-stone-400 focus:border-stone-700 focus:ring-2 focus:ring-stone-700/10 dark:border-stone-700 dark:bg-stone-900
                dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-300 dark:focus:ring-stone-300/15'
              autoFocus
            />
          </div>

          <div className='mt-2 max-h-56 overflow-auto rounded-lg'>
            {filteredCategories.length ? (
              <ul className='space-y-1'>
                {filteredCategories.map(category => {
                  const isSelected = value === category.id

                  return (
                    <li key={category.id}>
                      <button
                        type='button'
                        onClick={() => {
                          onChange(category.id)
                          setIsOpen(false)
                          setQuery('')
                        }}
                        className='flex w-full items-start justify-between rounded-lg px-3 py-2 text-left transition hover:bg-stone-100
                         dark:hover:bg-stone-800'
                      >
                        <span>
                          <span className='block text-sm font-medium text-stone-900 dark:text-stone-100'>
                            {category.name}
                          </span>
                          <span className='block text-xs text-stone-500 dark:text-stone-400'>
                            {category.type}
                          </span>
                        </span>

                        {isSelected ? (
                          <Check className='mt-0.5 h-4 w-4 text-stone-700 dark:text-stone-200' />
                        ) : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className='px-3 py-4 text-sm text-stone-500 dark:text-stone-400'>
                No categories found.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CategorySelect
