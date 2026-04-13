import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface User {
  email: string
}

interface AuthState {
  user: User | null
}

const initialState: AuthState = { user: null }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.user = { email: action.payload }
    },
    logout: state => {
      state.user = null
    },
  },
})

export const { setUserEmail, logout } = authSlice.actions
export default authSlice.reducer
