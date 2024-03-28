import { get, noop } from 'lodash'
import { useFieldOfficeAPI } from 'api'

export const useFieldOffice = () => {
  const userFieldOfficeAPI = useFieldOfficeAPI()

  const getFieldOfficesByAgency = async ({
    params,
    callback
  }: {
    params: FieldOffice.GetListParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await userFieldOfficeAPI.getFieldOfficesByAgency(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const getFieldOfficesById = async ({ id, callback }: { id: string; callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await userFieldOfficeAPI.getFieldOfficesById(id)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const updateFieldOfficesById = async ({
    id,
    params,
    callback
  }: {
    id: string
    params: FieldOffice.UpdateParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await userFieldOfficeAPI.updateFieldOfficesById(id, params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const deleteFieldOfficesById = async ({ id, callback }: { id: string; callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await userFieldOfficeAPI.deleteFieldOfficesById(id)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const createFieldOffice = async ({
    params,
    callback
  }: {
    params: FieldOffice.CreateParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await userFieldOfficeAPI.createFieldOffice(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  return {
    getFieldOfficesByAgency,
    getFieldOfficesById,
    updateFieldOfficesById,
    deleteFieldOfficesById,
    createFieldOffice
  }
}
