import { RootState } from '@/app/store'
import { createEntityAdapter, createSelector, createSlice, EntityState } from '@reduxjs/toolkit'
import { selectCurrentUsername } from '../auth/authSlice'
import { apiSlice } from '../api/apiSlice'

export interface User {
  id: string
  name: string
}

const usersAdapter = createEntityAdapter<User>()
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

export const selectUsersResult = apiSliceWithUsers.endpoints.getUsers.select()

const selectUsersData = createSelector(selectUsersResult, (result) => result.data ?? initialState)

export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUsername(state)
  if (!currentUsername) {
    return
  }
  return selectUserById(state, currentUsername)
}

export const { selectAll: selectAllUsers, selectById: selectUserById } = usersAdapter.getSelectors(selectUsersData)
