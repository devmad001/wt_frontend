import { useHttpRequest } from './useHttpRequest'

export const useGroupAPI = () => {
  const httpRequest = useHttpRequest()

  const createGroup = async (params: Group.CreateParams): Promise<any> =>
    httpRequest.POST('/v1/tracker-tool/groups', params)
  const groups = async (params: Group.ListParams): Promise<any> =>
    httpRequest.GET('/v1/tracker-tool/groups', { params })
  const leaveGroup = async (params: Group.LeaveParams): Promise<any> =>
    httpRequest.POST('/v1/groups/tracker-tool/leave', params)
  const group = async (id: string): Promise<any> => httpRequest.GET(`/v1/tracker-tool/groups/${id}`)
  const updateSignalKeys = async (groupId: string, params: Group.UpdateSignalKeysParams): Promise<any> =>
    httpRequest.PUT(`/v1/tracker-tool/groups/${groupId}/signal`, params)

  return {
    createGroup,
    groups,
    leaveGroup,
    group,
    updateSignalKeys
  }
}
