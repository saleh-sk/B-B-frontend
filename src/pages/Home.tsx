import {
  Boxes,
  BriefcaseBusiness,
  CircleDollarSign,
  Settings2,
} from 'lucide-react'
import HomeCard from '../components/HomeCard'

const cards = [
  {
    title: 'Finance',
    description:
      'Monitor budgets, spending flows, and monthly performance in one secure workspace.',
    Icon: CircleDollarSign,
    to: '/finance',
    tone: {
      border: 'border-emerald-200/80 dark:border-emerald-900/70',
      softBg:
        'bg-linear-to-br from-emerald-50 via-white to-emerald-100/70 dark:from-emerald-950/50 dark:via-stone-900 dark:to-emerald-900/30',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/60',
      iconText: 'text-emerald-700 dark:text-emerald-300',
      titleText: 'text-emerald-900 dark:text-emerald-200',
      ring: 'focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-400',
    },
  },
  {
    title: 'Boutique',
    description:
      'Review sales activity, product trends, and customer touchpoints with clarity.',
    Icon: BriefcaseBusiness,
    to: '/boutique',
    tone: {
      border: 'border-amber-200/80 dark:border-amber-900/70',
      softBg:
        'bg-linear-to-br from-amber-50 via-white to-amber-100/70 dark:from-amber-950/40 dark:via-stone-900 dark:to-amber-900/30',
      iconBg: 'bg-amber-100 dark:bg-amber-900/60',
      iconText: 'text-amber-700 dark:text-amber-300',
      titleText: 'text-amber-900 dark:text-amber-200',
      ring: 'focus-visible:ring-amber-600 dark:focus-visible:ring-amber-400',
    },
  },
  {
    title: 'Warehouse',
    description:
      'Track inventory levels, stock movements, and replenishment priorities in real time.',
    Icon: Boxes,
    to: '/warehouse',
    tone: {
      border: 'border-sky-200/80 dark:border-sky-900/70',
      softBg:
        'bg-linear-to-br from-sky-50 via-white to-sky-100/70 dark:from-sky-950/40 dark:via-stone-900 dark:to-sky-900/30',
      iconBg: 'bg-sky-100 dark:bg-sky-900/60',
      iconText: 'text-sky-700 dark:text-sky-300',
      titleText: 'text-sky-900 dark:text-sky-200',
      ring: 'focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400',
    },
  },
  {
    title: 'Logistics',
    description:
      'Coordinate delivery pipelines, route planning, and shipment status with confidence.',
    Icon: Settings2,
    to: '/logistics',
    tone: {
      border: 'border-violet-200/80 dark:border-violet-900/70',
      softBg:
        'bg-linear-to-br from-violet-50 via-white to-violet-100/70 dark:from-violet-950/40 dark:via-stone-900 dark:to-violet-900/30',
      iconBg: 'bg-violet-100 dark:bg-violet-900/60',
      iconText: 'text-violet-700 dark:text-violet-300',
      titleText: 'text-violet-900 dark:text-violet-200',
      ring: 'focus-visible:ring-violet-600 dark:focus-visible:ring-violet-400',
    },
  },
]

const Home = () => {
  return (
    <section
      className='min-h-[calc(100vh-4.5rem)] bg-linear-to-b from-stone-100 via-stone-50 to-stone-100 px-4 py-10
      text-stone-900 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 dark:text-stone-100 sm:px-6 lg:px-8'
    >
      <div className='mx-auto w-full max-w-7xl'>
        <div
          className='rounded-3xl border border-stone-200/70 bg-white/85 p-7 shadow-sm backdrop-blur-sm
          dark:border-stone-800 dark:bg-stone-900/85 sm:p-9'
        >
          <p className='text-xs font-semibold tracking-[0.18em] text-stone-500 uppercase dark:text-stone-400'>
            Operations Hub
          </p>
          <h1 className='mt-3 text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl'>
            Choose a business area to continue
          </h1>
          <p className='mt-3 max-w-2xl text-sm leading-6 text-stone-600 dark:text-stone-300 sm:text-base'>
            Access core departments through a unified portal designed for
            structured workflows and reliable decision making.
          </p>

          <div className='mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2'>
            {cards.map(card => (
              <HomeCard
                key={card.title}
                title={card.title}
                description={card.description}
                Icon={card.Icon}
                to={card.to}
                tone={card.tone}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
