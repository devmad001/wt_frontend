import { useHttpRequest } from './useHttpRequest'

export const useAgencyAPI = () => {
  const httpRequest = useHttpRequest()

  const getAgencies = async (params: Agency.GetListParams): Promise<any> =>
    httpRequest.GET('/v1/admin/agencies', { params })

  const getAgencyById = async (id: string): Promise<any> => httpRequest.GET(`/v1/admin/agencies/${id}`)

  const updateAgencyById = async (id: string, params: Agency.UpdateParams): Promise<any> =>
    httpRequest.PUT(`/v1/admin/agencies/${id}`, params)

  const deleteAgencyById = async (id: string): Promise<any> => httpRequest.DELETE(`/v1/admin/agencies/${id}`)

  const createAgency = async (params: Agency.CreateParams): Promise<any> =>
    httpRequest.POST('/v1/admin/agencies', params)

  return { getAgencies, getAgencyById, updateAgencyById, deleteAgencyById, createAgency }
}
