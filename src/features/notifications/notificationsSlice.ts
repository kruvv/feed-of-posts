import { client } from '@/api/client'
import { RootState } from '@/app/store'
import { createAppAsyncThunk } from '@/app/withTypes'
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { apiSlice } from '../api/apiSlice'

export interface ServerNotification {
  id: string
  date: string
  message: string
  user: string
}

export interface NotificationMetadata {
  id: string
  read: boolean
  isNew: boolean
}

const metadataAdapter = createEntityAdapter<NotificationMetadata>()

export const fetchNotifications = createAppAsyncThunk('notifications/fetchNotifications', async (_unused, thunkApi) => {
  const response = await client.get<ServerNotification[]>(`/fakeApi/notifications`)
  return response.data
})

const initialState = metadataAdapter.getInitialState()

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state) {
      Object.values(state.entities).forEach((metadata) => (metadata.read = true))
    },
  },
  extraReducers(builder) {
    builder.addMatcher(apiSliceWithNotifications.endpoints.getNotifications.matchFulfilled, (state, action) => {
      const notificationsMetadata: NotificationMetadata[] = action.payload.map((notification) => ({
        id: notification.id,
        read: false,
        isNew: true,
      }))

      Object.values(state.entities).forEach((metadata) => (metadata.isNew = !metadata.read))
      metadataAdapter.upsertMany(state, notificationsMetadata)
    })
  },
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const { selectAll: selectAllNotificationsMetadata, selectEntities: selectMetadataEntities } =
  metadataAdapter.getSelectors((state: RootState) => state.notifications)

export const selectUnreadNotificationCount = (state: RootState) => {
  const allMetadata = selectAllNotificationsMetadata(state)
  const unreadNotifications = allMetadata.filter((metadata) => !metadata.read)
  return unreadNotifications.length
}

export const apiSliceWithNotifications = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<ServerNotification[], void>({
      query: () => '/notifications',
    }),
  }),
})

export const { useGetNotificationsQuery } = apiSliceWithNotifications
