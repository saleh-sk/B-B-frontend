import { Eye, EyeOff, Lock, Mail, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { toggleTheme } from '../store/slices/themeSlice'
import { setUserEmail } from '../store/slices/authSlice'
import { useNavigate } from 'react-router'

const Login = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const mode = useAppSelector(state => state.theme.mode)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    dispatch(setUserEmail(formData.email))
    navigate('/')
  }

  return (
    <main
      className='flex min-h-screen items-center justify-center bg-stone-50 px-4 py-8 font-sans text-stone-900
     selection:bg-stone-200 dark:bg-stone-950 dark:text-stone-100 dark:selection:bg-stone-700'
    >
      <button
        type='button'
        onClick={() => dispatch(toggleTheme())}
        className='fixed right-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white
         px-4 py-2 text-sm font-medium text-stone-900 shadow-sm transition-colors hover:bg-stone-100
          dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800'
      >
        {mode === 'dark' ? (
          <>
            <Sun className='h-4 w-4' />
            Light
          </>
        ) : (
          <>
            <Moon className='h-4 w-4' />
            Dark
          </>
        )}
      </button>
      <div
        className='w-full max-w-100 rounded-2xl border border-stone-200/60 bg-white p-8
       shadow-sm transition-all dark:border-stone-800 dark:bg-stone-900 sm:p-10'
      >
        <div className='mb-10 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100'>
            Welcome back
          </h1>
          <p className='mt-2 text-sm text-stone-500 dark:text-stone-400'>
            Enter your credentials to access your account.
          </p>
        </div>

        <form className='space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div className='space-y-1.5'>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-stone-700 dark:text-stone-300'
              >
                Email
              </label>
              <div
                className='group relative flex items-center overflow-hidden rounded-xl border border-stone-200 bg-stone-50/50
               transition-all focus-within:border-stone-400 focus-within:bg-white focus-within:ring-[3px]
                focus-within:ring-stone-400/20 hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700
                 dark:bg-stone-800/60 dark:focus-within:border-stone-500 dark:focus-within:bg-stone-800
                  dark:focus-within:ring-stone-600/20 dark:hover:border-stone-600 dark:hover:bg-stone-800'
              >
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4'>
                  <Mail
                    className='h-5 w-5 text-stone-400 transition-colors group-focus-within:text-stone-700
                   dark:text-stone-500 dark:group-focus-within:text-stone-200'
                  />
                </div>
                <input
                  id='email'
                  type='email'
                  name='email'
                  placeholder='name@example.com'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full bg-transparent py-3 pl-11 pr-4 text-[15px] font-medium text-stone-900 outline-none
                   placeholder:font-normal placeholder:text-stone-400 dark:text-stone-100 dark:placeholder:text-stone-500'
                  required
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-stone-700 dark:text-stone-300'
              >
                Password
              </label>
              <div
                className='group relative flex items-center overflow-hidden rounded-xl border border-stone-200 bg-stone-50/50
               transition-all focus-within:border-stone-400 focus-within:bg-white focus-within:ring-[3px]
                focus-within:ring-stone-400/20 hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700
                 dark:bg-stone-800/60 dark:focus-within:border-stone-500 dark:focus-within:bg-stone-800
                  dark:focus-within:ring-stone-600/20 dark:hover:border-stone-600 dark:hover:bg-stone-800'
              >
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4'>
                  <Lock
                    className='h-5 w-5 text-stone-400 transition-colors group-focus-within:text-stone-700
                   dark:text-stone-500 dark:group-focus-within:text-stone-200'
                  />
                </div>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='*********'
                  value={formData.password}
                  onChange={handleChange}
                  className='w-full bg-transparent py-3 pl-11 pr-12 text-[15px] font-medium text-stone-900 outline-none
                   placeholder:font-normal placeholder:text-stone-400 dark:text-stone-100 dark:placeholder:text-stone-500'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(prev => !prev)}
                  className='absolute inset-y-0 right-0 flex items-center justify-center p-3 text-stone-400 transition-colors
                   hover:text-stone-700 focus:outline-none dark:text-stone-500 dark:hover:text-stone-200'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type='submit'
            className='w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all
             hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 active:scale-[0.98]
              dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 dark:focus:ring-stone-200
               dark:focus:ring-offset-stone-900'
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  )
}

export default Login
