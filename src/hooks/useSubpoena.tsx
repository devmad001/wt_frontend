import { get, noop } from 'lodash'
import { useSubpoenaAPI } from 'api'

export const useSubpoena = () => {
  const subpoenaAPI = useSubpoenaAPI()

  const newUpload = async ({
    params,
    callback
  }: {
    params: Subpoena.CreateParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await subpoenaAPI.newUpload(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const getSubpoenaList = async ({
    params,
    callback
  }: {
    params: Subpoena.ListParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await subpoenaAPI.getSubpoenaList(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const getSubpoenaDetail = async ({
    _id,
    params,
    callback
  }: {
    _id: string
    params: Subpoena.StatementParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await subpoenaAPI.getSubpoenaDetail(_id, params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const editSubpoena = async ({
    _id,
    params,
    callback
  }: {
    _id: string
    params: Subpoena.UpdateParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await subpoenaAPI.editSubpoena(_id, params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const deleteSubpoena = async ({ _id, callback }: { _id: string; callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await subpoenaAPI.deleteSubpoena(_id)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const generateURL = async ({ callback }: { callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await subpoenaAPI.generateURL()
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const requestGgApiUpload = async ({
    url,
    file,
    callback
  }: {
    url: string
    file: any
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await subpoenaAPI.requestGgApiUpload(url, file)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const archiveDocument = async ({ _id, callback }: { _id: string; callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await subpoenaAPI.archiveDocument(_id)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const restoreDocument = async ({ _id, callback }: { _id: string; callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await subpoenaAPI.restoreDocument(_id)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  return {
    newUpload,
    getSubpoenaList,
    getSubpoenaDetail,
    editSubpoena,
    deleteSubpoena,
    generateURL,
    requestGgApiUpload,
    archiveDocument,
    restoreDocument
  }
}
