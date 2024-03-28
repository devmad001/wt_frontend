import { Navigate, Route, Routes } from 'react-router'
import PublicRoute from './PublicRoute'
import {
  CaseDashboard,
  CreateAccountSuccess,
  DataCategory,
  ErrorPage,
  FinAware,
  LandingPage,
  Message,
  SampleCode,
  Settings,
  SignIn,
  SignInSmsVerification,
  SignUp,
  Subpoena,
  SubpoenaDetails,
  TechOwnerDashboard,
  UserCase,
  UserManagement,
  VerifyNewAccount
} from 'pages'
import { ConsoleLayout, GuestLayout } from 'ui-organisms'
import NonAuthRoute from './NonAuthRoute'
import AuthRoute from './AuthRoute'
import PermissionRoute from './PermissionRoute'
import AuthHelper from 'constant/AuthHelper'

const roleGroup1 = [AuthHelper.RoleType.TECH_OWNER, AuthHelper.RoleType.SUPER_ADMIN, AuthHelper.RoleType.ADMIN]
const roleGroup2 = [AuthHelper.RoleType.USER]

const RouterRoute = () => {
  return (
    <Routes>
      <Route path='/' element={<PublicRoute />}>
        <Route
          index
          Component={() => {
            return <Navigate to={'/home'} />
          }}
        />
        <Route path={'/home'} element={<LandingPage />} />
      </Route>
      <Route path='/' element={<NonAuthRoute />}>
        <Route element={<GuestLayout />}>
          <Route path={'/sign-in'} element={<SignIn />} />
          <Route path={'/sign-in/sms-verification'} element={<SignInSmsVerification />} />
          <Route path={'/sign-up'} element={<SignUp />} />
          <Route path={'/create-account-successfully'} element={<CreateAccountSuccess />} />
          <Route path={'/verify-new-account'} element={<VerifyNewAccount />} />
        </Route>
      </Route>
      <Route path='/' element={<AuthRoute />}>
        <Route element={<ConsoleLayout path='TRACKERTOOL' />}>
          <Route
            index
            Component={() => {
              return <Navigate to={'/subpoena'} />
            }}
          />
          <Route path='/dashboard' element={<TechOwnerDashboard />} />
          <Route
            path='/fin-aware'
            element={
              <PermissionRoute
                membership={AuthHelper.MembershipType.FINAWARE}
                roles={[AuthHelper.RoleType.TECH_OWNER]}
              />
            }
          >
            <Route
              index
              Component={() => {
                return <Navigate to={'/fin-aware/dashboard'} />
              }}
            />
            <Route path='/fin-aware/dashboard' element={<CaseDashboard />} />
            <Route path='/fin-aware/user-case' element={<UserCase />} />
          </Route>
          <Route
            path='/subpoena'
            element={
              <PermissionRoute
                membership={AuthHelper.MembershipType.TRACKER}
                roles={[AuthHelper.RoleType.TECH_OWNER]}
              />
            }
          >
            <Route index element={<Subpoena />} />
            <Route path='/subpoena/:id' element={<SubpoenaDetails />} />
          </Route>
          <Route path='/user-management' element={<PermissionRoute roles={roleGroup1} />}>
            <Route index element={<UserManagement />} />
          </Route>
          <Route path='/data-category' element={<PermissionRoute roles={roleGroup1} />}>
            <Route index element={<DataCategory />} />
          </Route>
          <Route path='/message' element={<Message />} />
          <Route path='/settings' element={<Settings />} />
        </Route>
      </Route>
      <Route path='*' element={<ErrorPage type='404' />} />
    </Routes>
  )
}

export default RouterRoute
