import type { SidebarItem } from '../components/Sidebar'
import {
  Users,
  Tags,
  Package,
  BadgeDollarSign,
  LayoutDashboard,
  FileText,
} from 'lucide-react'

export const logisticsSidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    url: '/logistics',
    type: 'link',
    icon: LayoutDashboard,
  },
  {
    label: 'Users',
    type: 'submenu',
    icon: Users,
    children: [
      {
        label: 'Manage Users',
        url: '/logistics/users',
        type: 'link',
      },
      {
        label: 'Add User',
        url: '/logistics/users/add',
        type: 'link',
      },
    ],
  },
  {
    label: 'Categories',
    type: 'submenu',
    icon: Tags,
    children: [
      {
        label: 'Manage Categories',
        url: '/logistics/categories',
        type: 'link',
      },
      {
        label: 'Add Category',
        url: '/logistics/categories/add',
        type: 'link',
      },
    ],
  },
]

export const warehouseSidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    url: '/warehouse',
    type: 'link',
    icon: LayoutDashboard,
  },
  {
    label: 'Products',
    type: 'submenu',
    icon: Package,
    children: [
      {
        label: 'Manage Products',
        url: '/warehouse/products',
        type: 'link',
      },
      {
        label: 'Add Product',
        url: '/warehouse/products/add',
        type: 'link',
      },
    ],
  },
  {
    label: 'Pending Pricing',
    url: '/warehouse/pending-pricing',
    type: 'link',
    icon: BadgeDollarSign,
  },
]

export const financeSidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    url: '/finance',
    type: 'link',
    icon: LayoutDashboard,
  },
  {
    label: 'P&L Reports',
    url: '/finance/pl-reports',
    type: 'link',
    icon: FileText,
  },
]
