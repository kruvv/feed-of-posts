import React from 'react'
import { nanoid } from '@reduxjs/toolkit'
import { useAppDispatch } from '@/app/hooks'
import { type Post, postAdded } from './postsSlice'

interface AddPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
}

interface AddPostFormElements extends HTMLFormElement {
  readonly elements: AddPostFormFields
}

export const AddPostForm = () => {
  const dispatch = useAppDispatch()

  const handleSubmit = (e: React.FormEvent<AddPostFormElements>) => {
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value

    const newPost: Post = {
      id: nanoid(),
      title,
      content,
    }

    dispatch(postAdded(newPost))

    e.currentTarget.reset()
  }
  return (
    <section>
      <h2>Add new Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          defaultValue=""
          required
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          defaultValue=""
          required
        ></textarea>
        <button>Save Post</button>
      </form>
    </section>
  )
}
