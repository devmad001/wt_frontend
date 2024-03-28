import { useAuth } from 'hooks'
import { ErrorPage } from 'pages'
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router'
import { getUserScopeInfo } from 'utils'

function PermissionRoute(props: any) {
  const [memberships, setMemberships] = useState<string[]>([])
  const [role, setRole] = useState<any>('')

  useEffect(() => {
    const userScope: Auth.ScopeInfo = getUserScopeInfo()

    setRole(userScope?.role || '')
    setMemberships(userScope?.memberships || [])
  }, [])

  const isAllowed = (): boolean | null => {
    return memberships?.includes(props?.membership) || (props?.roles instanceof Array && props?.roles?.includes(role))
  }

  return isAllowed() === true ? <Outlet /> : isAllowed() === false ? <ErrorPage type='403' /> : ''
}

export default PermissionRoute
