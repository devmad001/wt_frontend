import { useAuth } from 'hooks'
import { Navigate, Outlet } from 'react-router'

function PublicRoute() {
  return <Outlet />
}

export default PublicRoute
