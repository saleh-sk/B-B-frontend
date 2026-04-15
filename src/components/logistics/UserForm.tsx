import { useState } from 'react'
import type { ChangeEvent, SubmitEvent } from 'react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { toast } from 'sonner'
import {
  BadgeCheck,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserPlus,
  User as UserIcon,
} from 'lucide-react'
import type { UserRole } from '../../types/user.types'
import { Link } from 'react-router'

export type FormValues = {
  fullName: string
  username: string
  role: UserRole
  email: string
  password: string
  address: string
  phoneNumber: string
}

export type UserFormMode = 'create' | 'edit'

type Props = {
  mode: UserFormMode
  initialValues?: FormValues
  userId?: number | string
  onSubmit: (values: FormValues) => void
  onCancel?: () => void
}

const defaultUserFormValues: FormValues = {
  fullName: '',
  username: '',
  role: 'warehouse_employee',
  email: '',
  password: '',
  address: '',
  phoneNumber: '',
}

const roleLabel: Record<UserRole, string> = {
  admin: 'Admin',
  warehouse_employee: 'Warehouse Employee',
  finance_employee: 'Finance Employee',
  boutique_employee: 'Boutique Employee',
}

const fieldClassName =
  'w-full rounded-xl border border-stone-200 bg-white/70 appearance-none px-4 py-3.5 text-[15px] text-stone-900 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] backdrop-blur-md outline-none transition-all placeholder:text-stone-400 hover:border-stone-300 focus:border-stone-600 focus:bg-white focus:ring-4 focus:ring-stone-600/10 dark:border-stone-800/80 dark:bg-stone-900/50 dark:text-stone-100 dark:placeholder:text-stone-500 dark:hover:border-stone-700 dark:focus:border-stone-500 dark:focus:bg-stone-900 dark:focus:ring-stone-500/20'

const UserForm = ({ mode, initialValues, userId, onSubmit }: Props) => {
  const [formValues, setFormValues] = useState<FormValues>(
    initialValues ?? defaultUserFormValues,
  )

  const handleFieldChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target
    setFormValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault()

    if (!formValues.phoneNumber) {
      toast.error('Phone number is required.')
      return
    }

    onSubmit(formValues)

    if (mode === 'create') {
      setFormValues(defaultUserFormValues)
    }
  }

  return (
    <section
      className='relative overflow-hidden rounded-2xl bg-linear-to-br from-white via-stone-50
     to-stone-100 p-4 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900 sm:p-6 lg:p-8'
    >
      <div
        className='pointer-events-none absolute -top-16 -right-16 h-44 w-44
       rounded-full bg-stone-300/35 blur-3xl dark:bg-stone-700/30'
      />
      <div
        className='pointer-events-none absolute -bottom-20 -left-10 h-56 w-56
       rounded-full bg-stone-200/50 blur-3xl dark:bg-stone-800/40'
      />

      <div className='relative z-10 space-y-6'>
        <header className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400'>
              User Administration
            </p>
            <h1 className='mt-1 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100'>
              {mode === 'create'
                ? 'Create New User'
                : `Edit User (ID: ${userId ?? ''})`}
            </h1>
            <p className='mt-1 text-sm text-stone-600 dark:text-stone-400'>
              {mode === 'create'
                ? 'Fill all required details and submit to register a new account.'
                : "Modify details and save to update the user's account."}
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className='grid gap-5 lg:grid-cols-2'>
          <label className='space-y-1.5'>
            <span className='inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300'>
              <UserIcon className='h-4 w-4' />
              Full Name
            </span>
            <input
              name='fullName'
              value={formValues.fullName}
              onChange={handleFieldChange}
              placeholder='Enter full name'
              className={fieldClassName}
              required
            />
          </label>

          <label className='space-y-1.5'>
            <span className='inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300'>
              <BadgeCheck className='h-4 w-4' />
              Username
            </span>
            <input
              name='username'
              value={formValues.username}
              onChange={handleFieldChange}
              placeholder='Choose username'
              className={fieldClassName}
              required
            />
          </label>

          <label className='space-y-1.5'>
            <span className='inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300'>
              <ShieldCheck className='h-4 w-4' />
              Role
            </span>
            <select
              name='role'
              value={formValues.role}
              onChange={handleFieldChange}
              className={fieldClassName}
              required
            >
              {Object.entries(roleLabel).map(([role, label]) => (
                <option key={role} value={role}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className='space-y-1.5'>
            <span className='inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300'>
              <Mail className='h-4 w-4' />
              Email
            </span>
            <input
              type='email'
              name='email'
              value={formValues.email}
              onChange={handleFieldChange}
              placeholder='name@example.com'
              className={fieldClassName}
              required
            />
          </label>

          <label className='space-y-1.5'>
            <span className='inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300'>
              <KeyRound className='h-4 w-4' />
              Password
            </span>
            <input
              type='password'
              name='password'
              value={formValues.password}
              onChange={handleFieldChange}
              placeholder='*********'
              className={fieldClassName}
              required
            />
          </label>

          <label className='space-y-1.5'>
            <span className='inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300'>
              <Phone className='h-4 w-4' />
              Phone Number
            </span>
            <PhoneInput
              international
              defaultCountry='LB'
              value={formValues.phoneNumber}
              onChange={value =>
                setFormValues(prev => ({ ...prev, phoneNumber: value ?? '' }))
              }
              className='flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3.5 shadow-sm
               focus-within:border-stone-700 focus-within:ring-2 focus-within:ring-stone-700/20 dark:border-stone-700
                dark:bg-stone-900 dark:focus-within:border-stone-300 dark:focus-within:ring-stone-300/20'
              numberInputProps={{
                className:
                  'w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400 dark:text-stone-100 dark:placeholder:text-stone-500',
                required: true,
                placeholder: 'Enter phone number',
              }}
            />
          </label>

          <label className='space-y-1.5 lg:col-span-2'>
            <span className='inline-flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300'>
              <MapPin className='h-4 w-4' />
              Address
            </span>
            <textarea
              name='address'
              value={formValues.address}
              onChange={handleFieldChange}
              placeholder='Street, city, and additional location details'
              rows={3}
              className={fieldClassName}
              required
            />
          </label>

          <div className='lg:col-span-2 flex justify-start gap-4'>
            <button
              type='submit'
              className='inline-flex w-fit items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold
               text-white shadow-sm transition hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/30
                dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 dark:focus:ring-stone-100/40'
            >
              {mode === 'create' ? (
                <UserPlus className='h-4 w-4' />
              ) : (
                <Save className='h-4 w-4' />
              )}
              {mode === 'create' ? 'Create User' : 'Save Changes'}
            </button>

            <Link
              to='/logistics/users'
              className='inline-flex w-fit items-center gap-2 rounded-xl bg-stone-200 px-5 py-3 text-sm font-semibold
               text-stone-900 shadow-sm transition hover:bg-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300/30
                dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700 dark:focus:ring-stone-800/40'
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </section>
  )
}

export default UserForm
