import { ChevronDown } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router'
import type { LucideIcon } from 'lucide-react'

type SidebarItemType = 'link' | 'submenu'

interface SidebarBaseItem {
  label: string
  url: string
  type: SidebarItemType
}

export interface SidebarLinkItem extends SidebarBaseItem {
  type: 'link'
  icon?: never
}

export interface SidebarSubmenuItem extends SidebarBaseItem {
  type: 'submenu'
  icon: LucideIcon
  children: SidebarLinkItem[]
}

export type SidebarItem = SidebarLinkItem | SidebarSubmenuItem

interface SidebarProps {
  items: SidebarItem[]
  logo?: ReactNode
  className?: string
}

const baseLinkClasses =
  'group relative flex h-12 w-full items-center gap-3 rounded-lg px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-emerald-400/70 dark:focus-visible:ring-offset-stone-950'

const linkStateClasses =
  'text-stone-700 hover:bg-white/65 hover:text-stone-900 dark:text-stone-200 dark:hover:bg-black/20 dark:hover:text-white'

const activeLinkClasses =
  'bg-white/80 text-stone-950 shadow-[0_6px_20px_rgba(0,0,0,0.08)] dark:bg-black/35 dark:text-white'

const Sidebar = ({ items, logo, className = '' }: SidebarProps) => {
  const location = useLocation()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [hasManualToggle, setHasManualToggle] = useState(false)

  const inferredOpenSubmenu =
    items.find(
      item =>
        item.type === 'submenu' &&
        item.children.some(child => child.url === location.pathname),
    )?.label ?? null

  const currentOpenSubmenu = hasManualToggle ? openSubmenu : inferredOpenSubmenu

  return (
    <aside
      className={`fixed top-18 bottom-0 left-0 z-30 hidden w-65 flex-col gap-2 border-r border-stone-300/40
      bg-linear-to-b from-white/80 via-white/60 to-white/75 p-4 shadow-[0_10px_35px_rgba(0,0,0,0.08)] backdrop-blur-2xl
      dark:border-stone-700/60 dark:from-stone-950/70 dark:via-stone-950/55 dark:to-black/60 ${className}`}
    >
      <header className='flex h-18 items-center border-b border-stone-400/20 pb-3 dark:border-stone-300/15'>
        {logo ?? (
          <div className='text-sm font-semibold tracking-[0.2em] text-stone-700 uppercase dark:text-stone-300'>
            Brand
          </div>
        )}
      </header>

      <nav className='mt-1 flex-1 overflow-y-auto'>
        <ul className='space-y-1'>
          {items.map(item => {
            if (item.type === 'link') {
              return (
                <li key={item.label}>
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      `${baseLinkClasses} ${linkStateClasses} ${isActive ? activeLinkClasses : ''}`
                    }
                  >
                    <span className='h-1.5 w-1.5 rounded-full bg-stone-500/75 dark:bg-stone-400' />
                    <span className='pl-1'>{item.label}</span>
                  </NavLink>
                </li>
              )
            }

            const Icon = item.icon

            const submenuActive = item.children.some(
              child => child.url === location.pathname,
            )
            const isOpen = currentOpenSubmenu === item.label

            return (
              <li key={item.label}>
                <button
                  type='button'
                  onClick={() => {
                    setHasManualToggle(true)
                    setOpenSubmenu(current =>
                      current === item.label ? null : item.label,
                    )
                  }}
                  className={`${baseLinkClasses} ${linkStateClasses} ${submenuActive ? activeLinkClasses : ''}`}
                  aria-expanded={isOpen}
                >
                  <Icon className='h-5 w-5 shrink-0' />
                  <span>{item.label}</span>
                  <ChevronDown
                    className={`ml-auto h-4 w-4 transition ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <div
                  className={`grid overflow-hidden pl-6 transition-all duration-300 ${
                    isOpen
                      ? 'mt-1 grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-70'
                  }`}
                >
                  <ul className='min-h-0 space-y-1 overflow-hidden'>
                    {item.children.map(child => (
                      <li key={`${item.label}-${child.label}`}>
                        <NavLink
                          to={child.url}
                          className={({ isActive }) =>
                            `relative flex h-10 items-center rounded-md px-4 text-sm transition
                            ${
                              isActive
                                ? 'bg-white/75 text-stone-900 dark:bg-black/30 dark:text-white'
                                : 'text-stone-600 hover:bg-white/55 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-black/20 dark:hover:text-white'
                            }`
                          }
                        >
                          <span className='absolute left-2 h-1.5 w-1.5 rounded-full bg-stone-400/70 dark:bg-stone-400' />
                          <span className='pl-2'>{child.label}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
