import type { SidebarItem } from '../components/Sidebar'
import { Users, Tags, Package, BadgeDollarSign } from 'lucide-react'

export const logisticsSidebarItems: SidebarItem[] = [
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
