import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Post, NewPost, PostUpdate, ReactionName } from '@/features/posts/postsSlice'
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
    addReaction: builder.mutation<Post, { postId: string; reaction: ReactionName }>({
      query: ({ postId, reaction }) => ({
        url: `/posts/${postId}/reaction`,
        method: 'POST',
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reaction },
      }),
      async onQueryStarted({ postId, reaction }, lifecycleAppi) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const getPostsPatchResult = lifecycleAppi.dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
            const post = draft.find((post) => post.id === postId)
            if (post) {
              post.reactions[reaction]++
            }
          }),
        )

        // We also have another copy of the same data in the `getPost` cache
        // entry for this post ID, so we need to update that as well
        const getPostPatchResult = lifecycleAppi.dispatch(
          apiSlice.util.updateQueryData('getPost', postId, (draft) => {
            draft.reactions[reaction]++
          }),
        )
        try {
          await lifecycleAppi.queryFulfilled
        } catch (error) {
          getPostsPatchResult.undo()
          getPostPatchResult.undo()
        }
      },
    }),
  }),
})

export const { useAddReactionMutation, useGetPostsQuery, useGetPostQuery, useAddNewPostMutation, useEditPostMutation } =
  apiSlice
