import type { SidebarItem } from '../components/Sidebar'
import { Users, Tags } from 'lucide-react'

export const logisticsSidebarItems: SidebarItem[] = [
  {
    label: 'Users',
    type: 'submenu',
    url: '/logistics/users',
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
    url: '/logistics/categories',
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
