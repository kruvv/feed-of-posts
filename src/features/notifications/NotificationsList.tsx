import { useAppSelector } from '@/app/hooks'
import { allNotificationsRead, selectMetadataEntities, useGetNotificationsQuery } from './notificationsSlice'
import { PostAuthor } from '../posts/PostAuthor'
import { TimeAgo } from '@/components/TimeAgo'
import { useDispatch } from 'react-redux'
import { useLayoutEffect } from 'react'
import classNames from 'classnames'

export const NotificationsList = () => {
  const dispatch = useDispatch()
  const { data: notifications = [] } = useGetNotificationsQuery()
  const notificationsMetadata = useAppSelector(selectMetadataEntities)

  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  })

  const renderedNotifications = notifications.map((notification) => {
    const metadata = notificationsMetadata[notification.id]
    const notificationClassname = classNames('notification', {
      new: metadata.isNew,
    })

    return (
      <div
        key={notification.id}
        className={notificationClassname}
      >
        <div>
          <b>
            <PostAuthor
              userId={notification.user}
              showPrefix={false}
            />
          </b>{' '}
          {notification.message}
        </div>
        <TimeAgo timestamp={notification.date}></TimeAgo>
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
