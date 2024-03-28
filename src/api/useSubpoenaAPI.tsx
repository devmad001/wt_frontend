import { useHttpRequest } from './useHttpRequest'

export const useSubpoenaAPI = () => {
  const httpRequest = useHttpRequest()

  const newUpload = async (params: Subpoena.CreateParams): Promise<any> =>
    httpRequest.POST('/v1/tracker-tool/documents/submit', params)
  const getSubpoenaList = async (params: Subpoena.ListParams): Promise<any> =>
    httpRequest.GET('/v1/tracker-tool/documents', { params: params })
  const getSubpoenaDetail = async (_id: string, params: Subpoena.StatementParams): Promise<any> =>
    httpRequest.GET(`/v1/tracker-tool/documents/${_id}/statements`, { params: params })
  const editSubpoena = async (_id: string, params: Subpoena.UpdateParams): Promise<any> =>
    httpRequest.PUT(`/v1/tracker-tool/documents/${_id}`, params)
  const deleteSubpoena = async (_id: string): Promise<any> => httpRequest.DELETE(`/v1/tracker-tool/documents/${_id}`)
  const generateURL = async (): Promise<any> => httpRequest.GET('/v1/tracker-tool/documents/generateUrl')
  const requestGgApiUpload = async (url: string, file: any): Promise<any> =>
    httpRequest.REQUEST({
      method: 'PUT',
      url: url,
      headers: { Accept: '*', 'Content-Type': 'application/pdf', Authorization: null },
      data: file
    })
  const archiveDocument = async (_id: string): Promise<any> =>
    httpRequest.PUT(`/v1/tracker-tool/documents/${_id}/archive  `)
  const restoreDocument = async (_id: string): Promise<any> =>
    httpRequest.PUT(`/v1/tracker-tool/documents/${_id}/restore  `)

  return {
    newUpload,
    getSubpoenaList,
    getSubpoenaDetail,
    editSubpoena,
    deleteSubpoena,
    requestGgApiUpload,
    generateURL,
    archiveDocument,
    restoreDocument
  }
}
