import { get, noop } from 'lodash'
import { useUserManagementAPI } from 'api'

export const useUserManagement = () => {
  const userManagementAPI = useUserManagementAPI()

  const getUsersList = async ({
    params,
    callback
  }: {
    params: User.GetUsersParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await userManagementAPI.getUsersList(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const getUserAgency = async ({ callback }: { callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await userManagementAPI.getUserAgency()
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const createUser = async ({
    params,
    callback
  }: {
    params: User.CreateUserParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await userManagementAPI.createUser(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const getUserById = async ({ id, callback }: { id: string; callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await userManagementAPI.getUserById(id)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const updateUserById = async ({
    id,
    params,
    callback
  }: {
    id: string
    params: User.UpdateUserParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await userManagementAPI.updateUserById(id, params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const acceptUserById = async ({ id, callback }: { id: string; callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await userManagementAPI.acceptUserById(id)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const rejectUserById = async ({ id, callback }: { id: string; callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await userManagementAPI.rejectUserById(id)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

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
