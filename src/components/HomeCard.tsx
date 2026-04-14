import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'

type Props = {
  title: string
  description: string
  Icon: LucideIcon
  to: string
  tone: {
    border: string
    softBg: string
    iconBg: string
    iconText: string
    titleText: string
    ring: string
  }
}

const HomeCard = ({ title, description, Icon, to, tone }: Props) => {
  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1
         hover:shadow-lg focus:outline-none focus-visible:ring-2 ${tone.border} ${tone.softBg} ${tone.ring}`}
    >
      <div className='flex items-start justify-between gap-4'>
        <div
          className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${tone.iconBg}`}
        >
          <Icon className={`h-6 w-6 ${tone.iconText}`} />
        </div>

        <ArrowRight
          className='h-5 w-5 text-stone-400 transition-transform
         duration-300 group-hover:translate-x-1 dark:text-stone-500'
        />
      </div>

      <div className='mt-5 space-y-2'>
        <h3
          className={`text-lg font-semibold tracking-tight ${tone.titleText}`}
        >
          {title}
        </h3>
        <p className='text-sm leading-6 text-stone-600 dark:text-stone-300'>
          {description}
        </p>
      </div>
    </Link>
  )
}

export default HomeCard
