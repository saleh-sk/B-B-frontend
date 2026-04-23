import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CircleCheckBig,
  PackagePlus,
  Search,
  ShoppingBasket,
  UserRoundSearch,
  X,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import customersData from '../../../json/customers.json'
import productsData from '../../../json/products.json'
import { useDebounce } from '../../../hooks/use-debounce'
import { createInvoice } from '../../../services/invoice.service'
import type {
  CreateInvoiceInput,
  InvoiceCustomer,
  InvoiceDraftLineItem,
  InvoiceProduct,
} from '../../../types/invoice.types'

type RawCustomer = {
  id: string
  name: string
}

type RawProduct = {
  id: string
  name: string
  category: string
  price?: number
}

const CUSTOMERS_PER_PAGE = 6
const PRODUCTS_PER_PAGE = 7

const formatCurrency = (amountInCents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amountInCents / 100)
}

const normalizeCustomers = (items: RawCustomer[]): InvoiceCustomer[] => {
  const customersMap = new Map<string, InvoiceCustomer>()

  for (const item of items) {
    customersMap.set(item.id, {
      id: item.id,
      name: item.name,
    })
  }

  return [...customersMap.values()].sort((a, b) => a.name.localeCompare(b.name))
}

const normalizeProducts = (items: RawProduct[]): InvoiceProduct[] => {
  const productsMap = new Map<string, InvoiceProduct>()

  for (const item of items) {
    const unitPriceCents = Math.max(0, Math.round((item.price ?? 0) * 100))
    const normalizedProduct: InvoiceProduct = {
      id: item.id,
      name: item.name,
      category: item.category,
      unitPriceCents,
    }

    const existingProduct = productsMap.get(item.id)
    if (!existingProduct) {
      productsMap.set(item.id, normalizedProduct)
      continue
    }

    // Keep richer price data when duplicate ids exist in source JSON.
    if (normalizedProduct.unitPriceCents >= existingProduct.unitPriceCents) {
      productsMap.set(item.id, normalizedProduct)
    }
  }

  return [...productsMap.values()]
    .filter(product => product.unitPriceCents > 0)
    .sort((a, b) => a.name.localeCompare(b.name))
}

