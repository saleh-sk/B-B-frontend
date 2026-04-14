export type UserRole =
  | 'admin'
  | 'warehouse_employee'
  | 'finance_employee'
  | 'boutique_employee'

export type User = {
  id: number
  fullName: string
  username: string
  role: UserRole
  email: string
  password: string
  address: string
  phoneNumber: string
}
