import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, SubmitEvent } from 'react'
import {
  ImagePlus,
  PackagePlus,
  ClipboardPenLine,
  Hash,
  Boxes,
} from 'lucide-react'
import { toast } from 'sonner'
import CategorySelect from '../../../components/warehouse/CategorySelect'
import categoriesData from '../../../json/categories.json'
import { Link } from 'react-router'
import type { Category } from '../../../types/category.types'

type ProductRecord = {
  id: string
  name: string
  categoryId: number
  qty: number
  notes: string
  imageDataUrl: string | null
}

type ProductFormValues = {
  id: string
  name: string
  categoryId: number | null
  qty: string
  notes: string
}

const initialFormValues: ProductFormValues = {
  id: '',
  name: '',
  categoryId: null,
  qty: '',
  notes: '',
}

const fieldClassName =
  'w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 hover:border-stone-400 focus:border-stone-700 focus:ring-4 focus:ring-stone-700/10 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:hover:border-stone-600 dark:focus:border-stone-300 dark:focus:ring-stone-300/15'

const AddProduct = () => {
  const [products, setProducts] = useState<ProductRecord[]>(() => {
    const storedProducts = localStorage.getItem('products')
    if (!storedProducts) {
      return []
    }

    try {
      return JSON.parse(storedProducts) as ProductRecord[]
    } catch {
      return []
    }
  })

  const [formValues, setFormValues] =
    useState<ProductFormValues>(initialFormValues)
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products))
  }, [products])

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      setImageDataUrl(null)
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose a valid image file.')
      event.target.value = ''
      setImageDataUrl(null)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImageDataUrl((reader.result as string) ?? null)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault()

    const normalizedId = formValues.id.trim()
    const normalizedName = formValues.name.trim()
    const qtyNumber = Number(formValues.qty)
    const normalizedNotes = formValues.notes.trim()

    if (
      !normalizedId ||
      !normalizedName ||
      !formValues.categoryId ||
      !formValues.qty
    ) {
      toast.error('Please fill in all required fields.')
      return
    }

    if (!Number.isFinite(qtyNumber) || qtyNumber <= 0) {
      toast.error('Quantity must be a positive number.')
      return
    }

    const duplicateId = products.some(product => product.id === normalizedId)
    if (duplicateId) {
      toast.error('Product ID already exists. Please choose another ID.')
      return
    }

    const newProduct: ProductRecord = {
      id: normalizedId,
      name: normalizedName,
      categoryId: formValues.categoryId,
      qty: qtyNumber,
      notes: normalizedNotes,
      imageDataUrl,
    }

    const categoryName =
      (categoriesData as Category[]).find(
        category => category.id === formValues.categoryId,
      )?.name ?? 'Unknown'

    const pendingQueueRaw = localStorage.getItem('pending-pricing')
    let pendingQueue: Array<{ id: string; name: string; category: string }> = []

    if (pendingQueueRaw) {
      try {
        pendingQueue = JSON.parse(pendingQueueRaw) as Array<{
          id: string
          name: string
          category: string
        }>
      } catch {
        pendingQueue = []
      }
    }

    const alreadyQueued = pendingQueue.some(item => item.id === normalizedId)
    if (!alreadyQueued) {
      pendingQueue.push({
        id: normalizedId,
        name: normalizedName,
        category: categoryName,
      })
      localStorage.setItem('pending-pricing', JSON.stringify(pendingQueue))
    }

    setProducts(prev => [...prev, newProduct])
    setFormValues(initialFormValues)
    setImageDataUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success(`Product "${newProduct.name}" created successfully.`)
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

      <div className='relative z-10 mx-auto max-w-4xl space-y-6'>
        <header className='space-y-2'>
          <p className='text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400'>
            Product Management
          </p>
          <h1 className='flex items-center gap-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 sm:text-3xl'>
            <span
              className='inline-flex h-8 w-8 items-center justify-center rounded-xl
             bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
            >
              <PackagePlus className='h-4.5 w-4.5' />
            </span>
            Create New Product
          </h1>
          <p className='text-sm text-stone-600 dark:text-stone-400'>
            Register a product with stock quantity, category, image, and
            internal notes.
          </p>
        </header>

        <div
          className='rounded-2xl border border-stone-200/80 bg-white/85 p-4 shadow-sm
         backdrop-blur dark:border-stone-800/80 dark:bg-stone-900/80 sm:p-6'
        >
          <form onSubmit={handleSubmit} className='grid gap-5 lg:grid-cols-2'>
            <label className='block'>
              <span className='mb-2 inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300'>
                <ClipboardPenLine className='h-4 w-4' />
                Name
              </span>
              <input
                name='name'
                value={formValues.name}
                onChange={event =>
                  setFormValues(prev => ({ ...prev, name: event.target.value }))
                }
                placeholder='Ex: Wireless Keyboard'
                className={fieldClassName}
                required
              />
            </label>

            <label className='block'>
              <span className='mb-2 inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300'>
                <Boxes className='h-4 w-4' />
                Category
              </span>
              <CategorySelect
                value={formValues.categoryId}
                onChange={categoryId =>
                  setFormValues(prev => ({ ...prev, categoryId }))
                }
              />
            </label>

            <label className='block'>
              <span className='mb-2 inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300'>
                <Boxes className='h-4 w-4' />
                Qty
              </span>
              <input
                type='number'
                min='1'
                step='1'
                name='qty'
                value={formValues.qty}
                onChange={event =>
                  setFormValues(prev => ({ ...prev, qty: event.target.value }))
                }
                placeholder='Ex: 120'
                className={fieldClassName}
                required
              />
            </label>

            <label className='block'>
              <span className='mb-2 inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300'>
                <Hash className='h-4 w-4' />
                Id (manually entered)
              </span>
              <input
                name='id'
                value={formValues.id}
                onChange={event =>
                  setFormValues(prev => ({ ...prev, id: event.target.value }))
                }
                placeholder='Ex: PRD-001'
                className={fieldClassName}
                required
              />
            </label>

            <label className='block lg:col-span-2'>
              <span className='mb-2 inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300'>
                <ImagePlus className='h-4 w-4' />
                Image
              </span>

              <div className='flex flex-col gap-3 rounded-xl border border-dashed border-stone-300 bg-stone-50/70 p-4 dark:border-stone-700 dark:bg-stone-900/40 sm:flex-row sm:items-center'>
                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  className='inline-flex w-fit items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800'
                >
                  <ImagePlus className='h-4 w-4' />
                  Upload Image
                </button>
                <p className='text-xs text-stone-500 dark:text-stone-400'>
                  Supports JPG, PNG, WEBP and other image formats.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='hidden'
              />

              {imageDataUrl ? (
                <div className='mt-3 overflow-hidden rounded-xl border border-stone-200 bg-white p-2 shadow-sm dark:border-stone-700 dark:bg-stone-900'>
                  <img
                    src={imageDataUrl}
                    alt='Selected product preview'
                    className='h-48 w-full rounded-lg object-cover'
                  />
                </div>
              ) : null}
            </label>

            <label className='block lg:col-span-2'>
              <span className='mb-2 inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300'>
                <ClipboardPenLine className='h-4 w-4' />
                Notes
              </span>
              <textarea
                name='notes'
                value={formValues.notes}
                onChange={event =>
                  setFormValues(prev => ({
                    ...prev,
                    notes: event.target.value,
                  }))
                }
                rows={4}
                placeholder='Additional product notes and handling instructions'
                className={fieldClassName}
              />
            </label>
            <div className='flex items-center gap-3'>
              <button
                type='submit'
                className='inline-flex w-fit items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white
               shadow-sm transition hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-stone-900/20
                dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 dark:focus:ring-stone-100/30'
              >
                <PackagePlus className='h-4 w-4' />
                Create Product
              </button>
              <Link
                to='/warehouse/products'
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

export default AddProduct
