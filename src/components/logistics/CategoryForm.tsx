import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link } from 'react-router'
import { FolderPlus, PencilLine, Shapes, Tag } from 'lucide-react'
import { toast } from 'sonner'

export type CategoryFormValues = {
  name: string
  type: string
}

type CategoryFormMode = 'create' | 'edit'

type CategoryFormProps = {
  mode: CategoryFormMode
  initialValues?: CategoryFormValues
  categoryId?: number | string
  onSubmit: (values: CategoryFormValues) => void
}

const defaultValues: CategoryFormValues = {
  name: '',
  type: '',
}

const fieldClassName =
  'w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 hover:border-stone-400 focus:border-stone-700 focus:ring-4 focus:ring-stone-700/10 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:hover:border-stone-600 dark:focus:border-stone-300 dark:focus:ring-stone-300/15'

const CategoryForm = ({
  mode,
  initialValues,
  categoryId,
  onSubmit,
}: CategoryFormProps) => {
  const [formValues, setFormValues] = useState<CategoryFormValues>(
    initialValues ?? defaultValues,
  )

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault()

    if (!formValues.name || !formValues.type) {
      toast.error('Please fill in all required fields.')
      return
    }

    onSubmit(formValues)

    if (mode === 'create') {
      setFormValues(defaultValues)
    }
  }

  return (
    <section
      className='relative overflow-hidden rounded-3xl border border-stone-200/80 bg-linear-to-br from-white via-stone-50
     to-stone-100 p-4 shadow-sm dark:border-stone-800/80 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900 sm:p-6 lg:p-8'
    >
      <div
        className='pointer-events-none absolute -right-20 -top-20 h-64 w-64
       rounded-full bg-stone-300/35 blur-3xl dark:bg-stone-700/25'
      />
      <div
        className='pointer-events-none absolute -bottom-24 -left-24 h-72 w-72
       rounded-full bg-stone-200/40 blur-3xl dark:bg-stone-800/35'
      />

      <div className='relative z-10 mx-auto max-w-3xl space-y-6'>
        <header className='space-y-2'>
          <p className='text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400'>
            Category Management
          </p>
          <h1 className='flex items-center gap-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 sm:text-3xl'>
            <span
              className='inline-flex h-8 w-8 items-center justify-center rounded-xl
             bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
            >
              {mode === 'create' ? (
                <FolderPlus className='h-4.5 w-4.5' />
              ) : (
                <PencilLine className='h-4.5 w-4.5' />
              )}
            </span>
            {mode === 'create'
              ? 'Create New Category'
              : `Edit Category (ID: ${categoryId ?? ''})`}
          </h1>
          <p className='text-sm text-stone-600 dark:text-stone-400'>
            {mode === 'create'
              ? 'Add a category record by providing a category name and type.'
              : 'Update the category details and save your changes.'}
          </p>
        </header>

        <div
          className='rounded-2xl border border-stone-200/80 bg-white/85 p-4 shadow-sm
         backdrop-blur dark:border-stone-800/80 dark:bg-stone-900/80 sm:p-6'
        >
          <form onSubmit={handleSubmit} className='space-y-5'>
            <label className='block'>
              <span className='mb-2 inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300'>
                <Tag className='h-4 w-4' />
                Category Name
              </span>
              <input
                name='name'
                value={formValues.name}
                onChange={event =>
                  setFormValues(prev => ({ ...prev, name: event.target.value }))
                }
                placeholder='Ex: Electronics'
                className={fieldClassName}
                required
              />
            </label>

            <label className='block'>
              <span className='mb-2 inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300'>
                <Shapes className='h-4 w-4' />
                Category Type
              </span>
              <input
                name='type'
                value={formValues.type}
                onChange={event =>
                  setFormValues(prev => ({ ...prev, type: event.target.value }))
                }
                placeholder='Ex: Physical Goods'
                className={fieldClassName}
                required
              />
            </label>

            <div className='flex items-center gap-3'>
              <button
                type='submit'
                className='inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white
               shadow-sm transition hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-stone-900/20
                dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 dark:focus:ring-stone-100/30'
              >
                {mode === 'create' ? (
                  <FolderPlus className='h-4 w-4' />
                ) : (
                  <PencilLine className='h-4 w-4' />
                )}
                {mode === 'create' ? 'Create Category' : 'Save Changes'}
              </button>
              <Link
                to='/logistics/categories'
                className='inline-flex items-center gap-2 rounded-xl bg-stone-200 px-5 py-3 text-sm font-semibold
                 text-stone-900 shadow-sm transition hover:bg-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300/30
                  dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700 dark:focus:ring-stone-800/40'
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default CategoryForm
