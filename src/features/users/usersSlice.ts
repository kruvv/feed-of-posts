import { RootState } from '@/app/store'
import { createEntityAdapter, createSelector, createSlice, EntityState } from '@reduxjs/toolkit'
import { selectCurrentUsername } from '../auth/authSlice'
import { createAppAsyncThunk } from '@/app/withTypes'
import { client } from '@/api/client'
import { apiSlice } from '../api/apiSlice'

export interface User {
  id: string
  name: string
}

const usersAdapter = createEntityAdapter<User>()

// export const fetchUsers = createAppAsyncThunk('users/fetchUsers', async () => {
//   const response = await client.get<User[]>('/fakeApi/users')
//   return response.data
// })

const initialState = usersAdapter.getInitialState()

export const apiSliceWithUsers = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<User, string>, void>({
      query: () => '/users',
      transformResponse(res: User[]) {
        return usersAdapter.setAll(initialState, res)
      },
    }),
  }),
})

export const { useGetUsersQuery } = apiSliceWithUsers

// const usersSlice = createSlice({
//   name: 'users',
//   initialState,
//   reducers: {},
//   extraReducers(builder) {
//     builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
//   },
// })

// export default usersSlice.reducer

// export const { selectAll: selectAllUsers, selectById: selectUserById } = usersAdapter.getSelectors(
//   (state: RootState) => state.users,
// )

// Получаем текущий объект из хранилища для чтения и отображения
// export const selectCurrentUser = (state: RootState) => {
//   const currentUsername = selectCurrentUsername(state)
//   if (!currentUsername) return
//   return selectUserById(state, currentUsername)
// }

const emptyUsers: User[] = []

export const selectUsersResult = apiSliceWithUsers.endpoints.getUsers.select()

const selectUsersData = createSelector(selectUsersResult, (result) => result.data ?? initialState)

export const selectAllUsers = createSelector(selectUsersResult, (usersResult) => usersResult?.data ?? emptyUsers)

export const selectUserById = createSelector(
  selectAllUsers,
  (state: RootState, userId: string) => userId,
  (users, userId) => users.find((user) => user.id === userId),
)

export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUsername(state)
  if (currentUsername) {
    return selectUserById
  }
}

export const { selectAll: selectAllUsers, selectById: selectUserById } = usersAdapter.getSelectors(selectUsersData)
