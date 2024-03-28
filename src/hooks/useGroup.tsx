import { get, noop } from 'lodash'
import { useGroupAPI } from 'api'

export const useGroup = () => {
  const groupAPI = useGroupAPI()

  const createGroup = async ({
    params,
    callback
  }: {
    params: Group.CreateParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await groupAPI.createGroup(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const groups = async ({ params, callback }: { params: Group.ListParams; callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await groupAPI.groups(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const leaveGroup = async ({
    params,
    callback
  }: {
    params: Group.LeaveParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await groupAPI.leaveGroup(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const group = async ({ id, callback }: { id: string; callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await groupAPI.group(id)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const updateSignalKeys = async ({
    groupId,
    params,
    callback
  }: {
    groupId: string
    params: Group.UpdateSignalKeysParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await groupAPI.updateSignalKeys(groupId, params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  return {
    createGroup,
    groups,
    leaveGroup,
    group,
    updateSignalKeys
  }
}
