import { useMemo, useState } from 'react'

type SummaryCard = {
  title: string
  value: number
  tone: string
}

const PLReports = () => {
  const [startDate, setStartDate] = useState('2026-01-01')
  const [endDate, setEndDate] = useState('2026-12-31')

  const summaryCards = useMemo<SummaryCard[]>(
    () => [
      {
        title: 'Revenue',
        value: 1250000,
        tone: 'text-emerald-700 dark:text-emerald-300',
      },
      {
        title: 'COGS',
        value: -640000,
        tone: 'text-rose-700 dark:text-rose-300',
      },
      {
        title: 'Gross Profit',
        value: 610000,
        tone: 'text-sky-700 dark:text-sky-300',
      },
      {
        title: 'Operating Expenses (OPEX)',
        value: -285000,
        tone: 'text-amber-700 dark:text-amber-300',
      },
      {
        title: 'Operating Income (EBIT)',
        value: 325000,
        tone: 'text-violet-700 dark:text-violet-300',
      },
      {
        title: 'Net Profit',
        value: 241000,
        tone: 'text-indigo-700 dark:text-indigo-300',
      },
    ],
    [],
  )

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)

  return (
    <section
      className='min-h-full bg-linear-to-b from-stone-50 via-white to-stone-50
     p-4 sm:p-6 lg:p-8 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900'
    >
      <div className='mx-auto w-full max-w-7xl'>
        <div
          className='rounded-2xl border border-stone-200 bg-white/95 p-6 shadow-sm shadow-stone-200/60
         backdrop-blur-sm sm:p-8 dark:border-stone-800 dark:bg-stone-900/90 dark:shadow-black/20'
        >
          <header className='mb-8 space-y-2'>
            <h1 className='text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-100'>
              Profit & Loss Statement
            </h1>
            <p className='text-sm text-stone-600 sm:text-base dark:text-stone-400'>
              Financial performance overview for the selected reporting period.
            </p>
          </header>

          <div
            className='mb-8 grid grid-cols-1 gap-4 rounded-xl border border-stone-200
           bg-stone-50 p-4 sm:grid-cols-2 sm:p-5 dark:border-stone-800 dark:bg-stone-950/60'
          >
            <label className='space-y-2'>
              <span className='text-sm font-medium text-stone-700 dark:text-stone-300'>
                Start Date
              </span>
              <input
                type='date'
                value={startDate}
                onChange={event => setStartDate(event.target.value)}
                className='w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 shadow-sm
                 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-300/50 dark:border-stone-700
                  dark:bg-stone-900 dark:text-stone-100 dark:focus:border-stone-500 dark:focus:ring-stone-700/60'
              />
            </label>

            <label className='space-y-2'>
              <span className='text-sm font-medium text-stone-700 dark:text-stone-300'>
                End Date
              </span>
              <input
                type='date'
                value={endDate}
                onChange={event => setEndDate(event.target.value)}
                className='w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 shadow-sm
                 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-300/50 dark:border-stone-700
                  dark:bg-stone-900 dark:text-stone-100 dark:focus:border-stone-500 dark:focus:ring-stone-700/60'
              />
            </label>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {summaryCards.map(card => (
              <article
                key={card.title}
                className='rounded-xl border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/70 transition
                 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 dark:shadow-black/20'
              >
                <p className='text-sm font-medium text-stone-500 dark:text-stone-400'>
                  {card.title}
                </p>
                <p
                  className={`mt-3 text-2xl font-semibold tracking-tight sm:text-3xl ${card.tone}`}
                >
                  {formatCurrency(card.value)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PLReports
