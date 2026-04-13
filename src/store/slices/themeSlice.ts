import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const THEME_STORAGE_KEY = 'theme_mode'

export type ThemeMode = 'light' | 'dark'

interface ThemeState {
  mode: ThemeMode
}

const getInitialThemeState = (): ThemeState => {
  if (typeof window === 'undefined') {
    return { mode: 'light' }
  }

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return { mode: storedTheme }
  }

  return { mode: 'light' }
}

const initialState: ThemeState = getInitialThemeState()

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload

      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, action.payload)
      }
    },
    toggleTheme: state => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'

      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, state.mode)
      }
    },
  },
})

export const { setTheme, toggleTheme } = themeSlice.actions
export default themeSlice.reducer
