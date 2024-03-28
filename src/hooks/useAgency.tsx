import { get, noop } from 'lodash'
import { useAgencyAPI } from 'api'

export const useAgency = () => {
  const userAgencyAPI = useAgencyAPI()

  const getAgencies = async ({
    params,
    callback
  }: {
    params: Agency.GetListParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await userAgencyAPI.getAgencies(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const getAgencyById = async ({ id, callback }: { id: string; callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await userAgencyAPI.getAgencyById(id)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const updateAgencyById = async ({
    id,
    params,
    callback
  }: {
    id: string
    params: Agency.UpdateParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await userAgencyAPI.updateAgencyById(id, params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const deleteAgencyById = async ({ id, callback }: { id: string; callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await userAgencyAPI.deleteAgencyById(id)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const createAgency = async ({
    params,
    callback
  }: {
    params: Agency.CreateParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await userAgencyAPI.createAgency(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  return {
    getAgencies,
    getAgencyById,
    updateAgencyById,
    deleteAgencyById,
    createAgency
  }
}
