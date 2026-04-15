import { useMemo, useState } from 'react'
import {
  Search,
  SlidersHorizontal,
  TriangleAlert,
  Users2,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import usersData from '../../../json/users.json'
import type { User, UserRole } from '../../../types/user.types'
import UserRow from '../../../components/logistics/UserRow'

const roleLabel: Record<UserRole, string> = {
  admin: 'Admin',
  warehouse_employee: 'Warehouse Employee',
  finance_employee: 'Finance Employee',
  boutique_employee: 'Boutique Employee',
}

const Users = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('users')
    if (storedUsers) {
      try {
        return JSON.parse(storedUsers) as User[]
      } catch {
        return usersData as User[]
      }
    }

    return usersData as User[]
  })
  const [search, setSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState<'all' | UserRole>('all')
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return users.filter(user => {
      const matchesRole = selectedRole === 'all' || user.role === selectedRole

      const matchesSearch =
        normalizedSearch.length === 0 ||
        user.fullName.toLowerCase().includes(normalizedSearch) ||
        user.username.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.address.toLowerCase().includes(normalizedSearch) ||
        user.phoneNumber.toLowerCase().includes(normalizedSearch)

      return matchesRole && matchesSearch
    })
  }, [search, selectedRole, users])

  const handleDeleteUser = () => {
    if (!userToDelete) {
      return
    }

    const updatedUsers = users.filter(user => user.id !== userToDelete.id)
    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    toast.success(`${userToDelete.fullName} has been deleted.`)
    setUserToDelete(null)
  }

  return (
    <section className='relative overflow-hidden rounded-3xl border border-stone-200/80 bg-linear-to-br from-white via-stone-50 to-stone-100 p-4 shadow-sm dark:border-stone-800/80 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900 sm:p-6 lg:p-8'>
      <div className='pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-stone-300/30 blur-3xl dark:bg-stone-700/25' />
      <div className='pointer-events-none absolute -bottom-20 -left-24 h-72 w-72 rounded-full bg-stone-200/40 blur-3xl dark:bg-stone-800/35' />
      <div className='pointer-events-none absolute inset-x-0 top-0 h-18 bg-linear-to-b from-white/65 to-transparent dark:from-stone-900/50' />

      <div className='relative z-10 space-y-6'>
        <header className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400'>
              User Administration
            </p>
            <h1 className='mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 sm:text-3xl'>
              <span className='inline-flex h-8 w-8 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm dark:bg-stone-100 dark:text-stone-900'>
                <Users2 className='h-4.5 w-4.5' />
              </span>
              Users Directory
            </h1>
            <p className='mt-1 text-sm text-stone-600 dark:text-stone-400'>
              Browse, search, and manage users in a structured workspace.
            </p>
          </div>

          <div className='rounded-xl border border-stone-300 bg-white/90 px-4 py-2.5 text-sm shadow-sm dark:border-stone-700 dark:bg-stone-900/80'>
            <span className='text-stone-500 dark:text-stone-400'>
              Total Users:
            </span>{' '}
            <span className='font-semibold text-stone-900 dark:text-stone-100'>
              {filteredUsers.length}
            </span>
          </div>
        </header>

        <div className='grid gap-3 rounded-2xl border border-stone-200/80 bg-white/80 p-3 shadow-sm backdrop-blur dark:border-stone-800/80 dark:bg-stone-900/70 sm:grid-cols-2 sm:p-4'>
          <label className='relative'>
            <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400' />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder='Search by name, username, email, address, or phone'
              className='w-full rounded-xl border border-stone-300 bg-white px-10 py-2.5 text-sm text-stone-900 shadow-sm outline-none transition-all placeholder:text-stone-400 hover:border-stone-400 focus:border-stone-700 focus:ring-4 focus:ring-stone-700/10 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:hover:border-stone-600 dark:focus:border-stone-300 dark:focus:ring-stone-300/15'
            />
          </label>

          <label className='relative'>
            <SlidersHorizontal className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400' />
            <select
              value={selectedRole}
              onChange={event =>
                setSelectedRole(event.target.value as 'all' | UserRole)
              }
              className='w-full rounded-xl border border-stone-300 appearance-none bg-white px-10 py-2.5 text-sm text-stone-900 shadow-sm outline-none transition-all hover:border-stone-400 focus:border-stone-700 focus:ring-4 focus:ring-stone-700/10 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-stone-600 dark:focus:border-stone-300 dark:focus:ring-stone-300/15'
            >
              <option value='all'>All Roles</option>
              {Object.entries(roleLabel).map(([role, label]) => (
                <option key={role} value={role}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className='overflow-hidden rounded-2xl border border-stone-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-stone-800/80 dark:bg-stone-900/80'>
          <div className='overflow-x-auto'>
            <table className='min-w-262.5 w-full border-collapse'>
              <thead>
                <tr className='border-b border-stone-200 bg-stone-100/90 text-left text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:border-stone-800 dark:bg-stone-900/90 dark:text-stone-400'>
                  <th className='px-4 py-3'>Full Name</th>
                  <th className='px-4 py-3'>Username</th>
                  <th className='px-4 py-3'>Role</th>
                  <th className='px-4 py-3'>Email</th>
                  <th className='px-4 py-3'>Address</th>
                  <th className='px-4 py-3'>Phone Number</th>
                  <th className='px-4 py-3 text-right'>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className='px-4 py-10 text-center text-sm text-stone-500 dark:text-stone-400'
                    >
                      No users found for your current search/filter.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <UserRow
                      key={user.id}
                      user={user}
                      onRequestDelete={setUserToDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {userToDelete && (
        <div className='absolute inset-0 z-30 flex items-center justify-center bg-stone-950/55 p-4 backdrop-blur-xs'>
          <div className='w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-700 dark:bg-stone-900'>
            <div className='flex items-start justify-between gap-3'>
              <div className='flex items-start gap-3'>
                <div className='mt-0.5 rounded-lg bg-red-100 p-2 text-red-700 dark:bg-red-900/40 dark:text-red-300'>
                  <TriangleAlert className='h-5 w-5' />
                </div>
                <div>
                  <h2 className='text-lg font-semibold text-stone-900 dark:text-stone-100'>
                    Delete User
                  </h2>
                  <p className='mt-1 text-sm text-stone-600 dark:text-stone-400'>
                    Are you sure you want to delete {userToDelete.fullName}?
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type='button'
                onClick={() => setUserToDelete(null)}
                className='rounded-lg p-1.5 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100'
                aria-label='Close confirmation modal'
              >
                <X className='h-4 w-4' />
              </button>
            </div>

            <div className='mt-6 flex justify-end gap-2'>
              <button
                type='button'
                onClick={() => setUserToDelete(null)}
                className='rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleDeleteUser}
                className='rounded-xl border border-red-300 bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 dark:border-red-800 dark:bg-red-700 dark:hover:bg-red-600'
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Users
