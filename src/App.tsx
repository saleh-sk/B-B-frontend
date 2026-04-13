import { Routes, Route } from 'react-router'
import { Toaster } from 'sonner'
import { Suspense, useEffect } from 'react'
import Login from './pages/Login'
import { useAppSelector } from './store/hooks'
import Layout from './components/Layout'

function App() {
  const mode = useAppSelector(state => state.theme.mode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
  }, [mode])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Toaster position='top-right' closeButton />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route
            index
            element={
              <main className='flex min-h-[calc(100vh-4.5rem)] items-center justify-center bg-stone-100 px-4 text-stone-900 dark:bg-stone-950 dark:text-stone-100'>
                <h1 className='text-3xl font-semibold'>Hello World</h1>
              </main>
            }
          />
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
    </Suspense>
  )
}

export default App
