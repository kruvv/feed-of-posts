import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchPosts, Post, selectAllPosts, selectPostsError, selectPostsStatus } from './postsSlice'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from '@/components/TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { useEffect } from 'react'
import { Spinner } from '@/components/Spinner'

interface PostExcerptProps {
  post: Post
}

function PostExcerpt({ post }: PostExcerptProps) {
  return (
    <article
      className="post-excerpt"
      key={post.id}
    >
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <div className="post-content">{post.content.substring(0, 100)}</div>
      <ReactionButtons post={post} />
    </article>
  )
}

export const PostsList = () => {
  const dispatch = useAppDispatch()
  const posts = useAppSelector(selectAllPosts)
  const postStatus = useAppSelector(selectPostsStatus)
  const postsError = useAppSelector(selectPostsError)
  const orderPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  let content: React.ReactNode

  if (postStatus === 'pending') {
    content = <Spinner text="Loading..." />
  } else if (postStatus === 'succeeded') {
    const orderPosts = posts.slice().sort((a, b) => a.date.localeCompare(b.date))
    content = orderPosts.map((post) => (
      <PostExcerpt
        key={post.id}
        post={post}
      />
    ))
  } else if (postStatus === 'failed') {
    content = <div>{postsError}</div>
  }

  const renderedPosts = orderPosts.map((post) => (
    <article
      className="post-excerpt"
      key={post.id}
    >
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <PostAuthor userId={post.user} />
      <TimeAgo timestamp={post.date} />
      <ReactionButtons post={post} />
    </article>
  ))

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
