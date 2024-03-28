import { useAuth } from 'hooks'
import { Navigate, Outlet } from 'react-router'

function AuthRoute(props: any) {
  const auth = useAuth()
  const logged = auth.isLoggedIn()

  return logged ? <Outlet /> : <Navigate to={'/sign-in'} />
}

export default AuthRoute
