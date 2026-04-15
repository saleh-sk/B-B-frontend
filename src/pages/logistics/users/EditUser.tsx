import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { toast } from 'sonner'
import UserForm, {
  type FormValues,
} from '../../../components/logistics/UserForm'
import usersData from '../../../json/users.json'
import type { User } from '../../../types/user.types'

const EditUser = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

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

  const userId = Number(id)

  const selectedUser = useMemo(
    () => users.find(user => user.id === userId),
    [users, userId],
  )

  const initialValues = useMemo<FormValues | undefined>(() => {
    if (!selectedUser) {
      return undefined
    }

    return {
      fullName: selectedUser.fullName,
      username: selectedUser.username,
      role: selectedUser.role,
      email: selectedUser.email,
      password: selectedUser.password,
      address: selectedUser.address,
      phoneNumber: selectedUser.phoneNumber,
    }
  }, [selectedUser])

  useEffect(() => {
    if (!id || Number.isNaN(userId)) {
      toast.error('Invalid user id.')
      navigate('..', { relative: 'path' })
      return
    }

    if (!selectedUser) {
      toast.error('User not found.')
      navigate('..', { relative: 'path' })
    }
  }, [id, navigate, selectedUser, userId])

  const handleSubmit = (formValues: FormValues) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          fullName: formValues.fullName,
          username: formValues.username,
          role: formValues.role,
          email: formValues.email,
          password: formValues.password,
          address: formValues.address,
          phoneNumber: formValues.phoneNumber,
        }
      }
      return u
    })

    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    toast.success(`User #${userId} updated successfully.`)
    navigate('..', { relative: 'path' })
  }

  if (!initialValues) {
    return null
  }

  return (
    <UserForm
      key={userId}
      mode='edit'
      userId={userId}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  )
}

export default EditUser
