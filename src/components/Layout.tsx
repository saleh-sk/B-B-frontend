import { useAppSelector } from '../store/hooks'
import { Navigate, Outlet } from 'react-router'
import Navbar from './Navbar'

const Layout = () => {
  const user = useAppSelector(state => state.auth.user)

  if (!user) {
    return <Navigate to='/login' />
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
