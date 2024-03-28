import { get, noop } from 'lodash'
import { usePaymentAPI, usePromoCodeAPI } from 'api'

export const usePromoCode = () => {
  const promoCode = usePromoCodeAPI()

  const addPromoCode = async ({
    params,
    callback
  }: {
    params: PromoCode.CreateNewParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await promoCode.addPromoCode(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const getPromoCodes = async ({
    params,
    callback
  }: {
    params: PromoCode.ListParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await promoCode.getPromoCodes(params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const deletePromoCode = async ({ id, callback }: { id: string; callback: App.Callback }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await promoCode.deletePromoCode(id)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  const editPromoCode = async ({
    id,
    params,
    callback
  }: {
    id: string
    params: PromoCode.EditParams
    callback: App.Callback
  }): Promise<void> => {
    const onSuccess = get(callback, 'onSuccess', noop)
    const onFailure = get(callback, 'onFailure', noop)
    const onFinish = get(callback, 'onFinish', noop)

    try {
      const response = await promoCode.editPromoCode(id, params)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    } finally {
      onFinish()
    }
  }

  return {
    addPromoCode,
    getPromoCodes,
    deletePromoCode,
    editPromoCode
  }
}
