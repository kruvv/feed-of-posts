import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Post, NewPost, PostUpdate } from '@/features/posts/postsSlice'
import { User } from '../users/usersSlice'
export type { Post }

const TAG_FOR_POST = 'Post'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  tagTypes: [TAG_FOR_POST],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => '/posts',
      providesTags: (result = [], error, arg) => [
        TAG_FOR_POST,
        ...result.map(({ id }) => ({ type: TAG_FOR_POST, id }) as const),
      ],
    }),
    getPost: builder.query<Post, string>({
      query: (postId) => `/posts/${postId}`,
      providesTags: (result, error, arg) => [{ type: TAG_FOR_POST, id: arg }],
    }),
    addNewPost: builder.mutation<Post, NewPost>({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: initialPost,
      }),
      invalidatesTags: [TAG_FOR_POST],
    }),
    editPost: builder.mutation<Post, PostUpdate>({
      query: (post) => ({
        url: `posts/${post.id}`,
        method: 'PATCH',
        body: post,
      }),
      invalidatesTags: (result, error, arg) => [{ type: TAG_FOR_POST, id: arg.id }],
    }),
    getUsers: builder.query<User[], void>({
      query: () => '/users',
    }),
  }),
})

export const { useGetPostsQuery, useGetPostQuery, useAddNewPostMutation, useEditPostMutation, useGetUsersQuery } =
  apiSlice
