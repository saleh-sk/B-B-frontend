import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import UserForm, {
  type FormValues,
} from '../../../components/logistics/UserForm'
import usersData from '../../../json/users.json'
import type { User } from '../../../types/user.types'

const AddUser = () => {
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
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  const nextId = useMemo(() => {
    if (!users.length) {
      return 1
    }

    return Math.max(...users.map(user => user.id)) + 1
  }, [users])

  const handleCreateUser = (formValues: FormValues) => {
    const newUser: User = {
      id: nextId,
      fullName: formValues.fullName,
      username: formValues.username,
      role: formValues.role,
      email: formValues.email,
      password: formValues.password,
      address: formValues.address,
      phoneNumber: formValues.phoneNumber,
    }

    setUsers(prev => [...prev, newUser])
    toast.success(`User #${newUser.id} created successfully.`)
  }

  return <UserForm mode='create' onSubmit={handleCreateUser} />
}

export default AddUser
