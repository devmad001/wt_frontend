import { useHttpRequest } from './useHttpRequest'

export const useFieldOfficeAPI = () => {
  const httpRequest = useHttpRequest()

  const getFieldOfficesByAgency = async (params: FieldOffice.GetListParams): Promise<any> =>
    httpRequest.GET('/v1/admin/fieldOffices', { params })

  const getFieldOfficesById = async (id: string): Promise<any> => httpRequest.GET(`/v1/admin/fieldOffices/${id}`)

  const updateFieldOfficesById = async (id: string, params: FieldOffice.UpdateParams): Promise<any> =>
    httpRequest.PUT(`/v1/admin/fieldOffices/${id}`, params)

  const deleteFieldOfficesById = async (id: string): Promise<any> => httpRequest.DELETE(`/v1/admin/fieldOffices/${id}`)

  const createFieldOffice = async (params: FieldOffice.CreateParams): Promise<any> =>
    httpRequest.POST('/v1/admin/fieldOffices', params)

  return {
    getFieldOfficesByAgency,
    getFieldOfficesById,
    updateFieldOfficesById,
    deleteFieldOfficesById,
    createFieldOffice
  }
}
