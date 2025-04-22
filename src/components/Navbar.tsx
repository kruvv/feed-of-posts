import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import { selectCurrentUser } from '@/features/users/usersSlice'
import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)

  const isLoggedIn = !!user

  let navContent: React.ReactNode = null

  const onLogoutClicked = () => {
    if (isLoggedIn) {
      dispatch(logout())
    }
  }

  navContent = (
    <div className="navContent">
      <div className="navLinks">
        <Link to="/posts">Posts</Link>
        <Link to="/users">Users</Link>
      </div>
      <div className="userDetails">
        {/* <UserIcon size={32} /> */}
        {user?.name}
        {isLoggedIn && (
          <button
            className="button small"
            onClick={onLogoutClicked}
          >
            Log Out
          </button>
        )}
      </div>
    </div>
  )

  return (
    <nav>
      <section>
        <h1>Feed of posts</h1>
        {navContent}
      </section>
    </nav>
  )
}
