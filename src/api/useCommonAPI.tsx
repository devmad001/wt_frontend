import { useHttpRequest } from './useHttpRequest'

export const useCommonAPI = () => {
  const httpRequest = useHttpRequest()

  const getAgencybyId = async (id: string): Promise<any> => httpRequest.GET(`/v1/agencies/${id}`)
  const getFieldOfficesByAgency = async (id: string): Promise<any> => httpRequest.GET(`/v1/fieldOffices/${id}`)
  const getSquadByOfficeId = async (id: string): Promise<any> => httpRequest.GET(`/v1/squads/${id}`)

  return { getAgencybyId, getFieldOfficesByAgency, getSquadByOfficeId }
}
