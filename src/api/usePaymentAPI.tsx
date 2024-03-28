import { useHttpRequest } from './useHttpRequest'

export const usePaymentAPI = () => {
  const httpRequest = useHttpRequest()

  const getPaymentIntent = async (): Promise<any> => httpRequest.POST('/v1/admin/stripe/paymentIntent')
  const registerPaymentMethod = async (params: Payment.registerPaymentMethod): Promise<any> =>
    httpRequest.POST('/v1/admin/stripe/paymentMethod', params)
  const getPaymentInfo = async (): Promise<any> => httpRequest.GET('/v1/users/paymentInfo')
  const cancelSubscribe = async (params: any): Promise<any> =>
    httpRequest.PUT('/v1/admin/stripe/subscription/cancel', params)
  const setDefaultPaymentMethod = async (params: Payment.setDefaultPaymentMethodParams): Promise<any> =>
    httpRequest.PUT('/v1/admin/stripe/paymentMethod/setDefault', params)

  return { getPaymentIntent, registerPaymentMethod, getPaymentInfo, cancelSubscribe, setDefaultPaymentMethod }
}
