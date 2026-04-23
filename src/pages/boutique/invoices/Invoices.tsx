import { useMemo, useState } from 'react'
import { FileText, Search } from 'lucide-react'
import { Link } from 'react-router'
import { useDebounce } from '../../../hooks/use-debounce'
import { listInvoices } from '../../../services/invoice.service'

const formatCurrency = (amountInCents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amountInCents / 100)
}

const Invoices = () => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 200)
  const invoices = useMemo(() => listInvoices(), [])

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase()

    return invoices.filter(invoice => {
      if (!normalizedSearch) {
        return true
      }

      return (
        invoice.id.toLowerCase().includes(normalizedSearch) ||
        invoice.customer.id.toLowerCase().includes(normalizedSearch) ||
        invoice.customer.name.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [debouncedSearch, invoices])

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
                <FileText className='h-4.5 w-4.5' />
              </span>
              Invoices
            </h1>
            <p className='mt-1 text-sm text-stone-600 dark:text-stone-400'>
              View issued invoices and search by invoice or customer.
            </p>
          </div>

          <Link
            to='/boutique/invoices/add'
            className='rounded-xl border border-stone-900 bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200'
          >
            Add Invoice
          </Link>
        </header>

        <label className='relative block'>
          <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400' />
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder='Search by invoice id, customer id, or customer name'
            className='w-full rounded-xl border border-stone-300 bg-white px-10 py-2.5 text-sm text-stone-900 shadow-sm outline-none transition-all placeholder:text-stone-400 hover:border-stone-400 focus:border-stone-700 focus:ring-4 focus:ring-stone-700/10 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:hover:border-stone-600 dark:focus:border-stone-300 dark:focus:ring-stone-300/15'
          />
        </label>

        <div className='overflow-hidden rounded-2xl border border-stone-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-stone-800/80 dark:bg-stone-900/80'>
          <div className='overflow-x-auto'>
            <table className='w-full min-w-200 border-collapse'>
              <thead>
                <tr className='border-b border-stone-200 bg-stone-100/90 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:border-stone-800 dark:bg-stone-900/90 dark:text-stone-400'>
                  <th className='px-4 py-3'>Invoice ID</th>
                  <th className='px-4 py-3'>Customer</th>
                  <th className='px-4 py-3'>Items</th>
                  <th className='px-4 py-3'>Issued At</th>
                  <th className='px-4 py-3'>Status</th>
                  <th className='px-4 py-3 text-right'>Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className='px-4 py-10 text-center text-sm text-stone-500 dark:text-stone-400'
                    >
                      No invoices found. Create your first invoice from Add
                      Invoice.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map(invoice => (
                    <tr
                      key={invoice.id}
                      className='border-b border-stone-200/80 text-sm last:border-b-0 dark:border-stone-800/80'
                    >
                      <td className='px-4 py-3 font-semibold text-stone-900 dark:text-stone-100'>
                        {invoice.id}
                      </td>
                      <td className='px-4 py-3'>
                        <p className='font-medium text-stone-700 dark:text-stone-200'>
                          {invoice.customer.name}
                        </p>
                        <p className='text-xs text-stone-500 dark:text-stone-400'>
                          {invoice.customer.id}
                        </p>
                      </td>
                      <td className='px-4 py-3 text-stone-700 dark:text-stone-200'>
                        {invoice.lineItems.length}
                      </td>
                      <td className='px-4 py-3 text-stone-700 dark:text-stone-200'>
                        {new Date(invoice.createdAt).toLocaleString()}
                      </td>
                      <td className='px-4 py-3'>
                        <span className='rounded-full border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-800 dark:border-emerald-900 dark:bg-emerald-900/25 dark:text-emerald-300'>
                          {invoice.status}
                        </span>
                      </td>
                      <td className='px-4 py-3 text-right font-semibold text-stone-900 dark:text-stone-100'>
                        {formatCurrency(invoice.totalCents)}
                      </td>
                    </tr>
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

export default Invoices
