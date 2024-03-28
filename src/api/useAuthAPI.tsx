import { useHttpRequest } from './useHttpRequest'

export const useAuthAPI = () => {
  const httpRequest = useHttpRequest()

  const refreshToken = async (params: any): Promise<any> => httpRequest.POST<any, any>('/v1/auth/refresh', params)
  const signIn = async (params: Auth.SignInParams): Promise<any> => httpRequest.POST('/v1/auth/login', params)
  const regiser = async (params: Auth.RegisterParams): Promise<any> => httpRequest.POST('/v1/auth/register', params)
  const updateSignalKeys = async (params: User.updateSignalKeysParams): Promise<any> =>
    httpRequest.PUT('/v1/users/signal', params)
  const getPublicKeys = async (params: User.GetPublicKeysParams): Promise<any> =>
    httpRequest.POST('/v1/users/publicKeys', params)
  const getMyProfile = async (): Promise<any> => httpRequest.POST('/v1/users/me')
  const checkActivationCode = async (id: string): Promise<any> => httpRequest.GET(`/v1/agencies/${id}`)
  const changePassword = async (params: Auth.ChangePasswordParams): Promise<any> =>
    httpRequest.PUT('/v1/users/changePassword', params)
  const external = async (params: Auth.ExternalParams): Promise<any> => httpRequest.POST('/v1/auth/external', params)
  const signInSmsVerification = async (params: Auth.SmsVerificationParams): Promise<any> =>
    httpRequest.POST('/v1/auth/loginOtp', params)
  const requestOtp = async (params: Auth.RequestOTPParams): Promise<any> =>
    httpRequest.POST('/v1/auth/requestOtp', params)

  return {
    refreshToken,
    signIn,
    regiser,
    updateSignalKeys,
    getPublicKeys,
    checkActivationCode,
    getMyProfile,
    changePassword,
    external,
    signInSmsVerification,
    requestOtp
  }
}
