import { useHttpRequest } from './useHttpRequest'

export const usePromoCodeAPI = () => {
  const httpRequest = useHttpRequest()

  const addPromoCode = async (params: PromoCode.CreateNewParams): Promise<any> =>
    httpRequest.POST('/v1/admin/promoCodes', params)
  const getPromoCodes = async (params: PromoCode.ListParams): Promise<any> =>
    httpRequest.GET('/v1/admin/promoCodes', { params })
  const deletePromoCode = async (id: string): Promise<any> => httpRequest.DELETE('/v1/admin/promoCodes/' + id)
  const editPromoCode = async (id: string, params: PromoCode.EditParams): Promise<any> =>
    httpRequest.PUT('/v1/admin/promoCodes/' + id, params)

  return { addPromoCode, getPromoCodes, deletePromoCode, editPromoCode }
}
