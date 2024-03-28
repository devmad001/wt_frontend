import { get, noop } from 'lodash'
import { useContactAPI } from 'api'

export const useContact = () => {
  const contactAPI = useContactAPI()

  const contactsFind = async ({
    params,
    callback
  }: {
    params: Contact.FindParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await contactAPI.contactsFind(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const pendingList = async ({
    params,
    callback
  }: {
    params: Contact.PendingParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await contactAPI.pendingList(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const myContacts = async ({
    params,
    callback
  }: {
    params: Contact.MyContactsParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await contactAPI.myContacts(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const request = async ({
    params,
    callback
  }: {
    params: Contact.RequestContactParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await contactAPI.request(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const approve = async ({
    params,
    callback
  }: {
    params: Contact.ApproveContactParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await contactAPI.approve(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const reject = async ({
    params,
    callback
  }: {
    params: Contact.RejectContactParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await contactAPI.reject(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const remove = async ({ friendId, callback }: { friendId: string; callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await contactAPI.remove(friendId)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

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