const AddInvoice = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [customerSearch, setCustomerSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  )
  const [lineItems, setLineItems] = useState<InvoiceDraftLineItem[]>([])
  const [customersPage, setCustomersPage] = useState(1)
  const [productsPage, setProductsPage] = useState(1)

  const debouncedCustomerSearch = useDebounce(customerSearch, 250)
  const debouncedProductSearch = useDebounce(productSearch, 250)

  const customers = useMemo(
    () => normalizeCustomers(customersData as RawCustomer[]),
    [],
  )
  const products = useMemo(
    () => normalizeProducts(productsData as RawProduct[]),
    [],
  )

  const selectedCustomer = useMemo(
    () =>
      customers.find(customer => customer.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId],
  )

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = debouncedCustomerSearch.trim().toLowerCase()

    return customers.filter(customer => {
      if (!normalizedQuery) {
        return true
      }

      return (
        customer.id.toLowerCase().includes(normalizedQuery) ||
        customer.name.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [customers, debouncedCustomerSearch])

  const filteredProducts = useMemo(() => {
    const normalizedQuery = debouncedProductSearch.trim().toLowerCase()

    return products.filter(product => {
      if (!normalizedQuery) {
        return true
      }

      return (
        product.id.toLowerCase().includes(normalizedQuery) ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [products, debouncedProductSearch])

  const customersPageCount = Math.max(
    1,
    Math.ceil(filteredCustomers.length / CUSTOMERS_PER_PAGE),
  )
  const productsPageCount = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  )

  const effectiveCustomersPage = Math.min(customersPage, customersPageCount)
  const effectiveProductsPage = Math.min(productsPage, productsPageCount)

  const customersStart = (effectiveCustomersPage - 1) * CUSTOMERS_PER_PAGE
  const productsStart = (effectiveProductsPage - 1) * PRODUCTS_PER_PAGE
  const pagedCustomers = filteredCustomers.slice(
    customersStart,
    customersStart + CUSTOMERS_PER_PAGE,
  )
  const pagedProducts = filteredProducts.slice(
    productsStart,
    productsStart + PRODUCTS_PER_PAGE,
  )

  const subtotalCents = useMemo(() => {
    return lineItems.reduce(
      (total, item) => total + item.quantity * item.unitPriceCents,
      0,
    )
  }, [lineItems])

  const handleAddProduct = (product: InvoiceProduct) => {
    const isAlreadyAdded = lineItems.some(
      lineItem => lineItem.productId === product.id,
    )

    if (isAlreadyAdded) {
      toast.error('This product is already in the invoice.')
      return
    }

    setLineItems(previous => [
      ...previous,
      {
        productId: product.id,
        productName: product.name,
        category: product.category,
        quantity: 1,
        unitPriceCents: product.unitPriceCents,
      },
    ])
  }

  const handleQuantityChange = (
    productId: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextQuantity = Number(event.target.value)

    if (!Number.isFinite(nextQuantity)) {
      return
    }

    const sanitizedQuantity = Math.max(1, Math.floor(nextQuantity))

    setLineItems(previous =>
      previous.map(lineItem =>
        lineItem.productId === productId
          ? {
              ...lineItem,
              quantity: sanitizedQuantity,
            }
          : lineItem,
      ),
    )
  }

  const handleRemoveProduct = (productId: string) => {
    setLineItems(previous =>
      previous.filter(lineItem => lineItem.productId !== productId),
    )
  }

  const handleBack = () => {
    setStep(previous =>
      previous > 1 ? ((previous - 1) as 1 | 2 | 3) : previous,
    )
  }

  const handleNext = () => {
    if (step === 1 && !selectedCustomerId) {
      toast.error('Select one customer before moving to products.')
      return
    }

    if (step === 2 && lineItems.length === 0) {
      toast.error('Add at least one product to continue.')
      return
    }

    setStep(previous =>
      previous < 3 ? ((previous + 1) as 1 | 2 | 3) : previous,
    )
  }

  const handleCreateInvoice = () => {
    if (!selectedCustomer || lineItems.length === 0) {
      toast.error('Invoice is incomplete.')
      return
    }

    const payload: CreateInvoiceInput = {
      customer: selectedCustomer,
      lineItems,
    }

    const invoice = createInvoice(payload)
    toast.success(`Invoice ${invoice.id} created successfully.`)
    navigate('/boutique/invoices')
  }

  return (
    <section className='relative overflow-hidden rounded-3xl border border-stone-200/80 bg-linear-to-br from-white via-stone-50 to-stone-100 p-4 shadow-sm dark:border-stone-800/80 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900 sm:p-6 lg:p-8'>
      <div className='pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-stone-300/30 blur-3xl dark:bg-stone-700/25' />
      <div className='pointer-events-none absolute -bottom-20 -left-24 h-72 w-72 rounded-full bg-stone-200/40 blur-3xl dark:bg-stone-800/35' />

      <div className='relative z-10 space-y-6'>
        <header className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400'>
              Boutique Billing
            </p>
            <h1 className='mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 sm:text-3xl'>
              <span className='inline-flex h-8 w-8 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm dark:bg-stone-100 dark:text-stone-900'>
                <PackagePlus className='h-4.5 w-4.5' />
              </span>
              Create Invoice
            </h1>
            <p className='mt-1 text-sm text-stone-600 dark:text-stone-400'>
              Select customer, add products, and review invoice details before
              issuing.
            </p>
          </div>

          <Link
            to='/boutique/invoices'
            className='rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800'
          >
            Manage Invoices
          </Link>
        </header>

        <div className='grid gap-2 sm:grid-cols-3'>
          {[
            { label: 'Customer', value: 1 },
            { label: 'Products', value: 2 },
            { label: 'Review', value: 3 },
          ].map(stepItem => {
            const isActive = step === stepItem.value
            const isDone = step > stepItem.value

            return (
              <div
                key={stepItem.value}
                className={`rounded-2xl border p-3 text-sm shadow-sm ${
                  isActive
                    ? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900'
                    : 'border-stone-300 bg-white/85 text-stone-700 dark:border-stone-700 dark:bg-stone-900/75 dark:text-stone-300'
                }`}
              >
                <p className='text-xs uppercase tracking-[0.16em] opacity-80'>
                  Step {stepItem.value}
                </p>
                <p className='mt-1 flex items-center gap-2 font-semibold'>
                  {isDone ? <CircleCheckBig className='h-4 w-4' /> : null}
                  {stepItem.label}
                </p>
              </div>
            )
          })}
        </div>

        {step === 1 ? (
          <div className='space-y-4 rounded-2xl border border-stone-200/80 bg-white/85 p-4 shadow-sm dark:border-stone-800/80 dark:bg-stone-900/80'>
            <label className='relative block'>
              <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400' />
              <input
                value={customerSearch}
                onChange={event => {
                  setCustomerSearch(event.target.value)
                  setCustomersPage(1)
                }}
                placeholder='Search customer by id or name'
                className='w-full rounded-xl border border-stone-300 bg-white px-10 py-2.5 text-sm text-stone-900 shadow-sm outline-none transition-all placeholder:text-stone-400 hover:border-stone-400 focus:border-stone-700 focus:ring-4 focus:ring-stone-700/10 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:hover:border-stone-600 dark:focus:border-stone-300 dark:focus:ring-stone-300/15'
              />
            </label>

            <div className='overflow-hidden rounded-2xl border border-stone-200/80 bg-white/90 dark:border-stone-800/80 dark:bg-stone-900/80'>
              <div className='overflow-x-auto'>
                <table className='w-full min-w-160 border-collapse'>
                  <thead>
                    <tr className='border-b border-stone-200 bg-stone-100/90 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:border-stone-800 dark:bg-stone-900/90 dark:text-stone-400'>
                      <th className='px-4 py-3'>Select</th>
                      <th className='px-4 py-3'>Customer ID</th>
                      <th className='px-4 py-3'>Customer Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedCustomers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className='px-4 py-10 text-center text-sm text-stone-500 dark:text-stone-400'
                        >
                          <div className='mx-auto flex max-w-sm flex-col items-center gap-2'>
                            <UserRoundSearch className='h-7 w-7 text-stone-400 dark:text-stone-500' />
                            <p>No customers found.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      pagedCustomers.map(customer => {
                        const isSelected = customer.id === selectedCustomerId

                        return (
                          <tr
                            key={customer.id}
                            className={`border-b border-stone-200/80 text-sm transition last:border-b-0 dark:border-stone-800/80 ${
                              isSelected
                                ? 'bg-stone-100/70 dark:bg-stone-800/45'
                                : 'hover:bg-stone-100/50 dark:hover:bg-stone-800/35'
                            }`}
                          >
                            <td className='px-4 py-3'>
                              <input
                                type='radio'
                                name='invoice-customer'
                                checked={isSelected}
                                onChange={() =>
                                  setSelectedCustomerId(customer.id)
                                }
                              />
                            </td>
                            <td
                              className='cursor-pointer px-4 py-3 font-medium text-stone-700 dark:text-stone-200'
                              onClick={() => setSelectedCustomerId(customer.id)}
                            >
                              {customer.id}
                            </td>
                            <td
                              className='cursor-pointer px-4 py-3 text-stone-700 dark:text-stone-200'
                              onClick={() => setSelectedCustomerId(customer.id)}
                            >
                              {customer.name}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='flex flex-wrap items-center justify-between gap-3'>
              <p className='text-sm text-stone-600 dark:text-stone-400'>
                Showing {pagedCustomers.length} of {filteredCustomers.length}{' '}
                customers
              </p>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  disabled={effectiveCustomersPage === 1}
                  onClick={() =>
                    setCustomersPage(page => Math.max(1, page - 1))
                  }
                  className='rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200'
                >
                  Previous
                </button>
                <span className='text-sm text-stone-600 dark:text-stone-400'>
                  Page {effectiveCustomersPage} / {customersPageCount}
                </span>
                <button
                  type='button'
                  disabled={effectiveCustomersPage === customersPageCount}
                  onClick={() =>
                    setCustomersPage(page =>
                      Math.min(customersPageCount, page + 1),
                    )
                  }
                  className='rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200'
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className='grid gap-4 lg:grid-cols-2'>
            <div className='space-y-4 rounded-2xl border border-stone-200/80 bg-white/85 p-4 shadow-sm dark:border-stone-800/80 dark:bg-stone-900/80'>
              <label className='relative block'>
                <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400' />
                <input
                  value={productSearch}
                  onChange={event => {
                    setProductSearch(event.target.value)
                    setProductsPage(1)
                  }}
                  placeholder='Search products by name, id, or category'
                  className='w-full rounded-xl border border-stone-300 bg-white px-10 py-2.5 text-sm text-stone-900 shadow-sm outline-none transition-all placeholder:text-stone-400 hover:border-stone-400 focus:border-stone-700 focus:ring-4 focus:ring-stone-700/10 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:hover:border-stone-600 dark:focus:border-stone-300 dark:focus:ring-stone-300/15'
                />
              </label>

              <div className='overflow-hidden rounded-2xl border border-stone-200/80 bg-white/90 dark:border-stone-800/80 dark:bg-stone-900/80'>
                <div className='overflow-x-auto'>
                  <table className='w-full min-w-2xl border-collapse'>
                    <thead>
                      <tr className='border-b border-stone-200 bg-stone-100/90 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:border-stone-800 dark:bg-stone-900/90 dark:text-stone-400'>
                        <th className='px-4 py-3'>ID</th>
                        <th className='px-4 py-3'>Name</th>
                        <th className='px-4 py-3'>Price</th>
                        <th className='px-4 py-3 text-right'>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedProducts.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className='px-4 py-10 text-center text-sm text-stone-500 dark:text-stone-400'
                          >
                            No products found.
                          </td>
                        </tr>
                      ) : (
                        pagedProducts.map(product => {
                          const isAdded = lineItems.some(
                            lineItem => lineItem.productId === product.id,
                          )

                          return (
                            <tr
                              key={product.id}
                              className='border-b border-stone-200/80 text-sm last:border-b-0 dark:border-stone-800/80'
                            >
                              <td className='px-4 py-3 font-medium text-stone-700 dark:text-stone-200'>
                                {product.id}
                              </td>
                              <td className='px-4 py-3 text-stone-700 dark:text-stone-200'>
                                {product.name}
                              </td>
                              <td className='px-4 py-3 text-stone-700 dark:text-stone-200'>
                                {formatCurrency(product.unitPriceCents)}
                              </td>
                              <td className='px-4 py-3 text-right'>
                                <button
                                  type='button'
                                  disabled={isAdded}
                                  onClick={() => handleAddProduct(product)}
                                  className='rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200'
                                >
                                  {isAdded ? 'Added' : 'Add'}
                                </button>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className='flex flex-wrap items-center justify-between gap-3'>
                <p className='text-sm text-stone-600 dark:text-stone-400'>
                  Showing {pagedProducts.length} of {filteredProducts.length}{' '}
                  products
                </p>
                <div className='flex items-center gap-2'>
                  <button
                    type='button'
                    disabled={effectiveProductsPage === 1}
                    onClick={() =>
                      setProductsPage(page => Math.max(1, page - 1))
                    }
                    className='rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200'
                  >
                    Previous
                  </button>
                  <span className='text-sm text-stone-600 dark:text-stone-400'>
                    Page {effectiveProductsPage} / {productsPageCount}
                  </span>
                  <button
                    type='button'
                    disabled={effectiveProductsPage === productsPageCount}
                    onClick={() =>
                      setProductsPage(page =>
                        Math.min(productsPageCount, page + 1),
                      )
                    }
                    className='rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200'
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <div className='space-y-4 rounded-2xl border border-stone-200/80 bg-white/85 p-4 shadow-sm dark:border-stone-800/80 dark:bg-stone-900/80'>
              <h2 className='flex items-center gap-2 text-lg font-semibold text-stone-900 dark:text-stone-100'>
                <ShoppingBasket className='h-5 w-5' />
                Invoice Items
              </h2>

              <div className='overflow-hidden rounded-2xl border border-stone-200/80 bg-white/90 dark:border-stone-800/80 dark:bg-stone-900/80'>
                <div className='overflow-x-auto'>
                  <table className='w-full min-w-2xl border-collapse'>
                    <thead>
                      <tr className='border-b border-stone-200 bg-stone-100/90 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:border-stone-800 dark:bg-stone-900/90 dark:text-stone-400'>
                        <th className='px-4 py-3'>Product</th>
                        <th className='px-4 py-3'>Qty</th>
                        <th className='px-4 py-3'>Unit Price</th>
                        <th className='px-4 py-3'>Line Total</th>
                        <th className='px-4 py-3 text-right'>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className='px-4 py-10 text-center text-sm text-stone-500 dark:text-stone-400'
                          >
                            Add products from the left table.
                          </td>
                        </tr>
                      ) : (
                        lineItems.map(lineItem => (
                          <tr
                            key={lineItem.productId}
                            className='border-b border-stone-200/80 text-sm last:border-b-0 dark:border-stone-800/80'
                          >
                            <td className='px-4 py-3'>
                              <p className='font-medium text-stone-700 dark:text-stone-200'>
                                {lineItem.productName}
                              </p>
                              <p className='text-xs text-stone-500 dark:text-stone-400'>
                                {lineItem.productId}
                              </p>
                            </td>
                            <td className='px-4 py-3'>
                              <input
                                type='number'
                                min='1'
                                step='1'
                                value={lineItem.quantity}
                                onChange={event =>
                                  handleQuantityChange(
                                    lineItem.productId,
                                    event,
                                  )
                                }
                                className='w-20 rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-sm text-stone-900 outline-none focus:border-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:focus:border-stone-300'
                              />
                            </td>
                            <td className='px-4 py-3 text-stone-700 dark:text-stone-200'>
                              {formatCurrency(lineItem.unitPriceCents)}
                            </td>
                            <td className='px-4 py-3 font-semibold text-stone-900 dark:text-stone-100'>
                              {formatCurrency(
                                lineItem.quantity * lineItem.unitPriceCents,
                              )}
                            </td>
                            <td className='px-4 py-3 text-right'>
                              <button
                                type='button'
                                onClick={() =>
                                  handleRemoveProduct(lineItem.productId)
                                }
                                className='rounded-lg border border-red-300 bg-white px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 dark:border-red-800 dark:bg-stone-900 dark:text-red-300 dark:hover:bg-red-900/20'
                              >
                                <X className='h-3.5 w-3.5' />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className='rounded-xl border border-stone-300/80 bg-stone-50/80 p-4 dark:border-stone-700 dark:bg-stone-900/50'>
                <div className='flex items-center justify-between text-sm text-stone-600 dark:text-stone-400'>
                  <span>Items</span>
                  <span>{lineItems.length}</span>
                </div>
                <div className='mt-2 flex items-center justify-between text-base font-semibold text-stone-900 dark:text-stone-100'>
                  <span>Subtotal / Total</span>
                  <span>{formatCurrency(subtotalCents)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className='space-y-4 rounded-2xl border border-stone-200/80 bg-white/85 p-4 shadow-sm dark:border-stone-800/80 dark:bg-stone-900/80'>
            <div className='grid gap-3 sm:grid-cols-3'>
              <div className='rounded-xl border border-stone-300/80 bg-white p-3 dark:border-stone-700 dark:bg-stone-900'>
                <p className='text-xs uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400'>
                  Customer
                </p>
                <p className='mt-1 font-semibold text-stone-900 dark:text-stone-100'>
                  {selectedCustomer?.name ?? '-'}
                </p>
                <p className='text-sm text-stone-600 dark:text-stone-400'>
                  {selectedCustomer?.id ?? '-'}
                </p>
              </div>

              <div className='rounded-xl border border-stone-300/80 bg-white p-3 dark:border-stone-700 dark:bg-stone-900'>
                <p className='text-xs uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400'>
                  Issue Date
                </p>
                <p className='mt-1 font-semibold text-stone-900 dark:text-stone-100'>
                  {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className='rounded-xl border border-stone-300/80 bg-white p-3 dark:border-stone-700 dark:bg-stone-900'>
                <p className='text-xs uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400'>
                  Total
                </p>
                <p className='mt-1 font-semibold text-stone-900 dark:text-stone-100'>
                  {formatCurrency(subtotalCents)}
                </p>
              </div>
            </div>

            <div className='overflow-hidden rounded-2xl border border-stone-200/80 bg-white/90 dark:border-stone-800/80 dark:bg-stone-900/80'>
              <div className='overflow-x-auto'>
                <table className='w-full min-w-2xl border-collapse'>
                  <thead>
                    <tr className='border-b border-stone-200 bg-stone-100/90 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:border-stone-800 dark:bg-stone-900/90 dark:text-stone-400'>
                      <th className='px-4 py-3'>Product ID</th>
                      <th className='px-4 py-3'>Name</th>
                      <th className='px-4 py-3'>Qty</th>
                      <th className='px-4 py-3'>Unit Price</th>
                      <th className='px-4 py-3'>Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map(lineItem => (
                      <tr
                        key={lineItem.productId}
                        className='border-b border-stone-200/80 text-sm last:border-b-0 dark:border-stone-800/80'
                      >
                        <td className='px-4 py-3 font-medium text-stone-700 dark:text-stone-200'>
                          {lineItem.productId}
                        </td>
                        <td className='px-4 py-3 text-stone-700 dark:text-stone-200'>
                          {lineItem.productName}
                        </td>
                        <td className='px-4 py-3 text-stone-700 dark:text-stone-200'>
                          {lineItem.quantity}
                        </td>
                        <td className='px-4 py-3 text-stone-700 dark:text-stone-200'>
                          {formatCurrency(lineItem.unitPriceCents)}
                        </td>
                        <td className='px-4 py-3 font-semibold text-stone-900 dark:text-stone-100'>
                          {formatCurrency(
                            lineItem.quantity * lineItem.unitPriceCents,
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}

        <div className='flex flex-wrap justify-between gap-3'>
          <button
            type='button'
            onClick={handleBack}
            disabled={step === 1}
            className='inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800'
          >
            <ArrowLeft className='h-4 w-4' />
            Back
          </button>

          {step < 3 ? (
            <button
              type='button'
              onClick={handleNext}
              className='inline-flex items-center gap-2 rounded-xl border border-stone-900 bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200'
            >
              Next
              <ArrowRight className='h-4 w-4' />
            </button>
          ) : (
            <button
              type='button'
              onClick={handleCreateInvoice}
              className='inline-flex items-center gap-2 rounded-xl border border-emerald-700 bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 dark:border-emerald-500 dark:bg-emerald-500 dark:text-stone-950 dark:hover:bg-emerald-400'
            >
              <CircleCheckBig className='h-4 w-4' />
              Create Invoice
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default AddInvoice
