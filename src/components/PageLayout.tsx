import type { SidebarItem } from './Sidebar'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router'

type Props = {
  sidebarItems: SidebarItem[]
}

const PageLayout = ({ sidebarItems }: Props) => {
  return (
    <section className='min-h-[calc(100vh-4.5rem)] w-full bg-stone-100/90 dark:bg-stone-950'>
      <Sidebar items={sidebarItems} className='hidden lg:flex' />

      <div className='flex w-full px-2 py-2 sm:px-3 sm:py-3 lg:pl-68 lg:pr-4 lg:py-4'>
        <main className='min-h-full w-full'>
          <Outlet />
        </main>
      </div>
    </section>
  )
}

export default PageLayout
