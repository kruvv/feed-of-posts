import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import { fetchNotifications, selectUnreadNotificationCount } from '@/features/notifications/notificationsSlice'
import { selectCurrentUser } from '@/features/users/usersSlice'
import React from 'react'
import { Link } from 'react-router-dom'
import { UserIcon } from './UserIcon'

export const Navbar = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)

  const numUnreadNotifications = useAppSelector(selectUnreadNotificationCount)

  const isLoggedIn = !!user

  let navContent: React.ReactNode = null

  const onLogoutClicked = () => {
    if (isLoggedIn) {
      dispatch(logout())
    }
  }

  const fetchNewNotifications = () => {
    dispatch(fetchNotifications())
  }

  let unreadNotificationsBadge: React.ReactNode | undefined

  if (numUnreadNotifications > 0) {
    unreadNotificationsBadge = <span className="badge">{numUnreadNotifications}</span>
  }

  navContent = (
    <div className="navContent">
      <div className="navLinks">
        <Link to="/posts">Posts</Link>
        <Link to="/users">Users</Link>
        <Link to="/notifications">Notifications {unreadNotificationsBadge}</Link>
        <button
          className="button small"
          onClick={fetchNewNotifications}
        >
          Refresh Notifications
        </button>
      </div>
      <div className="userDetails">
        <UserIcon size={32} />
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
