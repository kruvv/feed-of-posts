import { RootState } from '@/app/store'
import { createSlice } from '@reduxjs/toolkit'
import { selectCurrentUsername } from '../auth/authSlice'

interface User {
  id: string
  name: string
}

const initialState: User[] = [
  { id: '0', name: 'Сергей Иванов' },
  { id: '1', name: 'Ирина Котова' },
  { id: '2', name: 'Алексей Долгов' },
]

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
})

export default usersSlice.reducer

export const selectAllUsers = (state: RootState) => state.users

// Получает пользователя по его id
export const selectUserById = (state: RootState, userId: string | null) =>
  state.users.find((user) => user.id === userId)

// Получаем текущий объект из хранилища для чтения и отображения
export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUsername(state)
  return selectUserById(state, currentUsername)
}
