import { Routes, Route } from 'react-router'
import { Toaster } from 'sonner'
import { Suspense, useEffect } from 'react'
import Login from './pages/Login'
import { useAppSelector } from './store/hooks'
import Layout from './components/Layout'
import Home from './pages/Home'
import LogisticsDashboard from './pages/logistics/LogisticsDashboard'
import PageLayout from './components/PageLayout'
import AddUser from './pages/logistics/users/AddUser'
import EditUser from './pages/logistics/users/EditUser'
import Users from './pages/logistics/users/Users'
import Categories from './pages/logistics/categories/Categories'
import EditCategory from './pages/logistics/categories/EditCategory'
import AddCategory from './pages/logistics/categories/AddCategory'
import WarehouseDashboard from './pages/warehouse/WarehouseDashboard'
import Products from './pages/warehouse/products/Products'
import AddProduct from './pages/warehouse/products/AddProduct'
import PendingPricing from './pages/warehouse/PendingPricing'
import {
  financeSidebarItems,
  logisticsSidebarItems,
  warehouseSidebarItems,
} from './constants'
import PLReports from './pages/finance/PLReports'
import FinanceDashboard from './pages/finance/FinanceDashboard'

const SectionPage = ({ title }: { title: string }) => {
  return (
    <section className='flex min-h-[calc(100vh-4.5rem)] items-center justify-center bg-stone-100 px-4 text-stone-900 dark:bg-stone-950 dark:text-stone-100'>
      <div className='rounded-2xl border border-stone-200 bg-white px-8 py-10 text-center shadow-sm dark:border-stone-800 dark:bg-stone-900'>
        <h2 className='text-2xl font-semibold'>{title}</h2>
        <p className='mt-2 text-sm text-stone-500 dark:text-stone-400'>
          This module is ready for your next implementation step.
        </p>
      </div>
    </section>
  )
}

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
            path='logistics'
            element={<PageLayout sidebarItems={logisticsSidebarItems} />}
          >
            <Route index element={<LogisticsDashboard />} />
            <Route path='users'>
              <Route index element={<Users />} />
              <Route path='add' element={<AddUser />} />
              <Route path='edit/:id' element={<EditUser />} />
            </Route>

            <Route path='categories'>
              <Route index element={<Categories />} />
              <Route path='add' element={<AddCategory />} />
              <Route path='edit/:id' element={<EditCategory />} />
            </Route>
          </Route>

          <Route
            path='warehouse'
            element={<PageLayout sidebarItems={warehouseSidebarItems} />}
          >
            <Route index element={<WarehouseDashboard />} />
            <Route path='products'>
              <Route index element={<Products />} />
              <Route path='add' element={<AddProduct />} />
            </Route>
            <Route path='pending-pricing' element={<PendingPricing />} />
          </Route>

          <Route
            path='finance'
            element={<PageLayout sidebarItems={financeSidebarItems} />}
          >
            <Route index element={<FinanceDashboard />} />
            <Route path='pl-reports' element={<PLReports />} />
          </Route>

          <Route index element={<Home />} />
          <Route path='boutique' element={<SectionPage title='Boutique' />} />
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
    </Suspense>
  )
}

export default App
