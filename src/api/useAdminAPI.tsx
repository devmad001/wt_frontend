import { useHttpRequest } from './useHttpRequest'

export const useAdminAPI = () => {
  const httpRequest = useHttpRequest()

  const activeUsers = async (): Promise<any> => httpRequest.GET(`/v1/admin/dashboard/onlineStatistic`)
  const messagesSent = async (): Promise<any> => httpRequest.GET(`/v1/admin/dashboard/messageSent`)
  const filesUploaded = async (): Promise<any> => httpRequest.GET(`/v1/admin/dashboard/filesUploaded`)
  const pageViews = async (): Promise<any> => httpRequest.GET(`/v1/admin/dashboard/pageViews`)
  const onlineUsers = async (params: any): Promise<any> =>
    httpRequest.GET(`/v1/admin/dashboard/onlineUsers`, { params })

  return { activeUsers, messagesSent, filesUploaded, pageViews, onlineUsers }
}
