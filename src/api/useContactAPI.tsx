import { useHttpRequest } from './useHttpRequest'

export const useContactAPI = () => {
  const httpRequest = useHttpRequest()

  const contactsFind = async (params: Contact.FindParams): Promise<any> =>
    httpRequest.GET('/v1/tracker-tool/contacts/find', { params })
  const pendingList = async (params: Contact.PendingParams): Promise<any> =>
    httpRequest.GET('/v1/tracker-tool/contacts/pending', { params })
  const myContacts = async (params: Contact.MyContactsParams): Promise<any> =>
    httpRequest.GET('/v1/tracker-tool/contacts', { params })
  const request = async (params: Contact.RejectContactParams): Promise<any> =>
    httpRequest.POST('/v1/tracker-tool/contacts/request', params)
  const approve = async (params: Contact.ApproveContactParams): Promise<any> =>
    httpRequest.POST('/v1/tracker-tool/contacts/approve', params)
  const reject = async (params: Contact.RejectContactParams): Promise<any> =>
    httpRequest.POST('/v1/tracker-tool/contacts/reject', params)
  const remove = async (friendId: string): Promise<any> =>
    httpRequest.PUT(`/v1/tracker-tool/contacts/remove?friendId=${friendId}`)

  return {
    contactsFind,
    pendingList,
    myContacts,
    request,
    approve,
    reject,
    remove
  }
}
