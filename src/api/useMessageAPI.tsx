import { useHttpRequest } from './useHttpRequest'

export const useMessageAPI = () => {
  const httpRequest = useHttpRequest()

  const createMessage = async (params: Message.CreateParams): Promise<any> =>
    httpRequest.POST('/v1/tracker-tool/messages', params)
  const messages = async (params: Message.ListParams): Promise<any> =>
    httpRequest.GET('/v1/tracker-tool/messages', { params })

  return {
    messages,
    createMessage
  }
}
