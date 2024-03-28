import { useHttpRequest } from './useHttpRequest'

export const useUserManagementAPI = () => {
  const httpRequest = useHttpRequest()

  const getUsersList = async (params: User.GetUsersParams): Promise<any> =>
    httpRequest.GET('/v1/admin/users', { params })

  const getUserAgency = async (): Promise<any> => httpRequest.GET('/v1/admin/users/agency')

  const getUserById = async (id: string): Promise<any> => httpRequest.GET(`/v1/admin/users/${id}`)

  const updateUserById = async (id: string, params: User.UpdateUserParams): Promise<any> =>
    httpRequest.PUT(`/v1/admin/users/${id}`, params)

  const acceptUserById = async (id: string): Promise<any> => httpRequest.PUT(`/v1/admin/users/${id}/accept`)

  const rejectUserById = async (id: string): Promise<any> => httpRequest.PUT(`/v1/admin/users/${id}/reject`)

  const createUser = async (params: User.CreateUserParams): Promise<any> => httpRequest.POST('/v1/admin/users', params)

  return {
    getUsersList,
    getUserAgency,
    createUser,
    getUserById,
    updateUserById,
    acceptUserById,
    rejectUserById
  }
}
