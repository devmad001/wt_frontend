import { get, noop } from 'lodash'
import { useMessageAPI } from 'api'

export const useMessage = () => {
  const messageAPI = useMessageAPI()

  const createMessage = async ({
    params,
    callback
  }: {
    params: Message.CreateParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await messageAPI.createMessage(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const messages = async ({
    params,
    callback
  }: {
    params: Message.ListParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await messageAPI.messages(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  return {
    createMessage,
    messages
  }
}
