import { SignalContext } from 'providers'
import { useContext } from 'react'
import { useNavigate, NavigateOptions } from 'react-router'
import { get, noop } from 'lodash'
import { useAuthAPI } from 'api'
import {
  generateToken,
  getAccessToken,
  getUserScopeInfo,
  revokeUser,
  setAccessToken,
  setFinAwareSessionId,
  setRefreshToken,
  setUserInfo,
  setUserScopeInfo
} from 'utils'
import CacheKey from 'constant/CacheKey'
import AuthHelper from 'constant/AuthHelper'
import { createSearchParams } from 'react-router-dom'

export const useAuth = () => {
  const navigate = useNavigate()
  const authAPI = useAuthAPI()
  const { createUserSignalManager } = useContext(SignalContext)

  const getToken = () => {
    return getAccessToken()
  }

  const isLoggedIn = () => {
    return getToken() ? true : false
  }

  const logout = () => {
    revokeUser()
    navigate('/sign-in')
    window.location.reload()
  }

  const signInSuccess = (res: any) => {
    const user: User.Details = {
      _id: res?._id,
      fullName: res?.fullName,
      address: res?.address,
      phone: res?.phone,
      email: res?.email,
      role: res?.role,
      createdAt: res?.createdAt,
      updatedAt: res?.updatedAt,
      signalKeys: res?.signalKeys || null,
      agency: res?.agency || null
    }
    const userScope: any = {
      memberships: res?.agency?.memberships || [],
      role: res?.role
    }

    setAccessToken(res.access_token)
    setRefreshToken(res.refresh_token)
    setUserInfo(user)
    setUserScopeInfo(userScope)
    registerFindawareSessionId()

    if (res?.signalKeys) {
      localStorage.setItem(CacheKey.SIGNAL_KEYS, JSON.stringify(res?.signalKeys))
    }
    createUserSignalManager(res)

    const memberships: string[] = userScope?.memberships || []
    const role: string = userScope?.role || ''
    if (memberships.includes(AuthHelper.MembershipType.TRACKER)) {
      navigate('/subpoena')
    }
    else if (memberships.includes(AuthHelper.MembershipType.FINAWARE)) {
        navigate('/fin-aware/dashboard')
    }
    else if (role === AuthHelper.RoleType.TECH_OWNER) {
      navigate('/dashboard')
    } else {
      navigate('/settings')
    }
  }

  const registerFindawareSessionId = () => {
    const finawareToken = generateToken()
    setFinAwareSessionId(finawareToken)

    const params: Auth.ExternalParams = {
      fin_session_id: finawareToken,
      expiry: 12
    }
    external({
      params: params,
      callback: {
        onSuccess: () => {
          //
        },
        onFailure: () => {
          //
        }
      }
    })
  }

  const reRegisterFindawareSessionId = () => {
    const finawareToken = generateToken()
    setFinAwareSessionId(finawareToken)

    const params: Auth.ExternalParams = {
      fin_session_id: finawareToken,
      expiry: 12
    }
    external({
      params: params,
      callback: {
        onSuccess: () => {
          //
        },
        onFailure: () => {
          //
        }
      }
    })
  }

  const signIn = async ({ params, callback }: { params: Auth.SignInParams; callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await authAPI.signIn(params)
      onSuccess(response)
      signInSuccess(response)
      // localStorage.setItem('phone', response?.phone)
      // navigate({
      //   pathname: '/sign-in/sms-verification',
      //   search: `?${createSearchParams([
      //     ['u', params.email],
      //     ['t', response?.idToken]
      //   ])}`
      // })
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const register = async ({
    params,
    callback
  }: {
    params: Auth.RegisterParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await authAPI.regiser(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const updateSignalKeys = async ({
    params,
    callback
  }: {
    params: User.updateSignalKeysParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await authAPI.updateSignalKeys(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const getPublicKeys = async ({
    params,
    callback
  }: {
    params: User.GetPublicKeysParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await authAPI.getPublicKeys(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const checkActivationCode = async ({ id, callback }: { id: any; callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await authAPI.checkActivationCode(id)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const getMyProfile = async ({ callback }: { callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await authAPI.getMyProfile()
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const changePassword = async ({
    params,
    callback
  }: {
    params: Auth.ChangePasswordParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await authAPI.changePassword(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const external = async ({
    params,
    callback
  }: {
    params: Auth.ExternalParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await authAPI.external(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const signInSmsVerification = async ({
    params,
    callback
  }: {
    params: Auth.SmsVerificationParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await authAPI.signInSmsVerification(params)
      onSuccess(response)
      signInSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const requestOtp = async ({
    params,
    callback
  }: {
    params: Auth.RequestOTPParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await authAPI.requestOtp(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  return {
    signIn,
    logout,
    getToken,
    isLoggedIn,
    register,
    updateSignalKeys,
    getPublicKeys,
    checkActivationCode,
    getMyProfile,
    changePassword,
    external,
    registerFindawareSessionId,
    reRegisterFindawareSessionId,
    signInSmsVerification,
    requestOtp
  }
}
