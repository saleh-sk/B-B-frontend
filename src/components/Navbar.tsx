import { LogOut, Menu, Moon, Sun, UserRound, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/slices/authSlice'
import { toggleTheme } from '../store/slices/themeSlice'

const extractDisplayName = (email?: string): string => {
  if (!email) {
    return 'User'
  }

  const localPart = email.split('@')[0] ?? ''
  const cleanedParts = localPart
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .split(/[._-]+/)
    .filter(Boolean)

  if (cleanedParts.length === 0) {
    return 'User'
  }

  return cleanedParts
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

const Navbar = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const userEmail = useAppSelector(state => state.auth.user?.email)
  const themeMode = useAppSelector(state => state.theme.mode)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const displayName = useMemo(() => extractDisplayName(userEmail), [userEmail])

  const handleLogout = () => {
    dispatch(logout())
    setIsMobileMenuOpen(false)
    navigate('/login')
  }

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  return (
    <>
      <header
        className='sticky top-0 z-40 border-b border-stone-200/80 bg-white/90
       backdrop-blur-xl dark:border-stone-800/80 dark:bg-stone-950/90'
      >
        <div className='mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4'>
          <div className='flex items-center gap-3'>
            <div
              className='inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stone-300 bg-stone-100
              text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200'
            >
              <UserRound className='h-5 w-5' />
            </div>
            <div className='min-w-0'>
              <p className='text-xs tracking-[0.16em] text-stone-500 uppercase dark:text-stone-400'>
                Account
              </p>
              <p className='truncate text-sm font-semibold text-stone-900 dark:text-stone-100'>
                {displayName}
              </p>
            </div>
          </div>

          <nav className='hidden items-center gap-3 md:flex'>
            <button
              type='button'
              onClick={handleThemeToggle}
              className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-stone-300 bg-white text-stone-800
               shadow-sm transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2
                dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800 dark:focus:ring-stone-500 dark:focus:ring-offset-stone-900'
              aria-label='Toggle theme'
            >
              {themeMode === 'dark' ? (
                <Sun className='h-5 w-5' />
              ) : (
                <Moon className='h-5 w-5' />
              )}
            </button>
            <button
              type='button'
              onClick={handleLogout}
              className='inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold
               text-white shadow-sm transition hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900
                focus:ring-offset-2 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 dark:focus:ring-stone-200
                 dark:focus:ring-offset-stone-900'
            >
              <LogOut className='h-4 w-4' />
              Logout
            </button>
          </nav>

          <button
            type='button'
            onClick={() => setIsMobileMenuOpen(true)}
            className='inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stone-300 bg-white text-stone-800
             shadow-sm transition hover:bg-stone-100 md:hidden dark:border-stone-700
              dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800'
            aria-label='Open menu'
          >
            <Menu className='h-5 w-5' />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 transition md:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <button
          type='button'
          onClick={() => setIsMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/35 transition-opacity ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label='Close menu overlay'
        />

        <aside
          className={`absolute right-0 top-0 flex h-full w-[80%] max-w-90 flex-col border-l border-stone-200 bg-white
           shadow-2xl transition-transform duration-300 ease-out dark:border-stone-800 dark:bg-stone-950 ${
             isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
           }`}
        >
          <div className='flex items-center justify-between border-b border-stone-100 p-6 dark:border-stone-800/60'>
            <div>
              <p className='text-xs tracking-[0.16em] text-stone-500 uppercase dark:text-stone-400'>
                Signed in as
              </p>
              <p className='mt-1 text-lg font-semibold text-stone-900 dark:text-stone-100'>
                {displayName}
              </p>
            </div>
            <button
              type='button'
              onClick={() => setIsMobileMenuOpen(false)}
              className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-600
               transition hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2
                dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700 dark:hover:text-stone-200'
              aria-label='Close menu'
            >
              <X className='h-5 w-5' />
            </button>
          </div>

          <div className='flex flex-col gap-2 p-6'>
            <button
              type='button'
              onClick={handleThemeToggle}
              className='flex w-full items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-4
               text-sm font-medium text-stone-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition active:scale-[0.98]
                hover:border-stone-300 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2
                 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800/80 dark:focus:ring-stone-500'
            >
              <div className='flex items-center gap-3'>
                {themeMode === 'dark' ? (
                  <Sun className='h-5 w-5 text-stone-400 dark:text-stone-500' />
                ) : (
                  <Moon className='h-5 w-5 text-stone-400 dark:text-stone-500' />
                )}
                <span>
                  {themeMode === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                </span>
              </div>
            </button>

            <button
              type='button'
              onClick={handleLogout}
              className='flex w-full items-center justify-between rounded-xl bg-stone-900 px-4 py-4 text-sm font-semibold
               text-white shadow-sm transition active:scale-[0.98] hover:bg-stone-800 focus:outline-none focus:ring-2
                focus:ring-stone-900 focus:ring-offset-2 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200
                 dark:focus:ring-stone-200'
            >
              <div className='flex items-center gap-3'>
                <LogOut className='h-5 w-5 text-stone-300 dark:text-stone-600' />
                <span>Logout</span>
              </div>
            </button>
          </div>
        </aside>
      </div>
    </>
  )
}

export default Navbar
