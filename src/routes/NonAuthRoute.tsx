import { useAuth } from 'hooks'
import { Navigate, Outlet } from 'react-router'

function NonAuthRoute(props: any) {
  const auth = useAuth()
  const logged = auth.isLoggedIn()

  return !logged ? <Outlet /> : <Navigate to={'/subpoena'} />
}

export default NonAuthRoute
