import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEditPostMutation, useGetPostQuery } from '../api/apiSlice'
import { Spinner } from '@/components/Spinner'

interface EditPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
}
interface EditPostFormElements extends HTMLFormElement {
  readonly elements: EditPostFormFields
}

export const EditPostForm = () => {
  const { postId } = useParams()

  const { data: post } = useGetPostQuery(postId!)

  const [updatePost, { isLoading }] = useEditPostMutation()

  const navigate = useNavigate()

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const onSavePostClicked = async (e: React.FormEvent<EditPostFormElements>) => {
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value

    if (title && content) {
      await updatePost({ id: post.id, title, content })
      navigate(`/posts/${postId}`)
    }
  }

  const spinner = isLoading ? <Spinner text="Saving..." /> : null

  return (
    <section>
      <h2>Edit Post</h2>
      <form onSubmit={onSavePostClicked}>
        <label htmlFor="postTitle">Post title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          defaultValue={post?.title}
          required
          disabled={isLoading}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          name="postContent"
          id="postContent"
          defaultValue={post?.content}
          required
          disabled={isLoading}
        ></textarea>
        <button disabled={isLoading}>Save Post</button>
      </form>
      {spinner}
    </section>
  )
}
