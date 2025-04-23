import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import { Navbar } from '@/components/Navbar'
import { PostMainPage } from '@/features/posts/PostMainPage'
import { SinglePostPage } from '@/features/posts/SinglePostPage'
import { EditPostForm } from '@/features/posts/EditPostForm'
import { LoginPage } from '@/features/auth/LoginPage'
import { useAppSelector } from '@/app/hooks'
import { selectCurrentUsername } from '@/features/auth/authSlice'
import { UsersList } from './features/users/UsersList'
import { UserPage } from './features/users/UserPage'
import { NotificationsList } from './features/notifications/NotificationsList'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const username = useAppSelector(selectCurrentUsername)

  return !username ? (
    <Navigate
      to="/"
      replace
    />
  ) : (
    children
  )
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<LoginPage />}
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route
                    path="/posts"
                    element={<PostMainPage />}
                  />
                  <Route
                    path="/posts/:postId"
                    element={<SinglePostPage />}
                  />
                  <Route
                    path="/editPost/:postId"
                    element={<EditPostForm />}
                  />
                  <Route
                    path="/users"
                    element={<UsersList />}
                  />
                  <Route
                    path="/users/:userId"
                    element={<UserPage />}
                  />
                  <Route
                    path="/notifications"
                    element={<NotificationsList />}
                  />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
