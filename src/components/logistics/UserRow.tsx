import { Link } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import type { User, UserRole } from '../../types/user.types'

type Props = {
  user: User
  onRequestDelete: (user: User) => void
}

const roleLabel: Record<UserRole, string> = {
  admin: 'Admin',
  warehouse_employee: 'Warehouse Employee',
  finance_employee: 'Finance Employee',
  boutique_employee: 'Boutique Employee',
}

const UserRow = ({ user, onRequestDelete }: Props) => {
  return (
    <tr
      className='group border-b border-stone-200/80 text-sm text-stone-700 transition-all
     hover:bg-stone-50/85 dark:border-stone-800/80 dark:text-stone-300 dark:hover:bg-stone-800/40'
    >
      <td className='px-4 py-3'>{user.fullName}</td>
      <td className='px-4 py-3 font-medium text-stone-700 dark:text-stone-300'>
        @{user.username}
      </td>
      <td className='px-4 py-3'>
        <span
          className='inline-flex rounded-full border border-stone-300 bg-stone-100 px-2.5 py-1 text-xs
         font-medium text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300'
        >
          {roleLabel[user.role] ?? user.role}
        </span>
      </td>
      <td className='px-4 py-3'>{user.email}</td>
      <td className='max-w-60 px-4 py-3'>
        <p className='truncate' title={user.address}>
          {user.address}
        </p>
      </td>
      <td className='px-4 py-3'>{user.phoneNumber}</td>
      <td className='px-4 py-3'>
        <div
          className='flex justify-end gap-2 opacity-0 transition-opacity
         duration-200 group-hover:opacity-100 group-focus-within:opacity-100'
        >
          <Link
            to={`/logistics/users/edit/${user.id}`}
            className='inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-600
             shadow-sm transition-all hover:-translate-y-0.5 hover:border-stone-400 hover:text-stone-900 dark:border-stone-700
              dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-600 dark:hover:text-stone-100'
            aria-label={`Edit ${user.fullName}`}
            title='Edit user'
          >
            <Pencil className='h-4 w-4' />
          </Link>
          <button
            type='button'
            onClick={() => onRequestDelete(user)}
            className='inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600
             shadow-sm transition-all hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-100 dark:border-red-900/70
              dark:bg-red-950/40 dark:text-red-400 dark:hover:border-red-800 dark:hover:bg-red-900/50'
            aria-label={`Delete ${user.fullName}`}
            title='Delete user'
          >
            <Trash2 className='h-4 w-4' />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default UserRow
