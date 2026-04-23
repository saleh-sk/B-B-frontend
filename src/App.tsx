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
import BoutiqueDashboard from './pages/boutique/BoutiqueDashboard'
import Invoices from './pages/boutique/invoices/Invoices'
import AddInvoice from './pages/boutique/invoices/AddInvoice'
import {
  boutiqueSidebarItems,
  financeSidebarItems,
  logisticsSidebarItems,
  warehouseSidebarItems,
} from './constants'
import PLReports from './pages/finance/PLReports'
import FinanceDashboard from './pages/finance/FinanceDashboard'

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
          <Route index element={<Home />} />

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

          <Route
            path='boutique'
            element={<PageLayout sidebarItems={boutiqueSidebarItems} />}
          >
            <Route index element={<BoutiqueDashboard />} />
            <Route path='invoices'>
              <Route index element={<Invoices />} />
              <Route path='add' element={<AddInvoice />} />
            </Route>
          </Route>
        </Route>

        <Route path='/login' element={<Login />} />
      </Routes>
    </Suspense>
  )
}

export default App
