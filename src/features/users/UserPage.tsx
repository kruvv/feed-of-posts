import { useAppSelector } from '@/app/hooks'
import { Link, useParams } from 'react-router-dom'
import { selectUserById } from './usersSlice'
import { TypedUseQueryStateResult } from '@reduxjs/toolkit/query/react'
import { createSelector } from '@reduxjs/toolkit'
import { useGetPostQuery, Post } from '@/features/api/apiSlice'

type GetPostSelectFromResultArg = TypedUseQueryStateResult<Post[], any, any>

const selectPostsForUser = createSelector(
  (res: GetPostSelectFromResultArg) => res.data,
  (res: GetPostSelectFromResultArg, userId: string) => userId,
  (data, userId) => data?.filter((post) => post.id === userId),
)

export const UserPage = () => {
  const { userId } = useParams()
  const user = useAppSelector((state) => selectUserById(state, userId!))

  const { postsForUser } = useGetPostQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      postsForUser: selectPostsForUser(result, userId!),
    }),
  })

  if (!user) {
    return (
      <section>
        <h2>User not found!</h2>
      </section>
    )
  }

  const postTitles = postsForUser?.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/post.id`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>
      <ul>{postTitles}</ul>
    </section>
  )
}
