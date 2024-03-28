import { useHttpRequest } from './useHttpRequest'

export const useSquadAPI = () => {
  const httpRequest = useHttpRequest()

  const getSquadByFieldOffice = async (params: Squad.GetListParams): Promise<any> =>
    httpRequest.GET('/v1/admin/squads', { params })

  const getSquadById = async (id: string): Promise<any> => httpRequest.GET(`/v1/admin/squads/${id}`)

  const updateSquadById = async (id: string, params: Squad.UpdateParams): Promise<any> =>
    httpRequest.PUT(`/v1/admin/squads/${id}`, params)

  const deleteSquadById = async (id: string): Promise<any> => httpRequest.DELETE(`/v1/admin/squads/${id}`)

  const createSquad = async (params: Squad.CreateParams): Promise<any> => httpRequest.POST('/v1/admin/squads', params)

  return { getSquadByFieldOffice, getSquadById, updateSquadById, deleteSquadById, createSquad }
}
